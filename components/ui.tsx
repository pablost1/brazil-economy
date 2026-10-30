import type { CSSProperties, ReactNode } from "react";
import type { T } from "@/lib/types";
import { SOURCES } from "@/lib/sources";
import { L } from "./Lang";

export function PageShell({ title, subtitle, color, icon, children }: { title: T; subtitle: T; color: string; icon: string; children: ReactNode }) {
  return (
    <main style={{ "--accent": color } as CSSProperties} className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16">
      <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 p-8" style={{ background: `linear-gradient(135deg, ${color}33, transparent 60%), #0d1526` }}>
        <div className="absolute -right-6 -top-6 select-none text-[9rem] opacity-15">{icon}</div>
        <h1 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span style={{ color }}>
            <L t={title} />
          </span>
        </h1>
        <p className="relative mt-2 max-w-2xl text-slate-300">
          <L t={subtitle} />
        </p>
      </section>
      <div className="mt-6 space-y-6">{children}</div>
    </main>
  );
}

export function Card({ title, children, className = "" }: { title?: T; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-[#0d1526] p-5 sm:p-6 ${className}`}>
      {title && (
        <h2 className="mb-4 text-lg font-bold text-white">
          <span className="mr-2 inline-block h-4 w-1.5 rounded-full align-middle" style={{ background: "var(--accent)" }} />
          <L t={title} />
        </h2>
      )}
      {children}
    </section>
  );
}

export function Kpi({ label, value, sub, color }: { label: T; value: ReactNode; sub?: ReactNode; color?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 p-5" style={{ background: `linear-gradient(160deg, ${color ?? "var(--accent)"}22, #0d1526 70%)` }}>
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        <L t={label} />
      </div>
      <div className="mt-1 text-3xl font-extrabold tabular-nums" style={{ color: color ?? "var(--accent)" }}>
        {value}
      </div>
      {sub && <div className="mt-1 text-sm text-slate-400">{sub}</div>}
    </div>
  );
}

export function KpiGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function Explainer({ title = { en: "What is this?", pt: "O que é isso?" }, children }: { title?: T; children: ReactNode }) {
  return (
    <Card title={title}>
      <div className="space-y-3 leading-relaxed text-slate-300">{children}</div>
    </Card>
  );
}

export function SourcesBox({ ids }: { ids: (keyof typeof SOURCES)[] }) {
  return (
    <Card title={{ en: "Sources", pt: "Fontes" }}>
      <ul className="space-y-3 text-sm">
        {ids.map((id) => {
          const s = SOURCES[id];
          return (
            <li key={id} className="rounded-xl bg-white/5 p-3">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-dotted underline-offset-4" style={{ color: "var(--accent)" }}>
                {s.name}
              </a>
              <div className="text-slate-400">{s.org}</div>
              <div className="mt-1 text-slate-300">
                <L t={s.note} />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export function ErrorNote({ what, detail }: { what: T; detail?: string }) {
  return (
    <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
      ⚠️ <L t={what} />
      {detail && <span className="block text-xs opacity-70">{detail}</span>}
    </div>
  );
}

export const P = ({ en, pt }: { en: string; pt: string }) => (
  <p>
    <L t={{ en, pt }} />
  </p>
);

export function fmtNum(v: number, lang: "en" | "pt" = "en", d = 2, opts: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat(lang === "pt" ? "pt-BR" : "en-US", { minimumFractionDigits: d, maximumFractionDigits: d, ...opts }).format(v);
}
