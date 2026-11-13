"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import { CalendarCheck, Menu, Phone, X } from "lucide-react";
import { Button } from "./ui/Button";
import { LogoMark } from "./ui/LogoMark";
import { SITE } from "@/lib/site-config";
import { useVenue } from "./VenueProvider";
import { useMenu } from "./menu/MenuProvider";
import { VenueCards, VenueSwitch } from "./VenueSwitch";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

export function Header() {
  const venue = useVenue();
  const menu = useMenu();
  const home = venue.basePath || "/";
  const NAV: { href: string; label: string; menu?: true }[] = [
    { href: `${home}#about`, label: "О нас" },
    { href: `${home}#services`, label: "Услуги" },
    ...(menu?.available ? [{ href: "#menu", label: "Меню", menu: true as const }] : []),
    { href: `${home}#gallery`, label: "Галерея" },
    { href: `${home}#reviews`, label: "Отзывы" },
    { href: `${home}#contact`, label: "Контакты" },
  ];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setPastHero(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-white/5 bg-ink/85 py-3 backdrop-blur-xl"
            : "bg-transparent py-5"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href={home} aria-label={`${SITE.name} — на главную`}>
            <LogoMark className="w-[76px] sm:w-[88px] md:w-[104px]" />
          </Link>

          <nav className="hidden items-center gap-8 whitespace-nowrap xl:flex">
            {NAV.map((item) =>
              item.menu ? (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => menu?.open()}
                  aria-haspopup="dialog"
                  className="group relative text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  {item.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  {item.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <VenueSwitch current={venue} />
            <a
              href={venue.phoneHref}
              aria-label={`Позвонить: ${venue.phone}`}
              title={venue.phone}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-all hover:border-accent hover:text-accent active:scale-95"
            >
              <Phone size={17} />
            </a>
            <Button href={venue.bookingUrl} variant="primary" className="px-6 py-3 text-sm">
              <CalendarCheck size={16} /> Забронировать
            </Button>
            {/* На средних экранах разделы прячутся в меню-бургер */}
            <button
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-accent xl:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
          <VenueSwitch current={venue} compact />
          <a
            href={venue.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Забронировать стол"
            className={cn(
              "grid h-11 w-11 place-items-center rounded-full bg-accent text-white transition-all hover:bg-accent-dark active:scale-95 sm:inline-flex sm:w-auto sm:gap-1.5 sm:px-4 sm:text-sm sm:font-semibold",
              pastHero && "max-md:hidden",
            )}
          >
            <CalendarCheck size={16} /> <span className="hidden sm:inline">Бронь</span>
          </a>
          <button
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-accent lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          </div>
        </div>

        <motion.div
          style={{ scaleX: progress }}
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent"
        />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl xl:hidden"
          >
            <motion.nav
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
                closed: {},
              }}
              className="flex h-full flex-col items-center justify-center gap-6 px-5"
            >
              <motion.div
                variants={{ closed: { opacity: 0, y: 20 }, open: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mb-2 flex w-full justify-center"
              >
                <VenueCards current={venue} onNavigate={() => setOpen(false)} />
              </motion.div>
              {NAV.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{
                    closed: { opacity: 0, y: 20 },
                    open: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  {item.menu ? (
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        menu?.open();
                      }}
                      className="text-3xl font-black uppercase tracking-tight text-white/90 transition-colors hover:text-accent"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="text-3xl font-black uppercase tracking-tight text-white/90 transition-colors hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.div
                variants={{
                  closed: { opacity: 0, y: 20 },
                  open: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex flex-col items-center gap-3 pt-4"
              >
                <Button href={venue.bookingUrl} onClick={() => setOpen(false)}>
                  <CalendarCheck size={16} /> Забронировать стол
                </Button>
                <Button href={venue.phoneHref} variant="outline" onClick={() => setOpen(false)}>
                  <Phone size={16} /> {venue.phone}
                </Button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Плавающая кнопка брони на телефоне — появляется после первого экрана */}
      <AnimatePresence>
        {pastHero && !open && (
          <motion.a
            href={venue.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            whileTap={{ scale: 0.97 }}
            className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex items-center justify-center gap-2 rounded-full bg-accent py-4 text-base font-semibold text-white shadow-glow md:hidden"
          >
            <CalendarCheck size={18} /> Забронировать стол
          </motion.a>
        )}
      </AnimatePresence>
    </>
  );
}