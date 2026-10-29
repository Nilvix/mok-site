import { HttpError } from "./http";

type Bucket = { count: number; resetAt: number };

/**
 * Простое ограничение частоты запросов «фиксированное окно» в памяти процесса.
 * Подходит для одного контейнера; при нескольких репликах замени хранилище на Redis.
 */
export function rateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const buckets = new Map<string, Bucket>();

  return function check(key: string) {
    const now = Date.now();
    const b = buckets.get(key);
    if (!b || b.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      if (buckets.size > 10_000) {
        buckets.forEach((v, k) => v.resetAt <= now && buckets.delete(k));
      }
      return;
    }
    if (++b.count > limit) {
      throw new HttpError(429, "Слишком много запросов, попробуйте позже", "rate_limited");
    }
  };
}
