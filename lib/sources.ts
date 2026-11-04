import type { T } from "./types";

export type Source = { name: string; org: string; url: string; note: T };

// Central registry so every page cites sources consistently.
export const SOURCES: Record<string, Source> = {
  bcbPtax: {
    name: "SGS series 1 - US dollar (sale), PTAX",
    org: "Banco Central do Brasil",
    url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados",
    note: { en: "Daily commercial dollar sale rate in R$, from the Central Bank open-data API.", pt: "Taxa diária de venda do dólar comercial em R$, da API de dados abertos do Banco Central." },
  },
  bcbIpca: {
    name: "SGS series 433 (monthly) and 13522 (12-month) - IPCA",
    org: "Banco Central do Brasil / IBGE",
    url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados",
    note: { en: "IPCA, Brazil's official inflation index, produced by IBGE and republished by the Central Bank.", pt: "IPCA, o índice oficial de inflação do Brasil, calculado pelo IBGE e republicado pelo Banco Central." },
  },
  bcbSelic: {
    name: "SGS series 4189 - Selic rate, accumulated in the month, annualized",
    org: "Banco Central do Brasil (Copom)",
    url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados",
    note: { en: "The basic interest rate set by the Monetary Policy Committee (Copom), as an annualized monthly figure.", pt: "A taxa básica de juros definida pelo Comitê de Política Monetária (Copom), em valor mensal anualizado." },
  },
  ibgeGdp: {
    name: "SIDRA table 5932 - Quarterly National Accounts",
    org: "IBGE",
    url: "https://sidra.ibge.gov.br/tabela/5932",
    note: { en: "Quarterly GDP growth at market prices, seasonally adjusted.", pt: "Variação trimestral do PIB a preços de mercado, com ajuste sazonal." },
  },
  ibgePnad: {
    name: "SIDRA table 6381 / PNAD Contínua",
    org: "IBGE",
    url: "https://sidra.ibge.gov.br/tabela/6381",
    note: { en: "Unemployment rate from the continuous household survey (from 2012), via BCB SGS series 24369.", pt: "Taxa de desocupação da PNAD Contínua (a partir de 2012), via série 24369 do SGS/BCB." },
  },
  bcbPme: {
    name: "SGS series 10777 - Unemployment rate, PME",
    org: "IBGE (Pesquisa Mensal de Emprego) via Banco Central",
    url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.10777/dados",
    note: { en: "Older monthly employment survey (six metropolitan regions), used for 2006-2011. Methodology differs from PNAD.", pt: "Antiga Pesquisa Mensal de Emprego (seis regiões metropolitanas), usada em 2006-2011. Metodologia diferente da PNAD." },
  },
  dieese: {
    name: "Pesquisa Nacional da Cesta Básica de Alimentos",
    org: "DIEESE (via Ipeadata)",
    url: "http://www.ipeadata.gov.br/Default.aspx",
    note: { en: "Monthly cost of the basic food basket in state capitals. Series DIEESE12_CBSP12 (São Paulo) and CESBTOTAL (all capitals).", pt: "Custo mensal da cesta básica de alimentos nas capitais. Séries DIEESE12_CBSP12 (São Paulo) e CESBTOTAL (todas as capitais)." },
  },
  bcbWage: {
    name: "SGS series 1619 - Minimum wage",
    org: "Banco Central do Brasil",
    url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1619/dados",
    note: { en: "Monthly national minimum wage in R$.", pt: "Salário mínimo nacional mensal em R$." },
  },
  bcbExports: {
    name: "SGS series 22708 (exports) and 22709 (imports) - Trade balance, FOB",
    org: "Banco Central do Brasil",
    url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.22708/dados",
    note: { en: "Monthly goods exports and imports in US$ million (balance of payments).", pt: "Exportações e importações mensais de bens em US$ milhões (balanço de pagamentos)." },
  },
  comex: {
    name: "Comex Stat",
    org: "MDIC - Ministério do Desenvolvimento, Indústria, Comércio e Serviços",
    url: "https://comexstat.mdic.gov.br/",
    note: { en: "Official foreign-trade statistics: exports by product section and destination country.", pt: "Estatísticas oficiais de comércio exterior: exportações por seção de produto e país de destino." },
  },
  brapi: {
    name: "brapi.dev - PETR4 quote",
    org: "B3 data via brapi.dev",
    url: "https://brapi.dev/",
    note: { en: "Petrobras preferred share (PETR4) price on the B3 stock exchange, monthly closes.", pt: "Cotação da ação preferencial da Petrobras (PETR4) na B3, fechamentos mensais." },
  },
  petrobrasRi: {
    name: "Petrobras Investor Relations - Financial results",
    org: "Petrobras",
    url: "https://www.investidorpetrobras.com.br/",
    note: { en: "Annual net income and dividends from Petrobras' published results. Entered manually - check the site for the latest.", pt: "Lucro líquido anual e dividendos dos resultados publicados pela Petrobras. Inseridos manualmente - confira o site para o mais recente." },
  },
  bcbDebt: {
    name: "SGS series 13762 / 13761 (DBGG) and 4513 / 4478 (DLSP)",
    org: "Banco Central do Brasil",
    url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13762/dados",
    note: { en: "Gross general-government debt (DBGG, from Dec 2006) and net public-sector debt (DLSP, from Dec 2001), in % of GDP and R$ million.", pt: "Dívida bruta do governo geral (DBGG, desde dez/2006) e dívida líquida do setor público (DLSP, desde dez/2001), em % do PIB e R$ milhões." },
  },
  ipeaDebt: {
    name: "Ipeadata - DLSP series (PAN12_DTSPY12, BM12_DINSPY12, BM12_DEXSPY12, BM12_DINGFY12, BM12_DINEMY12, BM12_DINEEY12)",
    org: "Banco Central do Brasil via Ipeadata",
    url: "http://www.ipeadata.gov.br/Default.aspx",
    note: { en: "Net public-sector debt in % of GDP since 1991, split into domestic and external and by government level (from 2001).", pt: "Dívida líquida do setor público em % do PIB desde 1991, dividida em interna e externa e por esfera de governo (desde 2001)." },
  },
  bacenExtDebt: {
    name: "Ipeadata - PAN_DEXT / BM_DEXTEI and BPAG4_DEX4 (gross external debt)",
    org: "Banco Central do Brasil (Balance of Payments, External Debt) via Ipeadata",
    url: "http://www.ipeadata.gov.br/Default.aspx",
    note: { en: "Gross external debt in US$: annual from 1950 and quarterly from 2001.", pt: "Dívida externa bruta em US$: anual desde 1950 e trimestral desde 2001." },
  },
  ibgeHistDebt: {
    name: "Ipeadata - HIST_DEXVELHA, HIST_DEXREG (historical external debt)",
    org: "Bouças (Min. Fazenda, 1955); IBGE Estatísticas Históricas do Brasil (1987) - via Ipeadata",
    url: "http://www.ipeadata.gov.br/Default.aspx",
    note: { en: "External debt in circulation 1824-1950 (pounds sterling), registered external debt 1889-1950 (US$). Discontinued series.", pt: "Dívida externa em circulação 1824-1950 (libras esterlinas), dívida externa registrada 1889-1950 (US$). Séries interrompidas." },
  },
  imfWeo: {
    name: "World Economic Outlook - general-government gross and net debt (Brazil)",
    org: "International Monetary Fund (via Ipeadata)",
    url: "https://www.imf.org/en/Publications/WEO",
    note: { en: "IMF estimate of general-government gross debt, shown as a cross-check of the Central Bank figures. Recent years may be projections.", pt: "Estimativa do FMI para a dívida bruta do governo geral, usada como conferência dos números do Banco Central. Anos recentes podem ser projeções." },
  },
  bcbExternal: {
    name: "SGS series 13621 (reserves), 22701 (current account), 22885 (direct investment)",
    org: "Banco Central do Brasil",
    url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13621/dados",
    note: { en: "International reserves (cash concept, daily, US$ million), monthly current-account balance and monthly net foreign direct investment in Brazil (US$ million).", pt: "Reservas internacionais (conceito caixa, diárias, US$ milhões), saldo mensal em transações correntes e investimento direto no país mensal líquido (US$ milhões)." },
  },
  ipeaFiscal: {
    name: "Ipeadata - BM12_NFSPNYS12, BM12_NFSPPYS12, BM12_NFSPJNYS12 (NFSP)",
    org: "Banco Central do Brasil (Notas para a Imprensa - Política Fiscal) via Ipeadata",
    url: "http://www.ipeadata.gov.br/Default.aspx",
    note: { en: "Public-sector borrowing requirement: nominal, primary and interest, 12-month flow in % of GDP (positive = deficit).", pt: "Necessidades de financiamento do setor público: nominal, primário e juros, fluxo em 12 meses em % do PIB (positivo = déficit)." },
  },
  ibgeGini: {
    name: "SIDRA table 7435 - Gini index of per-capita household income",
    org: "IBGE (PNAD Contínua)",
    url: "https://sidra.ibge.gov.br/tabela/7435",
    note: { en: "Annual Gini index of per-capita household income, at average prices of the year.", pt: "Índice de Gini anual do rendimento domiciliar per capita, a preços médios do ano." },
  },
  ipeaPnad: {
    name: "Ipeadata - PNADC12_RRPH12, PNADC12_MRRTH12, PNADC12_RRPHESPCC12, PNADC12_RRPHESPSC12",
    org: "IBGE (PNAD Contínua) via Ipeadata",
    url: "http://www.ipeadata.gov.br/Default.aspx",
    note: { en: "Average real income of the main job, total real income from work, and income of private employees with and without a formal contract.", pt: "Rendimento real médio do trabalho principal, massa de rendimento real do trabalho e rendimento dos empregados do setor privado com e sem carteira." },
  },
  ipeaActivity: {
    name: "Ipeadata - PIMPFN12_QIIGNN12, PIMPFN12_QIBKNN12, PIMPFN12_QIBCTNN12, PMC12_IVVRN12, PMC12_IVVRNAMP12",
    org: "IBGE (Pesquisa Industrial Mensal - Produção Física; Pesquisa Mensal de Comércio) via Ipeadata",
    url: "http://www.ipeadata.gov.br/Default.aspx",
    note: { en: "Industrial production volume by type of good and real retail sales, indexes with 2022 = 100.", pt: "Volume da produção industrial por tipo de bem e vendas reais do varejo, índices com 2022 = 100." },
  },
  bcbIbc: {
    name: "SGS series 24364 - IBC-Br, seasonally adjusted",
    org: "Banco Central do Brasil",
    url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.24364/dados",
    note: { en: "Monthly index of economic activity, a contemporaneous indicator of GDP.", pt: "Índice mensal de atividade econômica, indicador contemporâneo do PIB." },
  },
};
