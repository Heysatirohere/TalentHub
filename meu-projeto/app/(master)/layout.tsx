"use client";

import Link from "next/link";
import { LogOut, Sun, Moon } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { useTheme } from "@/context/ThemeContext";

function NpaLogomark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect width="36" height="36" rx="10" fill="#00FF55" />
      <path d="M7 10v16M7 10l9 10V10M16 26V10" stroke="#004A30" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="27" cy="12" r="2.5" fill="#004A30"/>
      <path d="M25 26l4.5-9 4.5 9M22.5 22h6" stroke="#004A30" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function MasterLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)" }}>

      {/* ── Top bar limpa ── */}
      <header className="npa-nav sticky top-0 z-40 backdrop-blur-xl border-b" style={{ borderColor: "var(--border-light)" }}>
        <div className="h-0.5 bg-gradient-to-r from-[#004A30] via-[#00FF55] to-[#004A30]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">

          {/* Logo + identificação */}
          <Link href="/master" className="flex items-center gap-2.5" aria-label="Hub Master">
            <NpaLogomark size={30} />
            <div className="leading-none">
              <span className="font-black text-white text-sm tracking-tight block">NPA</span>
              <span className="text-[10px] font-bold uppercase tracking-widest block -mt-0.5" style={{ color: "#00FF55" }}>
                Master
              </span>
            </div>
          </Link>

          {/* Ações da topbar */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Alternar tema"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={async () => { await logoutAction(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all"
              title="Trocar perfil"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>

        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
