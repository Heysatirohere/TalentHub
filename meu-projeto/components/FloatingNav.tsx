"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid, Briefcase, Sparkles, MessageSquare, BookOpen,
  FileText, UserCheck, Users, PlusCircle, ShieldCheck,
  Award, Clock, Home
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}

const ALUNO_LINKS: NavItem[] = [
  { href: "/aluno",              label: "Início",       icon: Home,          exact: true },
  { href: "/aluno/vagas",        label: "Vagas",        icon: Briefcase,     exact: false },
  { href: "/aluno/trilhas",      label: "Soft Skills",  icon: Sparkles,      exact: false },
  { href: "/aluno/testes",       label: "Histórico",    icon: BookOpen,      exact: false },
  { href: "/aluno/documentos",   label: "Pack",         icon: FileText,      exact: false },
  { href: "/aluno/mensagens",    label: "Mensagens",    icon: MessageSquare, exact: false },
];

const EMPRESA_LINKS: NavItem[] = [
  { href: "/empresa",                label: "Início",       icon: Home,          exact: true },
  { href: "/empresa/filtragem",      label: "Ranking",      icon: UserCheck,     exact: false },
  { href: "/empresa/banco-talentos", label: "Talentos",     icon: Users,         exact: false },
  { href: "/empresa/campanhas/nova", label: "Nova Vaga",    icon: PlusCircle,    exact: false },
  { href: "/empresa/mensagens",      label: "Mensagens",    icon: MessageSquare, exact: false },
];

const MASTER_LINKS: NavItem[] = [
  { href: "/master",           label: "Dashboard",   icon: LayoutGrid,    exact: true },
  { href: "/master/campanhas", label: "Campanhas",   icon: Briefcase,     exact: false },
  { href: "/master/mentorias", label: "Mentorias",   icon: ShieldCheck,   exact: false },
];

export function FloatingNav() {
  const pathname = usePathname();
  const { userRole } = useTalent();

  // Determine active list of links based on path or role
  let links: NavItem[] = [];
  if (pathname.startsWith("/aluno")) {
    links = ALUNO_LINKS;
  } else if (pathname.startsWith("/empresa")) {
    links = EMPRESA_LINKS;
  } else if (pathname.startsWith("/master")) {
    links = MASTER_LINKS;
  } else if (userRole === "aluno") {
    links = ALUNO_LINKS;
  } else if (userRole === "empresa") {
    links = EMPRESA_LINKS;
  } else if (userRole === "master") {
    links = MASTER_LINKS;
  }

  // If on landing or login page without a hub active, don't show floating nav
  if (links.length === 0 || pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/cadastro")) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[95vw]"
      aria-label="Menu de navegação flutuante"
    >
      <nav
        className="flex items-center gap-1 p-1.5 sm:p-2 rounded-2xl sm:rounded-full border backdrop-blur-xl transition-all shadow-2xl"
        style={{
          background: "var(--nav-bg, rgba(0, 74, 48, 0.88))",
          borderColor: "var(--border-strong, rgba(0, 255, 85, 0.25))",
          boxShadow: "0 10px 35px rgba(0, 0, 0, 0.35), 0 0 15px rgba(0, 255, 85, 0.15)",
        }}
      >
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs font-bold transition-all duration-200 group select-none whitespace-nowrap ${
                active
                  ? "text-[#004A30] bg-[#00FF55] shadow-md shadow-[#00FF55]/20 scale-105"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  active ? "scale-110" : "group-hover:scale-110"
                }`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`${
                  active ? "inline" : "hidden sm:inline"
                } text-[11px] font-bold tracking-tight`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
