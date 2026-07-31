"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase, Search, CheckCircle2, ArrowLeft,
  Send, XCircle, Building2, ChevronDown, Loader2
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { calculateMatchScore } from "@/lib/match";
import { SOFT_SKILLS_LABELS } from "@/types/talent";

/* ── Barra de match colorida ───────────────────── */
function MatchBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "#004A30" :
    score >= 60 ? "#006944" :
    "#92400e";
  const bg =
    score >= 80 ? "rgba(0,74,48,0.1)" :
    score >= 60 ? "rgba(0,105,68,0.1)" :
    "var(--amber-bg)";
  const border =
    score >= 80 ? "rgba(0,74,48,0.25)" :
    score >= 60 ? "rgba(0,105,68,0.25)" :
    "var(--amber-border)";
  return (
    <div
      className="px-3 py-2 rounded-xl border text-center shrink-0 min-w-[60px]"
      style={{ background: bg, borderColor: border }}
    >
      <span className="text-[9px] block font-bold uppercase tracking-wider" style={{ color }}>Match</span>
      <span className="text-base font-black" style={{ color }}>{score}%</span>
    </div>
  );
}

export default function StudentVagasPage() {
  const { currentAluno, vagas, candidaturas, candidatarAVaga, cancelarCandidatura } = useTalent();

  const [activeTab, setActiveTab] = useState<"todas" | "minhas">("todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [contratoFilter, setContratoFilter] = useState("TODOS");
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const vagasAtivas = useMemo(
    () => vagas.filter((v) => v.status === "aprovada" || (v.status as any) === "APROVADA"),
    [vagas]
  );

  const appliedVagaIds = useMemo(
    () => new Set(candidaturas.map((c) => c.vagaId)),
    [candidaturas]
  );

  const displayedVagas = useMemo(() => {
    let list = vagasAtivas;
    if (activeTab === "minhas") list = list.filter((v) => appliedVagaIds.has(v.id));
    if (contratoFilter !== "TODOS") list = list.filter((v) => v.tipoContrato === contratoFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (v) =>
          v.titulo.toLowerCase().includes(q) ||
          v.empresa.toLowerCase().includes(q) ||
          v.descricao.toLowerCase().includes(q) ||
          v.localizacao.toLowerCase().includes(q)
      );
    }
    return list;
  }, [vagasAtivas, activeTab, appliedVagaIds, contratoFilter, searchQuery]);

  const handleCandidatar = async (vagaId: string, score: number, titulo: string) => {
    try {
      setIsSubmitting(vagaId);
      const ok = await candidatarAVaga(vagaId, score);
      if (ok) alert(`Candidatura enviada para "${titulo}"!`);
      else alert("Não foi possível enviar. Tente novamente.");
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleCancelar = async (vagaId: string, titulo: string) => {
    if (confirm(`Cancelar candidatura para "${titulo}"?`)) {
      try {
        setIsSubmitting(vagaId);
        await cancelarCandidatura(vagaId);
      } finally {
        setIsSubmitting(null);
      }
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">

      {/* ── Header banner ── */}
      <div
        className="rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border animate-fade-up"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border-light)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="space-y-1 flex-1 min-w-0">
          <div className="npa-badge inline-flex">
            <Briefcase className="w-3 h-3" />
            Vagas Corporativas
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-head leading-tight">
            Painel de Vagas & Match
          </h1>
          <p className="text-xs text-muted leading-relaxed">
            Explore posições abertas, veja seu % de Match em tempo real e candidate-se em 1 clique.
          </p>
        </div>

        <div
          className="flex items-center gap-3 rounded-xl p-3 border shrink-0 self-start sm:self-auto"
          style={{ background: "var(--bg-raised)", borderColor: "var(--border-base)" }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(0,74,48,0.1)", border: "1px solid rgba(0,74,48,0.2)" }}
          >
            <Send className="w-4 h-4 text-npa" />
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase font-bold tracking-wider">Candidaturas</p>
            <p className="text-xl font-black text-npa">{candidaturas.length}</p>
          </div>
        </div>
      </div>

      {/* ── Tabs + Filtros ── */}
      <div
        className="flex flex-col gap-3 pb-4"
        style={{ borderBottom: "1px solid var(--border-light)" }}
      >
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: "todas" as const, label: `Vagas Abertas (${vagasAtivas.length})`, icon: Building2 },
            { id: "minhas" as const, label: `Minhas Candidaturas (${candidaturas.length})`, icon: CheckCircle2 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap shrink-0"
              style={
                activeTab === id
                  ? { background: "rgba(0,74,48,0.08)", color: "#004A30", borderColor: "rgba(0,74,48,0.25)" }
                  : { background: "var(--bg-raised)", color: "var(--text-muted)", borderColor: "var(--border-light)" }
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Search + Filtro contrato */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5" style={{ color: "var(--text-subtle)" }} />
            <input
              type="text"
              placeholder="Buscar por título, empresa…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="npa-input pl-10 w-full"
            />
          </div>
          <div className="relative">
            <select
              value={contratoFilter}
              onChange={(e) => setContratoFilter(e.target.value)}
              className="npa-select pr-8 w-full sm:w-auto"
            >
              <option value="TODOS">Todos os Contratos</option>
              <option value="Estágio">Estágio</option>
              <option value="Júnior">Júnior</option>
              <option value="Trainee">Trainee</option>
              <option value="Pleno">Pleno</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 pointer-events-none" style={{ color: "var(--text-subtle)" }} />
          </div>
        </div>
      </div>

      {/* ── Lista de vagas ── */}
      {displayedVagas.length === 0 ? (
        <div
          className="p-10 text-center npa-card rounded-2xl space-y-3"
        >
          <Briefcase className="w-10 h-10 mx-auto" style={{ color: "var(--text-subtle)" }} strokeWidth={1} />
          <h3 className="text-base font-bold text-head">Nenhuma vaga encontrada</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            {activeTab === "minhas"
              ? "Você ainda não se candidatou a nenhuma vaga. Explore as vagas abertas!"
              : "Nenhuma vaga ativa com os filtros selecionados."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {displayedVagas.map((vaga) => {
            const matchResult = currentAluno
              ? calculateMatchScore(currentAluno, vaga)
              : { scoreFinal: 0, softSkillsFaltantes: [], materiasAtendidas: [], softSkillsValidadas: [], hardScore: 0, softScore: 0 };

            const isApplied = appliedVagaIds.has(vaga.id);
            const score = matchResult.scoreFinal;

            return (
              <div
                key={vaga.id}
                className="npa-card rounded-2xl p-5 space-y-4 flex flex-col justify-between"
              >
                {/* Cabeçalho */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded"
                          style={{ background: "var(--bg-sunken)", color: "var(--text-muted)", border: "1px solid var(--border-light)" }}
                        >
                          {vaga.tipoContrato}
                        </span>
                        <span className="text-[11px] text-muted">{vaga.localizacao}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-head leading-snug">{vaga.titulo}</h3>
                      <p className="text-xs font-semibold text-npa">{vaga.empresa}</p>
                    </div>
                    <MatchBadge score={score} />
                  </div>

                  <p className="text-xs text-body leading-relaxed line-clamp-3">{vaga.descricao}</p>

                  {/* Soft skills exigidas */}
                  {vaga.requisitosSoftSkills && vaga.requisitosSoftSkills.length > 0 && (
                    <div
                      className="p-3 rounded-xl space-y-1.5"
                      style={{ background: "var(--amber-bg)", border: "1px solid var(--amber-border)" }}
                    >
                      <span className="text-[10px] uppercase font-bold" style={{ color: "var(--amber-text)" }}>
                        Soft Skills Exigidas:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {vaga.requisitosSoftSkills.map((sk) => (
                          <span
                            key={sk}
                            className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: "rgba(146,64,14,0.08)", color: "var(--amber-text)", border: "1px solid var(--amber-border)" }}
                          >
                            {SOFT_SKILLS_LABELS[sk as keyof typeof SOFT_SKILLS_LABELS] || sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pontos faltantes */}
                  {matchResult.softSkillsFaltantes && matchResult.softSkillsFaltantes.length > 0 && (
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: "var(--red-bg)", border: "1px solid var(--red-border)" }}
                    >
                      <span className="text-[10px] uppercase font-bold block mb-1" style={{ color: "var(--red-text)" }}>
                        Pontos a desenvolver:
                      </span>
                      <p className="text-[11px] leading-tight" style={{ color: "var(--red-text)" }}>
                        {matchResult.softSkillsFaltantes.join(", ")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div
                  className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 pt-3"
                  style={{ borderTop: "1px solid var(--border-light)" }}
                >
                  <span className="text-[11px] text-subtle">Publicada em {vaga.dataCriacao}</span>

                  {isApplied ? (
                    <div className="flex items-center gap-2 w-full xs:w-auto">
                      <span
                        className="flex-1 xs:flex-none px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                        style={{ background: "rgba(0,74,48,0.08)", border: "1px solid rgba(0,74,48,0.25)", color: "#004A30" }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Candidatado
                      </span>
                      <button
                        onClick={() => handleCancelar(vaga.id, vaga.titulo)}
                        disabled={isSubmitting === vaga.id}
                        className="npa-btn-ghost px-3 py-2 rounded-xl text-xs"
                        title="Cancelar candidatura"
                        style={{ color: "var(--red-text)" }}
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCandidatar(vaga.id, score, vaga.titulo)}
                      disabled={isSubmitting === vaga.id}
                      className="npa-btn-primary w-full xs:w-auto justify-center rounded-xl text-xs py-2.5 disabled:opacity-50"
                    >
                      {isSubmitting === vaga.id ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Enviando…</>
                      ) : (
                        <><Send className="w-4 h-4" /> Candidatar-me</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
