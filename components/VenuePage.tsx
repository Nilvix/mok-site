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

/** Главная страница заведения: одинаковая структура, свои данные и палитра. */
export async function VenuePage({ id }: { id: VenueId }) {
  const yandex = await getYandexData(id);

  return (
    <VenueProvider id={id} rating={yandex.rating}>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Gallery photos={yandex.photos} link={yandex.link} />
        <Reviews data={yandex} />
        <Contact />
      </main>
      <Footer />
    </VenueProvider>
  );
}
