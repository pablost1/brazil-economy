"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLang } from "./Lang";

type Item = { name: string; value: number; full?: string };

/** Horizontal ranking bars, each bar a different color from the palette. */
export default function RankBars({ items, palette, prefix = "", suffix = "", decimals = 0, compact, height }: { items: Item[]; palette: string[]; prefix?: string; suffix?: string; decimals?: number; compact?: boolean; height?: number }) {
  const { lang } = useLang();
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const fmt = (v: number) => prefix + new Intl.NumberFormat(locale, { maximumFractionDigits: decimals, notation: compact ? "compact" : "standard" }).format(v) + suffix;
  return (
    <div style={{ height: height ?? Math.max(240, items.length * 34) }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
          <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={fmt} tickLine={false} />
          <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={12} width={150} interval={0} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            contentStyle={{ background: "#0b1220", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "#e2e8f0" }}
            formatter={(v) => fmt(Number(v))}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.full ?? payload?.[0]?.payload?.name}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {items.map((_, i) => (
              <Cell key={i} fill={palette[i % palette.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
