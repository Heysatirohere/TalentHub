"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  LogIn, 
  RefreshCw, 
  Search
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";

export function Navbar() {
  const pathname = usePathname();
  const { resetarDados, currentAluno, userRole, vagas } = useTalent();

  const vagasPendentesCount = vagas.filter((v) => v.status === "pendente_aprovacao").length;

  const hubs = [
    {
      href: "/aluno",
      label: "Hub Aluno",
      role: "aluno",
      icon: GraduationCap,
      badge: currentAluno?.nome ? currentAluno.nome.split(" ")[0] : "Aluno",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      href: "/master",
      label: "Hub Master",
      role: "master",
      icon: ShieldCheck,
      badge: vagasPendentesCount > 0 ? `${vagasPendentesCount} Pendente` : "Master",
      color: vagasPendentesCount > 0 ? "text-amber-400 border-amber-500/30 bg-amber-500/10 font-bold animate-pulse" : "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    },
    {
      href: "/empresa",
      label: "Hub Empresa",
      role: "empresa",
      icon: Briefcase,
      badge: "Empresa",
      color: "text-teal-400 border-teal-500/30 bg-teal-500/10",
    },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                FECAP <span className="text-teal-400">TalentHub</span>
              </span>
              <span className="block text-[10px] font-medium text-slate-400 -mt-1 uppercase tracking-wider">
                Sessão: <strong className="text-teal-400 capitalize">{userRole}</strong>
              </span>
            </div>
          </Link>

          {/* Navigation Hubs */}
          <nav className="hidden lg:flex items-center space-x-2">
            {hubs.map((hub) => {
              const Icon = hub.icon;
              const isActive = pathname.startsWith(hub.href);
              const isCurrentRole = userRole === hub.role;
              return (
                <Link
                  key={hub.href}
                  href={hub.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                    isActive || isCurrentRole
                      ? "bg-slate-800 text-white border-teal-500/50 shadow-sm"
                      : "border-transparent text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                  <span>{hub.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${hub.color}`}>
                    {hub.badge}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2">
            <Link
              href="/login"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-950" />
              <span>Trocar Perfil</span>
            </Link>

            <button
              onClick={() => {
                if (confirm("Deseja restaurar os dados de teste dos 3 Hubs FECAP?")) {
                  resetarDados();
                }
              }}
              title="Restaurar dados de teste"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Submenu Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800/80 py-2 bg-slate-950 px-2 text-xs">
        {hubs.map((hub) => {
          const Icon = hub.icon;
          const isActive = pathname.startsWith(hub.href);
          return (
            <Link
              key={hub.href}
              href={hub.href}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg ${
                isActive ? "bg-teal-500/20 text-teal-300 font-bold" : "text-slate-400"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{hub.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
