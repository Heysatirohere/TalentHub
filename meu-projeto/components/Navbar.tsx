"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, RefreshCw, Moon, Sun, Menu, X, GraduationCap, Briefcase, ShieldCheck } from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

/* ── Ícone NPA (SVG personalizado) ───────────────── */
function NpaLogomark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect width="36" height="36" rx="10" fill="#00FF55" />
      {/* N */}
      <path d="M7 10v16M7 10l9 10V10M16 26V10" stroke="#004A30" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Ponto / acento */}
      <circle cx="27" cy="12" r="2.5" fill="#004A30"/>
      {/* A estilizado */}
      <path d="M21 26l4.5-9 4.5 9M22.5 22h6" stroke="#004A30" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Toggle de tema ─────────────────────────────── */
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}

/* ── Navbar principal (landing / hubs sem layout próprio) ─── */
export function Navbar() {
  const pathname = usePathname();
  const { resetarDados, currentAluno, userRole } = useTalent();
  const [mobileOpen, setMobileOpen] = useState(false);

  const hubs = [
    { href: "/aluno",  label: "Área do Aluno",    icon: GraduationCap, role: "aluno" },
    { href: "/master", label: "Coordenação",       icon: ShieldCheck,   role: "master" },
    { href: "/empresa",label: "Portal Empresas",   icon: Briefcase,     role: "empresa" },
  ];

  return (
    <header className="npa-nav sticky top-0 z-50">
      {/* Linha de acento superior */}
      <div className="h-0.5 bg-gradient-to-r from-[#004A30] via-[#00FF55] to-[#004A30]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="NPA — Início">
            <NpaLogomark size={34} />
            <div className="leading-none">
              <span className="font-black text-white text-base tracking-tight block">NPA</span>
              <span className="text-[10px] font-medium text-white/50 uppercase tracking-widest block -mt-0.5">
                FECAP
              </span>
            </div>
          </Link>

          {/* ── Direita: ações ── */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#004A30] bg-[#00FF55] hover:bg-[#33ff77] shadow-sm transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="capitalize">{(userRole as string) !== "visitante" ? `Perfil: ${userRole}` : "Entrar"}</span>
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                if (confirm("Restaurar dados de teste?")) resetarDados();
              }}
              title="Restaurar dados de teste"
              className="hidden lg:flex w-8 h-8 rounded-lg items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/8 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#004A30]/98 px-4 py-3 space-y-1 animate-fade-in">
          {hubs.map((hub) => {
            const Icon = hub.icon;
            const active = pathname.startsWith(hub.href);
            return (
              <Link
                key={hub.href}
                href={hub.href}
                onClick={() => setMobileOpen(false)}
                className={`npa-nav-link w-full ${active ? "active" : ""}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {hub.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="npa-btn-neon w-full justify-center mt-2"
          >
            <LogIn className="w-4 h-4" />
            Entrar / Trocar Perfil
          </Link>
        </div>
      )}
    </header>
  );
}
