import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, count, eq, gt } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireDb } from "./db";
import { env } from "./env";
import { logger } from "./logger";
import { hashPassword, verifyPassword } from "./password";
import { admins, auditLog, loginAttempts, sessions } from "./schema";

const log = logger("auth");

export const SESSION_COOKIE = "mok_admin";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 часов

/** Лимиты на неудачные попытки входа за окно в 15 минут. */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS_PER_IP = 5;
const MAX_FAILS_PER_LOGIN = 10;

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/** Заглушка для сравнения, когда логина нет — чтобы время ответа не выдавало, существует ли он. */
let dummyHash: Promise<string> | null = null;

export function requestIp(): string {
  const h = headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(loginRaw: string, password: string): Promise<LoginResult> {
  const db = requireDb();
  const ip = requestIp();
  const login = loginRaw.trim().toLowerCase().slice(0, 100);
  const since = new Date(Date.now() - WINDOW_MS);

  const [[byIp], [byLogin]] = await Promise.all([
    db
      .select({ n: count() })
      .from(loginAttempts)
      .where(and(eq(loginAttempts.ip, ip), eq(loginAttempts.success, false), gt(loginAttempts.createdAt, since))),
    db
      .select({ n: count() })
      .from(loginAttempts)
      .where(and(eq(loginAttempts.login, login), eq(loginAttempts.success, false), gt(loginAttempts.createdAt, since))),
  ]);
  if (byIp.n >= MAX_FAILS_PER_IP || byLogin.n >= MAX_FAILS_PER_LOGIN) {
    log.warn("login blocked by rate limit", { ip, login });
    return { ok: false, error: "Слишком много попыток. Попробуйте через 15 минут." };
  }

  const [admin] = await db.select().from(admins).where(eq(admins.login, login));
  dummyHash ??= hashPassword(randomBytes(16).toString("hex"));
  const valid = await verifyPassword(password, admin?.passwordHash ?? (await dummyHash));
  const success = !!admin && valid;

  await db.insert(loginAttempts).values({ ip, login, success });
  if (!success) {
    log.warn("login failed", { ip, login });
    return { ok: false, error: "Неверный логин или пароль" };
  }

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sessions).values({
    tokenHash: sha256(token),
    adminId: admin.id,
    expiresAt,
    ip,
    userAgent: headers().get("user-agent")?.slice(0, 300) ?? null,
  });
  await db.update(admins).set({ lastLoginAt: new Date() }).where(eq(admins.id, admin.id));
  await db.insert(auditLog).values({ adminId: admin.id, action: "login", ip });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "strict",
    path: "/admin",
    expires: expiresAt,
  });
  log.info("login ok", { ip, login });
  return { ok: true };
}

export type Admin = { id: number; login: string };

/** Текущий администратор по cookie сессии или null. */
export async function getAdmin(): Promise<Admin | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const db = requireDb();
  const [row] = await db
    .select({ id: admins.id, login: admins.login })
    .from(sessions)
    .innerJoin(admins, eq(admins.id, sessions.adminId))
    .where(and(eq(sessions.tokenHash, sha256(token)), gt(sessions.expiresAt, new Date())));
  return row ?? null;
}

/** Для страниц и действий админки: без сессии — на страницу входа. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function logout() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) await requireDb().delete(sessions).where(eq(sessions.tokenHash, sha256(token)));
  cookies().delete({ name: SESSION_COOKIE, path: "/admin" });
}

export async function audit(admin: Admin, action: string, details?: unknown) {
  await requireDb()
    .insert(auditLog)
    .values({ adminId: admin.id, action, details: details ?? null, ip: requestIp() });
}
