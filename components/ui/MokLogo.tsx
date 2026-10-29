"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Цвета логотипа (сняты с оригинала). */
export const LOGO_PINK = "#E21CDC";
const LOGO_WHITE = "#FFFFFF";

// Геометрия перерисована с оригинального логотипа (координаты в его пикселях).
const M_PATH =
  "M11 18H17L32.5 41.25L48 18H54V56H49V27L32.5 51.75L16 27V56H11Z";
const K_PATH =
  "M104 18H109V34H118.5L134.5 18H141.5L123 36.5L142.5 56H134.5L117.5 39H109V56H104Z";

// «О» — сетка 7×7 точек с пустым центром 3×3; верхний ряд выступает над буквами.
const DOTS: [number, number][] = [];
for (let row = 0; row < 7; row++) {
  for (let col = 0; col < 7; col++) {
    const hole = row >= 2 && row <= 4 && col >= 2 && col <= 4;
    if (!hole) DOTS.push([58 + col * 7, 12 + row * 7]);
  }
}
const DOT_R = 2.25;

type Props = {
  className?: string;
  /** Показать подпись «РЕСТО-ЛАУНЖ» под названием. */
  tagline?: boolean;
  /** Анимация появления точек при загрузке. */
  animated?: boolean;
  title?: string;
};

export function MokLogo({ className, tagline = false, animated = false, title = "МОК" }: Props) {
  const reduce = useReducedMotion();
  const animate = animated && !reduce;

  return (
    <svg
      viewBox={tagline ? "9 8 135.5 66" : "9 8 135.5 50"}
      className={cn("block h-auto overflow-visible", className)}
      role="img"
      aria-label={tagline ? `${title} — ресто-лаунж` : title}
    >
      <motion.path
        d={M_PATH}
        fill={LOGO_WHITE}
        initial={animate ? { opacity: 0, x: -6 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      <g fill={LOGO_PINK}>
        {DOTS.map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={DOT_R}
            initial={animate ? { opacity: 0, scale: 0 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.35,
              // волна от левого верхнего угла
              delay: animate ? 0.25 + ((cx - 58) / 7 + (cy - 12) / 7) * 0.045 : 0,
              ease: "backOut",
            }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}
      </g>
      <motion.path
        d={K_PATH}
        fill={LOGO_WHITE}
        initial={animate ? { opacity: 0, x: 6 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      {tagline && (
        <motion.text
          x={40}
          y={72}
          textLength={84}
          lengthAdjust="spacing"
          fill="#DADADA"
          fontSize={11.2}
          fontWeight={500}
          style={{ fontFamily: "var(--font-jura), system-ui, sans-serif" }}
          initial={animate ? { opacity: 0, y: 4 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: animate ? 0.9 : 0 }}
        >
          РЕСТО-ЛАУНЖ
        </motion.text>
      )}
    </svg>
  );
}
