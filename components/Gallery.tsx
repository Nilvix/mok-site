"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Expand, MapPin } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { Button } from "./ui/Button";
import { Lightbox } from "./ui/Lightbox";
import { photoUrl, type Photo } from "@/lib/reviews";
import { EASE } from "@/lib/motion";

const INITIAL = 10;
const STEP = 10;

// Ритм «бенто»-сетки: повторяется каждые 10 фото
const PATTERN = [
  "col-span-2 row-span-2",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
];

export function Gallery({ photos, link }: { photos: Photo[]; link: string }) {
  const [visible, setVisible] = useState(INITIAL);
  const [open, setOpen] = useState<number | null>(null);

  if (!photos.length) return null;
  const shown = photos.slice(0, visible);

  return (
    <section id="gallery" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
                Галерея
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 max-w-2xl text-3xl font-black leading-[1.1] tracking-tight text-white md:text-5xl">
                Атмосфера
                <span className="text-accent"> в деталях</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <a
              href={`${link}gallery/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-accent"
            >
              <MapPin size={14} /> {photos.length} фото с Яндекс Карт
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-flow-dense auto-rows-[150px] grid-cols-2 gap-3 md:auto-rows-[190px] md:grid-cols-4 md:gap-4">
          {shown.map((p, i) => (
            <motion.button
              key={p.id}
              onClick={() => setOpen(i)}
              aria-label={`Открыть фото ${i + 1}`}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: (i % STEP) * 0.04, ease: EASE }}
              className={`${PATTERN[i % PATTERN.length]} group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:rounded-3xl`}
            >
              <Image
                src={photoUrl(p, "XXL")}
                alt={p.alt}
                fill
                sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
                quality={70}
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-30" />
              <span className="absolute bottom-3 right-3 grid h-9 w-9 scale-75 place-items-center rounded-full bg-accent text-white opacity-0 shadow-glow transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <Expand size={15} />
              </span>
            </motion.button>
          ))}
        </div>

        {visible < photos.length && (
          <div className="mt-10 flex justify-center">
            <Button variant="outline" onClick={() => setVisible((v) => v + STEP)}>
              Показать ещё · {photos.length - visible}
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {open !== null && (
          <Lightbox
            images={photos.map((p) => ({ src: photoUrl(p, "XXXL"), alt: p.alt }))}
            index={open}
            onIndex={setOpen}
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
