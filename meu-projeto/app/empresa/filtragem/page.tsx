"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
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
  Mail,
  ChevronRight,
  ArrowLeft,
  FileCheck,
  Building2
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { rankAlunosParaVaga } from "@/lib/match";
import { MatchResult, SOFT_SKILLS_LABELS, HARD_SKILLS_LABELS } from "@/types/talent";

export default function FiltragemTalentosEmpresaPage() {
  const { alunos, vagas } = useTalent();

  // Filtrar apenas vagas APROVADAS pela coordenação Master
  const vagasAprovadas = useMemo(() => {
    return vagas.filter((v) => v.status === "aprovada");
  }, [vagas]);

  const [selectedVagaId, setSelectedVagaId] = useState<string>(vagasAprovadas[0]?.id || "");
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [cursoFilter, setCursoFilter] = useState("TODOS");
  const [apenasSoftsAtendidas, setApenasSoftsAtendidas] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState(0);

  const currentVaga = useMemo(() => {
    return vagasAprovadas.find((v) => v.id === selectedVagaId) || vagasAprovadas[0];
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

    if (cursoFilter !== "TODOS") {
      results = results.filter((m) => m.aluno.curso === cursoFilter);
    }

    if (apenasSoftsAtendidas) {
      results = results.filter((m) => m.passouSoftSkills);
    }

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
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      
      <div className="flex items-center space-x-3">
        <Link href="/empresa" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Filtragem de Talentos por Algoritmo de Match</h1>
          <p className="text-xs text-slate-400">
            Selecione uma vaga aprovada e analise os estudantes FECAP ranqueados.
          </p>
        </div>
      </div>

      {vagasAprovadas.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Nenhuma Vaga Aprovada no Momento</h2>
          <p className="text-xs text-slate-400">
            Suas campanhas precisam ser aprovadas pela Coordenação Master FECAP antes de liberarem o acesso à filtragem de talentos.
          </p>
          <Link
            href="/empresa/campanhas/nova"
            className="inline-block px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
          >
            Abrir Nova Campanha
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (4 cols): Vaga Selector & Filters */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-teal-400" />
                <span>Vagas Aprovadas ({vagasAprovadas.length})</span>
              </h2>

              <div className="space-y-2">
                {vagasAprovadas.map((v) => {
                  const isSelected = v.id === currentVaga?.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVagaId(v.id)}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all border ${
                        isSelected
                          ? "bg-teal-500/15 border-teal-500/50 text-white shadow-md"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-teal-300">
                          {v.tipoContrato}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold">✓ Aprovada</span>
                      </div>
                      <p className="font-bold text-xs text-white line-clamp-1">{v.titulo}</p>
                      <p className="text-[11px] text-slate-400">{v.empresa}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-teal-400" />
                <span>Filtros do Ranking</span>
              </h2>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Nome, RA ou curso..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Filtrar por Curso</label>
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

              <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={apenasSoftsAtendidas}
                  onChange={(e) => setApenasSoftsAtendidas(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 accent-teal-500 bg-slate-950"
                />
                <span>Apenas 100% de Soft Skills atendidas</span>
              </label>
            </div>

          </div>

          {/* Right Column (8 cols): Candidates Ranking */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Award className="w-5 h-5 text-teal-400" />
                <span>Ranking de Candidatos ({rankedMatches.length})</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {currentVaga?.titulo}
              </span>
            </div>

            {rankedMatches.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-slate-300 text-sm font-semibold">Nenhum aluno atende aos filtros atuais.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rankedMatches.map((match, rankIndex) => {
                  const { aluno, scoreFinal, passouSoftSkills, softSkillsFaltantes } = match;

                  let scoreBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
                  if (scoreFinal < 50 || !passouSoftSkills) {
                    scoreBg = "bg-rose-500/10 text-rose-400 border-rose-500/30";
                  } else if (scoreFinal < 75) {
                    scoreBg = "bg-amber-500/10 text-amber-400 border-amber-500/30";
                  }

                  return (
                    <div
                      key={aluno.id}
                      onClick={() => setSelectedMatch(match)}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-7 h-7 rounded-full bg-slate-950 flex items-center justify-center font-bold text-xs text-slate-400 border border-slate-800 shrink-0">
                          #{rankIndex + 1}
                        </div>

                        <img
                          src={aluno.avatarUrl}
                          alt={aluno.nome}
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                        />

                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-white text-sm group-hover:text-teal-400 transition-colors">
                              {aluno.nome}
                            </h3>
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                              RA: {aluno.ra}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {aluno.curso} ({aluno.idade} anos) &bull; {aluno.semestre}º Semestre
                          </p>

                          {!passouSoftSkills && softSkillsFaltantes.length > 0 && (
                            <p className="text-[11px] text-rose-400 font-medium mt-0.5">
                              ⚠ Falta: {softSkillsFaltantes.map(s => SOFT_SKILLS_LABELS[s]).join(", ")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0">
                        <div className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${scoreBg}`}>
                          {scoreFinal}% Match
                        </div>
                        <button className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 group-hover:bg-teal-500 group-hover:text-slate-950 font-bold text-xs flex items-center space-x-1">
                          <span>Perfil</span>
                          <ChevronRight className="w-3.5 h-3.5" />
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

      {/* STUDENT DETAILS MODAL */}
      {selectedMatch && currentVaga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative text-white shadow-2xl">
            
            <button
              onClick={() => setSelectedMatch(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4 border-b border-slate-800 pb-4">
              <img
                src={selectedMatch.aluno.avatarUrl}
                alt={selectedMatch.aluno.nome}
                className="w-16 h-16 rounded-full border-2 border-teal-500 object-cover"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-extrabold text-white">{selectedMatch.aluno.nome}</h2>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    RA: {selectedMatch.aluno.ra}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {selectedMatch.aluno.curso} &bull; {selectedMatch.aluno.idade} anos &bull; {selectedMatch.aluno.email}
                </p>
              </div>
            </div>

            {/* Hard Skills Progress */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Notas de Hard Skills vs Pesos da Vaga
              </h3>
              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {Object.entries(selectedMatch.aluno.hardSkills).map(([cat, score]) => {
                  const peso = currentVaga.pesosHardSkills[cat as keyof typeof currentVaga.pesosHardSkills] || 0;
                  return (
                    <div key={cat} className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-300">{HARD_SKILLS_LABELS[cat as keyof typeof HARD_SKILLS_LABELS]}:</span>
                        <span>Nota: <strong>{score}/100</strong> (Peso {peso}x)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full" style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teacher Feedback */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Feedbacks dos Professores FECAP</span>
              </h3>
              <div className="space-y-2">
                {selectedMatch.aluno.feedbacksProfessores.map((fb, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs italic text-slate-300">
                    &quot;{fb}&quot;
                  </div>
                ))}
              </div>
            </div>

            {/* Document Pack */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Pack de Documentos Acadêmicos ({selectedMatch.aluno.packDocumentos?.length || 0})</span>
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedMatch.aluno.packDocumentos?.map((doc) => (
                  <span key={doc.id} className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center space-x-1">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{doc.nome}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => setSelectedMatch(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Fechar
              </button>
              <button
                onClick={() => alert(`Convite de entrevista enviado para ${selectedMatch.aluno.email} (RA ${selectedMatch.aluno.ra})!`)}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 text-xs font-bold flex items-center space-x-2"
              >
                <Mail className="w-4 h-4 text-slate-950" />
                <span>Enviar Convite de Entrevista</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
