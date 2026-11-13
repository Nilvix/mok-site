import { ok, route } from "@/lib/server/http";
import { getYandexData } from "@/lib/yandex";



export const dynamic = "force-dynamic";

/** ?venue=220 (по умолчанию) или ?venue=322 */
export const GET = route("/api/yandex", async (req) => {
  const venue = req.nextUrl.searchParams.get("venue") === "322" ? "322" : "220";
  return ok(await getYandexData(venue));
});
