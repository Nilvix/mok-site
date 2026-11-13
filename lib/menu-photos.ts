import type { StaticImageData } from "next/image";
import salad from "@/assets/menu/salad.jpg";
import soup from "@/assets/menu/soup.jpg";
import pasta from "@/assets/menu/pasta.jpg";
import fries from "@/assets/menu/fries.jpg";
import wedges from "@/assets/menu/wedges.jpg";
import pizza from "@/assets/menu/pizza.jpg";
import khachapuri from "@/assets/menu/khachapuri.jpg";
import sandwich from "@/assets/menu/sandwich.jpg";
import nuggets from "@/assets/menu/nuggets.jpg";
import fondant from "@/assets/menu/fondant.jpg";
import dessert from "@/assets/menu/dessert.jpg";
import lemonade from "@/assets/menu/lemonade.jpg";
import milkshake from "@/assets/menu/milkshake.jpg";
import tea from "@/assets/menu/tea.jpg";
import coffee from "@/assets/menu/coffee.jpg";
import beer from "@/assets/menu/beer.jpg";
import sausages from "@/assets/menu/sausages.jpg";
import snacks from "@/assets/menu/snacks.jpg";

/** Фото блюд и напитков (assets/menu). В базе хранится ключ, например "salad". */
export const MENU_PHOTOS = {
  salad,
  soup,
  pasta,
  fries,
  wedges,
  pizza,
  khachapuri,
  sandwich,
  nuggets,
  fondant,
  dessert,
  lemonade,
  milkshake,
  tea,
  coffee,
  beer,
  sausages,
  snacks,
} satisfies Record<string, StaticImageData>;

export type MenuPhoto = keyof typeof MENU_PHOTOS;

export const MENU_PHOTO_KEYS = Object.keys(MENU_PHOTOS) as MenuPhoto[];

export function menuPhoto(key: string | null | undefined): StaticImageData | undefined {
  return key && key in MENU_PHOTOS ? MENU_PHOTOS[key as MenuPhoto] : undefined;
}
