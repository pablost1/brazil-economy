import type { T } from "./types";

export type PageMeta = { href: string; title: T; blurb: T; color: string; icon: string };

export const PAGES: PageMeta[] = [
  { href: "/dollar", title: { en: "Dollar", pt: "Dólar" }, blurb: { en: "How many reais one US dollar costs", pt: "Quantos reais custa um dólar" }, color: "#22c55e", icon: "💵" },
  { href: "/inflation", title: { en: "Inflation", pt: "Inflação" }, blurb: { en: "IPCA prices and the Selic interest rate", pt: "Preços (IPCA) e a taxa Selic" }, color: "#f97316", icon: "🔥" },
  { href: "/gdp", title: { en: "GDP", pt: "PIB" }, blurb: { en: "How fast the economy is growing", pt: "O quão rápido a economia cresce" }, color: "#3b82f6", icon: "📈" },
  { href: "/unemployment", title: { en: "Unemployment", pt: "Desemprego" }, blurb: { en: "Share of workers without a job", pt: "Parcela de trabalhadores sem emprego" }, color: "#a855f7", icon: "👷" },
  { href: "/basic-basket", title: { en: "Food basket", pt: "Cesta básica" }, blurb: { en: "Monthly cost of basic food", pt: "Custo mensal dos alimentos básicos" }, color: "#ef4444", icon: "🛒" },
  { href: "/exports", title: { en: "Exports", pt: "Exportações" }, blurb: { en: "What Brazil sells to the world", pt: "O que o Brasil vende ao mundo" }, color: "#14b8a6", icon: "🚢" },
  { href: "/petrobras", title: { en: "Petrobras", pt: "Petrobras" }, blurb: { en: "Share price, profit and dividends", pt: "Ação, lucro e dividendos" }, color: "#eab308", icon: "🛢️" },
  { href: "/debt", title: { en: "Public debt", pt: "Dívida pública" }, blurb: { en: "Domestic and external debt since the 1800s", pt: "Dívida interna e externa desde 1800" }, color: "#ec4899", icon: "🏦" },
  { href: "/external", title: { en: "External accounts", pt: "Contas externas" }, blurb: { en: "Dollar reserves, current account and foreign investment", pt: "Reservas em dólar, transações correntes e investimento estrangeiro" }, color: "#0ea5e9", icon: "🌐" },
  { href: "/fiscal", title: { en: "Public accounts", pt: "Contas públicas" }, blurb: { en: "Deficit, primary result and interest paid", pt: "Déficit, resultado primário e juros pagos" }, color: "#84cc16", icon: "🏛️" },
  { href: "/inequality", title: { en: "Inequality", pt: "Desigualdade" }, blurb: { en: "Gini index and workers' income", pt: "Índice de Gini e renda do trabalhador" }, color: "#f59e0b", icon: "⚖️" },
  { href: "/activity", title: { en: "Industry & retail", pt: "Indústria e varejo" }, blurb: { en: "Factory output, retail sales and monthly activity", pt: "Produção industrial, vendas no varejo e atividade mensal" }, color: "#8b5cf6", icon: "🏭" },
];
