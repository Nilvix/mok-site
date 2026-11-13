"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, CupSoda, UtensilsCrossed, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MenuCategory, MenuItem, MenuSection } from "@/lib/menu-220";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useVenue } from "../VenueProvider";

type SectionId = MenuSection["id"];

const ICON = { kitchen: UtensilsCrossed, bar: CupSoda } as const;

const rub = (n: number) => n.toLocaleString("ru-RU");

function Price({ price, volumes }: { price: MenuItem["price"]; volumes?: string[] }) {
  const list = Array.isArray(price) ? price : [price];
  if (list.length > 1 && volumes?.length === list.length) {
    return (
      <span className="flex shrink-0 gap-3 text-right">
        {list.map((p, i) => (
          <span key={i} className="min-w-[3.5rem]">
            <span className="block font-semibold text-white">{rub(p)}&nbsp;₽</span>
            <span className="block text-[10px] uppercase tracking-wider text-white/35">{volumes[i]}</span>
          </span>
        ))}
      </span>
    );
  }
  return (
    <span className="shrink-0 whitespace-nowrap font-semibold text-white">
      {list.map(rub).join(" / ")}&nbsp;₽
    </span>
  );
}

type Zoom = (photo: { src: string; alt: string }) => void;

/** Позиция меню: строка с точечным заполнителем; если есть фото — миниатюра слева. */
function Row({ it, volumes, onZoom }: { it: MenuItem; volumes?: string[]; onZoom: Zoom }) {
  return (
    <li className="flex items-center gap-3.5 px-4 py-3.5 sm:px-5">
      {it.photo && (
        <button
          type="button"
          onClick={() => onZoom({ src: it.photo!, alt: it.name })}
          aria-label={`Фото: ${it.name}`}
          className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 sm:h-[72px] sm:w-[72px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={it.photo}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </button>
      )}
      <div className="flex min-w-0 flex-1 items-end gap-3">
        <div className="min-w-0">
          <div className="text-[15px] leading-snug text-white/90">{it.name}</div>
          {it.note && <div className="mt-0.5 text-xs text-white/40">{it.note}</div>}
        </div>
        <span className="mb-1.5 min-w-6 flex-1 border-b border-dotted border-white/15" />
        <Price price={it.price} volumes={volumes} />
      </div>
    </li>
  );
}

function Category({ c, onZoom }: { c: MenuCategory; onZoom: Zoom }) {
  return (
    <section id={`menu-${c.id}`} data-cat={c.id} className="scroll-mt-4">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h3 className="text-xl font-black tracking-tight text-white sm:text-2xl">{c.title}</h3>
        <span className="text-xs text-white/35">
          {c.volumes && !c.items.some((i) => Array.isArray(i.price)) ? c.volumes.join(" / ") : ""}
        </span>
      </div>
      {c.adultsOnly && <p className="-mt-2 mb-4 text-xs text-white/40">Только для гостей старше 18 лет.</p>}
      <ul className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        {c.items.map((it, i) => (
          <Row key={`${it.name}-${i}`} it={it} volumes={c.volumes} onZoom={onZoom} />
        ))}
      </ul>
    </section>
  );
}

type Props = {
  sections: MenuSection[];
  section: SectionId | null;
  onSection: (s: SectionId) => void;
  onClose: () => void;
};

export function MenuModal({ sections, section, onSection, onClose }: Props) {
  const venue = useVenue();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const scroller = useRef<HTMLDivElement>(null);
  const chips = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const open = section !== null;
  const current = sections.find((s) => s.id === section);
  const available = sections.filter((s) => s.categories.length);

  useEffect(() => setMounted(true), []);

  // Блокируем прокрутку страницы, Esc закрывает, фокус — на кнопку закрытия
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Esc сначала закрывает открытое фото, потом само меню
      if (zoomRef.current) setZoom(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    closeBtn.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // При смене вкладки — наверх и первый раздел активен
  useEffect(() => {
    if (!current) return;
    scroller.current?.scrollTo({ top: 0 });
    setActiveCat(current.categories[0]?.id ?? null);
  }, [current]);

  // Подсветка раздела, который сейчас на экране
  useEffect(() => {
    const root = scroller.current;
    if (!root || !current) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveCat((visible[0].target as HTMLElement).dataset.cat ?? null);
      },
      { root, rootMargin: "0px 0px -65% 0px", threshold: 0 },
    );
    root.querySelectorAll("[data-cat]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [current]);

  // Активная «таблетка» раздела всегда видна в ленте
  useEffect(() => {
    chips.current
      ?.querySelector<HTMLElement>(`[data-chip="${activeCat}"]`)
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }, [activeCat, reduce]);

  const jump = (id: string) => {
    const el = scroller.current?.querySelector<HTMLElement>(`#menu-${id}`);
    if (!el || !scroller.current) return;
    setActiveCat(id);
    scroller.current.scrollTo({ top: el.offsetTop - 8, behavior: reduce ? "auto" : "smooth" });
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && current && (
        <motion.div
          key="mok-menu"
          className={cn("fixed inset-0 z-[70]", venue.theme)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.1 } }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Меню — ${current.title}`}
            className="absolute inset-x-0 bottom-0 top-[4svh] flex flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-[#0f0f10] shadow-2xl md:inset-x-0 md:mx-auto md:top-[5vh] md:bottom-[5vh] md:w-[min(920px,calc(100vw-48px))] md:rounded-[32px]"
            initial={reduce ? { opacity: 0 } : { y: "8%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: "8%", opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* Свечение в цвет заведения */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-72 w-[80%] -translate-x-1/2 rounded-full bg-accent/20 blur-[100px]" />

            {/* Шапка */}
            <div className="relative shrink-0 border-b border-white/[0.06] px-5 pb-3 pt-4 sm:px-8 sm:pt-6">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/15 md:hidden" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
                    Меню · {venue.short}
                  </div>
                  <h2 className="mt-1.5 text-3xl font-black tracking-tight text-white sm:text-4xl">{current.title}</h2>
                  {current.subtitle && <p className="mt-1 text-sm text-white/45">{current.subtitle}</p>}
                </div>
                <button
                  ref={closeBtn}
                  onClick={onClose}
                  aria-label="Закрыть меню"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 text-white/80 transition-all hover:rotate-90 hover:border-accent hover:text-accent"
                >
                  <X size={20} />
                </button>
              </div>

              {available.length > 1 && (
                <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
                  {available.map((s) => {
                    const Icon = ICON[s.id];
                    const active = s.id === current.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => onSection(s.id)}
                        className={cn(
                          "relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                          active ? "text-white" : "text-white/55 hover:text-white",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute inset-0 rounded-full bg-accent transition-all duration-300",
                            active ? "scale-100 opacity-100" : "scale-90 opacity-0",
                          )}
                        />
                        <Icon size={16} className="relative" />
                        <span className="relative">{s.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div ref={chips} className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8">
                {current.categories.map((c) => (
                  <button
                    key={c.id}
                    data-chip={c.id}
                    onClick={() => jump(c.id)}
                    className={cn(
                      "shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-all",
                      activeCat === c.id
                        ? "border-accent bg-accent/15 text-white"
                        : "border-white/10 text-white/60 hover:border-white/25 hover:text-white",
                    )}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Позиции */}
            <div ref={scroller} className="relative flex-1 overflow-y-auto overscroll-contain px-5 pb-32 pt-6 sm:px-8">
              <div className="space-y-10">
                {current.categories.map((c) => (
                  <Category key={c.id} c={c} onZoom={setZoom} />
                ))}
              </div>
              <p className="mt-10 text-center text-xs text-white/30">
                Цены указаны в рублях. Фото — иллюстрации, подача может отличаться.
              </p>
            </div>

            {/* Фото блюда крупно */}
            <AnimatePresence>
              {zoom && (
                <motion.button
                  type="button"
                  aria-label="Закрыть фото"
                  onClick={() => setZoom(null)}
                  className="absolute inset-0 z-20 grid place-items-center bg-black/85 p-5 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.figure
                    initial={{ scale: 0.94 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.94 }}
                    className="max-w-full"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={zoom.src} alt={zoom.alt} className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl" />
                    <figcaption className="mt-3 text-center text-sm text-white/70">{zoom.alt}</figcaption>
                  </motion.figure>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Бронь */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-[#0f0f10] via-[#0f0f10]/90 to-transparent px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-10 sm:px-8">
              <a
                href={venue.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-accent-dark sm:w-auto sm:px-10"
              >
                <CalendarCheck size={17} /> Забронировать стол
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
