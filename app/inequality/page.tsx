import { giniSeries } from "@/lib/data/ibge";
import { ipeaSeries } from "@/lib/data/ipeadata";
import { safe } from "@/lib/util";
import { last, pct, shiftMonths, valueAt } from "@/lib/stats";
import type { Point } from "@/lib/types";
import Chart from "@/components/Chart";
import { EV } from "@/lib/events";
import Num, { DateLabel } from "@/components/Num";
import { Card, ErrorNote, Explainer, Kpi, KpiGrid, P, PageShell, SourcesBox } from "@/components/ui";

const COLOR = "#f59e0b";
const bn = (p: Point[]): Point[] => p.map((x) => ({ date: x.date, value: x.value / 1000 }));

export default async function InequalityPage() {
  const [gi, inc, mass, formal, informal] = await Promise.all([
    safe(() => giniSeries()),
    safe(() => ipeaSeries("PNADC12_RRPH12", 2012)),
    safe(() => ipeaSeries("PNADC12_MRRTH12", 2012)),
    safe(() => ipeaSeries("PNADC12_RRPHESPCC12", 2012)),
    safe(() => ipeaSeries("PNADC12_RRPHESPSC12", 2012)),
  ]);
  const gini = gi.ok ? gi.data : [];
  const income = inc.ok ? inc.data : [];
  const massBn = bn(mass.ok ? mass.data : []);
  const lg = last(gini);
  const prevG = gini.length > 1 ? gini[gini.length - 2] : undefined;
  const li = last(income);
  const iAgo = li ? valueAt(income, shiftMonths(li.date, -12)) : undefined;
  const lm = last(massBn);

  return (
    <PageShell
      color={COLOR}
      icon="⚖️"
      title={{ en: "Inequality & Income", pt: "Desigualdade e Renda" }}
      subtitle={{ en: "How unevenly income is shared, and what the average worker earns.", pt: "Quão desigual é a distribuição da renda, e quanto ganha o trabalhador médio." }}
    >
      {[gi, inc, mass, formal, informal].some((r) => !r.ok) && <ErrorNote what={{ en: "Some income series could not be loaded.", pt: "Algumas séries de renda não puderam ser carregadas." }} detail={[gi, inc, mass, formal, informal].map((r) => (r.ok ? "" : r.error)).join(" ")} />}
      <KpiGrid>
        {lg && <Kpi label={{ en: "Gini index (household income)", pt: "Índice de Gini (renda domiciliar)" }} value={<Num v={lg.value} d={3} />} sub={<>{lg.date.slice(0, 4)}{prevG && <> · {prevG.date.slice(0, 4)}: <Num v={prevG.value} d={3} /></>}</>} color={COLOR} />}
        {li && <Kpi label={{ en: "Average real work income", pt: "Rendimento real médio do trabalho" }} value={<Num v={li.value} d={0} prefix="R$ " />} sub={<><DateLabel iso={li.date} />{iAgo && <> · <Num v={pct(li.value, iAgo.value)} d={1} suffix="%" sign /> vs 12m</>}</>} color="#fbbf24" />}
        {lm && <Kpi label={{ en: "Total real work income (per month)", pt: "Massa de rendimento real (por mês)" }} value={<Num v={lm.value} d={0} prefix="R$ " suffix=" bi" />} sub={<DateLabel iso={lm.date} />} color="#fb923c" />}
      </KpiGrid>
      <Card title={{ en: "Gini index of per-capita household income (0 = equal, 1 = unequal)", pt: "Índice de Gini da renda domiciliar per capita (0 = igual, 1 = desigual)" }}>
        <Chart events={EV.gini} about={{ en: "The Gini index measures income inequality from 0 (everyone earns the same) to 1 (one person earns everything). Here: per-capita household income, annual, from IBGE's PNAD Contínua.", pt: "O índice de Gini mede a desigualdade de renda de 0 (todos ganham igual) a 1 (uma pessoa fica com tudo). Aqui: renda domiciliar per capita, anual, da PNAD Contínua do IBGE." }} kind="line" decimals={3} yearlyLabels noRange series={[{ name: { en: "Gini", pt: "Gini" }, color: COLOR, points: gini }]} />
      </Card>
      <Card title={{ en: "Average real income of the main job (R$ per month, latest prices)", pt: "Rendimento real médio do trabalho principal (R$ por mês, preços recentes)" }}>
        <Chart events={EV.income} about={{ en: "Average monthly income of the main job, adjusted for inflation to recent prices (PNAD Contínua). It shows changes in the purchasing power of the average worker.", pt: "Rendimento médio mensal do trabalho principal, corrigido pela inflação para preços recentes (PNAD Contínua). Mostra a variação do poder de compra do trabalhador médio." }} kind="area" prefix="R$ " decimals={0} noRange series={[{ name: { en: "Average income", pt: "Rendimento médio" }, color: "#fbbf24", points: income }]} />
      </Card>
      <Card title={{ en: "Formal vs informal private employees (R$ per month)", pt: "Empregados do setor privado, com e sem carteira (R$ por mês)" }}>
        <Chart events={EV.formal} about={{ en: "Average monthly income of private-sector employees with and without a formal contract (carteira assinada), in real terms. The gap between lines measures informality's cost to workers.", pt: "Rendimento médio mensal de empregados do setor privado com e sem carteira assinada, em termos reais. A distância entre as linhas mede o custo da informalidade para o trabalhador." }}
          kind="line"
          prefix="R$ "
          decimals={0}
          noRange
          series={[
            { name: { en: "With formal contract", pt: "Com carteira assinada" }, color: "#34d399", points: formal.ok ? formal.data : [] },
            { name: { en: "Without formal contract", pt: "Sem carteira assinada" }, color: "#f87171", points: informal.ok ? informal.data : [] },
          ]}
        />
      </Card>
      <Card title={{ en: "Total real income from work (R$ billion per month)", pt: "Massa de rendimento real do trabalho (R$ bilhões por mês)" }}>
        <Chart events={EV.incomeMass} about={{ en: "Total real income from work in the economy per month (average income times number of workers), in R$ billion. It shows whether workers as a whole are being paid more.", pt: "Massa de rendimento real do trabalho na economia por mês (renda média vezes número de trabalhadores), em R$ bilhões. Mostra se os trabalhadores como um todo estão recebendo mais." }} kind="area" prefix="R$ " suffix=" bi" decimals={0} noRange series={[{ name: { en: "Total income", pt: "Massa de rendimento" }, color: "#fb923c", points: massBn }]} />
      </Card>
      <Explainer>
        <P en="The Gini index summarizes inequality in one number between 0 and 1. At 0 everyone has the same income; at 1 one person has everything. Brazil is among the more unequal large economies, but the index has been falling in recent years, helped by income-transfer programs, minimum-wage gains and a strong job market." pt="O índice de Gini resume a desigualdade em um número entre 0 e 1. Em 0, todos têm a mesma renda; em 1, uma pessoa fica com tudo. O Brasil está entre as grandes economias mais desiguais, mas o índice vem caindo nos últimos anos, com ajuda de programas de transferência de renda, ganhos do salário mínimo e um mercado de trabalho aquecido." />
        <P en="The Gini here is for per-capita household income from the continuous household survey (PNAD Contínua), which includes wages, benefits and transfers. It does not capture wealth or the very top incomes well, where surveys tend to under-report. Real income is adjusted for inflation, so changes are gains in purchasing power." pt="O Gini aqui é da renda domiciliar per capita da PNAD Contínua, que inclui salários, benefícios e transferências. Ele não capta bem a riqueza nem as rendas mais altas, que as pesquisas tendem a subdeclarar. A renda real é corrigida pela inflação, então as variações são ganhos de poder de compra." />
        <P en="The gap between workers with and without a formal contract is a window into inequality at work: informal jobs pay less and offer no social protection. Total income (average times number of workers) shows whether the economy as a whole is paying more to workers. Poverty rates are not shown because there is no continuous official series with a single definition." pt="A diferença entre trabalhadores com e sem carteira mostra a desigualdade no trabalho: empregos informais pagam menos e não dão proteção social. A massa de rendimento (renda média vezes número de trabalhadores) mostra se a economia como um todo paga mais aos trabalhadores. As taxas de pobreza não aparecem porque não há série oficial contínua com uma definição única." />
      </Explainer>
      <SourcesBox ids={["ibgeGini", "ipeaPnad"]} />
    </PageShell>
  );
}
