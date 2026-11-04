"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { L, LangToggle } from "./Lang";
import { PAGES } from "@/lib/pages";

export default function NavBar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070d1a]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-start gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2 py-1.5 font-bold tracking-tight text-white">
          <span className="text-xl">🇧🇷</span>
          <span className="hidden sm:inline">
            <L t={{ en: "Brazil Economy Tracker", pt: "Painel da Economia do Brasil" }} />
          </span>
        </Link>
        <nav className="flex flex-1 flex-wrap gap-1 text-sm">
          {PAGES.map((p) => {
            const active = path === p.href;
            return (
              <Link
                key={p.href}
                href={p.href}
                style={active ? { background: p.color, color: "#0b1220" } : undefined}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 font-medium transition ${active ? "" : "text-slate-300 hover:bg-white/10"}`}
              >
                <span className="mr-1">{p.icon}</span>
                <L t={p.title} />
              </Link>
            );
          })}
        </nav>
        <div className="shrink-0"><LangToggle /></div>
      </div>
    </header>
  );
}
