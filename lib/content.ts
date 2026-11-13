import "server-only";
import { asc, eq, inArray } from "drizzle-orm";
import { getDb } from "./server/db";
import { logger } from "./server/logger";
import { menuCategories, menuItems, promos, services, venues } from "./server/schema";
import { MENU_220, type MenuSection } from "./menu-220";
import { VENUES, telHref, type ServiceCard, type Venue, type VenueId } from "./venues";
import { mediaUrl } from "./media-url";
import { ABOUT_322, HERO_322 } from "./gallery-322";

const log = logger("content");

/** Меню по умолчанию (до первой правки в админке или без базы). */
export const DEFAULT_MENUS: Record<VenueId, MenuSection[]> = { "220": MENU_220, "322": [] };

/**
 * Данные заведения для страниц: значения по умолчанию из lib/venues.ts,
 * поверх — то, что владелец изменил в админ-панели.
 */
export async function getVenueContent(id: VenueId): Promise<Venue> {
  const base = withPhotos(VENUES[id]);
  const db = getDb();
  if (!db) return base;
  try {
    const [row] = await db.select().from(venues).where(eq(venues.id, id));
    if (!row) return base;
    const [promo] = await db.select().from(promos).where(eq(promos.venueId, id));
    const cards = await db
      .select()
      .from(services)
      .where(eq(services.venueId, id))
      .orderBy(asc(services.position));
    return {
      ...base,
      phone: row.phone,
      phoneHref: telHref(row.phone),
      hours: row.hours,
      bookingUrl: row.bookingUrl,
      promo: promo
        ? {
            enabled: promo.enabled,
            badge: promo.badge,
            title: promo.title,
            text: promo.text,
            prizes: promo.prizes,
            counterValue: promo.counterValue,
            counterLabel: promo.counterLabel,
          }
        : base.promo,
      services: cards.length
        ? cards.map((c) => ({
            icon: c.icon as ServiceCard["icon"],
            title: c.title,
            text: c.text,
            href: c.href || undefined,
          }))
        : base.services,
    };
  } catch (e) {
    log.error("venue content from DB failed, using defaults", { id, err: e });
    return base;
  }
}

/** Профессиональные фото интерьера (lib/gallery-322.ts) вместо снимков с Яндекса. */
function withPhotos(v: Venue): Venue {
  return v.id === "322" ? { ...v, images: { hero: HERO_322, about: ABOUT_322 } } : v;
}

/** Меню заведения: из базы, а если её нет — меню по умолчанию. Скрытые позиции не попадают. */
export async function getMenu(id: VenueId): Promise<MenuSection[]> {
  const db = getDb();
  if (!db) return DEFAULT_MENUS[id];
  try {
    const cats = await db
      .select()
      .from(menuCategories)
      .where(eq(menuCategories.venueId, id))
      .orderBy(asc(menuCategories.position));
    if (!cats.length) return DEFAULT_MENUS[id];
    const items = await db
      .select()
      .from(menuItems)
      .where(inArray(menuItems.categoryId, cats.map((c) => c.id)))
      .orderBy(asc(menuItems.position));

    const sections: MenuSection[] = [
      { id: "kitchen", title: "Кухня", subtitle: id === "220" ? "Работает до 2:30" : "", categories: [] },
      { id: "bar", title: "Бар", subtitle: "Лимонады, кофе, чай и милкшейки", categories: [] },
    ];
    for (const c of cats) {
      const list = items.filter((i) => i.categoryId === c.id && i.available);
      if (!list.length) continue;
      sections
        .find((s) => s.id === c.section)!
        .categories.push({
          id: c.slug,
          title: c.title,
          volumes: c.volumes ?? undefined,
          adultsOnly: c.adultsOnly,
          items: list.map((i) => ({
            name: i.name,
            price: i.prices.length === 1 ? i.prices[0] : i.prices,
            note: i.note ?? undefined,
            photo: mediaUrl(i.photo),
          })),
        });
    }
    return sections.filter((s) => s.categories.length);
  } catch (e) {
    log.error("menu from DB failed, using defaults", { id, err: e });
    return DEFAULT_MENUS[id];
  }
}
