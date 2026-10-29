"use client";

import {
  CloudFog,
  Martini,
  UtensilsCrossed,
  Gamepad2,
  CalendarCheck,
  PartyPopper,
} from "lucide-react";
import { Reveal } from "./ui/Reveal";

const SERVICES = [
  {
    icon: CloudFog,
    title: "Паровые коктейли",
    text: "Более 30 вкусов: фруктовые, авторские и классические.",
  },
  {
    icon: Martini,
    title: "Бар",
    text: "Коктейльная карта, крепкий алкоголь, авторские шоты и безалкогольные миксы.",
  },
  {
    icon: UtensilsCrossed,
    title: "Кухня",
    text: "Закуски, горячее и десерты. Кухня работает до последнего гостя.",
  },
  {
    icon: Gamepad2,
    title: "Игровая зона",
    text: "PlayStation, настольные игры и большой экран для трансляций.",
  },
  {
    icon: PartyPopper,
    title: "Мероприятия",
    text: "Дни рождения, корпоративы и закрытые вечеринки под ключ.",
  },
  {
    icon: CalendarCheck,
    title: "Бронь столов",
    text: "Столы, VIP-зоны и диваны — по звонку за пару минут.",
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
            Услуги
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-2xl text-3xl font-black leading-[1.1] tracking-tight text-white md:text-5xl">
            Всё для
            <span className="text-accent"> идеального вечера</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 0.06}>
                <article className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.04]">
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/0 blur-3xl transition-all duration-500 group-hover:bg-accent/25" />

                  <div className="relative">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-accent transition-transform duration-500 group-hover:scale-110">
                      <Icon size={22} strokeWidth={1.8} />
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-white">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">
                      {s.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}