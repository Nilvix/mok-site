import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/Gallery";
import { Reviews } from "@/components/Reviews";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { VenueProvider } from "@/components/VenueProvider";
import { getYandexData } from "@/lib/yandex";
import type { VenueId } from "@/lib/venues";
import { getMenu, getVenueContent } from "@/lib/content";
import { PHOTOS_322, PHOTO_CREDIT_322 } from "@/lib/gallery-322";
import { MenuProvider } from "@/components/menu/MenuProvider";

/** Главная страница заведения: одинаковая структура, свои данные и палитра. */
export async function VenuePage({ id }: { id: VenueId }) {
  const [yandex, venue, menu] = await Promise.all([getYandexData(id), getVenueContent(id), getMenu(id)]);

  return (
    <VenueProvider venue={venue} rating={yandex.rating}>
      <MenuProvider sections={menu}>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Gallery
          photos={id === "322" ? [...PHOTOS_322, ...yandex.photos] : yandex.photos}
          link={yandex.link}
          credit={id === "322" ? PHOTO_CREDIT_322 : undefined}
        />
        <Reviews data={yandex} />
        <Contact />
      </main>
      <Footer />
      </MenuProvider>
    </VenueProvider>
  );
}
