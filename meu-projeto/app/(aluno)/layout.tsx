"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, BookOpen, Briefcase, LogOut, Sparkles, MessageSquare } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { useTalent } from "@/context/TalentContext";

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentAluno } = useTalent();

  const navLinks = [
    {
      href: "/aluno",
      label: "Hub Aluno",
      icon: GraduationCap,
      exact: true,
    },
    {
      href: "/aluno/trilhas",
      label: "Trilhas & Soft Skills",
      icon: Sparkles,
      exact: false,
    },
    {
      href: "/aluno/mensagens",
      label: "Mensagens",
      icon: MessageSquare,
      exact: false,
    },
    {
      href: "/aluno/testes",
      label: "Histórico Escolar",
      icon: BookOpen,
      exact: false,
    },
    {
      href: "/aluno/experiencias",
      label: "Experiências",
      icon: Briefcase,
      exact: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Aluno Exclusive Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Role Badge */}
            <Link href="/aluno" className="flex items-center space-x-3 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  FECAP <span className="text-emerald-400">Aluno</span>
                </span>
                <span className="block text-[10px] font-medium text-slate-400 -mt-1 uppercase tracking-wider">
                  {currentAluno?.nome ? currentAluno.nome : "Área do Estudante"}
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
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm"
                        : "border-transparent text-slate-300 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                    <span>{link.label}</span>
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
                <LogOut className="w-3.5 h-3.5 text-emerald-400" />
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
