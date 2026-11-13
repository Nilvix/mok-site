"use client";

import Link from "next/link";
import { ArrowUpRight, Instagram, Send } from "lucide-react";
import { LogoMark } from "./ui/LogoMark";
import { SITE } from "@/lib/site-config";
import { VENUE_LIST } from "@/lib/venues";
import { useVenue } from "./VenueProvider";


const SOCIALS = [
  { href: SITE.socials.instagram, label: "Instagram*", Icon: Instagram },
  { href: SITE.socials.telegram, label: "Telegram", Icon: Send },
];

export function Footer() {
  const venue = useVenue();
  const home = venue.basePath || "/";
  const NAV = [
    { href: `${home}#about`, label: "О нас" },
    { href: `${home}#services`, label: "Услуги" },
    ...(venue.id === "220" ? [{ href: "/menu", label: "Меню" }] : []),
    { href: `${home}#gallery`, label: "Галерея" },
    { href: `${home}#reviews`, label: "Отзывы" },
    { href: `${home}#contact`, label: "Контакты" },
  ];
  return (
    <footer className="relative border-t border-white/5 bg-coal">
      <div className="mx-auto max-w-7xl px-5 pb-28 pt-14 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <LogoMark tagline className="w-40" />

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">
              {SITE.name} — ресто-лаунж и ресторан в Черкесске. Паровые коктейли, лимонады, кухня
              и игровая зона. Место, где вечер получается сам.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/70 transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
              Навигация
            </div>
            <ul className="mt-5 space-y-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-sm text-white/70 transition-colors hover:text-accent"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
              Наши заведения
            </div>
            <ul className="mt-5 space-y-6 text-sm text-white/70">
              {VENUE_LIST.map((v) => (
                <li key={v.id} className="space-y-1.5">
                  <Link
                    href={v.basePath || "/"}
                    className={
                      v.id === venue.id
                        ? "font-semibold text-white"
                        : "font-semibold text-white transition-colors hover:text-accent"
                    }
                  >
                    МОК · {v.short}
                    {v.id !== venue.id && <ArrowUpRight size={13} className="ml-1 inline" />}
                  </Link>
                  <div>
                    <a href={v.phoneHref} className="transition-colors hover:text-accent">
                      {v.phone}
                    </a>
                  </div>
                  <div className="text-white/50">Ежедневно · {v.hours}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 text-xs text-white/40 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} {SITE.name}. Все права защищены.</div>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white/70">
              Политика конфиденциальности
            </Link>
            <Link href="/offer" className="transition-colors hover:text-white/70">
              Оферта
            </Link>
          </div>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-white/25">
          * Instagram принадлежит компании Meta Platforms Inc., деятельность которой
          признана экстремистской и запрещена на территории РФ.
        </p>

        <div className="mt-10 flex justify-center">
          <a
            href="https://nilvix.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Сайт разработан Nilvix — открыть портфолио"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-white/[0.03] py-2 pl-5 pr-2 transition-all duration-500 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-glow"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/45">Created by</span>
            <span className="bg-gradient-to-r from-white via-accent-soft to-accent bg-clip-text font-signature text-3xl leading-none text-transparent">
              Nilvix
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.06] text-white/60 transition-all duration-500 group-hover:rotate-45 group-hover:bg-accent group-hover:text-white">
              <ArrowUpRight size={15} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}