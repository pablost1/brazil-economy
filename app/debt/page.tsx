import { bcbSeries } from "@/lib/data/bcb";
import { ipeaSeries } from "@/lib/data/ipeadata";
import { safe } from "@/lib/util";
import { last } from "@/lib/stats";
import type { Point } from "@/lib/types";
import Chart from "@/components/Chart";
import Num, { DateLabel } from "@/components/Num";
import { Card, ErrorNote, Explainer, Kpi, KpiGrid, P, PageShell, SourcesBox } from "@/components/ui";

const COLOR = "#ec4899";
const scale = (p: Point[], f: number): Point[] => p.map((x) => ({ date: x.date, value: x.value * f }));
/** Last value of each calendar year, dated yyyy-01-01 (for annual charts). */
function yearEnd(points: Point[]): Point[] {
  const m = new Map<string, Point>();
  for (const p of points) m.set(p.date.slice(0, 4), p);
  return [...m.entries()].map(([y, p]) => ({ date: `${y}-01-01`, value: p.value }));
}
const ok = <D,>(r: { ok: true; data: D } | { ok: false; error: string }, fallback: D): D => (r.ok ? r.data : fallback);

export default async function DebtPage() {
  const [dbggPct, dbggBrl, dlspPct, extAnnual, extQuarterly, extOld, extReg, dlspIpea, domNet, extNet, gov, subnat, soe, weoGross, weoNet] = await Promise.all([
    safe(() => bcbSeries(13762, 2006)),
    safe(() => bcbSeries(13761, 2006)),
    safe(() => bcbSeries(4513, 2001)),
    safe(() => ipeaSeries("PAN_DEXT", 1900)),
    safe(() => ipeaSeries("BPAG4_DEX4", 2001)),
    safe(() => ipeaSeries("HIST_DEXVELHA", 1800)),
    safe(() => ipeaSeries("HIST_DEXREG", 1800)),
    safe(() => ipeaSeries("PAN12_DTSPY12", 1900)),
    safe(() => ipeaSeries("BM12_DINSPY12", 2001)),
    safe(() => ipeaSeries("BM12_DEXSPY12", 2001)),
    safe(() => ipeaSeries("BM12_DINGFY12", 2001)),
    safe(() => ipeaSeries("BM12_DINEMY12", 2001)),
    safe(() => ipeaSeries("BM12_DINEEY12", 2001)),
    safe(() => ipeaSeries("WEO_DIVBRGGWEOBRA", 1900)),
    safe(() => ipeaSeries("WEO_DIVLIQGGWEOBRA", 1900)),
  ]);
  const all = { dbggPct, dbggBrl, dlspPct, extAnnual, extQuarterly, extOld, extReg, dlspIpea, domNet, extNet, gov, subnat, soe, weoGross, weoNet };
  const failed = Object.entries(all).filter(([, r]) => !r.ok);

  const dbgg = ok(dbggPct, []);
  const dlsp = ok(dlspPct, []);
  const dbggTri = scale(ok(dbggBrl, []), 1 / 1e6);
  const extBn = ok(extAnnual, []);
  const extQBn = scale(ok(extQuarterly, []), 1 / 1000);
  const lastDbgg = last(dbgg);
  const lastDlsp = last(dlsp);
  const lastDbggTri = last(dbggTri);
  const lastExt = last(extQBn);
  // The IMF series may contain projections; keep only years up to the last observed Central Bank year.
  const lastYear = lastDbgg?.date.slice(0, 4) ?? "9999";
  const upTo = (p: Point[]) => p.filter((x) => x.date.slice(0, 4) <= lastYear);

  return (
    <PageShell
      color={COLOR}
      icon="🏦"
      title={{ en: "Public Debt", pt: "Dívida Pública" }}
      subtitle={{ en: "How much the Brazilian state owes, to whom, and how that changed from the 1820s to today.", pt: "Quanto o Estado brasileiro deve, a quem, e como isso mudou desde a década de 1820 até hoje." }}
    >
      {failed.length > 0 && (
        <ErrorNote
          what={{ en: "Some debt series could not be loaded; the related charts may be empty.", pt: "Algumas séries de dívida não puderam ser carregadas; os gráficos relacionados podem estar vazios." }}
          detail={failed.map(([k, r]) => `${k}: ${r.ok ? "" : r.error}`).join(" | ")}
        />
      )}
      <KpiGrid>
        {lastDbgg && <Kpi label={{ en: "Gross debt (DBGG), % of GDP", pt: "Dívida bruta (DBGG), % do PIB" }} value={<Num v={lastDbgg.value} d={1} suffix="%" />} sub={<DateLabel iso={lastDbgg.date} />} color={COLOR} />}
        {lastDlsp && <Kpi label={{ en: "Net debt (DLSP), % of GDP", pt: "Dívida líquida (DLSP), % do PIB" }} value={<Num v={lastDlsp.value} d={1} suffix="%" />} sub={<DateLabel iso={lastDlsp.date} />} color="#f472b6" />}
        {lastDbggTri && <Kpi label={{ en: "Gross debt, R$ trillion", pt: "Dívida bruta, R$ trilhões" }} value={<Num v={lastDbggTri.value} d={2} prefix="R$ " suffix=" tri" />} sub={<DateLabel iso={lastDbggTri.date} />} color="#fb7185" />}
        {lastExt && <Kpi label={{ en: "Gross external debt", pt: "Dívida externa bruta" }} value={<Num v={lastExt.value} d={0} prefix="US$ " suffix=" bi" />} sub={<DateLabel iso={lastExt.date} />} color="#22d3ee" />}
      </KpiGrid>

      <Card title={{ en: "Public debt as % of GDP, since 1991 (several official series)", pt: "Dívida pública em % do PIB, desde 1991 (várias séries oficiais)" }}>
        <Chart about={{ en: "Public debt as a share of GDP, so years can be compared. DLSP is net debt of the public sector (debts minus financial assets); DBGG is gross debt of the general government; the IMF line is an independent estimate of gross debt.", pt: "Dívida pública como proporção do PIB, para poder comparar anos. A DLSP é a dívida líquida do setor público (dívidas menos ativos financeiros); a DBGG é a dívida bruta do governo geral; a linha do FMI é uma estimativa independente da dívida bruta." }}
          kind="line"
          suffix="%"
          decimals={1}
          yearlyLabels
          noRange
          height={380}
          series={[
            { name: { en: "Net public-sector debt, DLSP (1991→)", pt: "Dívida líquida do setor público, DLSP (1991→)" }, color: "#f472b6", points: yearEnd(ok(dlspIpea, [])) },
            { name: { en: "Gross general-government debt, DBGG (2006→)", pt: "Dívida bruta do governo geral, DBGG (2006→)" }, color: "#fb923c", points: yearEnd(dbgg) },
            { name: { en: "IMF: general-government gross debt", pt: "FMI: dívida bruta do governo geral" }, color: "#94a3b8", points: upTo(ok(weoGross, [])) },
          ]}
        />
      </Card>

      <Card title={{ en: "Gross external debt, 1950 to today (US$ billion)", pt: "Dívida externa bruta, de 1950 até hoje (US$ bilhões)" }}>
        <Chart about={{ en: "Gross external debt: what residents of Brazil (government, banks and companies) owe to non-residents, in US$ billion per year since 1950.", pt: "Dívida externa bruta: o que residentes no Brasil (governo, bancos e empresas) devem a não residentes, em US$ bilhões por ano desde 1950." }} kind="area" prefix="US$ " suffix=" bi" decimals={0} yearlyLabels noRange series={[{ name: { en: "Gross external debt", pt: "Dívida externa bruta" }, color: "#22d3ee", points: extBn }]} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title={{ en: "External debt in circulation, 1824-1950 (£ million)", pt: "Dívida externa em circulação, 1824-1950 (£ milhões)" }}>
          <Chart about={{ en: "Brazil's external debt in circulation from 1824 to 1950, in millions of pounds sterling (the currency of the London loans). Historical series from Ministry of Finance records.", pt: "A dívida externa brasileira em circulação de 1824 a 1950, em milhões de libras esterlinas (a moeda dos empréstimos de Londres). Série histórica dos registros do Ministério da Fazenda." }} kind="area" prefix="£ " suffix=" mi" decimals={0} yearlyLabels noRange height={300} series={[{ name: { en: "External debt (pounds sterling)", pt: "Dívida externa (libras esterlinas)" }, color: "#facc15", points: scale(ok(extOld, []), 1 / 1000) }]} />
        </Card>
        <Card title={{ en: "Registered external debt, 1889-1950 (US$ million)", pt: "Dívida externa registrada, 1889-1950 (US$ milhões)" }}>
          <Chart about={{ en: "Registered external debt from 1889 to 1950, in US$ million. It overlaps with the pound series but uses a different record and currency, so compare trends, not levels.", pt: "Dívida externa registrada de 1889 a 1950, em US$ milhões. Sobrepõe-se à série em libras, mas usa outro registro e outra moeda, então compare tendências, não níveis." }} kind="area" prefix="US$ " suffix=" mi" decimals={0} yearlyLabels noRange height={300} series={[{ name: { en: "Registered external debt", pt: "Dívida externa registrada" }, color: "#34d399", points: ok(extReg, []) }]} />
        </Card>
      </div>

      <Card title={{ en: "Gross external debt, quarterly since 2001 (US$ billion)", pt: "Dívida externa bruta, trimestral desde 2001 (US$ bilhões)" }}>
        <Chart about={{ en: "The same gross external debt, now quarterly since 2001 and up to date, in US$ billion.", pt: "A mesma dívida externa bruta, agora trimestral desde 2001 e atualizada, em US$ bilhões." }} kind="line" prefix="US$ " suffix=" bi" decimals={0} noRange series={[{ name: { en: "Gross external debt", pt: "Dívida externa bruta" }, color: "#22d3ee", points: extQBn }]} />
      </Card>

      <Card title={{ en: "Net debt: domestic vs external, since 2001 (% of GDP)", pt: "Dívida líquida: interna vs externa, desde 2001 (% do PIB)" }}>
        <Chart about={{ en: "Net debt of the public sector split between domestic and external, as % of GDP. Net external debt below zero means the reserves are larger than what the public sector owes abroad.", pt: "Dívida líquida do setor público dividida entre interna e externa, em % do PIB. Dívida externa líquida abaixo de zero significa que as reservas superam o que o setor público deve lá fora." }}
          kind="line"
          suffix="%"
          decimals={1}
          noRange
          zeroLine
          series={[
            { name: { en: "Total net debt (DLSP)", pt: "Dívida líquida total (DLSP)" }, color: "#f472b6", points: dlsp },
            { name: { en: "Domestic net debt", pt: "Dívida interna líquida" }, color: "#a78bfa", points: ok(domNet, []) },
            { name: { en: "External net debt", pt: "Dívida externa líquida" }, color: "#22d3ee", points: ok(extNet, []) },
          ]}
        />
      </Card>

      <Card title={{ en: "Who owes it: domestic net debt by level of government (% of GDP)", pt: "Quem deve: dívida interna líquida por esfera (% do PIB)" }}>
        <Chart about={{ en: "Domestic net debt broken down by who owes it: federal government with the Central Bank, states and municipalities, and state-owned companies (% of GDP).", pt: "Dívida interna líquida dividida por quem deve: governo federal com o Banco Central, estados e municípios, e estatais (% do PIB)." }}
          kind="line"
          suffix="%"
          decimals={1}
          noRange
          zeroLine
          series={[
            { name: { en: "Federal government + Central Bank", pt: "Governo federal + Banco Central" }, color: "#f472b6", points: ok(gov, []) },
            { name: { en: "States and municipalities", pt: "Estados e municípios" }, color: "#fb923c", points: ok(subnat, []) },
            { name: { en: "State-owned companies", pt: "Empresas estatais" }, color: "#facc15", points: ok(soe, []) },
          ]}
        />
      </Card>

      <Card title={{ en: "Gross debt in reais (R$ trillion, nominal)", pt: "Dívida bruta em reais (R$ trilhões, nominal)" }}>
        <Chart about={{ en: "Gross general-government debt in nominal reais (trillions). It also grows with inflation, so the % of GDP chart is fairer for comparing years.", pt: "Dívida bruta do governo geral em reais nominais (trilhões). Cresce também com a inflação, por isso o gráfico em % do PIB é mais justo para comparar anos." }} kind="area" prefix="R$ " suffix=" tri" decimals={1} noRange series={[{ name: { en: "DBGG", pt: "DBGG" }, color: "#fb923c", points: dbggTri }]} />
      </Card>

      <Explainer>
        <P
          en="Public debt is what the government has borrowed and not yet repaid. Brazil reports it in several ways. DBGG (gross general-government debt) adds up what the federal, state and municipal governments owe, without subtracting anything. DLSP (net public-sector debt) also includes state companies and the Central Bank, but subtracts the government's financial assets, such as the international reserves. That is why net debt is lower than gross debt."
          pt="Dívida pública é o que o governo pegou emprestado e ainda não pagou. O Brasil a mede de várias formas. A DBGG (dívida bruta do governo geral) soma o que União, estados e municípios devem, sem descontar nada. A DLSP (dívida líquida do setor público) inclui também as estatais e o Banco Central, mas desconta os ativos financeiros do governo, como as reservas internacionais. Por isso a dívida líquida é menor que a bruta."
        />
        <P
          en="Domestic debt is owed in reais, mostly through Treasury bonds bought by banks, funds and pension plans. External debt is owed to non-residents, usually in foreign currency. The gross external debt in the charts covers the whole country (government, banks and companies), not only the state. Today it is much smaller than the domestic debt, and the public sector's net external position is negative: reserves exceed what it owes abroad."
          pt="A dívida interna é devida em reais, principalmente por títulos do Tesouro comprados por bancos, fundos e fundos de pensão. A dívida externa é devida a não residentes, em geral em moeda estrangeira. A dívida externa bruta dos gráficos abrange o país todo (governo, bancos e empresas), não só o Estado. Hoje ela é bem menor que a interna, e a posição externa líquida do setor público é negativa: as reservas superam o que se deve lá fora."
        />
        <P
          en="History in short: the first foreign loans were taken in London right after independence (1824-25), and for over a century Brazil's debt was mostly external and in pounds sterling. External debt grew fast in the 1970s and became a crisis in the early 1980s. In the 1990s, after price stability arrived with the Real Plan, the weight shifted to domestic debt in reais. Since 2008 reserves have turned the external position around, while domestic debt climbed with interest costs and deficits, especially in 2014-2016 and during the 2020 pandemic."
          pt="Resumo da história: os primeiros empréstimos externos foram feitos em Londres logo após a independência (1824-25), e por mais de um século a dívida brasileira foi principalmente externa e em libras esterlinas. A dívida externa cresceu rápido nos anos 1970 e virou crise no início dos anos 1980. Nos anos 1990, com a estabilidade de preços do Plano Real, o peso passou para a dívida interna em reais. Desde 2008, as reservas inverteram a posição externa, enquanto a dívida interna subiu com juros e déficits, em especial em 2014-2016 e na pandemia de 2020."
        />
        <P
          en="How to read the charts: the first one shows the official series available since 1991 (net debt, gross debt and the IMF estimate); they are different concepts, so compare trends rather than exact levels. The pound and dollar charts are separate because the currencies cannot be compared. The gross-debt chart in reais is nominal and grows partly just because of inflation, which is why the % of GDP view is the fair one for comparing years."
          pt="Como ler os gráficos: o primeiro mostra as séries oficiais disponíveis desde 1991 (dívida líquida, dívida bruta e a estimativa do FMI); são conceitos diferentes, então compare tendências, não níveis exatos. Os gráficos em libras e em dólares são separados porque as moedas não são comparáveis. O gráfico da dívida bruta em reais é nominal e cresce em parte só pela inflação, por isso a visão em % do PIB é a justa para comparar anos."
        />
      </Explainer>
      <SourcesBox ids={["bcbDebt", "ipeaDebt", "bacenExtDebt", "ibgeHistDebt", "imfWeo"]} />
    </PageShell>
  );
}

