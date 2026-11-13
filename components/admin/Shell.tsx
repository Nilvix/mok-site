import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";
import { LogoMark } from "@/components/ui/LogoMark";
import { VENUE_LIST } from "@/lib/venues";
import { SubmitButton } from "./buttons";

/** Каркас страниц админки: шапка с заведениями и выходом. */
export function Shell({ login, children, theme }: { login: string; children: ReactNode; theme?: string }) {
  return (
    <div className={theme || undefined}>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-5 py-3">
          <Link href="/admin" className="mr-2">
            <LogoMark className="w-20" />
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm">
            {VENUE_LIST.map((v) => (
              <span key={v.id} className="flex gap-1">
                <Link href={`/admin/${v.id}`} className="rounded-full border border-white/10 px-3 py-1.5 text-white/75 hover:border-accent hover:text-accent">
                  {v.short}
                </Link>
                <Link href={`/admin/${v.id}/menu`} className="rounded-full border border-white/10 px-3 py-1.5 text-white/75 hover:border-accent hover:text-accent">
                  Меню
                </Link>
              </span>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm text-white/45">
            <span className="hidden sm:inline">{login}</span>
            <form action={logoutAction}>
              <SubmitButton variant="ghost" className="px-4 py-1.5">Выйти</SubmitButton>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-8">{children}</main>
    </div>
  );
}
