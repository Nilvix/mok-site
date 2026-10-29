import type { Photo, Review, YandexData } from "./reviews";
import snapshot from "./yandex-snapshot.json";
import { logger } from "./server/logger";

const log = logger("yandex");

export const YANDEX_ORG_ID = "175130855154";
const ORG_URL = `https://yandex.ru/maps/org/mok/${YANDEX_ORG_ID}`;

/** Как часто обновлять данные с Яндекса (сек). */
const REVALIDATE = 60 * 60 * 6;

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

type Json = Record<string, unknown>;

/** Обходит JSON и возвращает первое значение по ключу, прошедшее проверку. */
function findKey(node: unknown, key: string, test: (v: unknown) => boolean = () => true): unknown {
  const stack: unknown[] = [node];
  while (stack.length) {
    const cur = stack.pop();
    if (!cur || typeof cur !== "object") continue;
    if (!Array.isArray(cur) && key in cur && test((cur as Json)[key])) {
      return (cur as Json)[key];
    }
    for (const v of Object.values(cur)) stack.push(v);
  }
  return undefined;
}

/** Все значения по ключу. */
function findAll(node: unknown, key: string, out: unknown[] = []): unknown[] {
  if (!node || typeof node !== "object") return out;
  if (!Array.isArray(node) && key in node) out.push((node as Json)[key]);
  for (const v of Object.values(node)) findAll(v, key, out);
  return out;
}

/** "https://…/get-altay/123/abc/%s" | "{size}" | "%" → "https://…/get-altay/123/abc" */
function altayBase(url: unknown): string | null {
  if (typeof url !== "string") return null;
  const m = url.match(/^(https:\/\/avatars\.mds\.yandex\.net\/get-altay\/\d+\/[\w-]+)\//);
  return m ? m[1] : null;
}

export function parseYandexState(html: string): Omit<YandexData, "source"> {
  const raw = html.match(
    /<script type="application\/json" class="state-view">([\s\S]*?)<\/script>/,
  )?.[1];
  if (!raw) throw new Error("Yandex: state-view not found (возможно, капча)");
  const state = JSON.parse(raw) as Json;

  const ratingData = findKey(state, "ratingData", (v) => !!v && typeof v === "object") as
    | { ratingValue: number; reviewCount: number; ratingCount: number }
    | undefined;
  const results = findKey(state, "reviewResults", (v) => !!v && typeof v === "object") as
    | { reviews: Json[] }
    | undefined;
  if (!ratingData || !results?.reviews?.length) throw new Error("Yandex: reviews not found");

  const reviews: Review[] = results.reviews.map((r) => {
    const author = (r.author ?? {}) as Json;
    const avatar = typeof author.avatarUrl === "string"
      ? author.avatarUrl.replace("{size}", "islands-68")
      : null;
    return {
      id: String(r.reviewId),
      name: String(author.name ?? "Гость"),
      avatar,
      date: String(r.updatedTime ?? ""),
      rating: Number(r.rating ?? 0),
      text: String(r.text ?? "").trim(),
      reply: ((r.businessComment as Json | undefined)?.text as string | undefined)?.trim() || null,
      photos: ((r.photos as Json[] | undefined) ?? [])
        .map((p) => altayBase(p.urlTemplate))
        .filter((x): x is string => !!x),
    };
  });

  // Фото заведения: основная галерея + фото из отзывов и аспектов (еда, интерьер…)
  const seen = new Set<string>();
  const photos: Photo[] = [];
  const push = (base: string | null, alt: string) => {
    if (!base || seen.has(base)) return;
    seen.add(base);
    photos.push({ id: base.split("/").slice(-1)[0], base, alt });
  };

  const gallery = findKey(
    state,
    "photos",
    (v) => !!v && typeof v === "object" && Array.isArray((v as Json).items),
  ) as { items: { urlTemplate: string; alt?: string }[] } | undefined;
  gallery?.items.forEach((p) => push(altayBase(p.urlTemplate), p.alt || "МОК, фото"));
  reviews.forEach((r) => r.photos.forEach((b) => push(b, `Фото гостя: ${r.name}`)));
  (findAll(state, "aspects").filter(Array.isArray).flat() as Json[]).forEach((a) => {
    if (!a || typeof a !== "object" || !Array.isArray(a.photos)) return;
    (a.photos as Json[]).forEach((p) => push(altayBase(p.link), `МОК — ${a.text ?? "фото"}`));
  });

  return {
    rating: Math.round(ratingData.ratingValue * 10) / 10,
    reviewCount: ratingData.reviewCount,
    ratingCount: ratingData.ratingCount,
    reviews,
    photos,
    link: `${ORG_URL}/`,
    reviewsLink: `${ORG_URL}/reviews/`,
    addReviewLink: `${ORG_URL}/reviews/?add-review`,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Данные с Яндекс Карт: рейтинг, отзывы и фото.
 * Кэшируется на REVALIDATE секунд; если Яндекс не ответил или показал капчу —
 * возвращается сохранённый снимок lib/yandex-snapshot.json.
 */
export async function getYandexData(): Promise<YandexData> {
  try {
    const res = await fetch(`${ORG_URL}/reviews/`, {
      headers: { "User-Agent": UA, "Accept-Language": "ru-RU,ru;q=0.9" },
      next: { revalidate: REVALIDATE, tags: ["yandex"] },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Yandex: HTTP ${res.status}`);
    return { ...parseYandexState(await res.text()), source: "live" };
  } catch (e) {
    log.warn("live fetch failed, using snapshot", { reason: (e as Error).message });
    return { ...(snapshot as Omit<YandexData, "source">), source: "snapshot" };
  }
}
