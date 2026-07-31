"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen, ShieldCheck, ArrowLeft, CheckCircle2, Check,
  Award, FileCheck
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { SoftSkills, SOFT_SKILLS_LABELS } from "@/types/talent";

export default function HistoricoAlunoPage() {
  const router = useRouter();
  const { currentAluno, atualizarHistoricoAluno } = useTalent();

  const [softSkillsState, setSoftSkillsState] = useState<SoftSkills>(
    currentAluno?.softSkills || {
      comunicacao: true,
      trabalhoEmEquipe: true,
      lideranca: true,
      resolucaoProblemas: true,
      adaptabilidade: true,
      pensamentoCritico: true,
    }
  );

  const historico = currentAluno?.historicoAcademico || [];

  const mediaPonderadaGeral = historico.length > 0
    ? (historico.reduce((acc, h) => acc + h.nota, 0) / historico.length).toFixed(1)
    : "N/A";

  const toggleSkill = (key: keyof SoftSkills) => {
    setSoftSkillsState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAluno) return;

    await atualizarHistoricoAluno(currentAluno.id, softSkillsState, historico);
    alert("Habilidades comportamentais salvas com sucesso!");
    router.push("/aluno");
  };

  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 animate-fade-up">
        <Link href="/aluno" className="npa-btn-ghost p-2 rounded-xl shrink-0" aria-label="Voltar">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-head leading-tight">
              Histórico Escolar & Competências
            </h1>
            <span className="npa-badge text-[10px] self-start sm:self-auto">
              Validado FECAP
            </span>
          </div>
          <p className="text-xs text-muted">
            Notas integradas do sistema acadêmico FECAP.
          </p>
        </div>
      </div>

      {/* ── CR Resumo ── */}
      <div
        className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border animate-fade-up"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border-light)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm text-npa">
            <Award className="w-5 h-5 text-npa" />
            <span>Média Ponderada Geral (CR)</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Média oficial computada com base nas disciplinas concluídas.
          </p>
        </div>
        <div
          className="text-center px-5 py-2.5 rounded-xl border shrink-0 w-full sm:w-auto"
          style={{ background: "var(--bg-raised)", borderColor: "var(--border-base)" }}
        >
          <span className="block text-2xl sm:text-3xl font-black text-npa">{mediaPonderadaGeral}</span>
          <span className="text-[10px] text-muted uppercase font-semibold">Nota Média (0-10)</span>
        </div>
      </div>

      {/* ── Boletim ── */}
      <div className="npa-card rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="text-sm font-bold text-head flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-npa" />
            <span>Boletim de Disciplinas FECAP</span>
          </h2>
          <span className="text-xs text-muted font-mono">{historico.length} Matérias</span>
        </div>

        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border-light)" }}>
          <table className="w-full text-left text-xs min-w-[480px] npa-table">
            <thead>
              <tr>
                <th className="p-3">Disciplina / Matéria</th>
                <th className="p-3">Semestre</th>
                <th className="p-3 text-center">Nota Final (0-10)</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border-light)" }}>
              {historico.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-bold text-head flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-npa shrink-0" />
                    <span>{item.materia}</span>
                  </td>
                  <td className="p-3 font-mono text-muted">{item.semestre}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg border ${
                        item.nota >= 8.5
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : item.nota >= 7.0
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      }`}
                    >
                      {item.nota.toFixed(1)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="npa-badge text-[10px]">
                      <FileCheck className="w-3 h-3" />
                      Validado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Soft Skills ── */}
      <form onSubmit={handleSalvar} className="space-y-6">
        <div className="npa-card rounded-2xl p-5 space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-head flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-npa" />
              <span>Competências Comportamentais (Soft Skills)</span>
            </h2>
            <p className="text-xs text-muted">
              Selecione suas habilidades interpessoais para cruzamento com os requisitos de vagas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(Object.keys(SOFT_SKILLS_LABELS) as (keyof SoftSkills)[]).map((key) => {
              const active = softSkillsState[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleSkill(key)}
                  className="p-3 rounded-xl border flex items-center justify-between transition-all"
                  style={
                    active
                      ? { background: "rgba(0,74,48,0.08)", borderColor: "rgba(0,74,48,0.25)", color: "#004A30" }
                      : { background: "var(--bg-sunken)", borderColor: "var(--border-light)", color: "var(--text-muted)" }
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center border shrink-0 text-white font-bold"
                      style={active ? { background: "#004A30", borderColor: "#004A30" } : { borderColor: "var(--border-strong)" }}
                    >
                      {active && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-semibold">{SOFT_SKILLS_LABELS[key]}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            type="submit"
            className="npa-btn-primary w-full sm:w-auto justify-center py-3 rounded-xl text-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Salvar Preferências Comportamentais</span>
          </button>
        </div>
      </form>

    </main>
  );
}
