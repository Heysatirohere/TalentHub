"use client";

import React from "react";
import Link from "next/link";
import {
  Search, PlusCircle, UserCheck, ArrowRight, Building2, ChevronRight, TrendingUp
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";

function ActionCard({
  icon: Icon, title, desc, href, cta, accent = "#004A30", primary = false,
}: {
  icon: React.ElementType; title: string; desc: string;
  href: string; cta: string; accent?: string; primary?: boolean;
}) {
  return (
    <Link href={href} className="group npa-card npa-card-interactive rounded-2xl p-6 flex flex-col gap-5">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={
          primary
            ? { background: accent, boxShadow: `0 4px 14px ${accent}40` }
            : { background: `${accent}14`, border: `1px solid ${accent}25` }
        }
      >
        <Icon className="w-5 h-5" style={{ color: primary ? "#fff" : accent }} strokeWidth={1.8} />
      </div>
      <div className="space-y-1.5 flex-1">
        <h2 className="font-bold text-head text-sm">{title}</h2>
        <p className="text-xs text-muted leading-relaxed">{desc}</p>
      </div>
      <span className="flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all" style={{ color: accent }}>
        {cta}
        <ChevronRight className="w-3.5 h-3.5" />
      </span>
    </Link>
  );
}

export default function EmpresaDashboardPage() {
  const { vagas, alunos } = useTalent();
  const vagasAprovadas = vagas.filter((v) => v.status === "aprovada");

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">

      {/* ── Banner ── */}
      <div
        className="rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border animate-fade-up"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border-light)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="space-y-2">
          <div className="npa-badge inline-flex">
            <Building2 className="w-3 h-3" />
            Portal Corporativo
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-head">Gestão de Talentos</h1>
          <p className="text-sm text-muted max-w-lg">
            Abra campanhas formais ou use a Busca Ativa para prospectar no banco de talentos verificado da FECAP.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div
            className="rounded-xl p-4 border text-center"
            style={{ background: "var(--bg-raised)", borderColor: "var(--border-base)" }}
          >
            <p className="text-xs text-muted">Talentos</p>
            <p className="text-2xl font-black text-npa">{alunos.length}</p>
            <p className="text-[11px] text-subtle">disponíveis</p>
          </div>
          <div
            className="rounded-xl p-4 border text-center"
            style={{ background: "var(--bg-raised)", borderColor: "var(--border-base)" }}
          >
            <p className="text-xs text-muted">Vagas</p>
            <p className="text-2xl font-black text-npa">{vagas.length}</p>
            <p className="text-[11px] text-subtle">ativas</p>
          </div>
        </div>
      </div>

      {/* ── 3 módulos ── */}
      <div className="grid md:grid-cols-3 gap-5 animate-fade-up delay-100">
        <ActionCard
          icon={Search}
          title="Busca Ativa"
          desc="Explore a base completa de alunos FECAP com filtros livres de soft skills, notas e cursos — sem precisar de vaga aberta."
          href="/empresa/banco-talentos"
          cta="Explorar talentos"
          accent="#004A30"
          primary
        />
        <ActionCard
          icon={PlusCircle}
          title="Nova Vaga"
          desc="Cadastre uma posição formal com pesos técnicos (0–5) e requisitos de soft skills. O algoritmo de match ativa automaticamente."
          href="/empresa/campanhas/nova"
          cta="Criar vaga"
          accent="#006944"
        />
        <ActionCard
          icon={UserCheck}
          title="Ranking por Match"
          desc="Veja candidatos ordenados pelo algoritmo para suas vagas ativas e acesse feedbacks institucionais dos docentes."
          href="/empresa/filtragem"
          cta="Ver ranking"
          accent="#008040"
        />
      </div>

      {/* ── Campanhas ativas ── */}
      <div
        className="npa-card rounded-2xl p-6 space-y-5 animate-fade-up delay-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-npa" />
            <h2 className="font-bold text-head text-sm">Campanhas Ativas</h2>
            <span className="npa-badge">{vagas.length}</span>
          </div>
          <Link href="/empresa/campanhas/nova" className="npa-btn-neon px-3 py-1.5 text-xs rounded-xl">
            <PlusCircle className="w-3.5 h-3.5" />
            Nova
          </Link>
        </div>

        {vagas.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <Building2 className="w-10 h-10 mx-auto text-subtle" strokeWidth={1} />
            <p className="text-sm text-muted">Nenhuma campanha aberta ainda.</p>
            <Link href="/empresa/campanhas/nova" className="npa-btn-primary inline-flex rounded-xl text-xs">
              <PlusCircle className="w-4 h-4" />
              Criar primeira vaga
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {vagas.map((vaga) => (
              <div
                key={vaga.id}
                className="p-4 rounded-xl border space-y-2 transition-all hover:border-[#004A30]/25"
                style={{ background: "var(--bg-raised)", borderColor: "var(--border-light)" }}
              >
                <div className="flex justify-between items-start gap-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "var(--bg-sunken)", color: "var(--text-muted)" }}
                  >
                    {vaga.tipoContrato}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(0,201,81,0.12)", color: "#006944", border: "1px solid rgba(0,201,81,0.25)" }}
                  >
                    Ativa
                  </span>
                </div>
                <h3 className="font-bold text-head text-sm line-clamp-1">{vaga.titulo}</h3>
                <p className="text-xs text-muted">{vaga.empresa}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}
