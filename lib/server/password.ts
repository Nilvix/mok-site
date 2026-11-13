import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

/**
 * Хэширование паролей: scrypt (встроен в Node.js, устойчив к перебору на GPU).
 * Формат: scrypt$N$r$p$соль$хэш (base64url).
 */
const N = 2 ** 15;
const R = 8;
const P = 1;
const KEYLEN = 64;
const MAXMEM = 64 * 1024 * 1024;

function derive(password: string, salt: Buffer, opts: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(password.normalize("NFKC"), salt, KEYLEN, opts, (err, key) =>
      err ? reject(err) : resolve(key),
    ),
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, { N, r: R, p: P, maxmem: MAXMEM });
  return ["scrypt", N, R, P, salt.toString("base64url"), key.toString("base64url")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, n, r, p, salt, hash] = stored.split("$");
  if (algo !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const key = await derive(password, Buffer.from(salt, "base64url"), {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: MAXMEM,
  });
  return key.length === expected.length && timingSafeEqual(key, expected);
}

/** Требования к паролю администратора. Возвращает текст ошибки или null. */
export function passwordProblem(password: string): string | null {
  if (password.length < 12) return "Пароль должен быть не короче 12 символов";
  if (password.length > 200) return "Пароль слишком длинный";
  if (!/[a-zа-я]/i.test(password) || !/\d/.test(password)) return "Пароль должен содержать буквы и цифры";
  return null;
}
