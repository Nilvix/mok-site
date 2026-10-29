"use client";

import { motion, useReducedMotion } from "framer-motion";

const WORDS = ["RESTO-LOUNGE", "STEAM COCKTAILS", "BAR", "KITCHEN", "GAMING"];

export function Marquee() {
  const reduce = useReducedMotion();
  const row = [...WORDS, ...WORDS, ...WORDS, ...WORDS];

  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-y border-white/5 bg-coal py-6"
    >
      <motion.div
        className="flex w-max items-center gap-10 whitespace-nowrap will-change-transform"
        animate={reduce ? {} : { x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-2xl tracking-[0.14em] text-white/70 md:text-3xl">
              {w}
            </span>
            <span className="h-2 w-2 rounded-full bg-accent" />
          </span>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-coal to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-coal to-transparent" />
    </section>
  );
}