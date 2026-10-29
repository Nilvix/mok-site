import { ok, route } from "@/lib/server/http";
import { getYandexData } from "@/lib/yandex";

export const revalidate = 21600;

/** Отзывы, рейтинг и фото с Яндекс Карт в JSON (для отладки и обновления снимка). */
export const GET = route("/api/yandex", async () => ok(await getYandexData()));
