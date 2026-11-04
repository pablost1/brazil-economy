"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { L, useLang } from "./Lang";
import About from "./About";
import type { T } from "@/lib/types";

type Item = { name: string; value: number; full?: string };

/** Horizontal ranking bars, each bar a different color from the palette. */
export default function RankBars({ items, palette, prefix = "", suffix = "", decimals = 0, compact, height, about }: { items: Item[]; palette: string[]; prefix?: string; suffix?: string; decimals?: number; compact?: boolean; height?: number; about?: T }) {
  const { lang } = useLang();
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const fmt = (v: number) => prefix + new Intl.NumberFormat(locale, { maximumFractionDigits: decimals, notation: compact ? "compact" : "standard" }).format(v) + suffix;
  const total = items.reduce((a, b) => a + b.value, 0);
  const top = items[0];
  const bottom = items[items.length - 1];
  const share = top && total > 0 ? (top.value / total) * 100 : 0;
  const pctTxt = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(share);
  return (
    <div>
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
    {about && (
      <About>
        <p>{about[lang]}</p>
        {top && bottom && items.length > 1 && (
          <div>
            <p className="mb-1 font-semibold text-white">
              <L t={{ en: "Ranking at a glance", pt: "O ranking em resumo" }} />
            </p>
            <p>
              {lang === "pt"
                ? `${top.full ?? top.name} lidera com ${fmt(top.value)}, ${pctTxt}% da soma dos ${items.length} itens exibidos; o último é ${bottom.full ?? bottom.name}, com ${fmt(bottom.value)}. Este gráfico compara posições em um único período, por isso não há progressão no tempo.`
                : `${top.full ?? top.name} leads with ${fmt(top.value)}, ${pctTxt}% of the total of the ${items.length} items shown; last is ${bottom.full ?? bottom.name} with ${fmt(bottom.value)}. This chart compares positions in a single period, so there is no progression over time.`}
            </p>
          </div>
        )}
      </About>
    )}
    </div>
  );
}
