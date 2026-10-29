import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "../ui/LogoMark";
import { Footer } from "../Footer";
import { SITE } from "@/lib/site-config";

type Props = {
  title: string;
  children: ReactNode;
};

/** Каркас страницы юридического документа: шапка, оглавление по h2, текст, футер. */
export function LegalPage({ title, children }: Props) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" aria-label={`${SITE.name} — на главную`}>
            <LogoMark className="w-[88px] md:w-[104px]" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm text-white/80 transition-all hover:border-accent hover:text-accent active:scale-95"
          >
            <ArrowLeft size={16} /> На главную
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 pb-24 pt-14 md:px-8 md:pt-20">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
          Документы
        </span>
        <h1 className="mt-5 text-3xl font-black leading-[1.1] tracking-tight text-white md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-sm text-white/40">
          Редакция от {SITE.legal.effectiveDate}
        </p>

        <article className="legal mt-12 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-10">
          {children}
        </article>
      </main>

      <Footer />
    </>
  );
}

/** Значение реквизита; пока оно не заполнено — нейтральная формулировка. */
export function Req({ value, fallback }: { value: string; fallback: string }) {
  return <>{value || fallback}</>;
}

/** Блок с наименованием и реквизитами владельца сайта. */
export function OperatorDetails() {
  const { legal } = SITE;
  return (
    <ul>
      {/* Пустые реквизиты не выводятся — заполни их в lib/site-config.ts → legal */}
      {legal.name && <li>Наименование: {legal.name}</li>}
      {legal.inn && <li>ИНН: {legal.inn}</li>}
      {legal.ogrn && <li>ОГРН / ОГРНИП: {legal.ogrn}</li>}
      <li>Юридический адрес: {legal.address || SITE.address}</li>
      <li>Адрес заведения: {SITE.address}</li>
      <li>
        Телефон: <a href={SITE.phoneHref}>{SITE.phone}</a>
      </li>
      {legal.email && (
        <li>
          Электронная почта: <a href={`mailto:${legal.email}`}>{legal.email}</a>
        </li>
      )}
    </ul>
  );
}
