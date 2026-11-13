import { asc, eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Shell } from "@/components/admin/Shell";
import { DeleteButton, SubmitButton } from "@/components/admin/buttons";
import { Card, Checkbox, Field, Notice, inputCls } from "@/components/admin/ui";
import { mediaUrl } from "@/lib/media-url";
import { requireAdmin } from "@/lib/server/auth";
import { requireDb } from "@/lib/server/db";
import { menuCategories, menuItems } from "@/lib/server/schema";
import { VENUES, type VenueId } from "@/lib/venues";
import {
  addCategory,
  addMenuItem,
  deleteCategory,
  deleteMenuItem,
  moveMenuItem,
  saveCategory,
  saveMenuItem,
} from "../../actions";

type Props = { params: { venue: string }; searchParams: { saved?: string; error?: string } };

export default async function MenuAdmin({ params, searchParams }: Props) {
  const admin = await requireAdmin();
  if (!(params.venue in VENUES)) notFound();
  const id = params.venue as VenueId;
  const v = VENUES[id];
  const db = requireDb();
  const cats = await db.select().from(menuCategories).where(eq(menuCategories.venueId, id)).orderBy(asc(menuCategories.position));
  const items = cats.length
    ? await db
        .select()
        .from(menuItems)
        .where(inArray(menuItems.categoryId, cats.map((c) => c.id)))
        .orderBy(asc(menuItems.position), asc(menuItems.id))
    : [];

  return (
    <Shell login={admin.login} theme={v.theme}>
      <div className="text-xs uppercase tracking-[0.18em] text-accent">{v.kind}</div>
      <h1 className="mt-2 text-3xl font-black">Меню · {v.short}</h1>
      <p className="mt-2 mb-8 text-sm text-white/45">
        Цена в рублях. Для разных объёмов — через «/», например 350/620. Снимите «в наличии», чтобы скрыть позицию с сайта.
        Фото: JPG, PNG, WebP или HEIC до 10 МБ — сайт сам уменьшит и сожмёт его.
      </p>

      <Notice saved={searchParams.saved} error={searchParams.error} />

      <div className="space-y-6">
        {cats.map((c) => {
          const list = items.filter((i) => i.categoryId === c.id);
          return (
            <Card key={c.id} id={`cat-${c.id}`} title={`${c.section === "kitchen" ? "Кухня" : "Бар"} · ${c.title}`}>
              <details className="mb-5 rounded-2xl border border-white/5 p-4">
                <summary className="cursor-pointer text-sm text-white/60">Настройки раздела</summary>
                <form action={saveCategory} className="mt-4 grid gap-3 sm:grid-cols-3">
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="venue" value={id} />
                  <Field label="Название">
                    <input name="title" defaultValue={c.title} required maxLength={60} className={inputCls} />
                  </Field>
                  <Field label="Объёмы" hint="0,4 л / 1 л">
                    <input name="volumes" defaultValue={c.volumes?.join(" / ") ?? ""} maxLength={60} className={inputCls} />
                  </Field>
                  <div className="flex items-end pb-2">
                    <Checkbox name="adultsOnly" label="18+" defaultChecked={c.adultsOnly} />
                  </div>
                  <div className="flex flex-wrap gap-3 sm:col-span-3">
                    <SubmitButton variant="ghost">Сохранить раздел</SubmitButton>
                  </div>
                </form>
                <form action={deleteCategory} className="mt-3">
                  <input type="hidden" name="id" value={c.id} />
                  <DeleteButton label="Удалить раздел целиком" confirmText={`Удалить раздел «${c.title}» и все ${list.length} позиций в нём?`} />
                </form>
              </details>

              <ul className="space-y-2">
                {list.map((it) => (
                  <li key={it.id} id={`item-${it.id}`} className={`scroll-mt-24 rounded-2xl border p-3 ${it.available ? "border-white/5" : "border-white/5 opacity-50"}`}>
                    <form action={saveMenuItem} className="grid items-end gap-2 sm:grid-cols-[72px_2fr_1fr_1fr_auto]">
                      <input type="hidden" name="id" value={it.id} />
                      <input type="hidden" name="venue" value={id} />
                      <div className="row-span-2 self-start">
                        {mediaUrl(it.photo) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={mediaUrl(it.photo)} alt="" className="h-[72px] w-[72px] rounded-xl object-cover" />
                        ) : (
                          <div className="grid h-[72px] w-[72px] place-items-center rounded-xl border border-dashed border-white/15 text-[10px] text-white/30">
                            нет фото
                          </div>
                        )}
                      </div>
                      <Field label="Название">
                        <input name="name" defaultValue={it.name} required maxLength={120} className={inputCls} />
                      </Field>
                      <Field label="Цена, ₽">
                        <input name="prices" defaultValue={it.prices.join("/")} required maxLength={30} className={inputCls} />
                      </Field>
                      <Field label="Пометка">
                        <input name="note" defaultValue={it.note ?? ""} maxLength={80} className={inputCls} />
                      </Field>
                      <div className="flex flex-col gap-2 pb-0.5">
                        <Checkbox name="available" label="в наличии" defaultChecked={it.available} />
                        <SubmitButton className="px-4 py-1.5">Сохранить</SubmitButton>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 sm:col-span-4">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-white/70 hover:border-accent hover:text-accent">
                          {mediaUrl(it.photo) ? "Заменить фото" : "Загрузить фото"}
                          <input
                            type="file"
                            name="photoFile"
                            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif"
                            className="max-w-[180px] text-[11px] text-white/50 file:hidden"
                          />
                        </label>
                        {mediaUrl(it.photo) && <Checkbox name="removePhoto" label="убрать фото" />}
                        <span className="text-[11px] text-white/30">выберите файл и нажмите «Сохранить»</span>
                      </div>
                    </form>
                    <div className="mt-2 flex gap-2">
                      <form action={moveMenuItem}>
                        <input type="hidden" name="id" value={it.id} />
                        <input type="hidden" name="dir" value="up" />
                        <button className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 hover:text-white" aria-label="Выше">↑</button>
                      </form>
                      <form action={moveMenuItem}>
                        <input type="hidden" name="id" value={it.id} />
                        <input type="hidden" name="dir" value="down" />
                        <button className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 hover:text-white" aria-label="Ниже">↓</button>
                      </form>
                      <form action={deleteMenuItem} className="ml-auto">
                        <input type="hidden" name="id" value={it.id} />
                        <DeleteButton confirmText={`Удалить «${it.name}» из меню?`} />
                      </form>
                    </div>
                  </li>
                ))}
              </ul>

              <form action={addMenuItem} className="mt-4 grid items-end gap-2 rounded-2xl border border-dashed border-white/10 p-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
                <input type="hidden" name="categoryId" value={c.id} />
                <input type="hidden" name="venue" value={id} />
                <Field label="Новая позиция">
                  <input name="name" required maxLength={120} placeholder="Название" className={inputCls} />
                </Field>
                <Field label="Цена, ₽">
                  <input name="prices" required maxLength={30} placeholder="450" className={inputCls} />
                </Field>
                <Field label="Пометка">
                  <input name="note" maxLength={80} placeholder="необязательно" className={inputCls} />
                </Field>
                <SubmitButton variant="ghost">Добавить</SubmitButton>
              </form>
            </Card>
          );
        })}

        <Card title="Новый раздел меню">
          <form action={addCategory} className="grid items-end gap-3 sm:grid-cols-[2fr_1fr_auto]">
            <input type="hidden" name="venue" value={id} />
            <Field label="Название">
              <input name="title" required maxLength={60} placeholder="Например, Завтраки" className={inputCls} />
            </Field>
            <Field label="Где">
              <select name="section" className={inputCls}>
                <option value="kitchen">Кухня</option>
                <option value="bar">Бар</option>
              </select>
            </Field>
            <SubmitButton>Создать раздел</SubmitButton>
          </form>
        </Card>
      </div>
    </Shell>
  );
}
