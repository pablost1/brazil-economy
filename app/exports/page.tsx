import { Suspense } from "react";
import { bcbSeries } from "@/lib/data/bcb";
import { comexBreakdown } from "@/lib/data/comex";
import { safe, toYearly } from "@/lib/util";
import { last, sum } from "@/lib/stats";
import type { Point } from "@/lib/types";
import Chart from "@/components/Chart";
import { EV } from "@/lib/events";
import RankBars from "@/components/RankBars";
import Num, { DateLabel } from "@/components/Num";
import { Card, ErrorNote, Explainer, Kpi, KpiGrid, P, PageShell, SourcesBox } from "@/components/ui";


const PALETTE = ["#14b8a6", "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#f97316", "#eab308", "#84cc16", "#64748b"];
const bn = (p: Point[]): Point[] => p.map((x) => ({ date: x.date, value: x.value / 1000 }));

async function Breakdown({ year }: { year: number }) {
  const r = await safe(() => comexBreakdown(year));
  if (!r.ok)
    return <ErrorNote what={{ en: "The product and destination breakdown is temporarily unavailable (the Comex Stat API limits requests). Try again in a few minutes.", pt: "O detalhamento por produto e destino está temporariamente indisponível (a API do Comex Stat limita requisições). Tente novamente em alguns minutos." }} detail={r.error} />;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title={{ en: `Top product groups, ${r.data.year} (US$)`, pt: `Principais grupos de produtos, ${r.data.year} (US$)` }}>
        <RankBars about={{ en: "The main product groups Brazil exported in the last complete year, ranked by value in US$.", pt: "Os principais grupos de produtos exportados pelo Brasil no último ano completo, por valor em US$." }} items={r.data.products} palette={PALETTE} prefix="US$ " compact decimals={1} />
      </Card>
      <Card title={{ en: `Top destinations, ${r.data.year} (US$)`, pt: `Principais destinos, ${r.data.year} (US$)` }}>
        <RankBars about={{ en: "The main destination countries of Brazilian exports in the last complete year, ranked by value in US$.", pt: "Os principais países de destino das exportações brasileiras no último ano completo, por valor em US$." }} items={r.data.destinations} palette={PALETTE.slice().reverse()} prefix="US$ " compact decimals={1} />
      </Card>
    </div>
  );
}

export default async function ExportsPage() {
  const [ex, im] = await Promise.all([safe(() => bcbSeries(22708)), safe(() => bcbSeries(22709))]);
  const exports = ex.ok ? ex.data : [];
  const imports = im.ok ? im.data : [];
  const exBn = bn(exports);
  const imBn = bn(imports);
  const balance: Point[] = exBn.flatMap((e) => {
    const i = imBn.find((x) => x.date === e.date);
    return i ? [{ date: e.date, value: e.value - i.value }] : [];
  });
  const lastMonth = last(exBn);
  const ltm = exBn.slice(-12);
  const ltmBalance = balance.slice(-12);
  const thisYear = new Date().getFullYear();
  const completeYears = (p: Point[]) => toYearly(p).filter((y) => y.date.slice(0, 4) < String(thisYear) && p.filter((m) => m.date.startsWith(y.date.slice(0, 4))).length === 12);
  const yearlyEx = completeYears(exBn);
  const lastFullYear = Number(yearlyEx[yearlyEx.length - 1]?.date.slice(0, 4)) || thisYear - 1;

  return (
    <PageShell
      color="#14b8a6"
      icon="🚢"
      title={{ en: "Exports & Trade Balance", pt: "Exportações e Balança Comercial" }}
      subtitle={{ en: "What Brazil sells to the world, how much it earns in dollars, and who buys it.", pt: "O que o Brasil vende ao mundo, quanto ganha em dólares e quem compra." }}
    >
      {(!ex.ok || !im.ok) && <ErrorNote what={{ en: "Some trade data could not be loaded.", pt: "Alguns dados de comércio não puderam ser carregados." }} detail={[ex, im].map((r) => (r.ok ? "" : r.error)).join(" ")} />}
      <KpiGrid>
        {ltm.length === 12 && <Kpi label={{ en: "Exports, last 12 months", pt: "Exportações, últimos 12 meses" }} value={<Num v={sum(ltm)} d={1} prefix="US$ " suffix=" bi" />} sub={lastMonth && <DateLabel iso={lastMonth.date} />} />}
        {ltmBalance.length === 12 && <Kpi label={{ en: "Trade surplus, last 12 months", pt: "Superávit comercial, 12 meses" }} value={<Num v={sum(ltmBalance)} d={1} prefix="US$ " suffix=" bi" sign />} color={sum(ltmBalance) >= 0 ? "#2dd4bf" : "#f87171"} />}
        {lastMonth && <Kpi label={{ en: "Exports, latest month", pt: "Exportações, último mês" }} value={<Num v={lastMonth.value} d={1} prefix="US$ " suffix=" bi" />} sub={<DateLabel iso={lastMonth.date} />} color="#22d3ee" />}
      </KpiGrid>
      <Card title={{ en: "Annual exports (US$ billion, complete years)", pt: "Exportações anuais (US$ bilhões, anos completos)" }}>
        <Chart events={EV.exportsAnnual} about={{ en: "Brazil's goods exports are what the country sells abroad, in US$ billion per year (complete years only). It measures how many dollars the foreign sector brings in.", pt: "As exportações de bens são o que o país vende ao exterior, em US$ bilhões por ano (só anos completos). Mede quantos dólares o setor externo traz." }} kind="bar" prefix="US$ " suffix=" bi" decimals={0} yearlyLabels noRange series={[{ name: { en: "Exports", pt: "Exportações" }, color: "#14b8a6", points: yearlyEx }]} />
      </Card>
      <Card title={{ en: "Monthly exports vs imports (US$ billion)", pt: "Exportações vs importações mensais (US$ bilhões)" }}>
        <Chart events={EV.exportsMonthly} about={{ en: "Monthly exports and imports of goods (balance of payments, US$ billion). When the exports line is above imports, the country has a trade surplus.", pt: "Exportações e importações mensais de bens (balanço de pagamentos, US$ bilhões). Quando a linha de exportações está acima da de importações, há superávit comercial." }}
          kind="line"
          prefix="US$ "
          suffix=" bi"
          decimals={0}
          series={[
            { name: { en: "Exports", pt: "Exportações" }, color: "#14b8a6", points: exBn },
            { name: { en: "Imports", pt: "Importações" }, color: "#f97316", points: imBn },
          ]}
        />
      </Card>
      <Card title={{ en: "Monthly trade balance (US$ billion)", pt: "Saldo comercial mensal (US$ bilhões)" }}>
        <Chart events={EV.exportsBalance} about={{ en: "The trade balance is exports minus imports each month. Positive bars are a surplus (more sold than bought); negative bars are a deficit.", pt: "A balança comercial é exportações menos importações em cada mês. Barras positivas são superávit (vendeu mais do que comprou); negativas são déficit." }} kind="bar" prefix="US$ " suffix=" bi" decimals={1} zeroLine series={[{ name: { en: "Exports − imports", pt: "Exportações − importações" }, color: "#06b6d4", points: balance }]} />
      </Card>
      <Suspense fallback={<Card><p className="animate-pulse text-slate-400">Loading products and destinations… / Carregando produtos e destinos…</p></Card>}>
        <Breakdown year={lastFullYear} />
      </Suspense>
      <Explainer>
        <P en="Exports are the goods Brazil sells abroad, paid in foreign currency (mostly dollars). Brazil is a top global supplier of soybeans, iron ore, crude oil, corn, beef, coffee, sugar and pulp. Those dollars matter: they support the exchange rate and the country's ability to pay for imports." pt="Exportações são os bens que o Brasil vende ao exterior, pagos em moeda estrangeira (principalmente dólares). O Brasil é grande fornecedor mundial de soja, minério de ferro, petróleo, milho, carne bovina, café, açúcar e celulose. Esses dólares importam: sustentam o câmbio e a capacidade do país de pagar importações." />
        <P en="The trade balance is exports minus imports. A positive number (surplus) means the country sold more than it bought. Values are 'FOB' (free on board), meaning the price at the port before shipping and insurance costs." pt="A balança comercial é exportações menos importações. Um número positivo (superávit) significa que o país vendeu mais do que comprou. Os valores são 'FOB' (free on board), ou seja, o preço no porto antes de frete e seguro." />
        <P en="The totals come from the Central Bank's balance-of-payments series; the breakdown by product group and destination comes from the Ministry of Trade's Comex Stat database for the last complete year." pt="Os totais vêm da série do balanço de pagamentos do Banco Central; o detalhamento por grupo de produto e destino vem da base Comex Stat do Ministério do Desenvolvimento, Indústria, Comércio e Serviços, para o último ano completo." />
      </Explainer>
      <SourcesBox ids={["bcbExports", "comex"]} />
    </PageShell>
  );
}
