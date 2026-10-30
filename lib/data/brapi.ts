import { unstable_cache } from "next/cache";
import type { Point } from "../types";

export type Quote = { price: number; change: number; changePct: number; marketCap: number | null; history: Point[] };

export const petrQuote = unstable_cache(
  async (): Promise<Quote> => {
    let res = await fetch("https://brapi.dev/api/quote/PETR4?range=max&interval=1mo", { cache: "no-store" });
    if (!res.ok) res = await fetch("https://brapi.dev/api/quote/PETR4?range=10y&interval=1mo", { cache: "no-store" });
    if (!res.ok) throw new Error(`brapi PETR4: HTTP ${res.status}`);
    const r = (await res.json()).results[0];
    const history: Point[] = (r.historicalDataPrice ?? [])
      .filter((h: { close: number | null }) => h.close != null)
      .map((h: { date: number; close: number }) => ({ date: new Date(h.date * 1000).toISOString().slice(0, 10), value: h.close }));
    return { price: r.regularMarketPrice, change: r.regularMarketChange, changePct: r.regularMarketChangePercent, marketCap: r.marketCap ?? null, history };
  },
  ["petr4"],
  { revalidate: 900 },
);
