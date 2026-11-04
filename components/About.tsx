"use client";

import { useId, useState, type ReactNode } from "react";
import { L } from "./Lang";

/** Collapsed-by-default explanation panel with a show/hide button. */
export default function About({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="mt-4 border-t border-white/10 pt-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
      >
        <span aria-hidden>{open ? "▲" : "▼"}</span>
        {open ? <L t={{ en: "Hide explanation", pt: "Ocultar explicação" }} /> : <L t={{ en: "About this chart", pt: "Sobre este gráfico" }} />}
      </button>
      {open && (
        <div id={id} className="mt-3 space-y-3 text-sm leading-relaxed text-slate-300">
          {children}
        </div>
      )}
    </div>
  );
}
