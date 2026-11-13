"use server";

import { and, asc, eq, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { audit, login, logout, requireAdmin } from "@/lib/server/auth";
import { requireDb } from "@/lib/server/db";
import { menuCategories, menuItems, promos, services, venues } from "@/lib/server/schema";
import { UploadError, deleteImage, saveImage } from "@/lib/server/media";
import type { VenueId } from "@/lib/venues";

/* ---------- общее ---------- */

const venueId = z.enum(["220", "322"]);
const str = (maxLen: number) => z.string().trim().max(maxLen);
const required = (maxLen: number, label: string) =>
  z.string().trim().min(1, `Заполните поле «${label}»`).max(maxLen, `Поле «${label}» слишком длинное`);
const url = z
  .string()
  .trim()
  .max(500)
  .refine((v) => /^https:\/\/[^\s]+$/.test(v), "Ссылка должна начинаться с https://");
/** menu:kitchen / menu:bar (открыть меню), якорь #promo, внутренняя /… или внешняя https:// */
const href = z
  .string()
  .trim()
  .max(300)
  .refine(
    (v) => v === "" || /^menu:(kitchen|bar)$/.test(v) || /^(#|\/)[^\s]*$/.test(v) || /^https:\/\/[^\s]+$/.test(v),
    "Неверная ссылка",
  );
/** Файл фото из формы (пустой input даёт File нулевого размера). */
function uploadedFile(fd: FormData, name: string): File | null {
  const f = fd.get(name);
  return f instanceof File && f.size > 0 ? f : null;
}

/** "350" | "350/620" | "350 / 620 ₽" → [350, 620] */
const prices = z
  .string()
  .trim()
  .transform((v) => v.replace(/[₽\s]/g, "").split("/").filter(Boolean).map(Number))
  .refine((a) => a.length >= 1 && a.length <= 3 && a.every((n) => Number.isInteger(n) && n >= 0 && n <= 1_000_000), "Цена — целое число в рублях, для объёмов через «/»: 350/620");

function form(fd: FormData) {
  return Object.fromEntries(Array.from(fd.keys()).map((k) => [k, fd.get(k)?.toString() ?? ""]));
}

function fail(path: string, error: z.ZodError | string): never {
  const msg = typeof error === "string" ? error : error.issues[0]?.message ?? "Ошибка в данных";
  redirect(`${path}?error=${encodeURIComponent(msg)}`);
}

function refreshSite(venue: VenueId) {
  revalidatePath(venue === "220" ? "/" : "/322");
}

/* ---------- вход / выход ---------- */

export type LoginState = { error?: string };

export async function loginAction(_: LoginState, fd: FormData): Promise<LoginState> {
  const login_ = fd.get("login")?.toString() ?? "";
  const password = fd.get("password")?.toString() ?? "";
  if (!login_ || !password) return { error: "Введите логин и пароль" };
  if (password.length > 200) return { error: "Неверный логин или пароль" };
  const res = await login(login_, password);
  if (!res.ok) return { error: res.error };
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

/* ---------- контакты ---------- */

export async function saveContacts(fd: FormData) {
  const admin = await requireAdmin();
  const data = z
    .object({
      venue: venueId,
      phone: required(40, "Телефон").refine((v) => v.replace(/\D/g, "").length >= 10, "Проверьте номер телефона"),
      hours: required(60, "Часы работы"),
      bookingUrl: url,
    })
    .safeParse(form(fd));
  const path = `/admin/${fd.get("venue")}`;
  if (!data.success) fail(path, data.error);
  const { venue, ...values } = data.data;
  await requireDb().update(venues).set({ ...values, updatedAt: new Date() }).where(eq(venues.id, venue));
  await audit(admin, "contacts.update", { venue, ...values });
  refreshSite(venue);
  redirect(`${path}?saved=contacts`);
}

/* ---------- акция ---------- */

export async function savePromo(fd: FormData) {
  const admin = await requireAdmin();
  const data = z
    .object({
      venue: venueId,
      enabled: z.string().optional(),
      badge: required(60, "Метка"),
      title: required(120, "Заголовок"),
      text: required(600, "Текст"),
      prizes: str(1000),
      counterValue: str(20),
      counterLabel: str(60),
    })
    .safeParse(form(fd));
  const path = `/admin/${fd.get("venue")}`;
  if (!data.success) fail(path, data.error);
  const { venue, enabled, prizes: prizesRaw, ...rest } = data.data;

  // Каждая строка: «1 место — 30 000 ₽ деньгами»
  const prizes = prizesRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 10)
    .map((l) => {
      const [place, ...p] = l.split(/\s+[—–-]\s+/);
      return { place: place.trim().slice(0, 40), prize: p.join(" — ").trim().slice(0, 80) };
    });
  if (prizes.some((p) => !p.prize)) fail(path, "Призы: каждая строка в формате «1 место — описание приза»");

  const values = { ...rest, prizes, enabled: enabled === "on", updatedAt: new Date() };
  await requireDb()
    .insert(promos)
    .values({ venueId: venue, ...values })
    .onConflictDoUpdate({ target: promos.venueId, set: values });
  await audit(admin, "promo.update", { venue, ...values });
  refreshSite(venue);
  redirect(`${path}?saved=promo`);
}

/* ---------- карточки услуг ---------- */

export async function saveServices(fd: FormData) {
  const admin = await requireAdmin();
  const v = venueId.safeParse(fd.get("venue"));
  if (!v.success) fail("/admin", "Неизвестное заведение");
  const path = `/admin/${v.data}`;
  const db = requireDb();
  const rows = await db.select().from(services).where(eq(services.venueId, v.data)).orderBy(asc(services.position));

  const schema = z.object({ title: required(80, "Заголовок карточки"), text: required(400, "Текст карточки"), href });
  const updates: { id: number; title: string; text: string; href: string | null }[] = [];
  for (const row of rows) {
    const parsed = schema.safeParse({
      title: fd.get(`title_${row.id}`)?.toString() ?? "",
      text: fd.get(`text_${row.id}`)?.toString() ?? "",
      href: fd.get(`href_${row.id}`)?.toString() ?? "",
    });
    if (!parsed.success) fail(path, parsed.error);
    updates.push({ id: row.id, ...parsed.data, href: parsed.data.href || null });
  }
  await db.transaction(async (tx) => {
    for (const { id, ...set } of updates) await tx.update(services).set(set).where(eq(services.id, id));
  });
  await audit(admin, "services.update", { venue: v.data });
  refreshSite(v.data);
  redirect(`${path}?saved=services`);
}

/* ---------- меню ---------- */

const menuPath = (venue: string) => `/admin/${venue}/menu`;

async function categoryVenue(categoryId: number): Promise<VenueId> {
  const [c] = await requireDb()
    .select({ venueId: menuCategories.venueId })
    .from(menuCategories)
    .where(eq(menuCategories.id, categoryId));
  if (!c) fail("/admin", "Категория не найдена");
  return c.venueId as VenueId;
}

export async function saveMenuItem(fd: FormData) {
  const admin = await requireAdmin();
  const data = z
    .object({
      id: z.coerce.number().int().positive(),
      name: required(120, "Название"),
      prices,
      note: str(80),
      available: z.string().optional(),
      removePhoto: z.string().optional(),
    })
    .safeParse(form(fd));
  if (!data.success) fail(menuPath(fd.get("venue")?.toString() ?? "220"), data.error);
  const { id, note, available, removePhoto, ...rest } = data.data;
  const db = requireDb();
  const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
  if (!item) fail("/admin", "Позиция не найдена");
  const venue = await categoryVenue(item.categoryId);

  // Фото: новое заменяет старое; галочка «убрать фото» удаляет его
  let photo = item.photo;
  const file = uploadedFile(fd, "photoFile");
  if (file) {
    try {
      photo = await saveImage(file);
    } catch (e) {
      fail(menuPath(venue), e instanceof UploadError ? e.message : "Не удалось сохранить фото");
    }
  } else if (removePhoto === "on") {
    photo = null;
  }

  const set = { ...rest, note: note || null, photo, available: available === "on" };
  await db.update(menuItems).set(set).where(eq(menuItems.id, id));
  if (photo !== item.photo) await deleteImage(item.photo);
  await audit(admin, "menu.item.update", { venue, id, ...set, photoChanged: photo !== item.photo });
  refreshSite(venue);
  redirect(`${menuPath(venue)}?saved=item#item-${id}`);
}

export async function addMenuItem(fd: FormData) {
  const admin = await requireAdmin();
  const data = z
    .object({ categoryId: z.coerce.number().int().positive(), name: required(120, "Название"), prices, note: str(80) })
    .safeParse(form(fd));
  if (!data.success) fail(menuPath(fd.get("venue")?.toString() ?? "220"), data.error);
  const { categoryId, note, ...rest } = data.data;
  const venue = await categoryVenue(categoryId);
  const db = requireDb();
  const [{ m }] = await db.select({ m: max(menuItems.position) }).from(menuItems).where(eq(menuItems.categoryId, categoryId));
  const [row] = await db
    .insert(menuItems)
    .values({ categoryId, ...rest, note: note || null, position: (m ?? -1) + 1 })
    .returning({ id: menuItems.id });
  await audit(admin, "menu.item.create", { venue, categoryId, ...rest });
  refreshSite(venue);
  redirect(`${menuPath(venue)}?saved=item#item-${row.id}`);
}

export async function deleteMenuItem(fd: FormData) {
  const admin = await requireAdmin();
  const id = z.coerce.number().int().positive().safeParse(fd.get("id"));
  if (!id.success) fail("/admin", "Неверная позиция");
  const db = requireDb();
  const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id.data));
  if (!item) fail("/admin", "Позиция не найдена");
  const venue = await categoryVenue(item.categoryId);
  await db.delete(menuItems).where(eq(menuItems.id, id.data));
  await deleteImage(item.photo);
  await audit(admin, "menu.item.delete", { venue, item });
  refreshSite(venue);
  redirect(`${menuPath(venue)}?saved=deleted#cat-${item.categoryId}`);
}

export async function moveMenuItem(fd: FormData) {
  const admin = await requireAdmin();
  const id = Number(fd.get("id"));
  const dir = fd.get("dir") === "up" ? -1 : 1;
  const db = requireDb();
  const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
  if (!item) fail("/admin", "Позиция не найдена");
  const venue = await categoryVenue(item.categoryId);
  const list = await db
    .select({ id: menuItems.id })
    .from(menuItems)
    .where(eq(menuItems.categoryId, item.categoryId))
    .orderBy(asc(menuItems.position), asc(menuItems.id));
  const i = list.findIndex((x) => x.id === id);
  const j = i + dir;
  if (j >= 0 && j < list.length) {
    [list[i], list[j]] = [list[j], list[i]];
    await db.transaction(async (tx) => {
      for (let position = 0; position < list.length; position++) {
        await tx.update(menuItems).set({ position }).where(eq(menuItems.id, list[position].id));
      }
    });
    await audit(admin, "menu.item.move", { venue, id, dir });
    refreshSite(venue);
  }
  redirect(`${menuPath(venue)}#item-${id}`);
}

export async function saveCategory(fd: FormData) {
  const admin = await requireAdmin();
  const data = z
    .object({
      id: z.coerce.number().int().positive(),
      title: required(60, "Название раздела"),
      volumes: str(60),
      adultsOnly: z.string().optional(),
    })
    .safeParse(form(fd));
  if (!data.success) fail(menuPath(fd.get("venue")?.toString() ?? "220"), data.error);
  const { id, volumes, adultsOnly, title } = data.data;
  const venue = await categoryVenue(id);
  const set = {
    title,
    volumes: volumes ? volumes.split("/").map((s) => s.trim()).filter(Boolean) : null,
    adultsOnly: adultsOnly === "on",
  };
  await requireDb().update(menuCategories).set(set).where(eq(menuCategories.id, id));
  await audit(admin, "menu.category.update", { venue, id, ...set });
  refreshSite(venue);
  redirect(`${menuPath(venue)}?saved=category#cat-${id}`);
}

export async function addCategory(fd: FormData) {
  const admin = await requireAdmin();
  const data = z
    .object({ venue: venueId, section: z.enum(["kitchen", "bar"]), title: required(60, "Название раздела") })
    .safeParse(form(fd));
  if (!data.success) fail(menuPath(fd.get("venue")?.toString() ?? "220"), data.error);
  const { venue, section, title } = data.data;
  const db = requireDb();
  const [{ m }] = await db.select({ m: max(menuCategories.position) }).from(menuCategories).where(eq(menuCategories.venueId, venue));
  const slugBase =
    title
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "razdel";
  const slug = `${slugBase}-${Date.now().toString(36)}`;
  const [row] = await db
    .insert(menuCategories)
    .values({ venueId: venue, section, title, slug, position: (m ?? -1) + 1 })
    .returning({ id: menuCategories.id });
  await audit(admin, "menu.category.create", { venue, section, title });
  refreshSite(venue);
  redirect(`${menuPath(venue)}?saved=category#cat-${row.id}`);
}

export async function deleteCategory(fd: FormData) {
  const admin = await requireAdmin();
  const id = z.coerce.number().int().positive().safeParse(fd.get("id"));
  if (!id.success) fail("/admin", "Неверный раздел");
  const venue = await categoryVenue(id.data);
  const db = requireDb();
  const [cat] = await db.select().from(menuCategories).where(and(eq(menuCategories.id, id.data)));
  const photos = await db.select({ photo: menuItems.photo }).from(menuItems).where(eq(menuItems.categoryId, id.data));
  await db.delete(menuCategories).where(eq(menuCategories.id, id.data));
  await Promise.all(photos.map((p) => deleteImage(p.photo)));
  await audit(admin, "menu.category.delete", { venue, category: cat });
  refreshSite(venue);
  redirect(`${menuPath(venue)}?saved=deleted`);
}
