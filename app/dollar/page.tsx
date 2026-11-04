import { bcbSeries } from "@/lib/data/bcb";
import { safe, toMonthly } from "@/lib/util";
import { last, pct, shiftMonths, valueAt } from "@/lib/stats";
import Chart from "@/components/Chart";
import { L } from "@/components/Lang";
import Num, { DateLabel } from "@/components/Num";
import { Card, ErrorNote, Explainer, Kpi, KpiGrid, P, PageShell, SourcesBox } from "@/components/ui";


export default async function DollarPage() {
  const res = await safe(() => bcbSeries(1));
  const daily = res.ok ? res.data : [];
  const now = last(daily);
  const monthly = toMonthly(daily);
  const peak = daily.reduce((m, p) => (p.value > m.value ? p : m), daily[0]);
  const low = daily.reduce((m, p) => (p.value < m.value ? p : m), daily[0]);
  const yearAgo = now ? valueAt(daily, shiftMonths(now.date, -12)) : undefined;
  const monthAgo = now ? valueAt(daily, shiftMonths(now.date, -1)) : undefined;

  return (
    <PageShell
      color="#22c55e"
      icon="💵"
      title={{ en: "US Dollar (USD/BRL)", pt: "Dólar (USD/BRL)" }}
      subtitle={{ en: "How many Brazilian reais one US dollar buys, every day, for the last 20 years.", pt: "Quantos reais compram um dólar americano, todos os dias, nos últimos 20 anos." }}
    >
      {!res.ok && <ErrorNote what={{ en: "Could not load the dollar series right now.", pt: "Não foi possível carregar a série do dólar agora." }} detail={res.error} />}
      {now && (
        <KpiGrid>
          <Kpi label={{ en: "Latest rate", pt: "Cotação mais recente" }} value={<Num v={now.value} d={4} prefix="R$ " />} sub={<DateLabel iso={now.date} />} />
          {monthAgo && <Kpi label={{ en: "Change in 1 month", pt: "Variação em 1 mês" }} value={<Num v={pct(now.value, monthAgo.value)} d={2} suffix="%" sign />} color={now.value >= monthAgo.value ? "#f87171" : "#4ade80"} sub={<Num v={monthAgo.value} d={4} prefix="R$ " />} />}
          {yearAgo && <Kpi label={{ en: "Change in 12 months", pt: "Variação em 12 meses" }} value={<Num v={pct(now.value, yearAgo.value)} d={2} suffix="%" sign />} color={now.value >= yearAgo.value ? "#f87171" : "#4ade80"} sub={<Num v={yearAgo.value} d={4} prefix="R$ " />} />}
        </KpiGrid>
      )}
      <Card title={{ en: "Dollar price in reais (monthly average)", pt: "Preço do dólar em reais (média mensal)" }}>
        <Chart about={{ en: "The commercial US dollar selling rate (PTAX) published by the Central Bank, shown as a monthly average: how many reais it takes to buy one dollar. A higher number means a weaker real; a lower number, a stronger real.", pt: "Cotação de venda do dólar comercial (PTAX) divulgada pelo Banco Central, em média mensal: quantos reais são necessários para comprar um dólar. Número mais alto significa real mais fraco; mais baixo, real mais forte." }} series={[{ name: { en: "R$ per US$ 1", pt: "R$ por US$ 1" }, color: "#22c55e", points: monthly }]} prefix="R$ " />
        {peak && low && (
          <p className="mt-4 text-sm text-slate-400">
            <L t={{ en: "Highest in the period:", pt: "Máxima no período:" }} /> <Num v={peak.value} d={2} prefix="R$ " /> (<DateLabel iso={peak.date} />).{" "}
            <L t={{ en: "Lowest:", pt: "Mínima:" }} /> <Num v={low.value} d={2} prefix="R$ " /> (<DateLabel iso={low.date} />).
          </p>
        )}
      </Card>
      <Explainer>
        <P en="The dollar rate is the price of one US dollar in Brazilian reais. When the number goes up, the real is weaker: imports, travel abroad and fuel get more expensive, while Brazilian exporters (soy, oil, iron ore) earn more reais for the same dollars." pt="A cotação do dólar é o preço de um dólar americano em reais. Quando o número sobe, o real está mais fraco: importações, viagens ao exterior e combustíveis ficam mais caros, enquanto os exportadores brasileiros (soja, petróleo, minério de ferro) ganham mais reais pelos mesmos dólares." />
        <P en="The figure shown is the PTAX sale rate, the official reference rate calculated by the Central Bank from the day's trades, and widely used in contracts. The chart averages each month to keep it readable; the headline numbers use the latest daily value." pt="O valor exibido é a taxa PTAX de venda, a cotação oficial de referência calculada pelo Banco Central a partir das negociações do dia e muito usada em contratos. O gráfico usa a média de cada mês para ficar legível; os números de destaque usam o último valor diário." />
        <P en="What moves it: Brazil's interest rate vs. the US rate, commodity prices, the government's fiscal outlook, and global risk appetite." pt="O que o move: a taxa de juros do Brasil em relação à dos EUA, preços de commodities, a situação fiscal do governo e o apetite global por risco." />
      </Explainer>
      <SourcesBox ids={["bcbPtax"]} />
    </PageShell>
  );
}
