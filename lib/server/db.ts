import "server-only";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type DB = PostgresJsDatabase<typeof schema>;

const g = globalThis as unknown as { __mokDb?: DB | null };

/**
 * Подключение к PostgreSQL. Если DATABASE_URL не задан (сборка для GitHub Pages),
 * возвращает null — сайт тогда работает на данных по умолчанию из lib/venues.ts и lib/menu-220.ts.
 */
export function getDb(): DB | null {
  if (g.__mokDb !== undefined) return g.__mokDb;
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return (g.__mokDb = null);
  const client = postgres(url, { max: 10, idle_timeout: 30, connect_timeout: 5 });
  return (g.__mokDb = drizzle(client, { schema }));
}

/** То же, но для мест, где без базы работать нельзя (админка). */
export function requireDb(): DB {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL не задан — админ-панель недоступна");
  return db;
}
