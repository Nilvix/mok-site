/**
 * Переменные окружения сервера — единая точка чтения и проверки.
 * Используй `env.X` вместо `process.env.X`, чтобы ошибки конфигурации
 * всплывали при старте, а не посреди запроса.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

function str(name: string, fallback?: string): string {
  const v = process.env[name]?.trim();
  if (v) return v;
  if (fallback !== undefined) return fallback;
  throw new Error(`[env] Не задана обязательная переменная ${name}`);
}

function optional(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

function oneOf<T extends string>(name: string, allowed: readonly T[], fallback: T): T {
  const v = optional(name);
  if (!v) return fallback;
  if ((allowed as readonly string[]).includes(v)) return v as T;
  throw new Error(`[env] ${name}="${v}" — допустимо: ${allowed.join(", ")}`);
}

const isProd = process.env.NODE_ENV === "production";

export const env = {
  isProd,
  /** Публичный адрес сайта (для ссылок, метаданных, sitemap). */
  SITE_URL: str("SITE_URL", "http://localhost:3000"),
  LOG_LEVEL: oneOf<LogLevel>("LOG_LEVEL", ["debug", "info", "warn", "error"], isProd ? "info" : "debug"),
  /** Секрет для POST /api/revalidate. Не задан — эндпоинт отключён. */
  REVALIDATE_SECRET: optional("REVALIDATE_SECRET"),
  /** Токен Apify (зарезервирован под парсинг через Apify, сейчас не используется). */
  APIFY_TOKEN: optional("APIFY_TOKEN"),
} as const;

export type Env = typeof env;
