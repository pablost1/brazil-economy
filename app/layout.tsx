import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/components/Lang";
import NavBar from "@/components/NavBar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brazil Economy Tracker",
  description: "Dollar, inflation, GDP, unemployment, food basket, exports, Petrobras and public debt - Brazil's key economic indicators with sources.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <LangProvider>
          <NavBar />
          {children}
          <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
            Data from public sources (BCB, IBGE, DIEESE/Ipeadata, MDIC, B3/brapi, Petrobras RI). Not investment advice.
          </footer>
        </LangProvider>
      </body>
    </html>
  );
}
