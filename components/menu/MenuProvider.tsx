"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { MenuSection } from "@/lib/menu-220";
import { MenuModal } from "./MenuModal";

type SectionId = MenuSection["id"];

type Ctx = {
  /** Есть ли у заведения хоть один раздел меню */
  available: boolean;
  has: (section: SectionId) => boolean;
  open: (section?: SectionId) => void;
};

const MenuContext = createContext<Ctx | null>(null);

/** null — меню на этой странице нет (например, на страницах документов). */
export const useMenu = () => useContext(MenuContext);

const HASH = "#menu";

/**
 * Хранит состояние всплывающего меню. Открытие добавляет #menu в адрес,
 * поэтому кнопка «Назад» на телефоне закрывает меню, а ссылка …/#menu открывает его сразу.
 */
export function MenuProvider({ sections, children }: { sections: MenuSection[]; children: ReactNode }) {
  const [openSection, setOpenSection] = useState<SectionId | null>(null);
  const pushed = useRef(false);

  const has = useCallback((id: SectionId) => sections.some((s) => s.id === id && s.categories.length), [sections]);
  const first = sections.find((s) => s.categories.length)?.id ?? null;

  const open = useCallback(
    (section?: SectionId) => {
      const target = section && has(section) ? section : first;
      if (!target) return;
      setOpenSection(target);
      if (window.location.hash !== HASH) {
        window.history.pushState({ mokMenu: true }, "", HASH);
        pushed.current = true;
      }
    },
    [has, first],
  );

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back(); // закроется в обработчике popstate
    } else {
      setOpenSection(null);
      if (window.location.hash === HASH) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
  }, []);

  useEffect(() => {
    const onPop = () => {
      pushed.current = false;
      if (window.location.hash !== HASH) setOpenSection(null);
    };
    window.addEventListener("popstate", onPop);
    if (window.location.hash === HASH && first) setOpenSection(first);
    return () => window.removeEventListener("popstate", onPop);
  }, [first]);

  return (
    <MenuContext.Provider value={{ available: !!first, has, open }}>
      {children}
      <MenuModal sections={sections} section={openSection} onSection={setOpenSection} onClose={close} />
    </MenuContext.Provider>
  );
}
