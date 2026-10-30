import Link from "next/link";
import { bcbSeries } from "@/lib/data/bcb";
import { gdpAccum4q } from "@/lib/data/ibge";
import { ipeaSeries } from "@/lib/data/ipeadata";
import { petrQuote } from "@/lib/data/brapi";
import { safe } from "@/lib/util";
import { last, sum } from "@/lib/stats";
import { PAGES } from "@/lib/pages";
import { L } from "@/components/Lang";
import Num from "@/components/Num";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [usd, ipca12, selic, gdp, unemp, basket, exp, petr] = await Promise.all([
    safe(() => bcbSeries(1)),
    safe(() => bcbSeries(13522)),
    safe(() => bcbSeries(4189)),
    safe(() => gdpAccum4q()),
    safe(() => bcbSeries(24369, 2012)),
    safe(() => ipeaSeries("DIEESE12_CBSP12")),
    safe(() => bcbSeries(22708)),
    safe(() => petrQuote()),
  ]);

  const headline: Record<string, ReactNode> = {};
  const u = usd.ok ? last(usd.data) : undefined;
  if (u) headline["/dollar"] = <Num v={u.value} d={2} prefix="R$ " />;
  const i = ipca12.ok ? last(ipca12.data) : undefined;
  const s = selic.ok ? last(selic.data) : undefined;
  if (i) headline["/inflation"] = <><Num v={i.value} d={1} suffix="%" />{s && <span className="text-base font-semibold opacity-70"> · Selic <Num v={s.value} d={2} suffix="%" /></span>}</>;
  const g = gdp.ok ? last(gdp.data) : undefined;
  if (g) headline["/gdp"] = <Num v={g.value} d={1} suffix="%" sign />;
  const un = unemp.ok ? last(unemp.data) : undefined;
  if (un) headline["/unemployment"] = <Num v={un.value} d={1} suffix="%" />;
  const b = basket.ok ? last(basket.data) : undefined;
  if (b) headline["/basic-basket"] = <Num v={b.value} d={0} prefix="R$ " />;
  if (exp.ok && exp.data.length >= 12) headline["/exports"] = <Num v={sum(exp.data.slice(-12)) / 1000} d={0} prefix="US$ " suffix=" bi" />;
  if (petr.ok) headline["/petrobras"] = <Num v={petr.data.price} d={2} prefix="R$ " />;

  const captions: Record<string, { en: string; pt: string }> = {
    "/dollar": { en: "latest rate", pt: "cotação atual" },
    "/inflation": { en: "12-month inflation", pt: "inflação em 12 meses" },
    "/gdp": { en: "growth, last 4 quarters", pt: "crescimento, 4 trimestres" },
    "/unemployment": { en: "unemployment rate", pt: "taxa de desocupação" },
    "/basic-basket": { en: "basket cost, São Paulo", pt: "custo da cesta, São Paulo" },
    "/exports": { en: "exports, last 12 months", pt: "exportações, 12 meses" },
    "/petrobras": { en: "PETR4 share price", pt: "ação PETR4" },
  };

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16">
      <section className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-sky-500/10 to-yellow-400/20 p-8 sm:p-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          <L t={{ en: "Brazil's economy at a glance", pt: "A economia do Brasil em um relance" }} />
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-300">
          <L t={{ en: "Seven key indicators, each on its own page with a 20-year chart, a plain-language explanation and links to the official sources.", pt: "Sete indicadores-chave, cada um em sua página com gráfico de 20 anos, explicação em linguagem simples e links para as fontes oficiais." }} />
        </p>
      </section>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PAGES.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            style={{ background: `linear-gradient(150deg, ${p.color}30, #0d1526 65%)`, borderColor: `${p.color}55` }}
            className="group relative overflow-hidden rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute -right-3 -top-3 select-none text-7xl opacity-20 transition group-hover:scale-110 group-hover:opacity-30">{p.icon}</div>
            <h2 className="text-lg font-bold text-white">
              {p.icon} <L t={p.title} />
            </h2>
            <div className="mt-3 text-4xl font-extrabold tabular-nums" style={{ color: p.color }}>
              {headline[p.href] ?? <span className="text-2xl opacity-50">—</span>}
            </div>
            <div className="text-sm text-slate-400">
              <L t={captions[p.href]} />
            </div>
            <p className="mt-3 text-sm text-slate-300">
              <L t={p.blurb} />
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
