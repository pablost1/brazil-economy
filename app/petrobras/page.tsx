import { petrQuote } from "@/lib/data/brapi";
import { safe } from "@/lib/util";
import { pct, shiftMonths, valueAt } from "@/lib/stats";
import results from "@/data/petrobras-results.json";
import Chart from "@/components/Chart";
import Num from "@/components/Num";
import { Card, ErrorNote, Explainer, Kpi, KpiGrid, P, PageShell, SourcesBox } from "@/components/ui";


export default async function PetrobrasPage() {
  const q = await safe(() => petrQuote());
  const quote = q.ok ? q.data : undefined;
  const hist = quote?.history ?? [];
  const lastPt = hist[hist.length - 1];
  const tenAgo = lastPt ? valueAt(hist, shiftMonths(lastPt.date, -120)) : undefined;
  const yearAgo = lastPt ? valueAt(hist, shiftMonths(lastPt.date, -12)) : undefined;
  const income = results.netIncomeBRLbn.map((r) => ({ date: `${r.year}-01-01`, value: r.value }));
  const lastIncome = results.netIncomeBRLbn[results.netIncomeBRLbn.length - 1];

  return (
    <PageShell
      color="#eab308"
      icon="🛢️"
      title={{ en: "Petrobras (PETR4)", pt: "Petrobras (PETR4)" }}
      subtitle={{ en: "Brazil's state-controlled oil giant: its share price on the B3 and its yearly profit.", pt: "A gigante petrolífera controlada pelo Estado: o preço da ação na B3 e o lucro anual." }}
    >
      {!q.ok && <ErrorNote what={{ en: "Could not load the PETR4 quote right now.", pt: "Não foi possível carregar a cotação de PETR4 agora." }} detail={q.error} />}
      <KpiGrid>
        {quote && <Kpi label={{ en: "PETR4 share price", pt: "Preço da ação PETR4" }} value={<Num v={quote.price} d={2} prefix="R$ " />} sub={<Num v={quote.changePct} d={2} suffix="% today" sign />} color={quote.changePct >= 0 ? "#facc15" : "#f87171"} />}
        {quote?.marketCap && <Kpi label={{ en: "Market value", pt: "Valor de mercado" }} value={<Num v={quote.marketCap / 1e9} d={0} prefix="R$ " suffix=" bi" />} color="#fbbf24" />}
        {lastPt && yearAgo && <Kpi label={{ en: "Share price, 12 months", pt: "Preço da ação, 12 meses" }} value={<Num v={pct(lastPt.value, yearAgo.value)} d={1} suffix="%" sign />} color={lastPt.value >= yearAgo.value ? "#4ade80" : "#f87171"} sub={tenAgo ? <Num v={pct(lastPt.value, tenAgo.value)} d={0} suffix="% in 10 years" sign /> : undefined} />}
      </KpiGrid>
      <Card title={{ en: "PETR4 monthly closing price (R$)", pt: "Preço de fechamento mensal da PETR4 (R$)" }}>
        <Chart kind="area" prefix="R$ " series={[{ name: { en: "PETR4 close", pt: "Fechamento PETR4" }, color: "#eab308", points: hist }]} />
      </Card>
      <Card title={{ en: `Annual net income (R$ billion, through ${results.asOf})`, pt: `Lucro líquido anual (R$ bilhões, até ${results.asOf})` }}>
        <Chart kind="bar" prefix="R$ " suffix=" bi" decimals={1} yearlyLabels zeroLine noRange series={[{ name: { en: "Net income", pt: "Lucro líquido" }, color: "#facc15", points: income }]} />
        <p className="mt-3 text-sm text-slate-400">
          {lastIncome?.year}: <Num v={lastIncome?.value ?? 0} d={1} prefix="R$ " suffix=" bi" />.{" "}
          <span className="opacity-80">{results.note}</span>
        </p>
      </Card>
      <Explainer>
        <P en="Petrobras is Brazil's largest company, a mostly state-controlled oil and gas producer that is also one of the biggest payers of dividends and taxes in the country. Its profit rises and falls mostly with the international oil price (Brent), the dollar, and how much oil it pumps — especially from the offshore pre-salt fields." pt="A Petrobras é a maior empresa do Brasil, produtora de petróleo e gás controlada pelo Estado e uma das maiores pagadoras de dividendos e impostos do país. O lucro varia principalmente com o preço internacional do petróleo (Brent), o dólar e o volume produzido — sobretudo nos campos do pré-sal." />
        <P en="PETR4 is the company's preferred share on the B3 stock exchange. The chart shows month-end closing prices as traded. The profit chart shows the huge losses of the 2015–2016 corruption scandal and oil crash, and the boom of 2021–2022 when oil prices surged." pt="PETR4 é a ação preferencial da empresa na B3. O gráfico mostra os preços de fechamento de fim de mês, como negociados. O gráfico de lucro mostra os prejuízos enormes do escândalo de corrupção e da queda do petróleo em 2015–2016 e o boom de 2021–2022, quando o petróleo disparou." />
        <P en="Heads up: share prices come live from an API, but annual profit is entered by hand from the company's reports (see the note under the chart)." pt="Atenção: os preços da ação vêm de uma API em tempo real, mas o lucro anual é digitado manualmente a partir dos relatórios da empresa (veja a nota sob o gráfico)." />
      </Explainer>
      <SourcesBox ids={["brapi", "petrobrasRi"]} />
    </PageShell>
  );
}
