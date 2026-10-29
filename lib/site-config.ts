export const SITE = {
  name: "МОК",
  nameLatin: "MOK",
  tagline: "Ресто-лаунж в Черкесске",
  description:
    "МОК — ресто-лаунж в центре Черкесска. Паровые коктейли, авторский бар, кухня и игровая зона. Место для тех, кто ценит атмосферу и вкус.",
  address: "г. Черкесск, ул. Октябрьская, 220",
  addressShort: "ул. Октябрьская, 220",
  city: "Черкесск",
  phone: "+7 (938) 027-02-20",
  phoneHref: "tel:+79380270220",
  hours: "14:00 — 03:00",
  /**
   * Реквизиты для «Политики конфиденциальности» и «Оферты».
   * ⚠️ Заполни перед публикацией сайта: пустые поля подсвечиваются на страницах документов.
   */
  legal: {
    /** Например: «ИП Иванов Иван Иванович» или «ООО «МОК»» */
    name: "",
    inn: "",
    /** ОГРН (для ООО) или ОГРНИП (для ИП) */
    ogrn: "",
    /** Юридический адрес (если отличается от адреса заведения) */
    address: "",
    /** Почта для запросов по персональным данным (необязательно) */
    email: "",
    /** Дата, с которой действуют документы */
    effectiveDate: "29 октября 2026 г.",
  },
  // Онлайн-бронирование столов через Axle
  bookingUrl: "https://axle.market/mok220_booking",
  rating: "4.9",
  ratingLabel: "Яндекс.Карты",
  mapEmbed:
    "https://yandex.ru/map-widget/v1/?ll=42.057000%2C44.226000&z=17&text=Черкесск%20Октябрьская%20220",
  mapLink: "https://yandex.ru/maps/-/CTxfVXOi",
  socials: {
    instagram: "https://www.instagram.com/mok_resto?exln=bjNuOWowc3A3MGs5",
    telegram: "https://t.me/MOKrestolounge",
  },
  // Реальные фото заведения с Яндекс Карт
  images: {
    hero: "https://avatars.mds.yandex.net/get-altay/11203687/2a0000019148655dd4c8bec019213073e678/XXXL",
    about: "https://avatars.mds.yandex.net/get-altay/14306621/2a0000019148652817455078f6206d0ef135/XXXL",
  },
} as const;