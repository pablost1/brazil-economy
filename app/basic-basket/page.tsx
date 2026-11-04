import { bcbSeries } from "@/lib/data/bcb";
import { ipeaLatestByCity, ipeaSeries } from "@/lib/data/ipeadata";
import { safe } from "@/lib/util";
import { last, pct, shiftMonths, valueAt } from "@/lib/stats";
import Chart from "@/components/Chart";
import { EV } from "@/lib/events";
import { L } from "@/components/Lang";
import RankBars from "@/components/RankBars";
import Num, { DateLabel } from "@/components/Num";
import { Card, ErrorNote, Explainer, Kpi, KpiGrid, P, PageShell, SourcesBox } from "@/components/ui";


// IBGE municipality code -> capital city
const CAPITALS: Record<string, string> = {
  "3550308": "São Paulo", "3304557": "Rio de Janeiro", "5300108": "Brasília", "2927408": "Salvador", "2304400": "Fortaleza",
  "3106200": "Belo Horizonte", "4106902": "Curitiba", "4314902": "Porto Alegre", "2611606": "Recife", "1501402": "Belém",
  "5208707": "Goiânia", "1302603": "Manaus", "2704302": "Maceió", "2800308": "Aracaju", "2507507": "João Pessoa",
  "2408102": "Natal", "2211001": "Teresina", "2111300": "São Luís", "3205309": "Vitória", "4205407": "Florianópolis",
  "5002704": "Campo Grande", "5103403": "Cuiabá", "1100205": "Porto Velho", "1200401": "Rio Branco", "1600303": "Macapá",
  "1400100": "Boa Vista", "1721000": "Palmas",
};
const PALETTE = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#ec4899"];

export default async function BasketPage() {
  const [sp, wage, cities] = await Promise.all([
    safe(() => ipeaSeries("DIEESE12_CBSP12")),
    safe(() => bcbSeries(1619)),
    safe(() => ipeaLatestByCity("CESBTOTAL")),
  ]);
  const cost = sp.ok ? sp.data : [];
  const wages = wage.ok ? wage.data : [];
  const share = cost.flatMap((p) => {
    const w = valueAt(wages, p.date);
    return w ? [{ date: p.date, value: (p.value / w.value) * 100 }] : [];
  });
  const now = last(cost);
  const nowShare = last(share);
  const yearAgo = now ? valueAt(cost, shiftMonths(now.date, -12)) : undefined;
  const ranking = cities.ok
    ? cities.data
        .filter((c) => CAPITALS[c.city])
        .map((c) => ({ name: CAPITALS[c.city], value: c.value }))
        .sort((a, b) => b.value - a.value)
    : [];
  const cityMonth = cities.ok ? cities.data[0]?.date : undefined;

  return (
    <PageShell
      color="#ef4444"
      icon="🛒"
      title={{ en: "Basic Food Basket (Cesta Básica)", pt: "Cesta Básica de Alimentos" }}
      subtitle={{ en: "How much a month of essential groceries for one adult costs, and how much of the minimum wage it eats.", pt: "Quanto custa um mês de alimentos essenciais para um adulto e quanto do salário mínimo isso consome." }}
    >
      {(!sp.ok || !wage.ok) && <ErrorNote what={{ en: "Some basket data could not be loaded.", pt: "Alguns dados da cesta básica não puderam ser carregados." }} detail={[sp, wage].map((r) => (r.ok ? "" : r.error)).join(" ")} />}
      <KpiGrid>
        {now && <Kpi label={{ en: "Basket cost in São Paulo", pt: "Custo da cesta em São Paulo" }} value={<Num v={now.value} d={2} prefix="R$ " />} sub={<DateLabel iso={now.date} />} />}
        {now && yearAgo && <Kpi label={{ en: "Change in 12 months", pt: "Variação em 12 meses" }} value={<Num v={pct(now.value, yearAgo.value)} d={1} suffix="%" sign />} color={now.value >= yearAgo.value ? "#f87171" : "#4ade80"} sub={<Num v={yearAgo.value} d={2} prefix="R$ " />} />}
        {nowShare && <Kpi label={{ en: "Share of minimum wage", pt: "Fatia do salário mínimo" }} value={<Num v={nowShare.value} d={1} suffix="%" />} color="#fb7185" sub={<L t={{ en: "of the monthly minimum wage", pt: "do salário mínimo mensal" }} />} />}
      </KpiGrid>
      <Card title={{ en: "Monthly basket cost, São Paulo (R$)", pt: "Custo mensal da cesta, São Paulo (R$)" }}>
        <Chart events={EV.basketCost} about={{ en: "The monthly cost of the basic food basket in São Paulo, measured by DIEESE: the minimum set of foods an adult needs. It is a direct gauge of how food prices affect the household budget.", pt: "O custo mensal da cesta básica de alimentos em São Paulo, medido pelo DIEESE: o conjunto mínimo de alimentos de que um adulto precisa. Mede diretamente como os preços da comida pesam no orçamento." }} kind="area" prefix="R$ " decimals={0} series={[{ name: { en: "Basket cost", pt: "Custo da cesta" }, color: "#ef4444", points: cost }]} />
      </Card>
      <Card title={{ en: "Basket as a share of the minimum wage", pt: "Cesta como percentual do salário mínimo" }}>
        <Chart events={EV.basketShare} about={{ en: "The basket cost divided by the national minimum wage at the time. A falling line means a minimum-wage worker needs a smaller part of their pay to buy the basket; a rising line means the opposite.", pt: "O custo da cesta dividido pelo salário mínimo vigente. Uma linha em queda significa que quem ganha o mínimo gasta uma parte menor do salário na cesta; em alta, o contrário." }} kind="line" suffix="%" decimals={0} series={[{ name: { en: "% of minimum wage", pt: "% do salário mínimo" }, color: "#fb7185", points: share }]} />
      </Card>
      {ranking.length > 0 && (
        <Card title={{ en: `Cost by capital city${cityMonth ? " (" + cityMonth.slice(0, 7) + ")" : ""}`, pt: `Custo por capital${cityMonth ? " (" + cityMonth.slice(0, 7) + ")" : ""}` }}>
          <RankBars about={{ en: "Cost of the same basic basket in each state capital for the latest month: it compares where food is more expensive or cheaper.", pt: "Custo da mesma cesta básica em cada capital no último mês: compara onde a comida é mais cara ou mais barata." }} items={ranking} palette={PALETTE} prefix="R$ " />
        </Card>
      )}
      <Explainer>
        <P en="The Cesta Básica is a monthly survey by DIEESE (a labor-economics institute) that prices a fixed list of staple foods — rice, beans, flour, meat, milk, coffee, bananas, bread, sugar, oil, butter, tomatoes and potatoes — in 17 capital cities. The quantities are the ones the law (Decree-Law 399/1938) sets for one adult worker's monthly food needs." pt="A Cesta Básica é uma pesquisa mensal do DIEESE que precifica uma lista fixa de alimentos essenciais — arroz, feijão, farinha, carne, leite, café, banana, pão, açúcar, óleo, manteiga, tomate e batata — em 17 capitais. As quantidades são as que a lei (Decreto-Lei 399/1938) define para a alimentação mensal de um trabalhador adulto." />
        <P en="The 'share of minimum wage' chart divides the basket cost by the national minimum wage at the time. A falling line means a worker earning the minimum can buy the basket with a smaller part of their pay." pt="O gráfico de 'fatia do salário mínimo' divide o custo da cesta pelo salário mínimo vigente. Uma linha em queda significa que quem ganha o mínimo compra a cesta com uma parte menor do salário." />
      </Explainer>
      <SourcesBox ids={["dieese", "bcbWage"]} />
    </PageShell>
  );
}
