"use client";

import Image from "next/image";
import { Reveal } from "./ui/Reveal";
import { SITE } from "@/lib/site-config";

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-6">
            <Reveal>
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
                О нас
              </span>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="mt-5 text-3xl font-black leading-[1.1] tracking-tight text-white md:text-5xl">
                Больше, чем
                <span className="text-accent"> лаунж</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 text-base leading-relaxed text-white/60 md:text-lg">
                МОК — это ресто-лаунж в центре Черкесска. Мы соединили
                четыре вещи, за которые хочется остаться до утра: вкусную
                кухню, авторский бар, паровые коктейли и игровую зону.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-4 text-base leading-relaxed text-white/60 md:text-lg">
                Каждая деталь — от вкуса парового коктейля до звука в зале — продумана
                так, чтобы вечер получился именно таким, как вы хотели.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <ul className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  "Авторские паровые коктейли",
                  "Коктейльная карта",
                  "Кухня до позднего",
                  "PlayStation и настолки",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-white/75">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="md:col-span-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={SITE.images.about}
                alt="Барная стойка ресто-лаунжа МОК"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between rounded-2xl border border-white/10 bg-ink/60 p-4 backdrop-blur-xl">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                    Рейтинг
                  </div>
                  <div className="mt-1 text-2xl font-black text-white">
                    {SITE.rating}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                    Адрес
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {SITE.addressShort}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}