import { bcbSeries } from "@/lib/data/bcb";
import { ipeaSeries } from "@/lib/data/ipeadata";
import { safe } from "@/lib/util";
import { last, pct, shiftMonths, valueAt } from "@/lib/stats";
import type { Point } from "@/lib/types";
import Chart from "@/components/Chart";
import Num, { DateLabel } from "@/components/Num";
import { Card, ErrorNote, Explainer, Kpi, KpiGrid, P, PageShell, SourcesBox } from "@/components/ui";

const COLOR = "#8b5cf6";
const yoy = (p: Point[]): { last?: Point; change?: number } => {
  const l = p[p.length - 1];
  const a = l ? valueAt(p, shiftMonths(l.date, -12)) : undefined;
  return { last: l, change: l && a ? pct(l.value, a.value) : undefined };
};

export default async function ActivityPage() {
  const [ind, cap, cons, ret, retAmp, ibc] = await Promise.all([
    safe(() => ipeaSeries("PIMPFN12_QIIGNN12")),
    safe(() => ipeaSeries("PIMPFN12_QIBKNN12")),
    safe(() => ipeaSeries("PIMPFN12_QIBCTNN12")),
    safe(() => ipeaSeries("PMC12_IVVRN12")),
    safe(() => ipeaSeries("PMC12_IVVRNAMP12")),
    safe(() => bcbSeries(24364)),
  ]);
  const industry = ind.ok ? ind.data : [];
  const retail = ret.ok ? ret.data : [];
  const ibcData = ibc.ok ? ibc.data : [];
  const i = yoy(industry);
  const r = yoy(retail);
  const b = yoy(ibcData);

  return (
    <PageShell
      color={COLOR}
      icon="🏭"
      title={{ en: "Industry & Consumption", pt: "Indústria e Consumo" }}
      subtitle={{ en: "How much factories produce, how much families buy, and a monthly read on the whole economy.", pt: "Quanto as fábricas produzem, quanto as famílias compram e uma leitura mensal da economia toda." }}
    >
      {[ind, cap, cons, ret, retAmp, ibc].some((x) => !x.ok) && <ErrorNote what={{ en: "Some activity series could not be loaded.", pt: "Algumas séries de atividade não puderam ser carregadas." }} detail={[ind, cap, cons, ret, retAmp, ibc].map((x) => (x.ok ? "" : x.error)).join(" ")} />}
      <KpiGrid>
        {i.last && <Kpi label={{ en: "Industrial output (2022 = 100)", pt: "Produção industrial (2022 = 100)" }} value={<Num v={i.last.value} d={1} />} sub={<><DateLabel iso={i.last.date} />{i.change !== undefined && <> · <Num v={i.change} d={1} suffix="%" sign /> vs 12m</>}</>} color={COLOR} />}
        {r.last && <Kpi label={{ en: "Retail sales, real (2022 = 100)", pt: "Vendas do varejo, reais (2022 = 100)" }} value={<Num v={r.last.value} d={1} />} sub={<><DateLabel iso={r.last.date} />{r.change !== undefined && <> · <Num v={r.change} d={1} suffix="%" sign /> vs 12m</>}</>} color="#a78bfa" />}
        {b.last && <Kpi label={{ en: "IBC-Br activity index (adj.)", pt: "IBC-Br, atividade (ajustado)" }} value={<Num v={b.last.value} d={1} />} sub={<><DateLabel iso={b.last.date} />{b.change !== undefined && <> · <Num v={b.change} d={1} suffix="%" sign /> vs 12m</>}</>} color="#c4b5fd" />}
      </KpiGrid>
      <Card title={{ en: "Industrial production by type of good (index, 2022 = 100)", pt: "Produção industrial por tipo de bem (índice, 2022 = 100)" }}>
        <Chart
          kind="line"
          decimals={0}
          series={[
            { name: { en: "Industry overall", pt: "Indústria geral" }, color: COLOR, points: industry },
            { name: { en: "Capital goods", pt: "Bens de capital" }, color: "#f97316", points: cap.ok ? cap.data : [] },
            { name: { en: "Consumer goods", pt: "Bens de consumo" }, color: "#2dd4bf", points: cons.ok ? cons.data : [] },
          ]}
        />
      </Card>
      <Card title={{ en: "Real retail sales (index, 2022 = 100)", pt: "Vendas reais do varejo (índice, 2022 = 100)" }}>
        <Chart
          kind="line"
          decimals={0}
          series={[
            { name: { en: "Retail", pt: "Varejo" }, color: "#a78bfa", points: retail },
            { name: { en: "Broad retail (incl. cars, building materials)", pt: "Varejo ampliado (inclui veículos e material de construção)" }, color: "#f472b6", points: retAmp.ok ? retAmp.data : [] },
          ]}
        />
      </Card>
      <Card title={{ en: "IBC-Br: monthly economic activity index (seasonally adjusted)", pt: "IBC-Br: índice mensal de atividade econômica (com ajuste sazonal)" }}>
        <Chart kind="area" decimals={0} series={[{ name: { en: "IBC-Br", pt: "IBC-Br" }, color: "#c4b5fd", points: ibcData }]} />
      </Card>
      <Explainer>
        <P en="Industrial production measures the physical volume made by factories, mines and utilities, with prices removed. Capital goods (machines, equipment) show whether companies are investing; consumer goods show how much households are buying. The index is 100 on average in 2022, so 110 means 10% more output than that year." pt="A produção industrial mede o volume físico produzido por fábricas, minas e utilidades, sem o efeito dos preços. Bens de capital (máquinas, equipamentos) mostram se as empresas estão investindo; bens de consumo mostram quanto as famílias estão comprando. O índice vale 100 na média de 2022, então 110 significa 10% mais produção que naquele ano." />
        <P en="Real retail sales (the IBGE's monthly trade survey) track what families actually spend in stores, with inflation removed. The broad measure also counts vehicles and building materials, which depend a lot on credit and interest rates." pt="As vendas reais do varejo (Pesquisa Mensal de Comércio do IBGE) acompanham o que as famílias realmente gastam nas lojas, sem o efeito da inflação. O varejo ampliado inclui também veículos e materiais de construção, que dependem muito do crédito e dos juros." />
        <P en="The IBC-Br is the Central Bank's monthly proxy for GDP. GDP is only published every quarter, so economists use the IBC-Br to see turning points sooner. It is an estimate and gets revised, so use it for direction rather than exact levels." pt="O IBC-Br é o indicador mensal do Banco Central que aproxima o PIB. O PIB só sai a cada trimestre, então economistas usam o IBC-Br para ver mudanças de rumo mais cedo. É uma estimativa e é revisada, então vale para a direção, não para níveis exatos." />
      </Explainer>
      <SourcesBox ids={["ipeaActivity", "bcbIbc"]} />
    </PageShell>
  );
}
