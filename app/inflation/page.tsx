import { bcbSeries } from "@/lib/data/bcb";
import { safe } from "@/lib/util";
import { last } from "@/lib/stats";
import Chart from "@/components/Chart";
import Num, { DateLabel } from "@/components/Num";
import { Card, ErrorNote, Explainer, Kpi, KpiGrid, P, PageShell, SourcesBox } from "@/components/ui";


export default async function InflationPage() {
  const [m, y, s] = await Promise.all([safe(() => bcbSeries(433)), safe(() => bcbSeries(13522)), safe(() => bcbSeries(4189))]);
  const monthly = m.ok ? m.data : [];
  const twelve = y.ok ? y.data : [];
  const selic = s.ok ? s.data : [];
  const lm = last(monthly);
  const ly = last(twelve);
  const ls = last(selic);
  const realRate = ly && ls ? (((1 + ls.value / 100) / (1 + ly.value / 100)) - 1) * 100 : undefined;

  return (
    <PageShell
      color="#f97316"
      icon="🔥"
      title={{ en: "Inflation & Interest Rate", pt: "Inflação e Juros" }}
      subtitle={{ en: "How fast prices rise (IPCA) and the Selic rate the Central Bank uses to fight it.", pt: "O quão rápido os preços sobem (IPCA) e a taxa Selic que o Banco Central usa para combatê-la." }}
    >
      {(!m.ok || !y.ok || !s.ok) && <ErrorNote what={{ en: "Some inflation series could not be loaded.", pt: "Algumas séries de inflação não puderam ser carregadas." }} detail={[m, y, s].map((r) => (r.ok ? "" : r.error)).join(" ")} />}
      <KpiGrid>
        {ly && <Kpi label={{ en: "Inflation, last 12 months", pt: "Inflação em 12 meses" }} value={<Num v={ly.value} d={2} suffix="%" />} sub={<DateLabel iso={ly.date} />} />}
        {lm && <Kpi label={{ en: "Latest monthly IPCA", pt: "Último IPCA mensal" }} value={<Num v={lm.value} d={2} suffix="%" />} sub={<DateLabel iso={lm.date} />} color="#fb923c" />}
        {ls && <Kpi label={{ en: "Selic rate (annualized)", pt: "Taxa Selic (anualizada)" }} value={<Num v={ls.value} d={2} suffix="% a.a." />} sub={realRate !== undefined ? <><Num v={realRate} d={2} suffix="%" /> {" "}<span>real</span></> : undefined} color="#fbbf24" />}
      </KpiGrid>
      <Card title={{ en: "Inflation over 12 months", pt: "Inflação acumulada em 12 meses" }}>
        <Chart about={{ en: "IPCA is Brazil's official inflation index, calculated by IBGE. This line shows how much prices rose over the last 12 months. The official target is 3% a year, with a tolerance of 1.5 percentage points either way.", pt: "O IPCA é o índice oficial de inflação do Brasil, calculado pelo IBGE. Esta linha mostra quanto os preços subiram nos últimos 12 meses. A meta oficial é de 3% ao ano, com tolerância de 1,5 ponto percentual para mais ou para menos." }} kind="area" suffix="%" series={[{ name: { en: "IPCA, 12 months", pt: "IPCA, 12 meses" }, color: "#f97316", points: twelve }]} />
      </Card>
      <Card title={{ en: "Monthly inflation", pt: "Inflação mensal" }}>
        <Chart about={{ en: "The same IPCA index, month by month: how much prices changed compared with the previous month. It is more volatile than the 12-month figure and shows seasonal peaks (for example in food and energy).", pt: "O mesmo IPCA, mês a mês: quanto os preços mudaram em relação ao mês anterior. É mais volátil que o acumulado em 12 meses e mostra picos sazonais (por exemplo em alimentos e energia)." }} kind="bar" suffix="%" zeroLine series={[{ name: { en: "IPCA, month", pt: "IPCA, mês" }, color: "#fb923c", points: monthly }]} />
      </Card>
      <Card title={{ en: "Selic interest rate (annualized, monthly average)", pt: "Taxa Selic (anualizada, média mensal)" }}>
        <Chart about={{ en: "The Selic is the basic interest rate of the economy, set by the Central Bank's Monetary Policy Committee (Copom). It is raised to cool prices and lowered to stimulate activity. Shown as an annualized monthly average.", pt: "A Selic é a taxa básica de juros da economia, definida pelo Comitê de Política Monetária (Copom) do Banco Central. Sobe para esfriar os preços e cai para estimular a atividade. Aparece como média mensal anualizada." }} kind="line" suffix="%" series={[{ name: { en: "Selic, % per year", pt: "Selic, % ao ano" }, color: "#fbbf24", points: selic }]} />
      </Card>
      <Explainer>
        <P en="Inflation is the general rise in prices. In Brazil it is measured by the IPCA (Índice Nacional de Preços ao Consumidor Amplo), calculated by IBGE from the prices of food, housing, transport, health and more for families earning 1 to 40 minimum wages." pt="Inflação é o aumento geral dos preços. No Brasil ela é medida pelo IPCA (Índice Nacional de Preços ao Consumidor Amplo), calculado pelo IBGE com preços de alimentos, moradia, transporte, saúde e mais, para famílias com renda de 1 a 40 salários mínimos." />
        <P en="The Selic is the basic interest rate, set by the Central Bank's Copom committee. When inflation is too high, the Bank raises the Selic to cool spending; when inflation is under control, it cuts it to stimulate growth. The 'real' value shown under the Selic is the rate after subtracting the last 12 months of inflation." pt="A Selic é a taxa básica de juros, definida pelo Copom do Banco Central. Quando a inflação está alta, o Banco sobe a Selic para esfriar o consumo; quando está sob controle, ele reduz para estimular o crescimento. O valor 'real' sob a Selic é a taxa descontada da inflação dos últimos 12 meses." />
        <P en="Brazil uses an inflation-targeting regime: the Central Bank must keep 12-month inflation close to a target set by the National Monetary Council." pt="O Brasil adota o regime de metas de inflação: o Banco Central deve manter a inflação de 12 meses próxima de uma meta definida pelo Conselho Monetário Nacional." />
      </Explainer>
      <SourcesBox ids={["bcbIpca", "bcbSelic"]} />
    </PageShell>
  );
}
