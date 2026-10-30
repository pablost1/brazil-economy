"use client";

import { useLang } from "./Lang";

/** Number formatted for the active language (1,234.5 vs 1.234,5). */
export default function Num({ v, d = 2, prefix = "", suffix = "", compact, sign }: { v: number; d?: number; prefix?: string; suffix?: string; compact?: boolean; sign?: boolean }) {
  const { lang } = useLang();
  const s = new Intl.NumberFormat(lang === "pt" ? "pt-BR" : "en-US", {
    minimumFractionDigits: compact ? 0 : d,
    maximumFractionDigits: d,
    notation: compact ? "compact" : "standard",
    signDisplay: sign ? "exceptZero" : "auto",
  }).format(v);
  return (
    <>
      {prefix}
      {s}
      {suffix}
    </>
  );
}

/** Month + year label for an ISO date, in the active language. */
export function DateLabel({ iso, yearOnly }: { iso: string; yearOnly?: boolean }) {
  const { lang } = useLang();
  if (yearOnly) return <>{iso.slice(0, 4)}</>;
  return <>{new Date(iso + "T12:00:00").toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", { month: "long", year: "numeric" })}</>;
}
