"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase, Search, Award, ShieldCheck, CheckCircle2,
  X, UserCheck, MessageSquare, SlidersHorizontal,
  ArrowLeft, FileCheck, BookOpen, ChevronRight
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { rankAlunosParaVaga } from "@/lib/match";
import { MatchResult, Aluno } from "@/types/talent";
import { ChatDrawer } from "@/components/ChatDrawer";

export default function FiltragemTalentosEmpresaPage() {
  const { alunos, vagas } = useTalent();

  const vagasAprovadas = useMemo(() => {
    if (!vagas || vagas.length === 0) return [];
    const filtered = vagas.filter(
      (v) => v.status === "aprovada" || (v.status as string)?.toUpperCase() === "APROVADA"
    );
    return filtered.length > 0 ? filtered : vagas;
  }, [vagas]);

  const [selectedVagaId, setSelectedVagaId] = useState<string>("");
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [chatAluno, setChatAluno] = useState<Aluno | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [cursoFilter, setCursoFilter] = useState("TODOS");
  const [apenasSoftsAtendidas, setApenasSoftsAtendidas] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState(0);

  const currentVaga = useMemo(() => {
    if (selectedVagaId) {
      const found = vagasAprovadas.find((v) => v.id === selectedVagaId);
      if (found) return found;
    }
    return vagasAprovadas[0] || vagas[0];
  }, [vagasAprovadas, vagas, selectedVagaId]);

  React.useEffect(() => {
    if (!selectedVagaId && vagasAprovadas.length > 0) {
      setSelectedVagaId(vagasAprovadas[0].id);
    }
  }, [vagasAprovadas, selectedVagaId]);

  const rankedMatches = useMemo(() => {
    if (!currentVaga) return [];
    let results = rankAlunosParaVaga(alunos, currentVaga);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (m) =>
          m.aluno.nome.toLowerCase().includes(q) ||
          m.aluno.ra.toLowerCase().includes(q) ||
          m.aluno.email.toLowerCase().includes(q) ||
          m.aluno.curso.toLowerCase().includes(q)
      );
    }
    if (cursoFilter !== "TODOS") results = results.filter((m) => m.aluno.curso === cursoFilter);
    if (apenasSoftsAtendidas) results = results.filter((m) => m.passouSoftSkills);
    if (minMatchScore > 0) results = results.filter((m) => m.scoreFinal >= minMatchScore);

    return results;
  }, [alunos, currentVaga, searchQuery, cursoFilter, apenasSoftsAtendidas, minMatchScore]);

  const cursosDisponiveis = useMemo(() => {
    const setC = new Set(alunos.map((a) => a.curso));
    return Array.from(setC);
  }, [alunos]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">

      {/* ── Header ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4 animate-fade-up"
        style={{ borderBottom: "1px solid var(--border-light)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/empresa" className="npa-btn-ghost p-2 rounded-xl shrink-0" aria-label="Voltar">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <div className="npa-badge inline-flex mb-1">
              <UserCheck className="w-3 h-3" />
              Ranking por Match
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-head leading-tight">
              Ranking de Candidatos por Vaga
            </h1>
            <p className="text-xs text-muted">
              Candidatos ordenados por compatibilidade técnica e comportamental.
            </p>
          </div>
        </div>
      </div>

      {vagasAprovadas.length === 0 ? (
        <div className="npa-card rounded-2xl p-8 text-center space-y-3">
          <Briefcase className="w-10 h-10 mx-auto" style={{ color: "var(--text-subtle)" }} strokeWidth={1} />
          <h3 className="text-base font-bold text-head">Nenhuma vaga ativa encontrada</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Cadastre uma nova vaga para que o algoritmo ordene os melhores candidatos.
          </p>
          <Link href="/empresa/campanhas/nova" className="npa-btn-primary inline-flex text-xs rounded-xl">
            Criar Nova Vaga
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Coluna esquerda: Vaga & Filtros ── */}
          <div className="lg:col-span-4 space-y-5">
            {/* Seletor de Vaga */}
            <div className="npa-card rounded-2xl p-5 space-y-3">
              <label className="block text-xs font-bold text-npa uppercase tracking-wider">
                Selecione a Vaga
              </label>
              <select
                value={selectedVagaId}
                onChange={(e) => setSelectedVagaId(e.target.value)}
                className="npa-select"
              >
                {vagasAprovadas.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.titulo} ({v.tipoContrato})
                  </option>
                ))}
              </select>

              {currentVaga && (
                <div className="pt-2 text-xs space-y-1.5" style={{ borderTop: "1px solid var(--border-light)" }}>
                  <p className="font-semibold text-head">{currentVaga.empresa} &bull; {currentVaga.localizacao}</p>
                  <p className="text-muted line-clamp-2">{currentVaga.descricao}</p>
                </div>
              )}
            </div>

            {/* Filtros */}
            <div className="npa-card rounded-2xl p-5 space-y-4">
              <h2 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-npa" />
                <span>Refinar Ranking</span>
              </h2>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5" style={{ color: "var(--text-subtle)" }} />
                <input
                  type="text"
                  placeholder="Nome, RA, curso..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="npa-input pl-10"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase mb-1">Curso</label>
                <select value={cursoFilter} onChange={(e) => setCursoFilter(e.target.value)} className="npa-select">
                  <option value="TODOS">Todos os Cursos</option>
                  {cursosDisponiveis.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 pt-2" style={{ borderTop: "1px solid var(--border-light)" }}>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-muted uppercase">Match Mínimo</span>
                  <span className="font-mono font-bold text-npa">{minMatchScore}%</span>
                </div>
                <input
                  type="range" min={0} max={100} step={5}
                  value={minMatchScore}
                  onChange={(e) => setMinMatchScore(Number(e.target.value))}
                  className="w-full" style={{ accentColor: "#004A30" }}
                />
              </div>

              <label className="flex items-center gap-2 text-xs cursor-pointer pt-1" style={{ color: "var(--amber-text)" }}>
                <input
                  type="checkbox"
                  checked={apenasSoftsAtendidas}
                  onChange={(e) => setApenasSoftsAtendidas(e.target.checked)}
                  className="rounded"
                />
                <span>Apenas Soft Skills 100% Atendidas</span>
              </label>

              <button
                onClick={() => {
                  setSearchQuery("");
                  setCursoFilter("TODOS");
                  setApenasSoftsAtendidas(false);
                  setMinMatchScore(0);
                }}
                className="npa-btn-ghost w-full justify-center text-xs rounded-xl"
              >
                Limpar Filtros
              </button>
            </div>
          </div>

          {/* ── Coluna direita: Lista do Ranking ── */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-head flex items-center gap-2">
                <Award className="w-4 h-4 text-npa" />
                <span>Candidatos Ordenados ({rankedMatches.length})</span>
              </h2>
            </div>

            {rankedMatches.length === 0 ? (
              <div className="p-10 text-center npa-card rounded-2xl space-y-2">
                <UserCheck className="w-10 h-10 mx-auto text-subtle" strokeWidth={1} />
                <p className="font-bold text-xs text-head">Nenhum candidato atende aos filtros</p>
                <p className="text-xs text-muted">Tente reduzir o Match mínimo.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rankedMatches.map((match, index) => {
                  const { aluno, scoreFinal, softSkillsFaltantes } = match;
                  const scoreBg =
                    scoreFinal >= 80 ? "rgba(0,74,48,0.1)" :
                    scoreFinal >= 60 ? "rgba(0,105,68,0.1)" :
                    "var(--amber-bg)";
                  const scoreColor =
                    scoreFinal >= 80 ? "#004A30" :
                    scoreFinal >= 60 ? "#006944" :
                    "var(--amber-text)";

                  return (
                    <div
                      key={aluno.id}
                      onClick={() => setSelectedMatch(match)}
                      className="npa-card npa-card-interactive rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div
                          className="w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0"
                          style={{ background: "var(--bg-raised)", color: "var(--text-head)", border: "1px solid var(--border-base)" }}
                        >
                          #{index + 1}
                        </div>

                        <img
                          src={aluno.avatarUrl}
                          alt={aluno.nome}
                          className="w-11 h-11 rounded-xl object-cover shrink-0 border-2"
                          style={{ borderColor: "var(--border-strong)" }}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-head text-sm truncate">{aluno.nome}</h3>
                            <span className="npa-badge text-[10px]">RA: {aluno.ra}</span>
                          </div>
                          <p className="text-xs text-muted truncate">
                            {aluno.curso} &bull; {aluno.semestre}º Semestre
                          </p>
                          {softSkillsFaltantes && softSkillsFaltantes.length > 0 && (
                            <p className="text-[11px] font-medium mt-0.5" style={{ color: "var(--red-text)" }}>
                              ⚠ Falta: {softSkillsFaltantes.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 pt-2 sm:pt-0" style={{ borderTop: "1px solid var(--border-light)" }}>
                        <div
                          className="px-3 py-1 rounded-xl text-xs font-black border"
                          style={{ background: scoreBg, color: scoreColor, borderColor: "var(--border-light)" }}
                        >
                          {scoreFinal}% Match
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setChatAluno({ ...aluno, userId: aluno.userId || aluno.id });
                          }}
                          className="npa-btn-primary px-3 py-1.5 rounded-xl text-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Mensagem</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modal de Detalhes ── */}
      {selectedMatch && currentVaga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative border"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border-base)", boxShadow: "var(--shadow-lg)" }}
          >
            <button
              onClick={() => setSelectedMatch(null)}
              className="absolute top-5 right-5 npa-btn-ghost w-8 h-8 p-0 justify-center rounded-full"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Modal */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4" style={{ borderBottom: "1px solid var(--border-light)" }}>
              <img
                src={selectedMatch.aluno.avatarUrl}
                alt={selectedMatch.aluno.nome}
                className="w-14 h-14 rounded-2xl object-cover shrink-0 border-2"
                style={{ borderColor: "var(--border-strong)" }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-extrabold text-head">{selectedMatch.aluno.nome}</h2>
                  <span className="npa-badge text-[10px]">RA: {selectedMatch.aluno.ra}</span>
                </div>
                <p className="text-xs text-muted mt-0.5">
                  {selectedMatch.aluno.curso} &bull; {selectedMatch.aluno.idade} anos &bull; {selectedMatch.aluno.email}
                </p>
              </div>
            </div>

            {/* Histórico */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-npa uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-npa" />
                <span>Boletim do Histórico Escolar (FECAP)</span>
              </h3>
              <div className="rounded-xl border overflow-x-auto" style={{ background: "var(--bg-raised)", borderColor: "var(--border-light)" }}>
                {!selectedMatch.aluno.historicoAcademico || selectedMatch.aluno.historicoAcademico.length === 0 ? (
                  <p className="text-xs text-muted italic p-4 text-center">Histórico não importado.</p>
                ) : (
                  <table className="w-full text-left text-xs min-w-[400px] npa-table">
                    <thead>
                      <tr>
                        <th>Matéria</th>
                        <th>Semestre</th>
                        <th className="text-center">Nota</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: "var(--border-light)" }}>
                      {selectedMatch.aluno.historicoAcademico.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-semibold text-head">{item.materia}</td>
                          <td className="p-3 font-mono text-muted">{item.semestre}</td>
                          <td className="p-3 text-center">
                            <span className="font-mono font-bold text-npa">{item.nota.toFixed(1)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--amber-text)" }}>
                <ShieldCheck className="w-4 h-4" />
                <span>Competências Comportamentais</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedMatch.aluno.progressosTrilha?.map((progresso) => {
                  const isValidated = progresso.status === "VALIDADO_MENTORIA";
                  const nomeTrilha = (progresso as any).trilha?.nome || progresso.trilhaNome || "Soft Skill";
                  return (
                    <span key={progresso.id || progresso.trilhaNome} className="npa-badge text-[10px]">
                      {nomeTrilha} ({isValidated ? "Validado" : "Aprovado"})
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Documentos */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-npa uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-npa" />
                <span>Pack de Documentos ({selectedMatch.aluno.packDocumentos?.length || 0})</span>
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedMatch.aluno.packDocumentos?.map((doc) => (
                  <span key={doc.id} className="npa-badge text-[10px]">
                    <FileCheck className="w-3 h-3" />
                    {doc.nome}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Modal */}
            <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-2" style={{ borderTop: "1px solid var(--border-light)" }}>
              <button onClick={() => setSelectedMatch(null)} className="npa-btn-ghost justify-center text-xs py-2.5 rounded-xl">
                Fechar
              </button>
              <button
                onClick={() => {
                  if (selectedMatch?.aluno) {
                    const target = { ...selectedMatch.aluno, userId: selectedMatch.aluno.userId || selectedMatch.aluno.id };
                    setSelectedMatch(null);
                    setChatAluno(target);
                  }
                }}
                className="npa-btn-primary justify-center text-xs py-2.5 rounded-xl"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar Mensagem ao Candidato</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT DRAWER LATERAL */}
      <ChatDrawer aluno={chatAluno} onClose={() => setChatAluno(null)} />
    </main>
  );
}
