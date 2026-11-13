import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-accent focus:bg-white/[0.06]";

export function Card({ id, title, hint, children }: { id?: string; title: string; hint?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-3xl border border-white/10 bg-white/[0.02] p-5 md:p-7">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {hint && <p className="mt-1 text-sm text-white/45">{hint}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-white/50">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-white/35">{hint}</span>}
    </label>
  );
}

export function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2.5 text-sm text-white/80">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-[rgb(var(--c-accent))]" />
      {label}
    </label>
  );
}

export function Notice({ saved, error }: { saved?: string; error?: string }) {
  if (error)
    return (
      <div role="alert" className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        {error}
      </div>
    );
  if (saved)
    return (
      <div role="status" className="mb-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
        {saved === "deleted" ? "Удалено." : "Сохранено — изменения уже на сайте."}
      </div>
    );
  return null;
}
