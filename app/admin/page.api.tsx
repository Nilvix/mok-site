import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Shell } from "@/components/admin/Shell";
import { requireAdmin } from "@/lib/server/auth";
import { requireDb } from "@/lib/server/db";
import { admins, auditLog } from "@/lib/server/schema";
import { VENUE_LIST } from "@/lib/venues";

const ACTIONS: Record<string, string> = {
  login: "Вход",
  "contacts.update": "Контакты",
  "promo.update": "Акция",
  "services.update": "Карточки услуг",
  "menu.item.update": "Позиция меню",
  "menu.item.create": "Новая позиция меню",
  "menu.item.delete": "Удаление позиции меню",
  "menu.item.move": "Порядок в меню",
  "menu.category.update": "Раздел меню",
  "menu.category.create": "Новый раздел меню",
  "menu.category.delete": "Удаление раздела меню",
};

export default async function AdminHome() {
  const admin = await requireAdmin();
  const log = await requireDb()
    .select({ action: auditLog.action, at: auditLog.createdAt, who: admins.login, details: auditLog.details })
    .from(auditLog)
    .leftJoin(admins, eq(admins.id, auditLog.adminId))
    .orderBy(desc(auditLog.createdAt))
    .limit(15);

  return (
    <Shell login={admin.login}>
      <h1 className="text-3xl font-black">Админ-панель</h1>
      <p className="mt-2 text-white/50">Выберите заведение: акции, контакты, карточки услуг и меню.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {VENUE_LIST.map((v) => (
          <div key={v.id} className={v.theme || undefined}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
              <div className="text-xs uppercase tracking-[0.18em] text-accent">{v.kind}</div>
              <div className="mt-2 text-xl font-bold">МОК · {v.short}</div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href={`/admin/${v.id}`} className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark">
                  Акция и контакты
                </Link>
                <Link href={`/admin/${v.id}/menu`} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-accent hover:text-accent">
                  Меню
                </Link>
                <Link href={v.basePath || "/"} target="_blank" className="rounded-full px-4 py-2 text-sm text-white/50 hover:text-white">
                  Открыть сайт ↗
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-lg font-bold">Последние действия</h2>
      <ul className="mt-4 divide-y divide-white/5 rounded-3xl border border-white/10 bg-white/[0.02] text-sm">
        {log.length === 0 && <li className="p-4 text-white/40">Пока пусто</li>}
        {log.map((l, i) => {
          const venue = (l.details as { venue?: string } | null)?.venue;
          return (
            <li key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
              <span className="w-36 text-white/40">
                {l.at.toLocaleString("ru-RU", { timeZone: "Europe/Moscow", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className="text-white/85">{ACTIONS[l.action] ?? l.action}</span>
              {venue && <span className="text-white/40">· {venue}</span>}
              <span className="ml-auto text-white/40">{l.who ?? "—"}</span>
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}
