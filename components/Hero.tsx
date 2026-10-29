"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDown, CalendarCheck, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";
import { LogoMark } from "./ui/LogoMark";
import { SITE } from "@/lib/site-config";
import { EASE } from "@/lib/motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={SITE.images.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/90 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(233,30,140,0.30),transparent_60%)]" />
      </div>

      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-20 pt-32 md:grid-cols-12 md:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="md:col-span-7"
        >
          <motion.div
            variants={item}
            className="group mb-8 inline-flex items-center gap-3 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs text-white/90 backdrop-blur md:text-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-medium">Ресто-лаунж · Черкесск</span>
            <Sparkles size={14} className="text-accent" />
          </motion.div>

          <motion.h1 variants={item} className="mb-2">
            <LogoMark tagline animated className="w-[280px] sm:w-[380px] md:w-[460px]" />
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/60 md:text-lg"
          >
            Паровые коктейли, авторский бар, кухня и игровая зона. Пространство,
            в которое хочется возвращаться вечером.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <Button href={SITE.bookingUrl} variant="primary">
              <CalendarCheck size={18} /> Забронировать стол
            </Button>
            <Button href="#services" variant="outline">
              Что у нас есть
            </Button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-14 grid max-w-lg grid-cols-3 gap-4 border-t sm:gap-6 border-white/10 pt-8"
          >
            {[
              { v: SITE.rating, l: "рейтинг" },
              { v: "220", l: "Октябрьская" },
              { v: SITE.city, l: "КЧР" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-xl font-black text-white sm:text-2xl md:text-3xl">
                  {s.v}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/40">
                  {s.l}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.aside
          id="promo"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="md:col-span-5 md:row-span-0 -bottom-20"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl md:p-8">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                Акция месяца
              </span>

              <h3 className="mt-5 text-2xl font-black leading-tight text-white md:text-3xl">
                Паровой коктейль в подарок к сету
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Каждую пятницу и субботу — паровой коктейль в подарок при заказе
                кухни от 3000 ₽. Подробности у администратора.
              </p>

              <div className="mt-7 flex items-end justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black leading-none text-white">
                      30
                    </span>
                    <span className="text-xs uppercase tracking-widest text-white/50">
                      дней
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/40">
                    до конца акции
                  </div>
                </div>
                <Button
                  href={SITE.phoneHref}
                  variant="outline"
                  className="px-5 py-2.5 text-sm"
                >
                  Узнать
                </Button>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>

      <motion.a
        href="#about"
        aria-label="Прокрутить вниз"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/40 transition-colors hover:text-accent md:flex"
      >
        <motion.span
          animate={reduce ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="grid h-8 w-8 place-items-center rounded-full border border-white/15"
        >
          <ArrowDown size={14} />
        </motion.span>
        Листайте
      </motion.a>
    </section>
  );
}