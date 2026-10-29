"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { EASE } from "@/lib/motion";

type Props = {
  images: { src: string; alt: string }[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
};

/** Полноэкранный просмотр фото: стрелки, клавиатура, свайп. Рендерить внутри AnimatePresence. */
export function Lightbox({ images, index, onIndex, onClose }: Props) {
  const count = images.length;
  const go = useCallback(
    (dir: 1 | -1) => onIndex((index + dir + count) % count),
    [index, count, onIndex],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  const img = images[index];

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр фото"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <div className="absolute left-5 top-5 font-display text-xs tracking-[0.3em] text-white/50 md:left-8 md:top-8">
        {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </div>

      <button
        onClick={onClose}
        aria-label="Закрыть"
        className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:border-accent hover:text-accent active:scale-95 md:right-8 md:top-8"
      >
        <X size={20} />
      </button>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={img.src}
          className="relative h-[70svh] w-[92vw] sm:h-[78svh] md:w-[80vw]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: EASE }}
          drag={count > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80) go(1);
            else if (info.offset.x > 80) go(-1);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-white/10 border-t-accent" />
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="90vw"
            className="pointer-events-none select-none rounded-2xl object-contain"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Предыдущее фото"
            className="absolute bottom-6 left-[calc(50%-3.5rem)] grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-ink/60 text-white transition-all hover:border-accent hover:text-accent active:scale-95 sm:bottom-auto sm:left-4 sm:top-1/2 sm:-translate-y-1/2 md:left-8"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Следующее фото"
            className="absolute bottom-6 right-[calc(50%-3.5rem)] grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-ink/60 text-white transition-all hover:border-accent hover:text-accent active:scale-95 sm:bottom-auto sm:right-4 sm:top-1/2 sm:-translate-y-1/2 md:right-8"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}
    </motion.div>
  );
}
