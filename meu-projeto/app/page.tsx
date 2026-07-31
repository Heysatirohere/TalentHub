"use client";

import Link from "next/link";
import {
  ArrowRight, LogIn, UserPlus, Users, CheckCircle2, BrainCircuit,
  GraduationCap, Briefcase, ShieldCheck, ChevronRight
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

/* ── Logo SVG custom ───────────────────────────── */
function NpaLogomark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <rect width="44" height="44" rx="13" fill="#00FF55" />
      <path d="M8 12v20M8 12l11 12V12M19 32V12" stroke="#004A30" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="33" cy="14" r="3" fill="#004A30"/>
      <path d="M25 32l5.5-11 5.5 11M26.8 27h7.4" stroke="#004A30" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Hub card ───────────────────────────────────── */
function HubCard({
  icon: Icon,
  title,
  description,
  href,
  accent,
  delay = "0s",
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  accent: string;
  delay?: string;
}) {
  return (
    <Link
      href={href}
      className="group npa-card npa-card-interactive rounded-2xl p-7 flex flex-col gap-5 animate-fade-up"
      style={{ animationDelay: delay }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accent, boxShadow: `0 4px 14px ${accent}55` }}
      >
        <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
      </div>
      <div className="space-y-2 flex-1">
        <h3 className="font-bold text-lg text-head leading-snug">{title}</h3>
        <p className="text-muted text-sm leading-relaxed">{description}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: accent }}>
        <span>Acessar</span>
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

/* ── Stat card ──────────────────────────────────── */
function StatCard({ value, label, sub, delay = "0s" }: { value: string | number; label: string; sub: string; delay?: string }) {
  return (
    <div className="npa-stat animate-fade-up text-center space-y-1" style={{ animationDelay: delay }}>
      <p className="text-4xl font-black text-npa">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wider text-muted">{label}</p>
      <p className="text-[11px] text-subtle">{sub}</p>
    </div>
  );
}

export default function Home() {
  const { alunos, vagas } = useTalent();
  const { theme, toggle } = useTheme();
  const vagasAprovadas = vagas.filter((v) => v.status === "aprovada").length;

  return (
    <main className="flex-1 flex flex-col" style={{ background: "var(--bg-base)" }}>

      {/* ─── Header ──────────────────────────────────────── */}
      <header className="npa-nav sticky top-0 z-50">
        <div className="h-0.5 bg-gradient-to-r from-[#004A30] via-[#00FF55] to-[#004A30]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="NPA — Início">
            <NpaLogomark size={34} />
            <div className="leading-none">
              <span className="font-black text-white text-base tracking-tight block">NPA</span>
              <span className="text-[10px] font-medium text-white/50 uppercase tracking-widest block -mt-0.5">FECAP</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Alternar tema"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#004A30] bg-[#00FF55] hover:bg-[#33ff77] shadow-sm transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-28">
        {/* Blob decorativo */}
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: "radial-gradient(circle, #00FF55 0%, transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px opacity-20"
          style={{ background: "linear-gradient(90deg, transparent, #00FF55, transparent)" }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">

          {/* Chip institucional */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest animate-fade-up"
            style={{ background: "rgba(0,74,48,0.06)", borderColor: "rgba(0,74,48,0.15)", color: "#004A30" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#00C951] animate-pulse" />
            <span className="dark:hidden">Fundação Escola de Comércio Álvares Penteado</span>
            <span className="hidden dark:inline" style={{ color: "#00C951" }}>Fundação Escola de Comércio Álvares Penteado</span>
          </div>

          {/* Headline */}
          <div className="space-y-4 animate-fade-up delay-100">
            <div className="flex items-center justify-center gap-4 mb-2">
              <NpaLogomark size={52} />
            </div>
            <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-none">
              <span className="npa-gradient-text">NPA</span>
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-body">
              Núcleo de Protagonismo <span className="text-npa font-black dark:text-neon">Alvarista</span>
            </p>
          </div>

          {/* Subtítulo */}
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed animate-fade-up delay-200">
            Plataforma institucional que conecta estudantes FECAP ao mercado de trabalho
            através de avaliação de competências, match inteligente e banco de talentos verificado.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up delay-300">
            <Link href="/login" className="npa-btn-primary px-8 py-3.5 text-sm rounded-2xl">
              <LogIn className="w-4 h-4" />
              Acessar Plataforma
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/cadastro" className="npa-btn-ghost px-8 py-3.5 text-sm rounded-2xl">
              <UserPlus className="w-4 h-4" />
              Cadastrar via RA
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-10 border-t animate-fade-up delay-400"
            style={{ borderColor: "var(--border-light)" }}>
            <StatCard value={alunos.length} label="Estudantes" sub="Cadastrados" delay="0.4s" />
            <StatCard value={vagasAprovadas} label="Campanhas" sub="Aprovadas" delay="0.5s" />
            <StatCard value="3" label="Módulos" sub="Conectados" delay="0.6s" />
          </div>
        </div>
      </section>

      {/* ─── 3 Hubs ──────────────────────────────────────── */}
      <section className="py-20 border-t" style={{ background: "var(--bg-surface)", borderColor: "var(--border-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Ecossistema NPA</p>
            <h2 className="text-3xl font-black text-head tracking-tight">Três perfis. Um sistema.</h2>
            <p className="text-muted text-sm max-w-md mx-auto">
              Cada ator tem seu espaço de trabalho com fluxos específicos e integração total.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <HubCard
              icon={GraduationCap}
              title="Hub do Aluno"
              description="Gerencie seu perfil acadêmico, realize testes de soft skills, acompanhe candidaturas e envie documentos para validação institucional."
              href="/login?role=aluno"
              accent="#004A30"
              delay="0.1s"
            />
            <HubCard
              icon={ShieldCheck}
              title="Hub Master"
              description="Painel de governança com métricas de empregabilidade, distribuição de competências e validação de mentorias dos estudantes FECAP."
              href="/login?role=master"
              accent="#006944"
              delay="0.2s"
            />
            <HubCard
              icon={Briefcase}
              title="Hub Empresas"
              description="Publique vagas com pesos técnicos, acesse o banco de talentos verificado e use a Busca Ativa para prospecção sem vaga aberta."
              href="/login?role=empresa"
              accent="#00A040"
              delay="0.3s"
            />
          </div>
        </div>
      </section>

      {/* ─── Features strip ─────────────────────────────── */}
      <section className="py-16" style={{ background: "var(--bg-base)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "📊", title: "Match Inteligente", desc: "Algoritmo de cruzamento entre perfil do aluno e requisitos da vaga." },
              { icon: "🏛️", title: "Validação FECAP", desc: "Histórico acadêmico e soft skills verificadas pela instituição." },
              { icon: "💬", title: "Chat Integrado", desc: "Comunicação direta entre recrutadores e candidatos na plataforma." },
              { icon: "📈", title: "Analytics em Tempo Real", desc: "Indicadores de empregabilidade para coordenação acadêmica." },
            ].map((f, i) => (
              <div
                key={i}
                className="npa-card rounded-xl p-5 space-y-2 animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-2xl">{f.icon}</div>
                <h3 className="font-bold text-sm text-head">{f.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────── */}
      <footer className="npa-nav py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <div className="flex items-center gap-2.5">
            <NpaLogomark size={24} />
            <span className="font-semibold text-white/70">
              NPA — Núcleo de Protagonismo Alvarista
            </span>
          </div>
          <p>© {new Date().getFullYear()} FECAP &bull; Todos os direitos reservados</p>
        </div>
      </footer>

    </main>
  );
}
