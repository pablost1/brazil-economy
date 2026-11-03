import { bcbSeries } from "@/lib/data/bcb";
import { safe } from "@/lib/util";
import { last } from "@/lib/stats";
import Chart from "@/components/Chart";
import Num, { DateLabel } from "@/components/Num";
import { Card, ErrorNote, Explainer, Kpi, KpiGrid, P, PageShell, SourcesBox } from "@/components/ui";


export default async function UnemploymentPage() {
  const [pnad, pme] = await Promise.all([safe(() => bcbSeries(24369, 2012)), safe(() => bcbSeries(10777, 2006, 2016))]);
  const pn = pnad.ok ? pnad.data : [];
  const old = pme.ok ? pme.data : [];
  const now = last(pn);
  const peak = pn.reduce((m, p) => (p.value > m.value ? p : m), pn[0]);
  const low = pn.reduce((m, p) => (p.value < m.value ? p : m), pn[0]);

  return (
    <PageShell
      color="#a855f7"
      icon="👷"
      title={{ en: "Unemployment", pt: "Desemprego" }}
      subtitle={{ en: "The share of people looking for work who cannot find it.", pt: "A parcela das pessoas que procuram trabalho e não encontram." }}
    >
      {(!pnad.ok || !pme.ok) && <ErrorNote what={{ en: "Some unemployment data could not be loaded.", pt: "Alguns dados de desemprego não puderam ser carregados." }} detail={[pnad, pme].map((r) => (r.ok ? "" : r.error)).join(" ")} />}
      <KpiGrid>
        {now && <Kpi label={{ en: "Unemployment rate (latest)", pt: "Taxa de desocupação (atual)" }} value={<Num v={now.value} d={1} suffix="%" />} sub={<DateLabel iso={now.date} />} />}
        {peak && <Kpi label={{ en: "Peak since 2012", pt: "Pico desde 2012" }} value={<Num v={peak.value} d={1} suffix="%" />} sub={<DateLabel iso={peak.date} />} color="#f472b6" />}
        {low && <Kpi label={{ en: "Lowest since 2012", pt: "Mínima desde 2012" }} value={<Num v={low.value} d={1} suffix="%" />} sub={<DateLabel iso={low.date} />} color="#c084fc" />}
      </KpiGrid>
      <Card title={{ en: "Unemployment rate, 2006 to today", pt: "Taxa de desocupação, 2006 até hoje" }}>
        <Chart
          kind="line"
          suffix="%"
          decimals={1}
          series={[
            { name: { en: "PME (2006–2016, 6 metro regions)", pt: "PME (2006–2016, 6 regiões metropolitanas)" }, color: "#f472b6", points: old },
            { name: { en: "PNAD Contínua (2012–today, national)", pt: "PNAD Contínua (2012–hoje, nacional)" }, color: "#a855f7", points: pn },
          ]}
        />
      </Card>
      <Explainer>
        <P en="The unemployment rate is the percentage of the labor force (people working or actively looking for work) who do not have a job. People who gave up looking are not counted, which is why economists also watch 'underemployment' and informality." pt="A taxa de desocupação é o percentual da força de trabalho (pessoas que trabalham ou procuram emprego ativamente) que está sem trabalho. Quem desistiu de procurar não entra na conta, por isso economistas também acompanham a subocupação e a informalidade." />
        <P en="Today the official number comes from IBGE's PNAD Contínua, a household survey covering the whole country, published as a rolling three-month average. Before 2012 there was no equivalent national survey; the older PME covered only six metropolitan regions, so the two lines are not exactly comparable, but they overlap from 2012 to 2016 so you can see the gap." pt="Hoje o número oficial vem da PNAD Contínua do IBGE, pesquisa domiciliar que cobre o país todo, divulgada em médias de três meses móveis. Antes de 2012 não havia pesquisa nacional equivalente; a antiga PME cobria apenas seis regiões metropolitanas, então as duas linhas não são exatamente comparáveis, mas se sobrepõem de 2012 a 2016 para mostrar a diferença." />
      </Explainer>
      <SourcesBox ids={["ibgePnad", "bcbPme"]} />
    </PageShell>
  );
}
