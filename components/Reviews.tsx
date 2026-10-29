"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, MessageCircle, PenLine } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { Button } from "./ui/Button";
import { Lightbox } from "./ui/Lightbox";
import { photoUrl, type Review, type YandexData } from "@/lib/reviews";
import { cn } from "@/lib/utils";

/** Показываем отзывы с этой оценкой и выше. */
const MIN_RATING = 4;
const MAX_REVIEWS = 20;

const plural = (n: number, [one, few, many]: [string, string, string]) => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
};

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Оценка ${value} из 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(value) ? "fill-accent text-accent" : "text-white/20"}
        />
      ))}
    </div>
  );
}

function ReviewCard({
  r,
  index,
  onPhoto,
}: {
  r: Review;
  index: number;
  onPhoto: (urls: string[], i: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const long = r.text.length > 260;

  return (
    <motion.article
      data-review-card
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: Math.min(index, 3) * 0.08 }}
      className="group relative flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-[border-color,background-color,transform] duration-500 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.04] sm:w-[380px] md:w-[420px]"
    >
      <Quote
        size={48}
        className="absolute right-5 top-5 text-accent/10 transition-colors group-hover:text-accent/25"
      />

      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.03]">
          {r.avatar ? (
            <Image src={r.avatar} alt="" fill sizes="40px" className="object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-sm font-bold text-accent">
              {r.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{r.name}</div>
          <div className="text-xs text-white/40">{formatDate(r.date)}</div>
        </div>
      </div>

      <div className="mt-5">
        <Stars value={r.rating} />
      </div>

      <motion.div layout className="relative mt-4 flex-1">
        <p
          className={cn(
            "whitespace-pre-line text-sm leading-relaxed text-white/75 md:text-[15px]",
            long && !open && "line-clamp-6",
          )}
        >
          {r.text}
        </p>
        {long && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="mt-2 text-xs font-semibold text-accent transition-opacity hover:opacity-80"
          >
            {open ? "Свернуть" : "Читать полностью"}
          </button>
        )}
      </motion.div>

      {r.photos.length > 0 && (
        <div className="mt-5 flex gap-2">
          {r.photos.slice(0, 4).map((b, i) => (
            <button
              key={b}
              onClick={() => onPhoto(r.photos.map((p) => photoUrl({ base: p }, "XXXL")), i)}
              aria-label="Открыть фото из отзыва"
              className="relative h-14 w-14 overflow-hidden rounded-xl border border-white/10 transition-transform duration-300 hover:scale-105 hover:border-accent/50"
            >
              <Image src={photoUrl({ base: b }, "M")} alt="" fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {r.reply && (
        <div className="mt-5 rounded-2xl border border-accent/20 bg-accent/[0.06] px-4 py-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            <MessageCircle size={12} /> Ответ МОК
          </div>
          <p className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-white/60">{r.reply}</p>
        </div>
      )}
    </motion.article>
  );
}

export function Reviews({ data }: { data: YandexData }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<{ urls: string[]; index: number } | null>(null);

  const reviews = useMemo(
    () =>
      data.reviews
        .filter((r) => r.rating >= MIN_RATING && r.text.length > 20)
        .slice(0, MAX_REVIEWS),
    [data.reviews],
  );

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-review-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="reviews" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
                Отзывы с Яндекс Карт
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-3xl font-black leading-[1.1] tracking-tight text-white md:text-5xl">
                Гости
                <span className="text-accent"> о нас</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="md:col-span-5">
            <a
              href={data.reviewsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur transition-colors duration-300 hover:border-accent/40"
            >
              <div className="font-display text-5xl font-black leading-none text-white">
                {data.rating.toFixed(1).replace(".", ",")}
              </div>
              <div>
                <Stars value={data.rating} size={16} />
                <div className="mt-1.5 text-xs text-white/50">
                  {data.reviewCount} {plural(data.reviewCount, ["отзыв", "отзыва", "отзывов"])} ·{" "}
                  {data.ratingCount} {plural(data.ratingCount, ["оценка", "оценки", "оценок"])}
                </div>
                <div className="mt-0.5 text-xs text-accent underline-offset-4 group-hover:underline">
                  Яндекс Карты
                </div>
              </div>
            </a>
          </Reveal>
        </div>

        <div className="relative mt-12">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((r, i) => (
              <ReviewCard
                key={r.id}
                r={r}
                index={i}
                onPhoto={(urls, index) => setLightbox({ urls, index })}
              />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Предыдущий отзыв"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-all hover:border-accent hover:text-accent active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Следующий отзыв"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-all hover:border-accent hover:text-accent active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={data.addReviewLink}>
              <PenLine size={16} /> Оставить отзыв
            </Button>
            <Button href={data.reviewsLink} variant="outline">
              Все {data.reviewCount} {plural(data.reviewCount, ["отзыв", "отзыва", "отзывов"])} на Яндекс Картах
            </Button>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.urls.map((src) => ({ src, alt: "Фото из отзыва" }))}
            index={lightbox.index}
            onIndex={(index) => setLightbox((l) => (l ? { ...l, index } : l))}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
