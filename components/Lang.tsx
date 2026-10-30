"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { T } from "@/lib/types";

type Lang = "en" | "pt";
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "en" || saved === "pt") setLangState(saved);
      else if (navigator.language.toLowerCase().startsWith("pt")) setLangState("pt");
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  };
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);

/** Renders the text in the active language. */
export function L({ t }: { t: T }) {
  const { lang } = useLang();
  return <>{t[lang]}</>;
}

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex rounded-full border border-white/15 bg-white/5 p-0.5 text-xs font-semibold">
      {(["en", "pt"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-3 py-1 transition ${lang === l ? "bg-white text-slate-900" : "text-slate-300 hover:text-white"}`}
          aria-pressed={lang === l}
        >
          {l === "en" ? "EN" : "PT"}
        </button>
      ))}
    </div>
  );
}
