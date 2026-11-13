// Обновляет резервные снимки данных Яндекс Карт для обоих заведений
// (lib/yandex-snapshot.json — Октябрьская, 220; lib/yandex-snapshot-322.json — Октябрьская, 322).
// Запуск при работающем dev-сервере: npm run sync:yandex
import { writeFile } from "node:fs/promises";

const base = process.env.SITE_URL ?? "http://localhost:3000";
const FILES = { 220: "yandex-snapshot.json", 322: "yandex-snapshot-322.json" };

let failed = false;
for (const [venue, file] of Object.entries(FILES)) {
  const res = await fetch(`${base}/api/yandex?venue=${venue}`, { cache: "no-store" });
  const data = await res.json();
  if (data.source !== "live") {
    console.error(`[${venue}] Яндекс не отдал живые данные — снимок не обновлён.`);
    failed = true;
    continue;
  }
  delete data.source;
  await writeFile(new URL(`../lib/${file}`, import.meta.url), JSON.stringify(data, null, 2) + "\n");
  console.log(
    `[${venue}] сохранено: ${data.reviews.length} отзывов, ${data.photos.length} фото, рейтинг ${data.rating}`,
  );
}
process.exit(failed ? 1 : 0);
