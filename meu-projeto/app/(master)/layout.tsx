"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, LayoutDashboard, Briefcase, LogOut, Award, Sun, Moon } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { useTalent } from "@/context/TalentContext";
import { useTheme } from "@/context/ThemeContext";

function NpaLogomark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect width="36" height="36" rx="10" fill="#00FF55" />
      <path d="M7 10v16M7 10l9 10V10M16 26V10" stroke="#004A30" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="27" cy="12" r="2.5" fill="#004A30"/>
      <path d="M21 26l4.5-9 4.5 9M22.5 22h6" stroke="#004A30" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const navLinks = [
  { href: "/master",           label: "Dashboard",   icon: LayoutDashboard, exact: true,  badge: null as string | null },
  { href: "/master/campanhas", label: "Campanhas",   icon: Briefcase,       exact: false, badge: null as string | null },
  { href: "/master/mentorias", label: "Mentorias",   icon: Award,           exact: false, badge: null as string | null },
];

export default function MasterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { alunos } = useTalent();
  const { theme, toggle } = useTheme();

  const pendingMentorias = alunos.reduce((acc, a) => {
    return acc + (a.progressosTrilha?.filter(p => p.status === "TESTE_APROVADO").length || 0);
  }, 0);

  const links = navLinks.map(l =>
    l.href === "/master/mentorias"
      ? { ...l, badge: pendingMentorias > 0 ? `${pendingMentorias}` : null }
      : l
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)" }}>
      <header className="npa-nav sticky top-0 z-50">
        <div className="h-0.5 bg-gradient-to-r from-[#004A30] via-[#00FF55] to-[#004A30]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">

          <Link href="/master" className="flex items-center gap-2.5" aria-label="Hub Master">
            <NpaLogomark size={30} />
            <div className="leading-none">
              <span className="font-black text-white text-sm tracking-tight block">NPA</span>
              <span className="text-[10px] font-medium uppercase tracking-widest block -mt-0.5" style={{ color: "#00FF55" }}>
                Master
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Navegação master">
            {links.map(({ href, label, icon: Icon, exact, badge }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link key={href} href={href} className={`npa-nav-link relative ${active ? "active" : ""}`}>
                  <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={active ? 2.2 : 1.8} />
                  {label}
                  {badge && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-amber-400 text-[#1c0a00] text-[9px] font-black flex items-center justify-center animate-pulse">
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggle} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all" aria-label="Tema">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={async () => { await logoutAction(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white/70 hover:text-white bg-white/8 hover:bg-white/15 border border-white/15 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-1 px-3 pb-2 overflow-x-auto">
          {links.map(({ href, label, icon: Icon, exact, badge }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`npa-nav-link relative shrink-0 text-[11px] ${active ? "active" : ""}`}>
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
                {badge && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 rounded-full bg-amber-400 text-[#1c0a00] text-[8px] font-black flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
