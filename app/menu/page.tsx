import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MenuView } from "@/components/MenuView";
import { VenueProvider } from "@/components/VenueProvider";
import { getMenu, getVenueContent } from "@/lib/content";
import { VENUES } from "@/lib/venues";

const v = VENUES["220"];

export const metadata: Metadata = {
  title: "Меню",
  description: `Меню МОК на ${v.short}: кухня до 2:30, лимонады, кофе, чай, милкшейки. Цены.`,
  alternates: { canonical: "/menu" },
};

export const revalidate = 300;

export default async function MenuPage() {
  const [venue, menu] = await Promise.all([getVenueContent("220"), getMenu("220")]);
  return (
    <VenueProvider venue={venue}>
      <Header />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-28 md:px-8 md:pt-32">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
          МОК · {v.short}
        </span>
        <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight text-white md:text-6xl">
          Меню
        </h1>
        <p className="mt-4 max-w-xl text-base text-white/60">
          Кухня работает до 2:30. Цены указаны в рублях. Фотографии — иллюстрации,
          подача блюд может отличаться.
        </p>
        <div className="mt-10">
          <MenuView sections={menu} />
        </div>
      </main>
      <Footer />
    </VenueProvider>
  );
}
