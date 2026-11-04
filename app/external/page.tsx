import { bcbSeries } from "@/lib/data/bcb";
import { safe, toMonthly } from "@/lib/util";
import { last, sum } from "@/lib/stats";
import type { Point } from "@/lib/types";
import Chart from "@/components/Chart";
import Num, { DateLabel } from "@/components/Num";
import { Card, ErrorNote, Explainer, Kpi, KpiGrid, P, PageShell, SourcesBox } from "@/components/ui";

const COLOR = "#0ea5e9";
const bn = (p: Point[]): Point[] => p.map((x) => ({ date: x.date, value: x.value / 1000 }));
/** Sum of the trailing 12 months, from a monthly series. */
const rolling12 = (p: Point[]): Point[] => p.slice(11).map((x, i) => ({ date: x.date, value: sum(p.slice(i, i + 12)) }));

export default async function ExternalPage() {
  const [res, cc, fdi] = await Promise.all([safe(() => bcbSeries(13621)), safe(() => bcbSeries(22701)), safe(() => bcbSeries(22885))]);
  const reserves = bn(toMonthly(res.ok ? res.data : [], "last"));
  const ccBn = bn(cc.ok ? cc.data : []);
  const fdiBn = bn(fdi.ok ? fdi.data : []);
  const cc12 = rolling12(ccBn);
  const fdi12 = rolling12(fdiBn);
  const lr = last(reserves);
  const lcc = last(cc12);
  const lfdi = last(fdi12);

  return (
    <PageShell
      color={COLOR}
      icon="🌐"
      title={{ en: "External Accounts", pt: "Contas Externas" }}
      subtitle={{ en: "Dollar reserves, the current-account balance and the foreign investment that comes in.", pt: "Reservas em dólar, o saldo em transações correntes e o investimento estrangeiro que entra." }}
    >
      {(!res.ok || !cc.ok || !fdi.ok) && <ErrorNote what={{ en: "Some external-account series could not be loaded.", pt: "Algumas séries de contas externas não puderam ser carregadas." }} detail={[res, cc, fdi].map((r) => (r.ok ? "" : r.error)).join(" ")} />}
      <KpiGrid>
        {lr && <Kpi label={{ en: "International reserves", pt: "Reservas internacionais" }} value={<Num v={lr.value} d={0} prefix="US$ " suffix=" bi" />} sub={<DateLabel iso={lr.date} />} color={COLOR} />}
        {lcc && <Kpi label={{ en: "Current account, last 12 months", pt: "Transações correntes, 12 meses" }} value={<Num v={lcc.value} d={1} prefix="US$ " suffix=" bi" sign />} sub={<DateLabel iso={lcc.date} />} color={lcc.value >= 0 ? "#2dd4bf" : "#f87171"} />}
        {lfdi && <Kpi label={{ en: "Foreign direct investment, 12 months", pt: "Investimento direto no país, 12 meses" }} value={<Num v={lfdi.value} d={1} prefix="US$ " suffix=" bi" />} sub={<DateLabel iso={lfdi.date} />} color="#38bdf8" />}
      </KpiGrid>
      <Card title={{ en: "International reserves (US$ billion, end of month)", pt: "Reservas internacionais (US$ bilhões, fim do mês)" }}>
        <Chart about={{ en: "International reserves are the dollars and other foreign assets held by the Central Bank (cash concept), shown as end-of-month values in US$ billion. They are the country's cushion against external shocks.", pt: "Reservas internacionais são os dólares e outros ativos externos do Banco Central (conceito caixa), em valores de fim de mês, em US$ bilhões. São o colchão do país contra choques externos." }} kind="area" prefix="US$ " suffix=" bi" decimals={0} series={[{ name: { en: "Reserves", pt: "Reservas" }, color: COLOR, points: reserves }]} />
      </Card>
      <Card title={{ en: "Current-account balance, 12-month total (US$ billion)", pt: "Saldo em transações correntes, acumulado em 12 meses (US$ bilhões)" }}>
        <Chart about={{ en: "The current account sums trade in goods and services and income sent abroad and received. Shown as the total of the last 12 months, in US$ billion; negative means a deficit financed by foreign money.", pt: "As transações correntes somam o comércio de bens e serviços e as rendas enviadas e recebidas do exterior. Aparecem como total dos últimos 12 meses, em US$ bilhões; negativo é déficit, financiado com dinheiro estrangeiro." }} kind="bar" prefix="US$ " suffix=" bi" decimals={0} zeroLine series={[{ name: { en: "Current account (12m)", pt: "Transações correntes (12m)" }, color: "#f97316", points: cc12 }]} />
      </Card>
      <Card title={{ en: "Foreign direct investment in Brazil, 12-month total (US$ billion)", pt: "Investimento direto no país, acumulado em 12 meses (US$ bilhões)" }}>
        <Chart about={{ en: "Foreign direct investment (IDP) is money foreign companies bring to open or buy businesses in Brazil. Shown as the total of the last 12 months, in US$ billion.", pt: "O investimento direto no país (IDP) é o dinheiro que empresas estrangeiras trazem para abrir ou comprar negócios no Brasil. Aparece como total dos últimos 12 meses, em US$ bilhões." }} kind="area" prefix="US$ " suffix=" bi" decimals={0} series={[{ name: { en: "Foreign direct investment (12m)", pt: "Investimento direto (12m)" }, color: "#38bdf8", points: fdi12 }]} />
      </Card>
      <Explainer>
        <P en="International reserves are the dollars and other foreign assets held by the Central Bank. They work as a cushion: they let the country pay its foreign debts and calm the exchange rate in a crisis. That is why Brazil's public-sector net external debt is negative - the reserves are larger than what the state owes abroad." pt="Reservas internacionais são os dólares e outros ativos externos mantidos pelo Banco Central. Funcionam como um colchão: permitem pagar dívidas externas e acalmar o câmbio em uma crise. Por isso a dívida externa líquida do setor público brasileiro é negativa - as reservas são maiores do que o Estado deve lá fora." />
        <P en="The current account adds up trade in goods and services plus income sent abroad (profits, interest) and received. A negative number (deficit) means the country spent more abroad than it earned and needs to be financed with foreign money. A small deficit financed by long-term investment is normal for an emerging economy." pt="As transações correntes somam o comércio de bens e serviços e as rendas enviadas e recebidas do exterior (lucros, juros). Um número negativo (déficit) significa que o país gastou mais lá fora do que ganhou e precisa ser financiado com dinheiro estrangeiro. Um déficit pequeno financiado por investimento de longo prazo é normal em economias emergentes." />
        <P en="Foreign direct investment (IDP) is money that foreign companies bring to build or buy businesses in Brazil. It is the most stable way to finance a current-account deficit, unlike short-term financial flows that can leave quickly. Values are shown as 12-month totals to remove monthly noise." pt="O investimento direto no país (IDP) é o dinheiro que empresas estrangeiras trazem para abrir ou comprar negócios no Brasil. É a forma mais estável de financiar um déficit em transações correntes, ao contrário de fluxos financeiros de curto prazo, que podem sair rápido. Os valores aparecem em totais de 12 meses para tirar o ruído mensal." />
      </Explainer>
      <SourcesBox ids={["bcbExternal"]} />
    </PageShell>
  );
}
