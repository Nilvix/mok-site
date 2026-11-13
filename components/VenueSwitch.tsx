"use client";

import Link from "next/link";
import { VENUE_LIST, type Venue } from "@/lib/venues";
import { cn } from "@/lib/utils";

/** Фирменный цвет каждого заведения — точка в переключателе всегда своего цвета. */
const DOT: Record<Venue["id"], string> = { "220": "#F113F1", "322": "#E8141B" };

type Props = { current: Venue; compact?: boolean; className?: string };

/** Капсула-переключатель между заведениями: «● 220 лаунж | ● 322 ресторан». */
export function VenueSwitch({ current, compact, className }: Props) {
  return (
    <nav
      aria-label="Наши заведения"
      className={cn(
        "flex h-11 items-center rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md",
        className,
      )}
    >
      {VENUE_LIST.map((v) => {
        const active = v.id === current.id;
        return (
          <Link
            key={v.id}
            href={v.basePath || "/"}
            aria-current={active ? "page" : undefined}
            title={`МОК · ${v.short} — ${v.kind.toLowerCase()}`}
            className={cn(
              "group relative flex h-full items-center gap-2 rounded-full transition-all duration-300",
              compact ? "px-2.5" : "px-3.5",
              active ? "bg-white/[0.09] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" : "text-white/50 hover:text-white",
            )}
          >
            <span
              className={cn("h-2 w-2 rounded-full transition-all duration-300", !active && "opacity-60 group-hover:opacity-100")}
              style={{ background: DOT[v.id], boxShadow: active ? `0 0 10px ${DOT[v.id]}` : undefined }}
            />
            <span className="text-sm font-semibold tabular-nums">{v.id}</span>
            {!compact && (
              <span className={cn("hidden text-[11px] xl:inline", active ? "text-white/55" : "text-white/35")}>
                {v.kind === "Ресто-лаунж" ? "лаунж" : v.kind.toLowerCase()}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/** Большие карточки заведений — для мобильного меню. */
export function VenueCards({ current, onNavigate }: { current: Venue; onNavigate?: () => void }) {
  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-3">
      {VENUE_LIST.map((v) => {
        const active = v.id === current.id;
        return (
          <Link
            key={v.id}
            href={v.basePath || "/"}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative overflow-hidden rounded-2xl border p-4 text-left transition-all",
              active ? "border-white/20 bg-white/[0.07]" : "border-white/10 bg-white/[0.02] hover:border-white/25",
            )}
          >
            <span
              className="absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-40 blur-2xl"
              style={{ background: DOT[v.id] }}
            />
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: DOT[v.id] }} />
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">{v.kind}</span>
            </span>
            <span className="mt-2 block text-2xl font-black text-white">{v.id}</span>
            <span className="block text-xs text-white/50">{active ? "Вы здесь" : `ул. Октябрьская`}</span>
          </Link>
        );
      })}
    </div>
  );
}
