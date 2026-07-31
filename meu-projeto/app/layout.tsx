import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TalentProvider } from "@/context/TalentContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NPA — Núcleo de Protagonismo Alvarista | FECAP",
  description:
    "Plataforma institucional de recrutamento, match de habilidades e banco de talentos da FECAP — Fundação Escola de Comércio Álvares Penteado.",
  keywords: ["FECAP", "NPA", "estágio", "recrutamento", "soft skills", "alunos"],
};

import { FloatingNav } from "@/components/FloatingNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-[#00C951]/30 selection:text-[#004A30]">
        <ThemeProvider>
          <TalentProvider>
            <div className="flex-1 flex flex-col pb-20">{children}</div>
            <FloatingNav />
          </TalentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
