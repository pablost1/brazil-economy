import { unstable_cache } from "next/cache";
import type { Point } from "../types";
import { START_YEAR } from "../util";

type Raw = { VALDATA: string; VALVALOR: number | null; TERCODIGO?: string };

async function raw(code: string): Promise<Raw[]> {
  const res = await fetch(`https://www.ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='${code}')`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Ipeadata ${code}: HTTP ${res.status}`);
  return ((await res.json()) as { value: Raw[] }).value;
}

export const ipeaSeries = unstable_cache(
  async (code: string, fromYear: number = START_YEAR): Promise<Point[]> =>
    (await raw(code))
      .filter((r) => r.VALVALOR != null && Number(r.VALDATA.slice(0, 4)) >= fromYear)
      .map((r) => ({ date: r.VALDATA.slice(0, 10), value: r.VALVALOR as number })),
  ["ipea-series"],
  { revalidate: 86400 },
);

// Latest basket cost for each capital (series CESBTOTAL, key = IBGE municipality code)
export const ipeaLatestByCity = unstable_cache(
  async (code: string): Promise<{ city: string; date: string; value: number }[]> => {
    const rows = (await raw(code)).filter((r) => r.VALVALOR != null && r.TERCODIGO);
    const latest = new Map<string, Raw>();
    for (const r of rows) {
      const cur = latest.get(r.TERCODIGO!);
      if (!cur || r.VALDATA > cur.VALDATA) latest.set(r.TERCODIGO!, r);
    }
    const maxDate = [...latest.values()].reduce((m, r) => (r.VALDATA > m ? r.VALDATA : m), "");
    return [...latest.values()]
      .filter((r) => r.VALDATA.slice(0, 7) === maxDate.slice(0, 7))
      .map((r) => ({ city: r.TERCODIGO!, date: r.VALDATA.slice(0, 10), value: r.VALVALOR as number }));
  },
  ["ipea-by-city"],
  { revalidate: 86400 },
);
