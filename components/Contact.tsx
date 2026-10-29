"use client";

import { MapPin, Phone, Clock, CalendarCheck } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { Button } from "./ui/Button";
import { SITE } from "@/lib/site-config";

const INFO = [
  { icon: MapPin, label: "Адрес", value: SITE.address },
  { icon: Phone, label: "Телефон", value: SITE.phone, href: SITE.phoneHref },
  { icon: Clock, label: "Часы работы", value: SITE.hours },
];

export function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <Reveal>
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
                Контакты
              </span>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="mt-5 text-3xl font-black leading-[1.1] tracking-tight text-white md:text-5xl">
                Ждём вас
                <span className="text-accent"> в МОК</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-5 text-base leading-relaxed text-white/60">
                Забронируйте стол онлайн за минуту или просто приходите — мы всегда
                рады гостям. Для больших компаний и мероприятий позвоните
                заранее — подберём зал.
              </p>
            </Reveal>

            <ul className="mt-10 space-y-5">
              {INFO.map((row, i) => {
                const Icon = row.icon;
                const content = (
                  <div className="flex items-start gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-accent">
                      <Icon size={18} strokeWidth={1.8} />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                        {row.label}
                      </div>
                      <div className="mt-1 text-base text-white">
                        {row.value}
                      </div>
                    </div>
                  </div>
                );
                return (
                  <Reveal key={row.label} delay={0.15 + i * 0.05}>
                    {row.href ? (
                      <a href={row.href} className="block transition-colors hover:text-accent">
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </Reveal>
                );
              })}
            </ul>

            <Reveal delay={0.35}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href={SITE.bookingUrl} variant="primary">
                  <CalendarCheck size={18} /> Забронировать стол
                </Button>
                <Button href={SITE.phoneHref} variant="outline" className="px-6 py-3 text-sm">
                  <Phone size={16} /> Позвонить
                </Button>
                <Button href={SITE.mapLink} variant="outline" className="px-6 py-3 text-sm">
                  Проложить маршрут
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="md:col-span-7">
            <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] md:h-full md:min-h-[520px]">
              <iframe
                title="МОК на карте"
                src={SITE.mapEmbed}
                loading="lazy"
                className="h-full w-full"
                style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg)" }}
                allowFullScreen
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}