import type { Photo } from "./reviews";
import p01_logo_wall from "@/assets/venues/322/01-logo-wall.jpg";
import p02_bar from "@/assets/venues/322/02-bar.jpg";
import p03_hall from "@/assets/venues/322/03-hall.jpg";
import p05_lounge_chair from "@/assets/venues/322/05-lounge-chair.jpg";
import p06_sofas from "@/assets/venues/322/06-sofas.jpg";
import p07_hall_stairs from "@/assets/venues/322/07-hall-stairs.jpg";
import p08_vip_room from "@/assets/venues/322/08-vip-room.jpg";
import p09_decor from "@/assets/venues/322/09-decor.jpg";
import p10_lounge from "@/assets/venues/322/10-lounge.jpg";
import p11_corridor from "@/assets/venues/322/11-corridor.jpg";
import p12_logo_chair from "@/assets/venues/322/12-logo-chair.jpg";
import p13_shelves from "@/assets/venues/322/13-shelves.jpg";
import p14_seating from "@/assets/venues/322/14-seating.jpg";
import p15_booths from "@/assets/venues/322/15-booths.jpg";
import p16_details from "@/assets/venues/322/16-details.jpg";
import p17_reception from "@/assets/venues/322/17-reception.jpg";
import p18_steam_bar from "@/assets/venues/322/18-steam-bar.jpg";
import p19_drinks_fridge from "@/assets/venues/322/19-drinks-fridge.jpg";

/**
 * Профессиональные фото интерьера МОК на Октябрьской, 322
 * (совместный пост mok_resto и фотографа olkhovoy_photo в Instagram).
 */
export const PHOTO_CREDIT_322 = "olkhovoy_photo";

export const PHOTOS_322: Photo[] = [
  { id: "322-logo-wall", base: "", src: p01_logo_wall.src, alt: "МОК на Октябрьской, 322 — зона у светящейся вывески мок" },
  { id: "322-bar", base: "", src: p02_bar.src, alt: "МОК на Октябрьской, 322 — барная стойка" },
  { id: "322-hall", base: "", src: p03_hall.src, alt: "МОК на Октябрьской, 322 — общий зал" },
  { id: "322-lounge-chair", base: "", src: p05_lounge_chair.src, alt: "МОК на Октябрьской, 322 — кресло у вывески мок" },
  { id: "322-sofas", base: "", src: p06_sofas.src, alt: "МОК на Октябрьской, 322 — диваны в общем зале" },
  { id: "322-hall-stairs", base: "", src: p07_hall_stairs.src, alt: "МОК на Октябрьской, 322 — зал и лестница" },
  { id: "322-vip-room", base: "", src: p08_vip_room.src, alt: "МОК на Октябрьской, 322 — отдельная комната" },
  { id: "322-decor", base: "", src: p09_decor.src, alt: "МОК на Октябрьской, 322 — детали интерьера" },
  { id: "322-lounge", base: "", src: p10_lounge.src, alt: "МОК на Октябрьской, 322 — мягкая зона" },
  { id: "322-corridor", base: "", src: p11_corridor.src, alt: "МОК на Октябрьской, 322 — коридор с кабинками" },
  { id: "322-logo-chair", base: "", src: p12_logo_chair.src, alt: "МОК на Октябрьской, 322 — кресло у вывески" },
  { id: "322-steam-bar", base: "", src: p18_steam_bar.src, alt: "МОК на Октябрьской, 322 — барная стойка с паровыми коктейлями" },
  { id: "322-drinks-fridge", base: "", src: p19_drinks_fridge.src, alt: "МОК на Октябрьской, 322 — холодильник с напитками" },
  { id: "322-shelves", base: "", src: p13_shelves.src, alt: "МОК на Октябрьской, 322 — стеллажи с декором" },
  { id: "322-seating", base: "", src: p14_seating.src, alt: "МОК на Октябрьской, 322 — посадка у окна" },
  { id: "322-booths", base: "", src: p15_booths.src, alt: "МОК на Октябрьской, 322 — кабинки вдоль стены" },
  { id: "322-details", base: "", src: p16_details.src, alt: "МОК на Октябрьской, 322 — детали интерьера" },
  { id: "322-reception", base: "", src: p17_reception.src, alt: "МОК на Октябрьской, 322 — зона ресепшена" },
];

/** Фото для первого экрана и блока «О нас». */
export const HERO_322 = p03_hall.src;
export const ABOUT_322 = p02_bar.src;
