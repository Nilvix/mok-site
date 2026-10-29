import Link from "next/link";
import { Instagram, Send } from "lucide-react";
import { LogoMark } from "./ui/LogoMark";
import { SITE } from "@/lib/site-config";

const NAV = [
  { href: "/#about", label: "О нас" },
  { href: "/#services", label: "Услуги" },
  { href: "/#gallery", label: "Галерея" },
  { href: "/#reviews", label: "Отзывы" },
  { href: "/#contact", label: "Контакты" },
];

const SOCIALS = [
  { href: SITE.socials.instagram, label: "Instagram*", Icon: Instagram },
  { href: SITE.socials.telegram, label: "Telegram", Icon: Send },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-coal">
      <div className="mx-auto max-w-7xl px-5 pb-28 pt-14 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <LogoMark tagline className="w-40" />

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">
              {SITE.name} — {SITE.tagline.toLowerCase()}. Паровые коктейли, бар, кухня
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
              Контакты
            </div>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li>{SITE.address}</li>
              <li>
                <a href={SITE.phoneHref} className="transition-colors hover:text-accent">
                  {SITE.phone}
                </a>
              </li>
              <li>{SITE.hours}</li>
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

        <div className="mt-8 flex justify-center">
          <a
            href="https://github.com/Nilvix"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-baseline gap-2 text-white/45 transition-colors duration-300 hover:text-white/60"
          >
            <span className="text-[10px] uppercase tracking-[0.3em]">Created by</span>
            <span className="bg-gradient-to-r from-white via-accent-soft to-accent bg-clip-text px-1 font-signature text-3xl leading-none text-transparent transition-[filter] duration-500 group-hover:drop-shadow-[0_0_10px_rgba(241,19,241,0.6)]">
              Nilvix
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}