import type { Metadata } from "next";
import { VenuePage } from "@/components/VenuePage";
import { VENUES } from "@/lib/venues";

// Контент из админки появляется на сайте не позже чем через 5 минут (или сразу после сохранения)
export const revalidate = 300;

const v = VENUES["322"];

export const metadata: Metadata = {
  title: `Ресторан на ${v.short}`,
  description: `МОК — ресторан в Черкесске, ${v.addressShort}. Кухня, паровые коктейли, игровая зона и розыгрыш 30 000 ₽ в честь открытия.`,
  alternates: { canonical: "/322" },
};

export default function Page() {
  return <VenuePage id="322" />;
}
