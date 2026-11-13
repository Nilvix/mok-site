import { notFound } from "next/navigation";
import { Shell } from "@/components/admin/Shell";
import { SubmitButton } from "@/components/admin/buttons";
import { Card, Checkbox, Field, Notice, inputCls } from "@/components/admin/ui";
import { getVenueContent } from "@/lib/content";
import { requireAdmin } from "@/lib/server/auth";
import { requireDb } from "@/lib/server/db";
import { services } from "@/lib/server/schema";
import { VENUES, type VenueId } from "@/lib/venues";
import { asc, eq } from "drizzle-orm";
import { savePromo, saveContacts, saveServices } from "../actions";

type Props = { params: { venue: string }; searchParams: { saved?: string; error?: string } };

export default async function VenueAdmin({ params, searchParams }: Props) {
  const admin = await requireAdmin();
  if (!(params.venue in VENUES)) notFound();
  const id = params.venue as VenueId;
  const v = await getVenueContent(id);
  const cards = await requireDb().select().from(services).where(eq(services.venueId, id)).orderBy(asc(services.position));
  const promo = v.promo;

  return (
    <Shell login={admin.login} theme={v.theme}>
      <div className="text-xs uppercase tracking-[0.18em] text-accent">{v.kind}</div>
      <h1 className="mt-2 text-3xl font-black">МОК · {v.short}</h1>
      <p className="mt-2 mb-8 text-sm text-white/45">Изменения появляются на сайте сразу после сохранения.</p>

      <Notice saved={searchParams.saved} error={searchParams.error} />

      <div className="space-y-6">
        <Card id="promo" title="Акция на первом экране" hint="Карточка справа от логотипа. Снимите галочку, чтобы скрыть её.">
          <form action={savePromo} className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="venue" value={id} />
            <div className="sm:col-span-2">
              <Checkbox name="enabled" label="Показывать акцию на сайте" defaultChecked={promo?.enabled ?? true} />
            </div>
            <Field label="Метка" hint="Маленькая надпись сверху">
              <input name="badge" defaultValue={promo?.badge} required maxLength={60} className={inputCls} />
            </Field>
            <Field label="Заголовок">
              <input name="title" defaultValue={promo?.title} required maxLength={120} className={inputCls} />
            </Field>
            <Field label="Текст" className="sm:col-span-2">
              <textarea name="text" defaultValue={promo?.text} required maxLength={600} rows={3} className={inputCls} />
            </Field>
            <Field label="Призы" hint="Каждый с новой строки: «1 место — 30 000 ₽ деньгами». Можно оставить пустым." className="sm:col-span-2">
              <textarea
                name="prizes"
                defaultValue={promo?.prizes.map((p) => `${p.place} — ${p.prize}`).join("\n")}
                rows={4}
                maxLength={1000}
                className={inputCls}
              />
            </Field>
            <Field label="Большая цифра" hint="Например, 300. Можно пусто.">
              <input name="counterValue" defaultValue={promo?.counterValue} maxLength={20} className={inputCls} />
            </Field>
            <Field label="Подпись под цифрой">
              <input name="counterLabel" defaultValue={promo?.counterLabel} maxLength={60} className={inputCls} />
            </Field>
            <div className="sm:col-span-2">
              <SubmitButton>Сохранить акцию</SubmitButton>
            </div>
          </form>
        </Card>

        <Card id="contacts" title="Контакты и бронирование">
          <form action={saveContacts} className="grid gap-4 sm:grid-cols-3">
            <input type="hidden" name="venue" value={id} />
            <Field label="Телефон">
              <input name="phone" defaultValue={v.phone} required maxLength={40} className={inputCls} />
            </Field>
            <Field label="Часы работы" hint="Например, 14:00 — 03:00">
              <input name="hours" defaultValue={v.hours} required maxLength={60} className={inputCls} />
            </Field>
            <Field label="Ссылка на бронь (Axle)">
              <input name="bookingUrl" type="url" defaultValue={v.bookingUrl} required maxLength={500} className={inputCls} />
            </Field>
            <div className="sm:col-span-3">
              <SubmitButton>Сохранить контакты</SubmitButton>
            </div>
          </form>
        </Card>

        <Card id="services" title="Карточки «Всё для идеального вечера»" hint="Ссылка: menu:kitchen — открыть меню кухни, menu:bar — меню бара, #promo — к акции, https://… — внешний сайт. Пусто — карточка не кликабельна.">
          <form action={saveServices} className="space-y-5">
            <input type="hidden" name="venue" value={id} />
            {cards.map((c) => (
              <div key={c.id} className="grid gap-3 rounded-2xl border border-white/5 p-4 sm:grid-cols-2">
                <Field label="Заголовок">
                  <input name={`title_${c.id}`} defaultValue={c.title} required maxLength={80} className={inputCls} />
                </Field>
                <Field label="Ссылка">
                  <input name={`href_${c.id}`} defaultValue={c.href ?? ""} maxLength={300} className={inputCls} />
                </Field>
                <Field label="Текст" className="sm:col-span-2">
                  <textarea name={`text_${c.id}`} defaultValue={c.text} required maxLength={400} rows={2} className={inputCls} />
                </Field>
              </div>
            ))}
            <SubmitButton>Сохранить карточки</SubmitButton>
          </form>
        </Card>
      </div>
    </Shell>
  );
}
