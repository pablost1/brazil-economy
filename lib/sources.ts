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
};
