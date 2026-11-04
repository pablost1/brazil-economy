import { ipeaSeries } from "@/lib/data/ipeadata";
import { safe } from "@/lib/util";
import { last } from "@/lib/stats";
import Chart from "@/components/Chart";
import Num, { DateLabel } from "@/components/Num";
import { Card, ErrorNote, Explainer, Kpi, KpiGrid, P, PageShell, SourcesBox } from "@/components/ui";

const COLOR = "#84cc16";

export default async function FiscalPage() {
  const [nom, prim, int] = await Promise.all([safe(() => ipeaSeries("BM12_NFSPNYS12")), safe(() => ipeaSeries("BM12_NFSPPYS12")), safe(() => ipeaSeries("BM12_NFSPJNYS12"))]);
  const nominal = nom.ok ? nom.data : [];
  const primary = prim.ok ? prim.data : [];
  const interest = int.ok ? int.data : [];
  const ln = last(nominal);
  const lp = last(primary);
  const li = last(interest);

  return (
    <PageShell
      color={COLOR}
      icon="🏛️"
      title={{ en: "Public Accounts", pt: "Contas Públicas" }}
      subtitle={{ en: "Does the government spend more than it collects, and how much goes to interest?", pt: "O governo gasta mais do que arrecada, e quanto vai para juros?" }}
    >
      {(!nom.ok || !prim.ok || !int.ok) && <ErrorNote what={{ en: "Some fiscal series could not be loaded.", pt: "Algumas séries fiscais não puderam ser carregadas." }} detail={[nom, prim, int].map((r) => (r.ok ? "" : r.error)).join(" ")} />}
      <KpiGrid>
        {ln && <Kpi label={{ en: "Nominal deficit, 12 months (% GDP)", pt: "Déficit nominal, 12 meses (% do PIB)" }} value={<Num v={ln.value} d={2} suffix="%" />} sub={<DateLabel iso={ln.date} />} color={COLOR} />}
        {lp && <Kpi label={{ en: "Primary result, 12 months (% GDP)", pt: "Resultado primário, 12 meses (% do PIB)" }} value={<Num v={lp.value} d={2} suffix="%" />} sub={<><DateLabel iso={lp.date} /> · {lp.value > 0 ? "deficit / déficit" : "surplus / superávit"}</>} color="#a3e635" />}
        {li && <Kpi label={{ en: "Interest paid, 12 months (% GDP)", pt: "Juros pagos, 12 meses (% do PIB)" }} value={<Num v={li.value} d={2} suffix="%" />} sub={<DateLabel iso={li.date} />} color="#facc15" />}
      </KpiGrid>
      <Card title={{ en: "Primary result, interest and nominal deficit (12 months, % of GDP; positive = deficit)", pt: "Resultado primário, juros e déficit nominal (12 meses, % do PIB; positivo = déficit)" }}>
        <Chart
          kind="line"
          suffix="%"
          decimals={1}
          zeroLine
          series={[
            { name: { en: "Nominal result", pt: "Resultado nominal" }, color: COLOR, points: nominal },
            { name: { en: "Primary result", pt: "Resultado primário" }, color: "#38bdf8", points: primary },
            { name: { en: "Interest", pt: "Juros" }, color: "#f97316", points: interest },
          ]}
        />
      </Card>
      <Card title={{ en: "Interest on the public debt (12 months, % of GDP)", pt: "Juros da dívida pública (12 meses, % do PIB)" }}>
        <Chart kind="area" suffix="%" decimals={1} series={[{ name: { en: "Interest", pt: "Juros" }, color: "#f97316", points: interest }]} />
      </Card>
      <Explainer>
        <P en="The public sector's financing need (NFSP) measures how much the government had to borrow in a period. Here a positive number is a deficit and a negative number is a surplus. The nominal result is the whole picture; the primary result leaves out interest, showing whether revenue covers the government's spending on services, salaries and investment." pt="A necessidade de financiamento do setor público (NFSP) mede quanto o governo precisou tomar emprestado em um período. Aqui, número positivo é déficit e negativo é superávit. O resultado nominal é o quadro completo; o primário exclui os juros e mostra se a arrecadação cobre os gastos com serviços, salários e investimentos." />
        <P en="Nominal result = primary result + interest. When interest is high, as with a high Selic rate and a big debt, the nominal deficit stays large even if the primary result is near zero. This is the link between fiscal accounts and the public debt: every year the nominal deficit adds to the debt." pt="Resultado nominal = resultado primário + juros. Quando os juros são altos, com Selic elevada e dívida grande, o déficit nominal continua grande mesmo com o primário perto de zero. É a ligação entre as contas públicas e a dívida: todo ano o déficit nominal soma-se à dívida." />
        <P en="The figures cover the federal, state and municipal governments and state companies (excluding Petrobras and Eletrobras), for the 12 months ending in each month, as a share of GDP." pt="Os números abrangem governo federal, estados, municípios e empresas estatais (exceto Petrobras e Eletrobras), nos 12 meses encerrados em cada mês, como proporção do PIB." />
      </Explainer>
      <SourcesBox ids={["ipeaFiscal"]} />
    </PageShell>
  );
}
