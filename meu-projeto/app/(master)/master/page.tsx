"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck, Clock, Users, CheckCircle2,
  ArrowRight, TrendingUp, BrainCircuit, Building2, Award
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { SOFT_SKILLS_LABELS, SoftSkills } from "@/types/talent";

function KpiCard({
  label, value, unit, sub, icon: Icon, accent = "#004A30", delay = "0s",
}: {
  label: string; value: string | number; unit?: string; sub: string;
  icon: React.ElementType; accent?: string; delay?: string;
}) {
  return (
    <div className="npa-stat rounded-2xl animate-fade-up" style={{ animationDelay: delay }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{label}</span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${accent}12`, border: `1px solid ${accent}20` }}
        >
          <Icon className="w-4 h-4" style={{ color: accent }} strokeWidth={1.8} />
        </div>
      </div>
      <p className="text-3xl font-black text-head">
        {value}{unit && <span className="text-sm font-normal text-muted ml-1">{unit}</span>}
      </p>
      <p className="text-[11px] text-muted mt-1">{sub}</p>
    </div>
  );
}

export default function MasterDashboardPage() {
  const { alunos, vagas } = useTalent();

  const softSkillsStats = useMemo(() => {
    const totalAlunos = alunos.length || 1;
    const stats: Record<keyof SoftSkills, number> = {
      comunicacao: 0, trabalhoEmEquipe: 0, lideranca: 0,
      resolucaoProblemas: 0, adaptabilidade: 0, pensamentoCritico: 0,
    };
    alunos.forEach((a) => {
      (Object.keys(stats) as (keyof SoftSkills)[]).forEach((key) => {
        if (
          a.softSkills?.[key] ||
          a.progressosTrilha?.some(p => p.trilhaNome.toLowerCase() === key.toLowerCase() && p.status !== "EM_TRILHA")
        ) stats[key]++;
      });
    });
    return (Object.keys(stats) as (keyof SoftSkills)[]).map(key => ({
      key,
      label: SOFT_SKILLS_LABELS[key],
      count: stats[key],
      percent: Math.round((stats[key] / totalAlunos) * 100),
    }));
  }, [alunos]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">

      {/* ── Banner ── */}
      <div
        className="rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border animate-fade-up"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border-light)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="space-y-2">
          <div className="npa-badge inline-flex">
            <ShieldCheck className="w-3 h-3" />
            Coordenação Master FECAP
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-head">
            Métricas & Governança
          </h1>
          <p className="text-sm text-muted max-w-lg">
            Acompanhamento analítico da empregabilidade universitária e indicadores de contratação.
          </p>
        </div>

        <Link href="/master/campanhas" className="npa-btn-primary rounded-xl shrink-0">
          <Building2 className="w-4 h-4" />
          Ver Campanhas ({vagas.length})
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ── KPIs ── */}
      <div className="grid sm:grid-cols-3 gap-5">
        <KpiCard
          label="Tempo Médio de Match"
          value="4.2"
          unit="Dias"
          sub="18% mais rápido que o trimestre anterior"
          icon={Clock}
          accent="#004A30"
          delay="0.1s"
        />
        <KpiCard
          label="Alunos na Base"
          value={alunos.length}
          sub="Perfis com histórico verificado FECAP"
          icon={Users}
          accent="#006944"
          delay="0.2s"
        />
        <KpiCard
          label="Campanhas Ativas"
          value={vagas.length}
          sub="Vagas corporativas alimentando o match"
          icon={CheckCircle2}
          accent="#008040"
          delay="0.3s"
        />
      </div>

      {/* ── Analytics ── */}
      <div className="grid lg:grid-cols-12 gap-6">

        {/* Soft Skills Distribution */}
        <div className="lg:col-span-7 npa-card rounded-2xl p-6 space-y-5 animate-fade-up delay-200">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-npa" />
            <h2 className="text-sm font-bold text-head">Distribuição de Soft Skills</h2>
          </div>
          <p className="text-xs text-muted -mt-3">
            % dos estudantes FECAP com validação em cada competência.
          </p>

          <div className="space-y-4">
            {softSkillsStats.map((item, i) => (
              <div key={item.key} className="space-y-1.5 animate-fade-up" style={{ animationDelay: `${0.05 * i}s` }}>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-body">{item.label}</span>
                  <span className="font-bold text-npa">
                    {item.percent}% <span className="text-subtle font-normal">({item.count}/{alunos.length})</span>
                  </span>
                </div>
                <div className="npa-progress-track">
                  <div className="npa-progress-bar" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campanhas overview */}
        <div className="lg:col-span-5 npa-card rounded-2xl p-6 space-y-5 flex flex-col animate-fade-up delay-300">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-npa" />
            <h2 className="text-sm font-bold text-head">Monitoramento de Campanhas</h2>
          </div>

          <div className="space-y-2.5 flex-1">
            {[
              { label: "Vagas Corporativas Ativas", value: vagas.length, accent: "#004A30" },
              { label: "Estudantes no Algoritmo", value: alunos.length, accent: "#006944" },
              { label: "Taxa de Match Estimada", value: `${Math.min(100, Math.round((vagas.length / Math.max(alunos.length, 1)) * 100))}%`, accent: "#008040" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center p-3 rounded-xl text-xs border"
                style={{ background: "var(--bg-raised)", borderColor: "var(--border-light)" }}
              >
                <span className="text-body">{row.label}</span>
                <span className="font-bold text-sm" style={{ color: row.accent }}>{row.value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Link href="/master/campanhas" className="npa-btn-primary w-full justify-center rounded-xl text-xs">
              Ver Catálogo de Campanhas
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/master/mentorias" className="npa-btn-ghost w-full justify-center rounded-xl text-xs">
              <Award className="w-4 h-4" />
              Validar Mentorias
            </Link>
          </div>
        </div>
      </div>

    </main>
  );
}
