import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/Gallery";
import { Reviews } from "@/components/Reviews";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { getYandexData } from "@/lib/yandex";

export const revalidate = 21600;

export default async function Page() {
  const yandex = await getYandexData();

  return (
    <>
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
    </>
  );
}