import { unstable_cache } from "next/cache";
import type { Point } from "../types";
import { brDate, START_YEAR } from "../util";

// The BCB SGS API limits date windows (about 10 years for daily series), so we fetch in chunks.
async function fetchWindow(code: number, from: string, to: string): Promise<Point[]> {
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados?formato=json&dataInicial=${from}&dataFinal=${to}`;
  let lastErr = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(25000) });
      if (res.status === 404) return []; // "Value(s) not found": nothing published in this window
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = (await res.json()) as { data: string; valor: string }[];
      return rows.map((r) => ({ date: brDate(r.data), value: Number(r.valor) })).filter((p) => Number.isFinite(p.value));
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
    }
  }
  throw new Error(`BCB SGS ${code}: ${lastErr}`);
}

async function load(code: number, startYear: number, endYear?: number): Promise<Point[]> {
  const now = new Date();
  const last = Math.min(endYear ?? now.getFullYear(), now.getFullYear());
  const pad = (n: number) => String(n).padStart(2, "0");
  const windows: [string, string][] = [];
  for (let y = startYear; y <= last; y += 9) {
    const yEnd = Math.min(y + 8, last);
    const to = yEnd === now.getFullYear() ? `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${yEnd}` : `31/12/${yEnd}`;
    windows.push([`01/01/${y}`, to]);
  }
  return (await Promise.all(windows.map(([f, t]) => fetchWindow(code, f, t)))).flat();
}

export const bcbSeries = unstable_cache(
  async (code: number, startYear: number = START_YEAR, endYear?: number) => load(code, startYear, endYear),
  ["bcb-series"],
  { revalidate: 3600 },
);
