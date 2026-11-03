import { gdpAccum4q, gdpQuarterly } from "@/lib/data/ibge";
import { safe } from "@/lib/util";
import { last } from "@/lib/stats";
import Chart from "@/components/Chart";
import Num from "@/components/Num";
import { Card, ErrorNote, Explainer, Kpi, KpiGrid, P, PageShell, SourcesBox } from "@/components/ui";


function quarterLabel(iso: string) {
  const q = Math.floor((Number(iso.slice(5, 7)) - 1) / 3) + 1;
  return `Q${q} ${iso.slice(0, 4)}`;
}

export default async function GdpPage() {
  const [q, a] = await Promise.all([safe(() => gdpQuarterly()), safe(() => gdpAccum4q())]);
  const quarterly = q.ok ? q.data : [];
  const accum = a.ok ? a.data : [];
  const lq = last(quarterly);
  const la = last(accum);
  const worst = quarterly.reduce((m, p) => (p.value < m.value ? p : m), quarterly[0]);
  const best = quarterly.reduce((m, p) => (p.value > m.value ? p : m), quarterly[0]);

  return (
    <PageShell
      color="#3b82f6"
      icon="📈"
      title={{ en: "GDP — Economic Growth", pt: "PIB — Crescimento Econômico" }}
      subtitle={{ en: "How much the Brazilian economy grew, quarter by quarter, since 2006.", pt: "Quanto a economia brasileira cresceu, trimestre a trimestre, desde 2006." }}
    >
      {(!q.ok || !a.ok) && <ErrorNote what={{ en: "Could not load GDP data right now.", pt: "Não foi possível carregar os dados do PIB agora." }} detail={[q, a].map((r) => (r.ok ? "" : r.error)).join(" ")} />}
      <KpiGrid>
        {lq && <Kpi label={{ en: "Latest quarter vs previous", pt: "Último trimestre vs anterior" }} value={<Num v={lq.value} d={1} suffix="%" sign />} sub={quarterLabel(lq.date)} color={lq.value >= 0 ? "#60a5fa" : "#f87171"} />}
        {la && <Kpi label={{ en: "Growth, last 4 quarters", pt: "Crescimento, últimos 4 trimestres" }} value={<Num v={la.value} d={1} suffix="%" sign />} sub={quarterLabel(la.date)} color="#818cf8" />}
        {worst && best && <Kpi label={{ en: "Worst / best quarter", pt: "Pior / melhor trimestre" }} value={<><Num v={worst.value} d={1} suffix="%" /> / <Num v={best.value} d={1} suffix="%" sign /></>} sub={`${quarterLabel(worst.date)} / ${quarterLabel(best.date)}`} color="#22d3ee" />}
      </KpiGrid>
      <Card title={{ en: "Growth vs previous quarter (seasonally adjusted)", pt: "Crescimento vs trimestre anterior (com ajuste sazonal)" }}>
        <Chart kind="bar" suffix="%" decimals={1} zeroLine series={[{ name: { en: "GDP, quarterly change", pt: "PIB, variação trimestral" }, color: "#3b82f6", points: quarterly }]} />
      </Card>
      <Card title={{ en: "Growth over the last 4 quarters", pt: "Crescimento acumulado em 4 trimestres" }}>
        <Chart kind="area" suffix="%" decimals={1} zeroLine series={[{ name: { en: "GDP, 4 quarters", pt: "PIB, 4 trimestres" }, color: "#818cf8", points: accum }]} />
      </Card>
      <Explainer>
        <P en="GDP (Produto Interno Bruto) is the total value of all goods and services produced in Brazil in a period. It is the main scorecard of how big the economy is and how fast it is growing." pt="O PIB (Produto Interno Bruto) é o valor total de todos os bens e serviços produzidos no Brasil em um período. É o principal indicador do tamanho da economia e de quão rápido ela cresce." />
        <P en="IBGE publishes it every quarter. The top chart compares each quarter with the one before (seasonally adjusted, so Christmas or harvest effects are removed); the second chart sums up growth over the latest four quarters, which smooths out noise. The deep drop in 2020 is the COVID-19 shock; the big dip around 2015–2016 is the severe recession." pt="O IBGE divulga o PIB a cada trimestre. O primeiro gráfico compara cada trimestre com o anterior (com ajuste sazonal, que remove efeitos como Natal ou safra); o segundo soma o crescimento dos últimos quatro trimestres, o que suaviza oscilações. A queda forte em 2020 é o choque da COVID-19; a queda em 2015–2016 é a recessão severa." />
      </Explainer>
      <SourcesBox ids={["ibgeGdp"]} />
    </PageShell>
  );
}
