/**
 * Подготовка базы при старте: миграции → начальные данные → первый администратор.
 * Вызывается из instrumentation.ts (при запуске сервера) и из scripts/*.ts.
 * Не импортирует server-only, поэтому работает и в обычных скриптах.
 */
import path from "node:path";
import { count, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";
import { hashPassword, passwordProblem } from "./password";
import { VENUE_LIST } from "../venues";
import { MENU_220 } from "../menu-220";

type Log = (msg: string) => void;

export async function bootstrapDatabase(url: string, log: Log = console.log) {
  const client = postgres(url, { max: 1, onnotice: () => {} });
  const db = drizzle(client, { schema });
  try {
    await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
    log("migrations applied");

    // Начальные данные — только если база пустая (повторный запуск ничего не перезапишет)
    const [{ n }] = await db.select({ n: count() }).from(schema.venues);
    if (n === 0) {
      await db.transaction(async (tx) => {
        for (const v of VENUE_LIST) {
          await tx.insert(schema.venues).values({
            id: v.id,
            phone: v.phone,
            hours: v.hours,
            bookingUrl: v.bookingUrl,
          });
          if (v.promo) await tx.insert(schema.promos).values({ venueId: v.id, ...v.promo });
          await tx.insert(schema.services).values(
            v.services.map((s, position) => ({
              venueId: v.id,
              position,
              icon: s.icon,
              title: s.title,
              text: s.text,
              href: s.href ?? null,
            })),
          );
        }
        let catPos = 0;
        for (const section of MENU_220) {
          for (const c of section.categories) {
            const [cat] = await tx
              .insert(schema.menuCategories)
              .values({
                venueId: "220",
                section: section.id,
                slug: c.id,
                title: c.title,
                volumes: c.volumes ?? null,
                photo: c.photo ?? null,
                adultsOnly: !!c.adultsOnly,
                position: catPos++,
              })
              .returning({ id: schema.menuCategories.id });
            await tx.insert(schema.menuItems).values(
              c.items.map((it, position) => ({
                categoryId: cat.id,
                name: it.name,
                prices: Array.isArray(it.price) ? it.price : [it.price],
                note: it.note ?? null,
                photo: it.photo ?? null,
                position,
              })),
            );
          }
        }
      });
      log("seed data inserted");
    }

    // Первый администратор из переменных окружения (если ещё нет ни одного)
    const login = process.env.ADMIN_LOGIN?.trim();
    const password = process.env.ADMIN_PASSWORD;
    if (login && password) {
      const [{ n: admins }] = await db.select({ n: count() }).from(schema.admins);
      if (admins === 0) {
        const problem = passwordProblem(password);
        if (problem) {
          log(`admin not created: ${problem}`);
        } else {
          await db.insert(schema.admins).values({ login, passwordHash: await hashPassword(password) });
          log(`admin "${login}" created`);
        }
      }
    }

    // Чистка: просроченные сессии и старые попытки входа
    await db.delete(schema.sessions).where(lt(schema.sessions.expiresAt, new Date()));
    await db
      .delete(schema.loginAttempts)
      .where(lt(schema.loginAttempts.createdAt, new Date(Date.now() - 30 * 86_400_000)));
  } finally {
    await client.end({ timeout: 5 });
  }
}
