"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, LayoutDashboard, CheckSquare, LogOut, Award } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { useTalent } from "@/context/TalentContext";

export default function MasterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { vagas, alunos } = useTalent();

  const vagasPendentesCount = vagas.filter((v) => v.status === "pendente_aprovacao").length;
  
  const mentoriasPendentesCount = alunos.reduce((acc, a) => {
    const pCount = a.progressosTrilha?.filter((p) => p.status === "TESTE_APROVADO").length || 0;
    return acc + pCount;
  }, 0);

  const navLinks = [
    {
      href: "/master",
      label: "Dashboards",
      icon: LayoutDashboard,
      exact: true,
      badge: null,
    },
    {
      href: "/master/campanhas",
      label: "Aprovar Campanhas",
      icon: CheckSquare,
      exact: false,
      badge: vagasPendentesCount > 0 ? `${vagasPendentesCount}` : null,
    },
    {
      href: "/master/mentorias",
      label: "Validar Mentorias",
      icon: Award,
      exact: false,
      badge: mentoriasPendentesCount > 0 ? `${mentoriasPendentesCount}` : null,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Master Exclusive Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Role Badge */}
            <Link href="/master" className="flex items-center space-x-3 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
                <ShieldCheck className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  FECAP <span className="text-cyan-400">Master</span>
                </span>
                <span className="block text-[10px] font-medium text-slate-400 -mt-1 uppercase tracking-wider">
                  Coordenação & Gestão
                </span>
              </div>
            </Link>

            {/* Exclusive Navigation Links */}
            <nav className="flex items-center space-x-1 sm:space-x-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm"
                        : "border-transparent text-slate-300 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold animate-pulse">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Logout / Switch Profile */}
            <div className="flex items-center">
              <button
                onClick={async () => {
                  await logoutAction();
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all"
                title="Sair da conta ou trocar perfil"
              >
                <LogOut className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Trocar Perfil</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
