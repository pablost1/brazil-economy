import { unstable_cache } from "next/cache";

export type Slice = { name: string; value: number };

// The Comex Stat API is aggressively rate-limited (HTTP 429). We respect it: wait once as the
// API asks (10s), and after a failure stop calling it for a few minutes instead of hammering it.
const COOLDOWN_MS = 5 * 60 * 1000;
let blockedUntil = 0;

async function query(details: string[], from: string, to: string): Promise<Record<string, unknown>[]> {
  if (Date.now() < blockedUntil) throw new Error("Comex Stat: rate limited (HTTP 429), retrying later");
  for (let i = 0; i < 6; i++) {
    const res = await fetch("https://api-comexstat.mdic.gov.br/general?language=en", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flow: "export", monthDetail: false, period: { from, to }, details, metrics: ["metricFOB"] }),
      cache: "no-store",
    });
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 15000));
      continue;
    }
    if (!res.ok) throw new Error(`Comex Stat: HTTP ${res.status}`);
    return (await res.json()).data.list;
  }
  blockedUntil = Date.now() + COOLDOWN_MS;
  throw new Error("Comex Stat: rate limited (HTTP 429)");
}

function topN(rows: Record<string, unknown>[], nameKey: string, n: number): Slice[] {
  const agg = new Map<string, number>();
  for (const r of rows) {
    const name = String(r[nameKey]);
    agg.set(name, (agg.get(name) ?? 0) + Number(r.metricFOB));
  }
  const sorted = [...agg.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, n);
  const rest = sorted.slice(n).reduce((a, b) => a + b.value, 0);
  return rest > 0 ? [...top, { name: "Others", value: rest }] : top;
}

export const comexBreakdown = unstable_cache(
  async (year: number) => {
    const sections = await query(["section"], `${year}-01`, `${year}-12`);
    await new Promise((r) => setTimeout(r, 11000));
    const countries = await query(["country"], `${year}-01`, `${year}-12`);
    const keyOf = (rows: Record<string, unknown>[], word: string) =>
      Object.keys(rows[0] ?? {}).find((k) => k.toLowerCase().includes(word) && !/code|^co/i.test(k)) ?? word;
    return { year, products: topN(sections, keyOf(sections, "section"), 7), destinations: topN(countries, keyOf(countries, "country"), 8) };
  },
  ["comex-breakdown"],
  { revalidate: 86400 * 7 },
);
