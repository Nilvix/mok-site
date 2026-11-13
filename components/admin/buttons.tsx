"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export function SubmitButton({ children, variant = "primary", className }: { children: ReactNode; variant?: "primary" | "ghost" | "danger"; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all active:scale-95 disabled:opacity-50",
        variant === "primary" && "bg-accent text-white hover:bg-accent-dark",
        variant === "ghost" && "border border-white/15 text-white/80 hover:border-accent hover:text-accent",
        variant === "danger" && "border border-red-500/30 text-red-300 hover:bg-red-500/10",
        className,
      )}
    >
      {pending ? "Сохраняю…" : children}
    </button>
  );
}

/** Кнопка удаления с подтверждением. */
export function DeleteButton({ label = "Удалить", confirmText }: { label?: string; confirmText: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
      className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-50"
    >
      {label}
    </button>
  );
}
