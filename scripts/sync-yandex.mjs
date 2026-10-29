// Обновляет резервный снимок данных Яндекс Карт (lib/yandex-snapshot.json).
// Запуск при работающем dev-сервере: npm run sync:yandex
import { writeFile } from "node:fs/promises";

const base = process.env.SITE_URL ?? "http://localhost:3000";
const res = await fetch(`${base}/api/yandex`, { cache: "no-store" });
const data = await res.json();
if (data.source !== "live" || !data.reviews?.length) {
  console.error("Яндекс не отдал живые данные — снимок не обновлён.");
  process.exit(1);
}
delete data.source;
await writeFile(
  new URL("../lib/yandex-snapshot.json", import.meta.url),
  JSON.stringify(data, null, 2) + "\n",
);
console.log(
  `Сохранено: ${data.reviews.length} отзывов, ${data.photos.length} фото, рейтинг ${data.rating}`,
);
