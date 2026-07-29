"use client";

import React, { useState, useMemo } from "react";
import { 
  Briefcase, 
  Search, 
  Award, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  X, 
  UserCheck, 
  MessageSquare, 
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
  Mail,
  ChevronRight
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { rankAlunosParaVaga } from "@/lib/match";
import { MatchResult, SOFT_SKILLS_LABELS, HARD_SKILLS_LABELS } from "@/types/talent";

export default function RecruiterDashboardPage() {
  const { alunos, vagas } = useTalent();

  // Vaga selecionada
  const [selectedVagaId, setSelectedVagaId] = useState<string>(vagas[0]?.id || "");
  
  // Modal de Detalhes do Aluno
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [cursoFilter, setCursoFilter] = useState("TODOS");
  const [apenasSoftsAtendidas, setApenasSoftsAtendidas] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState(0);

  const currentVaga = useMemo(() => {
    return vagas.find((v) => v.id === selectedVagaId) || vagas[0];
  }, [vagas, selectedVagaId]);

  // Executa o algoritmo de match e aplica os filtros do recrutador
  const rankedMatches = useMemo(() => {
    if (!currentVaga) return [];

    let results = rankAlunosParaVaga(alunos, currentVaga);

    // Filtro por nome / e-mail
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (m) =>
          m.aluno.nome.toLowerCase().includes(q) ||
          m.aluno.email.toLowerCase().includes(q) ||
          m.aluno.curso.toLowerCase().includes(q)
      );
    }

    // Filtro por curso
    if (cursoFilter !== "TODOS") {
      results = results.filter((m) => m.aluno.curso === cursoFilter);
    }

    // Filtro por Soft Skills 100%
    if (apenasSoftsAtendidas) {
      results = results.filter((m) => m.passouSoftSkills);
    }

    // Filtro por Score Mínimo
    if (minMatchScore > 0) {
      results = results.filter((m) => m.scoreFinal >= minMatchScore);
    }

    return results;
  }, [alunos, currentVaga, searchQuery, cursoFilter, apenasSoftsAtendidas, minMatchScore]);

  const cursosDisponiveis = useMemo(() => {
    const set = new Set(alunos.map((a) => a.curso));
    return Array.from(set);
  }, [alunos]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Painel do Recrutador</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Ranking de Candidatos por Vaga</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Algoritmo inteligente de match FECAP ordenando os melhores perfis para cada oportunidade.
          </p>
        </div>

        {/* Stats Badge */}
        <div className="flex items-center space-x-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Candidatos no Ranking</p>
            <p className="text-lg font-bold text-teal-400">{rankedMatches.length} de {alunos.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
            <UserCheck className="w-5 h-5 text-teal-400" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Vaga Selector & Filters / Right Column Student Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* Left Column (4 cols): Vaga Selection & Filters */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Vaga Selector Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-teal-400" />
              <span>1. Selecionar Vaga Corporativa</span>
            </h2>

            <div className="space-y-2">
              {vagas.map((v) => {
                const isSelected = v.id === currentVaga.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVagaId(v.id)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all border ${
                      isSelected
                        ? "bg-teal-500/15 border-teal-500/50 text-white shadow-md shadow-teal-500/5"
                        : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-teal-300">
                        {v.tipoContrato}
                      </span>
                      {isSelected && <Sparkles className="w-3.5 h-3.5 text-teal-400" />}
                    </div>
                    <p className="font-bold text-sm text-white line-clamp-1">{v.titulo}</p>
                    <p className="text-xs text-slate-400">{v.empresa}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vaga Details Summary */}
          {currentVaga && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Requisitos da Vaga Selecionada
              </h3>
              <p className="text-xs text-slate-400">{currentVaga.descricao}</p>
              
              <div>
                <span className="text-[11px] font-semibold text-amber-400 block mb-1">
                  Soft Skills Obrigatórias (Filtro):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentVaga.requisitosSoftSkills.map((sk) => (
                    <span key={sk} className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {SOFT_SKILLS_LABELS[sk]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-teal-400 block mb-1">
                  Pesos de Hard Skills (0 a 5):
                </span>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                  {Object.entries(currentVaga.pesosHardSkills).map(([cat, peso]) => (
                    <div key={cat} className="flex justify-between px-2 py-1 bg-slate-950 rounded">
                      <span className="capitalize">{cat}:</span>
                      <span className="font-bold text-teal-400">Peso {peso}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Filter Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-400" />
              <span>Filtros do Ranking</span>
            </h2>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Buscar por candidato ou e-mail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Curso Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Filtrar por Curso FECAP</label>
              <select
                value={cursoFilter}
                onChange={(e) => setCursoFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="TODOS">Todos os Cursos</option>
                {cursosDisponiveis.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Checkbox Soft Skills */}
            <label className="flex items-center space-x-3 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={apenasSoftsAtendidas}
                onChange={(e) => setApenasSoftsAtendidas(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 accent-teal-500 bg-slate-950"
              />
              <span>Exibir apenas alunos com 100% das Soft Skills atendidas</span>
            </label>

            {/* Slider Min Score */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Score Mínimo:</span>
                <span className="font-bold text-teal-400">{minMatchScore}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                step={10}
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>

          </div>

        </div>

        {/* Right Column (8 cols): Candidate Match Ranking List */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-teal-400" />
              <span>Ranking Ordenado de Alunos ({rankedMatches.length})</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Ordenado por % de Match
            </span>
          </div>

          {rankedMatches.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-semibold">Nenhum candidato atende aos filtros atuais.</p>
              <p className="text-xs text-slate-500">Tente reduzir o filtro de score mínimo ou selecione outro curso.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rankedMatches.map((match, rankIndex) => {
                const { aluno, scoreFinal, passouSoftSkills, softSkillsFaltantes } = match;

                // Definir cor do badge baseado no scoreFinal
                let scoreColorBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
                if (scoreFinal < 50 || !passouSoftSkills) {
                  scoreColorBg = "bg-rose-500/10 text-rose-400 border-rose-500/30";
                } else if (scoreFinal < 75) {
                  scoreColorBg = "bg-amber-500/10 text-amber-400 border-amber-500/30";
                }

                return (
                  <div
                    key={aluno.id}
                    onClick={() => setSelectedMatch(match)}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-teal-500/5 group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    
                    {/* Candidate Info */}
                    <div className="flex items-center space-x-4">
                      {/* Rank Position Badge */}
                      <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center font-bold text-xs text-slate-400 border border-slate-800 shrink-0">
                        #{rankIndex + 1}
                      </div>

                      {/* Avatar */}
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-700 shrink-0">
                        <img
                          src={aluno.avatarUrl}
                          alt={aluno.nome}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-white text-base group-hover:text-teal-400 transition-colors">
                            {aluno.nome}
                          </h3>
                          {passouSoftSkills ? (
                            <span title="Todas as soft skills exigidas foram atendidas" className="inline-flex">
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            </span>
                          ) : (
                            <span title="Soft skills obrigatórias faltantes - Penalizado" className="inline-flex">
                              <ShieldAlert className="w-4 h-4 text-rose-400" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          {aluno.curso} &bull; {aluno.semestre}º Semestre FECAP
                        </p>

                        {/* Warning if missing soft skills */}
                        {!passouSoftSkills && softSkillsFaltantes.length > 0 && (
                          <p className="text-[11px] text-rose-400 font-medium mt-1 flex items-center space-x-1">
                            <span>⚠ Falta soft skill:</span>
                            <span className="font-semibold">
                              {softSkillsFaltantes.map((s) => SOFT_SKILLS_LABELS[s]).join(", ")}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Match Score & CTA */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0">
                      
                      <div className="text-left sm:text-right">
                        <div className={`px-3 py-1 rounded-xl text-sm font-extrabold border ${scoreColorBg} inline-flex items-center space-x-1`}>
                          <span>{scoreFinal}% Match</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Hard: {match.hardSkillScore}% | Soft: {match.softSkillScore}%
                        </p>
                      </div>

                      <button className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 group-hover:bg-teal-500 group-hover:text-slate-950 font-bold text-xs flex items-center space-x-1 transition-all">
                        <span>Ver Perfil</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* STUDENT DETAILS MODAL / DRAWER */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative text-white">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedMatch(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Candidate Header */}
            <div className="flex items-center space-x-4 border-b border-slate-800 pb-5">
              <img
                src={selectedMatch.aluno.avatarUrl}
                alt={selectedMatch.aluno.nome}
                className="w-16 h-16 rounded-full border-2 border-teal-500 object-cover shadow-lg"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-extrabold text-white">{selectedMatch.aluno.nome}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${selectedMatch.scoreFinal >= 75 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                    {selectedMatch.scoreFinal}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedMatch.aluno.curso} ({selectedMatch.aluno.semestre}º Semestre) &bull; {selectedMatch.aluno.email}
                </p>
              </div>
            </div>

            {/* Soft Skills Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Avaliação de Soft Skills (Requisitos da Vaga)</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(SOFT_SKILLS_LABELS) as (keyof typeof SOFT_SKILLS_LABELS)[]).map((key) => {
                  const isRequired = currentVaga.requisitosSoftSkills.includes(key);
                  const hasSkill = selectedMatch.aluno.softSkills[key];

                  return (
                    <div
                      key={key}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${
                        hasSkill
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : isRequired
                          ? "bg-rose-500/10 border-rose-500/40 text-rose-300 font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-500"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {hasSkill ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                        <span>{SOFT_SKILLS_LABELS[key]}</span>
                      </div>
                      {isRequired && (
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 border border-amber-500/20">
                          Requerida
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hard Skills Progress Bars */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center space-x-2">
                <Award className="w-4 h-4 text-teal-400" />
                <span>Notas de Hard Skills por Categoria</span>
              </h3>

              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {Object.entries(selectedMatch.aluno.hardSkills).map(([cat, score]) => {
                  const pesoVaga = currentVaga.pesosHardSkills[cat as keyof typeof currentVaga.pesosHardSkills] || 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-300">{HARD_SKILLS_LABELS[cat as keyof typeof HARD_SKILLS_LABELS]}:</span>
                        <span className="text-slate-400">
                          Nota: <strong className="text-white">{score}/100</strong> (Peso na Vaga: <strong className="text-teal-400">{pesoVaga}x</strong>)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teacher Feedback Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Feedbacks Oficiais dos Professores FECAP</span>
              </h3>

              <div className="space-y-2">
                {selectedMatch.aluno.feedbacksProfessores.map((feedback, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start space-x-3">
                    <GraduationCap className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <p className="italic">{feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => setSelectedMatch(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Fechar
              </button>

              <button
                onClick={() => {
                  alert(`Convite de entrevista enviado com sucesso para ${selectedMatch.aluno.email}!`);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-teal-500/20"
              >
                <Mail className="w-4 h-4 text-slate-950" />
                <span>Convidar para Entrevista</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
