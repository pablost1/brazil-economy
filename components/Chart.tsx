"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Point, T } from "@/lib/types";
import { L, useLang } from "./Lang";

export type Series = { name: T; color: string; points: Point[] };

type Props = {
  series: Series[];
  kind?: "area" | "line" | "bar";
  prefix?: string;
  suffix?: string;
  decimals?: number;
  height?: number;
  /** compact numbers (e.g. 1.2B) for big values */
  compact?: boolean;
  yearlyLabels?: boolean;
  zeroLine?: boolean;
  /** hide the 5y/10y/20y buttons */
  noRange?: boolean;
};

const RANGES = [5, 10, 20] as const;

export default function Chart({ series, kind = "area", prefix = "", suffix = "", decimals = 2, height = 340, compact, yearlyLabels, zeroLine, noRange }: Props) {
  const { lang } = useLang();
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const [range, setRange] = useState<number>(20);

  const lastDate = useMemo(() => series.flatMap((s) => s.points.map((p) => p.date)).sort().pop() ?? "", [series]);
  const firstDate = useMemo(() => series.flatMap((s) => s.points.map((p) => p.date)).sort()[0] ?? "", [series]);

  const rows = useMemo(() => {
    const cutoff = !noRange && lastDate ? `${Number(lastDate.slice(0, 4)) - range}${lastDate.slice(4)}` : "";
    const map = new Map<string, Record<string, number | string>>();
    series.forEach((s, i) => {
      for (const p of s.points) {
        if (p.date < cutoff) continue;
        const row = map.get(p.date) ?? { date: p.date };
        row[`s${i}`] = p.value;
        map.set(p.date, row);
      }
    });
    const sorted = [...map.values()].sort((a, b) => String(a.date).localeCompare(String(b.date)));
    if (!yearlyLabels || sorted.length < 2) return sorted;
    // annual charts: keep a row for every year so gaps in the history stay visible
    const byYear = new Map(sorted.map((r) => [String(r.date).slice(0, 4), r]));
    const y0 = Number(String(sorted[0].date).slice(0, 4));
    const y1 = Number(String(sorted[sorted.length - 1].date).slice(0, 4));
    const out: Record<string, number | string>[] = [];
    for (let y = y0; y <= y1; y++) out.push(byYear.get(String(y)) ?? { date: `${y}-01-01` });
    return out;
  }, [series, range, lastDate, noRange, yearlyLabels]);

  const fmt = (v: number) =>
    prefix + new Intl.NumberFormat(locale, { maximumFractionDigits: decimals, minimumFractionDigits: compact ? 0 : decimals, notation: compact ? "compact" : "standard" }).format(v) + suffix;
  const fmtDate = (d: string) =>
    yearlyLabels ? d.slice(0, 4) : new Date(d + "T12:00:00").toLocaleDateString(locale, { month: "short", year: "numeric" });

  const common = {
    data: rows,
    margin: { top: 8, right: 12, left: 0, bottom: 0 },
  };
  const axes = (
    <>
      <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
      <XAxis dataKey="date" tickFormatter={(d) => d.slice(0, 4)} stroke="#94a3b8" fontSize={12} minTickGap={36} tickLine={false} />
      <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={fmt} width={compact ? 64 : 72} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
      <Tooltip
        contentStyle={{ background: "#0b1220", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "#e2e8f0" }}
        labelFormatter={(d) => fmtDate(String(d))}
        formatter={(v, name) => [fmt(Number(v)), name]}
      />
      {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
      {zeroLine && <ReferenceLine y={0} stroke="rgba(255,255,255,0.35)" />}
    </>
  );

  const sName = (i: number) => series[i].name[lang];

  return (
    <div>
      {!noRange && (
        <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
          <span>
            <L t={{ en: "Data since", pt: "Dados desde" }} /> {firstDate.slice(0, 4)}
          </span>
          <div className="flex gap-1">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-full px-3 py-1 font-semibold transition ${range === r ? "bg-[var(--accent)] text-slate-950" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
              >
                {r}y
              </button>
            ))}
          </div>
        </div>
      )}
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          {kind === "bar" ? (
            <BarChart {...common}>
              {axes}
              {series.map((s, i) => (
                <Bar key={i} dataKey={`s${i}`} name={sName(i)} fill={s.color} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          ) : kind === "line" ? (
            <LineChart {...common}>
              {axes}
              {series.map((s, i) => (
                <Line key={i} dataKey={`s${i}`} name={sName(i)} stroke={s.color} strokeWidth={2.5} dot={false} type="monotone" connectNulls />
              ))}
            </LineChart>
          ) : (
            <AreaChart {...common}>
              <defs>
                {series.map((s, i) => (
                  <linearGradient key={i} id={`g${i}-${s.color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity={0.55} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              {axes}
              {series.map((s, i) => (
                <Area key={i} dataKey={`s${i}`} name={sName(i)} stroke={s.color} strokeWidth={2.5} fill={`url(#g${i}-${s.color.slice(1)})`} type="monotone" connectNulls />
              ))}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
