import { unstable_cache } from "next/cache";
import type { Point } from "../types";
import { START_YEAR } from "../util";

type Row = { V: string; D3C: string };

// Quarterly SIDRA code "200601" -> 2006-01-01 (Q1)
function quarterDate(code: string): string {
  const y = code.slice(0, 4);
  const q = Number(code.slice(4, 6));
  return `${y}-${String((q - 1) * 3 + 1).padStart(2, "0")}-01`;
}

async function sidraGdp(variable: number): Promise<Point[]> {
  const url = `https://apisidra.ibge.gov.br/values/t/5932/n1/all/v/${variable}/p/all/c11255/90707`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`IBGE SIDRA 5932: HTTP ${res.status}`);
  const rows = ((await res.json()) as Row[]).slice(1);
  return rows
    .map((r) => ({ date: quarterDate(r.D3C), value: Number(r.V) }))
    .filter((p) => Number.isFinite(p.value) && Number(p.date.slice(0, 4)) >= START_YEAR);
}

// 6564 = quarter vs previous quarter (seasonally adjusted); 6561 = accumulated over 4 quarters
export const gdpQuarterly = unstable_cache(() => sidraGdp(6564), ["gdp-q"], { revalidate: 86400 });
export const gdpAccum4q = unstable_cache(() => sidraGdp(6561), ["gdp-4q"], { revalidate: 86400 });
