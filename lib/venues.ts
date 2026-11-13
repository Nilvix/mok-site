/**
 * Заведения МОК. Всё, что отличается у Октябрьской, 220 и Октябрьской, 322, лежит здесь.
 * Общие данные (название, соцсети, реквизиты) — в lib/site-config.ts.
 */

export type VenueId = "220" | "322";

export type ServiceCard = {
  icon: "steam" | "drinks" | "kitchen" | "games" | "events" | "booking";
  title: string;
  text: string;
  /** Куда ведёт карточка; без href — некликабельна. */
  href?: string;
};

export type Venue = {
  id: VenueId;
  /** Корень страниц заведения: "" или "/322" */
  basePath: string;
  /** CSS-класс палитры (app/globals.css) */
  theme: string;
  themeColor: string;
  kind: string;
  short: string;
  address: string;
  addressShort: string;
  phone: string;
  phoneHref: string;
  hours: string;
  bookingUrl: string;
  /** Координаты для карты: [долгота, широта] */
  coords: [number, number];
  yandexOrgId: string;
  images: { hero: string; about: string };
  services: ServiceCard[];
};

const BOOKING_NOTE =
  "Забронируйте стол или место в игровой зоне по телефону или кнопкой «Забронировать» — всё займёт пару минут.";

export const VENUES: Record<VenueId, Venue> = {
  "220": {
    id: "220",
    basePath: "",
    theme: "",
    themeColor: "#0A0A0A",
    kind: "Ресто-лаунж",
    short: "Октябрьская, 220",
    address: "г. Черкесск, ул. Октябрьская, 220",
    addressShort: "ул. Октябрьская, 220",
    phone: "+7 (938) 027-02-20",
    phoneHref: "tel:+79380270220",
    hours: "14:00 — 03:00",
    bookingUrl: "https://axle.market/mok220_booking",
    coords: [42.06066, 44.220692],
    yandexOrgId: "175130855154",
    images: {
      hero: "https://avatars.mds.yandex.net/get-altay/11203687/2a0000019148655dd4c8bec019213073e678/XXXL",
      about: "https://avatars.mds.yandex.net/get-altay/14306621/2a0000019148652817455078f6206d0ef135/XXXL",
    },
    services: [
      {
        icon: "steam",
        title: "Паровые коктейли",
        text: "Более 30 вкусов: фруктовые, авторские и классические.",
      },
      {
        icon: "drinks",
        title: "Лимонады, кофе и милкшейки",
        text: "Домашние лимонады, свежесваренный кофе, милкшейки и большая чайная карта — вкусно и без алкоголя.",
        href: "/menu#bar",
      },
      {
        icon: "kitchen",
        title: "Кухня до 2:30",
        text: "Салаты, супы, горячее, пицца, бургеры и десерты. Кухня работает до 2:30 — поужинать можно и глубокой ночью.",
        href: "/menu#kitchen",
      },
      {
        icon: "games",
        title: "Игровая зона",
        text: "Компьютерные залы с мощными игровыми ПК, PlayStation 5 и настольные игры — для игры с друзьями или всей командой.",
      },
      {
        icon: "events",
        title: "Трансляции и розыгрыши",
        text: "Спортивные трансляции на экранах по всему заведению, тематические вечера и постоянные розыгрыши с хорошими призами.",
        href: "#promo",
      },
      {
        icon: "booking",
        title: "Бронь столов и игровых зон",
        text: BOOKING_NOTE,
        href: "https://axle.market/mok220_booking",
      },
    ],
  },
  "322": {
    id: "322",
    basePath: "/322",
    theme: "theme-red",
    themeColor: "#0A0A0A",
    kind: "Ресторан",
    short: "Октябрьская, 322",
    address: "г. Черкесск, ул. Октябрьская, 322",
    addressShort: "ул. Октябрьская, 322",
    phone: "+7 (999) 491-05-88",
    phoneHref: "tel:+79994910588",
    hours: "11:00 — 01:00",
    bookingUrl: "https://axle.market/mok322_booking",
    coords: [42.054721, 44.20028],
    yandexOrgId: "167567837497",
    images: {
      hero: "https://avatars.mds.yandex.net/get-altay/17651669/2a0000019ecb5fd505d5937b53bff87ee2ce/XXXL",
      about: "https://avatars.mds.yandex.net/get-altay/20105000/2a0000019f4d7baf18713a578d6d68441187/XXXL",
    },
    services: [
      {
        icon: "steam",
        title: "Паровые коктейли",
        text: "Фруктовые, авторские и классические вкусы — подберём под ваше настроение.",
      },
      {
        icon: "drinks",
        title: "Лимонады, кофе и милкшейки",
        text: "Домашние лимонады, свежесваренный кофе, милкшейки и чай — вкусно и без алкоголя.",
      },
      {
        icon: "kitchen",
        title: "Кухня",
        text: "Салаты, горячее и десерты — меню новой кухни скоро появится на сайте.",
      },
      {
        icon: "games",
        title: "Игровая зона",
        text: "Игровые ПК, PlayStation 5 и настольные игры — для игры с друзьями или всей командой.",
      },
      {
        icon: "events",
        title: "Трансляции и розыгрыши",
        text: "Спортивные трансляции, тематические вечера и розыгрыш 30 000 ₽ в честь открытия.",
        href: "#promo",
      },
      {
        icon: "booking",
        title: "Бронь столов и игровых зон",
        text: BOOKING_NOTE,
        href: "https://axle.market/mok322_booking",
      },
    ],
  },
};

export const VENUE_LIST = [VENUES["220"], VENUES["322"]];

export function otherVenue(v: Venue): Venue {
  return v.id === "220" ? VENUES["322"] : VENUES["220"];
}

/** Ссылка на карту Яндекса с меткой заведения (для iframe). */
export function mapEmbedUrl(v: Venue): string {
  const [lon, lat] = v.coords;
  return `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=17&pt=${lon}%2C${lat}%2Cpm2rdm&oid=${v.yandexOrgId}`;
}

export function mapLink(v: Venue): string {
  return `https://yandex.ru/maps/org/mok/${v.yandexOrgId}/`;
}

/** Маршрут в Яндекс Картах до заведения. */
export function routeLink(v: Venue): string {
  const [lon, lat] = v.coords;
  return `https://yandex.ru/maps/?rtext=~${lat}%2C${lon}&rtt=auto`;
}
