import Image from "next/image";
import type { MenuCategory, MenuItem, MenuSection } from "@/lib/menu-220";
import { menuPhoto } from "@/lib/menu-photos";

const rub = (n: number) => n.toLocaleString("ru-RU");

function Price({ price }: { price: MenuItem["price"] }) {
  const list = Array.isArray(price) ? price : [price];
  return (
    <span className="shrink-0 whitespace-nowrap font-semibold text-white">
      {list.map(rub).join(" / ")}&nbsp;₽
    </span>
  );
}

function Category({ c }: { c: MenuCategory }) {
  return (
    <article
      id={c.id}
      className="scroll-mt-40 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]"
    >
      {menuPhoto(c.photo) && (
        <div className="relative aspect-[16/7] w-full overflow-hidden bg-coal">
          <Image
            src={menuPhoto(c.photo)!}
            alt={c.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            placeholder="blur"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        </div>
      )}
      <div className="p-6 md:p-7">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-xl font-black text-white md:text-2xl">{c.title}</h3>
          {c.volumes && (
            <span className="text-xs uppercase tracking-[0.14em] text-white/40">
              {c.volumes.join(" / ")}
            </span>
          )}
        </div>
        {c.adultsOnly && (
          <p className="mt-2 text-xs text-white/40">Только для гостей старше 18 лет.</p>
        )}
        <ul className="mt-5 space-y-3.5">
          {c.items.map((it, i) => (
            <li key={`${it.name}-${i}`} className="flex items-center gap-3">
              {menuPhoto(it.photo) && (
                <Image
                  src={menuPhoto(it.photo)!}
                  alt={it.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-xl object-cover"
                />
              )}
              <div className="flex min-w-0 flex-1 items-baseline gap-2">
                <span className="text-[15px] text-white/85">
                  {it.name}
                  {it.note && <span className="ml-1.5 text-xs text-white/40">{it.note}</span>}
                </span>
                <span className="mb-1 min-w-4 flex-1 border-b border-dotted border-white/15" />
                <Price price={it.price} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/** Полное меню заведения: навигация по категориям + карточки с позициями. */
export function MenuView({ sections }: { sections: MenuSection[] }) {
  return (
    <>
      <nav
        aria-label="Разделы меню"
        className="sticky top-[68px] z-30 -mx-5 border-b border-white/5 bg-ink/90 px-5 py-3 backdrop-blur-xl md:top-[76px] md:-mx-8 md:px-8"
      >
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {sections.map((s) => (
            <div key={s.id} className="flex shrink-0 items-center gap-2">
              <a
                href={`#${s.id}`}
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
              >
                {s.title}
              </a>
              {s.categories.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="whitespace-nowrap rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:border-accent hover:text-accent"
                >
                  {c.title}
                </a>
              ))}
            </div>
          ))}
        </div>
      </nav>

      {sections.map((s) => (
        <section key={s.id} id={s.id} className="scroll-mt-32 pt-14">
          <div className="flex items-baseline gap-4">
            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">{s.title}</h2>
            <span className="text-sm text-accent">{s.subtitle}</span>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {s.categories.map((c) => (
              <Category key={c.id} c={c} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
