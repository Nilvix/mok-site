import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { HttpError, clientIp, ok, route } from "@/lib/server/http";
import { rateLimiter } from "@/lib/server/rate-limit";
import { env } from "@/lib/server/env";
import { logger } from "@/lib/server/logger";

export const dynamic = "force-dynamic";

const log = logger("revalidate");
const limit = rateLimiter({ limit: 5, windowMs: 60_000 });

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/**
 * Принудительно обновить данные с Яндекс Карт (отзывы, рейтинг, фото), не дожидаясь кэша.
 * curl -X POST -H "Authorization: Bearer $REVALIDATE_SECRET" https://сайт/api/revalidate
 */
export const POST = route("/api/revalidate", (req) => {
  limit(clientIp(req));

  if (!env.REVALIDATE_SECRET) throw new HttpError(404, "Not found", "not_found");
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!safeEqual(token, env.REVALIDATE_SECRET)) {
    throw new HttpError(401, "Неверный токен", "unauthorized");
  }

  revalidateTag("yandex");
  revalidatePath("/");
  log.info("yandex data revalidated", { ip: clientIp(req) });
  return ok({ revalidated: true, at: new Date().toISOString() });
});
