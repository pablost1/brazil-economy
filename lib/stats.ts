import type { Point } from "./types";

export const last = (p: Point[]): Point | undefined => p[p.length - 1];

/** Value of the last point at or before `date` (ISO). */
export function valueAt(points: Point[], date: string): Point | undefined {
  let found: Point | undefined;
  for (const p of points) {
    if (p.date <= date) found = p;
    else break;
  }
  return found;
}

export function shiftMonths(iso: string, months: number): string {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

export const pct = (now: number, before: number) => ((now - before) / before) * 100;

export const today = () => new Date().toISOString().slice(0, 10);

/** Keep only points up to today (some BCB series publish future-dated targets). */
export const upToToday = (p: Point[]) => p.filter((x) => x.date <= today());

export const sum = (p: Point[]) => p.reduce((a, b) => a + b.value, 0);
