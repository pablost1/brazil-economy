import type { Point, Result } from "./types";

export const START_YEAR = 2006; // last ~20 years

export function brDate(s: string): string {
  const [d, m, y] = s.split("/");
  return `${y}-${m}-${d}`;
}

function bucket(points: Point[], keyLen: number, suffix: string): Map<string, number[]> {
  const buckets = new Map<string, number[]>();
  for (const p of points) {
    const k = p.date.slice(0, keyLen) + suffix;
    const arr = buckets.get(k) ?? [];
    arr.push(p.value);
    buckets.set(k, arr);
  }
  return buckets;
}

export function toMonthly(points: Point[], mode: "mean" | "last" = "mean"): Point[] {
  return [...bucket(points, 7, "-01").entries()].map(([date, v]) => ({
    date,
    value: mode === "mean" ? v.reduce((a, b) => a + b, 0) / v.length : v[v.length - 1],
  }));
}

export function toYearly(points: Point[], mode: "sum" | "mean" = "sum"): Point[] {
  return [...bucket(points, 4, "-01-01").entries()].map(([date, v]) => ({
    date,
    value: v.reduce((a, b) => a + b, 0) / (mode === "mean" ? v.length : 1),
  }));
}

export async function safe<D>(fn: () => Promise<D>): Promise<Result<D>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
