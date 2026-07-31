"use client";

import React from "react";
import Link from "next/link";
import {
  Briefcase, BrainCircuit, FileText, CheckCircle2,
  ArrowRight, ShieldCheck, LayoutGrid, User, ChevronRight
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { SOFT_SKILLS_LABELS } from "@/types/talent";

/* ── Card de módulo ──────────────────────────────── */
function ModuleCard({
  href, icon: Icon, title, desc, meta, cta, accent = "#004A30",
}: {
  href: string; icon: React.ElementType; title: string; desc: string;
  meta?: string; cta: string; accent?: string;
}) {
  return (
    <Link href={href} className="group npa-card npa-card-interactive rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
        >
          <Icon className="w-5 h-5" style={{ color: accent }} strokeWidth={1.8} />
        </div>
        <ChevronRight className="w-4 h-4 text-muted group-hover:translate-x-1 transition-transform mt-0.5" />
      </div>
      <div className="space-y-1.5 flex-1">
        <h2 className="font-bold text-head text-sm leading-snug">{title}</h2>
        <p className="text-xs text-muted leading-relaxed">{desc}</p>
        {meta && <p className="text-xs font-semibold" style={{ color: accent }}>{meta}</p>}
      </div>
      <span className="text-xs font-bold" style={{ color: accent }}>{cta}</span>
    </Link>
  );
}

/* ── Soft skill badge ────────────────────────────── */
function SkillBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className="px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center justify-between gap-2 transition-all"
      style={
        active
          ? { background: "rgba(0,74,48,0.08)", borderColor: "rgba(0,74,48,0.2)", color: "#004A30" }
          : { background: "var(--bg-sunken)", borderColor: "var(--border-light)", color: "var(--text-subtle)" }
      }
    >
      <span>{label}</span>
      <span className="text-[9px] font-mono font-bold">{active ? "✓" : "—"}</span>
    </div>
  );
}

export default function HubAlunoDashboard() {
  const { currentAluno, currentAlunoId, candidaturas } = useTalent();

  const isIncompleto = !currentAluno || !currentAluno.ra || !currentAluno.nome;
  const nome = currentAluno?.nome || "Aluno";
  const email = currentAluno?.email || (currentAlunoId?.includes("@") ? currentAlunoId : "");
  const experiencias = currentAluno?.experiencias || [];

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">

      {/* ── Banner de perfil ── */}
      {isIncompleto ? (
        <div
          className="rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border animate-fade-up"
          style={{ background: "var(--amber-bg)", borderColor: "var(--amber-border)" }}
        >
          <div className="space-y-2">
            <div className="npa-badge npa-badge-amber inline-flex">
              <User className="w-3 h-3" />
              Perfil Incompleto
            </div>
            <h1 className="text-2xl font-extrabold" style={{ color: "var(--amber-text)" }}>Olá, {nome}!</h1>
            <p className="text-sm leading-relaxed" style={{ color: "var(--amber-text)", opacity: 0.8 }}>
              Complete seu perfil para acessar todas as funcionalidades da plataforma NPA.
            </p>
            {email && (
              <span className="text-xs font-mono" style={{ color: "var(--amber-text)" }}>{email}</span>
            )}
          </div>
          <Link href="/aluno/cadastro" className="npa-btn-primary rounded-xl shrink-0">
            <User className="w-4 h-4" />
            Completar Perfil
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div
          className="rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border animate-fade-up"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border-light)", boxShadow: "var(--shadow-sm)" }}
        >
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={currentAluno.avatarUrl}
                alt={currentAluno.nome}
                className="w-16 h-16 rounded-2xl object-cover border-2"
                style={{ borderColor: "#00C951" }}
              />
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ background: "#00C951", borderColor: "var(--bg-surface)" }}
              >
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <div className="npa-badge inline-flex mb-2">
                RA {currentAluno.ra}
              </div>
              <h1 className="text-2xl font-extrabold text-head leading-tight">{currentAluno.nome}</h1>
              <p className="text-xs text-muted">
                {currentAluno.curso} &bull; {currentAluno.semestre}º Sem. &bull; {currentAluno.email}
              </p>
            </div>
          </div>

          <div
            className="rounded-xl p-4 border text-center shrink-0"
            style={{ background: "var(--bg-raised)", borderColor: "var(--border-base)" }}
          >
            <p className="text-xs text-muted mb-1">Candidaturas</p>
            <p className="text-2xl font-black text-npa">{candidaturas.length}</p>
            <p className="text-[11px] text-subtle">enviadas</p>
          </div>
        </div>
      )}

      {/* ── Módulos ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ModuleCard
          href="/aluno/vagas"
          icon={Briefcase}
          title="Vagas & Candidaturas"
          desc="Explore posições abertas e veja seu Match % em tempo real."
          meta={`${candidaturas.length} candidatura(s)`}
          cta="Ver vagas →"
          accent="#004A30"
        />
        <ModuleCard
          href="/aluno/testes"
          icon={BrainCircuit}
          title="Testes & Soft Skills"
          desc="Realize testes interativos para mapear suas competências técnicas."
          cta="Fazer testes →"
          accent="#006944"
        />
        <ModuleCard
          href="/aluno/experiencias"
          icon={LayoutGrid}
          title="Experiências"
          desc="Registre estágios, projetos e Empresa Júnior FECAP."
          meta={`${experiencias.length} experiência(s)`}
          cta="Gerenciar →"
          accent="#005038"
        />
        <ModuleCard
          href="/aluno/documentos"
          icon={FileText}
          title="Documentos"
          desc="Envie comprovante de matrícula e histórico para validação."
          cta="Ver documentos →"
          accent="#008040"
        />
      </div>

      {/* ── Painel inferior ── */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Soft Skills */}
        <div className="npa-card rounded-2xl p-6 space-y-4 animate-fade-up delay-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-npa" />
              <h3 className="text-sm font-bold text-head">Soft Skills</h3>
            </div>
            <Link href="/aluno/trilhas" className="text-xs font-bold text-npa hover:underline">Ver trilhas →</Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(SOFT_SKILLS_LABELS) as (keyof typeof SOFT_SKILLS_LABELS)[]).map((key) => {
              const active = Boolean(
                currentAluno?.softSkills?.[key] ||
                currentAluno?.progressosTrilha?.some(
                  p => p.trilhaNome.toLowerCase() === key.toLowerCase() && p.status !== "EM_TRILHA"
                )
              );
              return <SkillBadge key={key} label={SOFT_SKILLS_LABELS[key]} active={active} />;
            })}
          </div>
        </div>

        {/* Experiências */}
        <div className="npa-card rounded-2xl p-6 space-y-4 animate-fade-up delay-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-npa" />
              <h3 className="text-sm font-bold text-head">Experiências</h3>
            </div>
            <Link href="/aluno/experiencias" className="text-xs font-bold text-npa hover:underline">Gerenciar →</Link>
          </div>

          {experiencias.length === 0 ? (
            <div className="text-center py-6 space-y-2">
              <Briefcase className="w-8 h-8 mx-auto text-subtle" strokeWidth={1.2} />
              <p className="text-xs text-muted">Nenhuma experiência cadastrada ainda.</p>
              <Link href="/aluno/experiencias" className="npa-btn-ghost text-xs inline-flex">
                Adicionar experiência
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {experiencias.slice(0, 3).map((exp) => (
                <div
                  key={exp.id}
                  className="p-3 rounded-xl border space-y-0.5"
                  style={{ background: "var(--bg-raised)", borderColor: "var(--border-light)" }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-head">{exp.cargo}</span>
                    <span className="text-[10px] text-npa font-semibold">{exp.periodo}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-npa">{exp.empresa}</p>
                  <p className="text-[11px] text-muted line-clamp-1">{exp.descricao}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </main>
  );
}
