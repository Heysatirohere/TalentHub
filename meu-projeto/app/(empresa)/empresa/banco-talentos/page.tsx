"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  SlidersHorizontal, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Mail, 
  ArrowLeft, 
  MessageSquare, 
  FileCheck, 
  Building2, 
  Sparkles,
  BookOpen,
  Award
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { Aluno, SoftSkills, SOFT_SKILLS_LABELS } from "@/types/talent";
import { ChatDrawer } from "@/components/ChatDrawer";

export default function BancoTalentosBuscaAtivaPage() {
  const { alunos } = useTalent();

  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [chatAluno, setChatAluno] = useState<Aluno | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [cursoFilter, setCursoFilter] = useState("TODOS");

  // Selected Soft Skills required
  const [requiredSoftSkills, setRequiredSoftSkills] = useState<Record<keyof SoftSkills, boolean>>({
    comunicacao: false,
    trabalhoEmEquipe: false,
    lideranca: false,
    resolucaoProblemas: false,
    adaptabilidade: false,
    pensamentoCritico: false,
  });

  const [minNotaMateria, setMinNotaMateria] = useState<number>(0);

  const toggleSoftSkillFilter = (key: keyof SoftSkills) => {
    setRequiredSoftSkills((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filter students pro-actively
  const filteredAlunos = useMemo(() => {
    return alunos.filter((aluno) => {
      // 1. Keyword search (Nome, RA, Email, Curso, Disciplinas do Histórico)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = aluno.nome.toLowerCase().includes(q);
        const matchRa = aluno.ra.toLowerCase().includes(q);
        const matchEmail = aluno.email.toLowerCase().includes(q);
        const matchCurso = aluno.curso.toLowerCase().includes(q);
        const matchMateria = aluno.historicoAcademico?.some((h) => h.materia.toLowerCase().includes(q));
        if (!matchName && !matchRa && !matchEmail && !matchCurso && !matchMateria) return false;
      }

      // 2. Curso filter
      if (cursoFilter !== "TODOS" && aluno.curso !== cursoFilter) {
        return false;
      }

      // 3. Mandatory Soft Skills
      const reqKeys = (Object.keys(requiredSoftSkills) as (keyof SoftSkills)[]).filter(
        (k) => requiredSoftSkills[k]
      );
      for (const k of reqKeys) {
        if (!aluno.softSkills?.[k]) return false;
      }

      // 4. Média Mínima Acadêmica
      if (minNotaMateria > 0) {
        const mediaGeral = aluno.historicoAcademico && aluno.historicoAcademico.length > 0
          ? aluno.historicoAcademico.reduce((acc, h) => acc + h.nota, 0) / aluno.historicoAcademico.length
          : 0;
        if (mediaGeral < minNotaMateria) return false;
      }

      return true;
    });
  }, [alunos, searchQuery, cursoFilter, requiredSoftSkills, minNotaMateria]);

  const cursosDisponiveis = useMemo(() => {
    const set = new Set(alunos.map((a) => a.curso));
    return Array.from(set);
  }, [alunos]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/empresa" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Busca Ativa & Prospecção por Histórico Real</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Banco de Talentos Universitários FECAP</h1>
            <p className="text-slate-400 text-sm">
              Explore perfis acadêmicos com notas reais do histórico da faculdade e validação institucional.
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center space-x-3 bg-slate-900 p-3 rounded-2xl border border-slate-800 self-start md:self-auto">
          <div className="text-right">
            <p className="text-xs text-slate-400">Talentos Encontrados</p>
            <p className="text-lg font-bold text-teal-400">{filteredAlunos.length} de {alunos.length}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar (4 cols) & Candidates Grid (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (4 cols): Multi-filter Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-5 shadow-xl">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-400" />
              <span>Filtros Proativos de Prospecção</span>
            </h2>

            {/* Keyword Search */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Palavra-chave / Matéria / RA / Nome
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Ex: Cybersecurity, Lucas, 26028671..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Curso Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Filtrar por Curso FECAP
              </label>
              <select
                value={cursoFilter}
                onChange={(e) => setCursoFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="TODOS">Todos os Cursos</option>
                {cursosDisponiveis.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Média Mínima Acadêmica */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-semibold text-slate-300 uppercase">Média Mínima do Histórico (CR)</span>
                <span className="font-mono font-bold text-teal-400">{minNotaMateria > 0 ? `${minNotaMateria.toFixed(1)} / 10` : "Qualquer Média"}</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={minNotaMateria}
                onChange={(e) => setMinNotaMateria(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>

            {/* Soft Skills Mandatory Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                Exigir Soft Skills Obrigatórias
              </label>
              <div className="space-y-1.5">
                {(Object.keys(SOFT_SKILLS_LABELS) as (keyof SoftSkills)[]).map((key) => {
                  const isChecked = requiredSoftSkills[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleSoftSkillFilter(key)}
                      className={`w-full p-2 rounded-xl border text-left text-xs flex items-center justify-between transition-all ${
                        isChecked
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-300 font-semibold"
                          : "bg-slate-950 border-slate-800/80 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>{SOFT_SKILLS_LABELS[key]}</span>
                      <span className="text-[10px] font-mono">{isChecked ? "✓ Exigida" : "Opcional"}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSearchQuery("");
                setCursoFilter("TODOS");
                setMinNotaMateria(0);
                setRequiredSoftSkills({
                  comunicacao: false,
                  trabalhoEmEquipe: false,
                  lideranca: false,
                  resolucaoProblemas: false,
                  adaptabilidade: false,
                  pensamentoCritico: false,
                });
              }}
              className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold border border-slate-800 transition-colors"
            >
              Limpar Todos os Filtros
            </button>

          </div>

        </div>

        {/* Right Column (8 cols): Candidates Grid */}
        <div className="lg:col-span-8 space-y-4">
          
          {filteredAlunos.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">Nenhum aluno atende aos critérios selecionados</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Tente afrouxar as soft skills exigidas ou reduzir a média mínima do histórico escolar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAlunos.map((aluno) => {
                const historico = aluno.historicoAcademico || [];
                const mediaGeral = historico.length > 0
                  ? (historico.reduce((acc, h) => acc + h.nota, 0) / historico.length).toFixed(1)
                  : "N/A";

                return (
                  <div
                    key={aluno.id}
                    onClick={() => setSelectedAluno(aluno)}
                    className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-5 space-y-4 cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-teal-500/5 group flex flex-col justify-between"
                  >
                    
                    {/* Top Row: Avatar & Info */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={aluno.avatarUrl}
                          alt={aluno.nome}
                          className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 shrink-0"
                        />
                        <div>
                          <h3 className="font-bold text-white text-sm group-hover:text-teal-400 transition-colors">
                            {aluno.nome}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {aluno.curso} &bull; {aluno.semestre}º Semestre
                          </p>
                          <span className="inline-block text-[10px] font-mono font-semibold text-teal-300 mt-0.5">
                            RA: {aluno.ra}
                          </span>
                        </div>
                      </div>

                      {/* Summary of Academic Transcript */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-semibold flex items-center space-x-1">
                            <Award className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Média Ponderada (CR):</span>
                          </span>
                          <span className="font-mono font-bold text-emerald-400 text-sm">{mediaGeral}</span>
                        </div>

                        {/* Top 2 materias */}
                        <div className="space-y-1 pt-1 border-t border-slate-800/60">
                          {historico.slice(0, 2).map((h, i) => (
                            <div key={i} className="flex justify-between text-[11px] text-slate-300">
                              <span className="truncate pr-2">{h.materia}</span>
                              <span className="font-mono font-bold text-teal-300">{h.nota.toFixed(1)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status & CTA */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <FileCheck className="w-3 h-3" />
                        <span>Histórico Validado</span>
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setChatAluno(aluno);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1 transition-all shadow-md shadow-cyan-500/10"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-slate-950" />
                          <span>Enviar Mensagem</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* STUDENT OFFICIAL ACADEMIC TRANSCRIPT DRAWER / MODAL */}
      {selectedAluno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative text-white shadow-2xl">
            
            <button
              onClick={() => setSelectedAluno(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-4 border-b border-slate-800 pb-4">
              <img
                src={selectedAluno.avatarUrl}
                alt={selectedAluno.nome}
                className="w-16 h-16 rounded-full border-2 border-teal-500 object-cover"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-extrabold text-white">{selectedAluno.nome}</h2>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    RA: {selectedAluno.ra}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {selectedAluno.curso} &bull; {selectedAluno.idade} anos &bull; {selectedAluno.email}
                </p>
              </div>
            </div>

            {/* Official Academic Transcript (Boletim) Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  <span>Boletim / Histórico Validado pela Instituição (FECAP)</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Validação Oficial Ativa
                </span>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Matéria / Disciplina</th>
                      <th className="p-3">Semestre</th>
                      <th className="p-3 text-center">Nota (0 a 10)</th>
                      <th className="p-3 text-right">Selo Institucional</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {selectedAluno.historicoAcademico?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50">
                        <td className="p-3 font-semibold text-white">{item.materia}</td>
                        <td className="p-3 font-mono text-slate-400">{item.semestre}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded ${
                            item.nota >= 8.5
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : item.nota >= 7.0
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          }`}>
                            {item.nota.toFixed(1)}
                          </span>
                        </td>
                        <td className="p-3 text-right text-[10px] text-emerald-400 font-semibold">
                          ✓ FECAP Verificado
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Soft Skills Badges */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Competências Comportamentais (Soft Skills)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(SOFT_SKILLS_LABELS) as (keyof SoftSkills)[]).map((key) => {
                  const active = Boolean(selectedAluno.softSkills?.[key] || selectedAluno.progressosTrilha?.some(p => p.trilhaNome.toLowerCase() === key.toLowerCase() && p.status !== "EM_TRILHA"));
                  return (
                    <div
                      key={key}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between ${
                        active
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                          : "bg-slate-950 border-slate-800 text-slate-500 opacity-60"
                      }`}
                    >
                      <span>{SOFT_SKILLS_LABELS[key]}</span>
                      <span className="text-[9px] font-mono">{active ? "✓" : "✗"}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Experiences */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Histórico de Experiências ({selectedAluno.experiencias?.length || 0})</span>
              </h3>
              {selectedAluno.experiencias?.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Sem experiências cadastradas.</p>
              ) : (
                <div className="space-y-2">
                  {selectedAluno.experiencias?.map((exp) => (
                    <div key={exp.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-white">
                        <span>{exp.cargo}</span>
                        <span className="text-emerald-400 text-[10px]">{exp.periodo}</span>
                      </div>
                      <p className="text-teal-400 font-semibold">{exp.empresa}</p>
                      <p className="text-slate-400">{exp.descricao}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Teacher Feedback */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Feedbacks dos Professores FECAP</span>
              </h3>
              <div className="space-y-2">
                {selectedAluno.feedbacksProfessores.map((fb, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs italic text-slate-300">
                    &quot;{fb}&quot;
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => setSelectedAluno(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  const target = selectedAluno;
                  setSelectedAluno(null);
                  setChatAluno(target);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-extrabold flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
              >
                <MessageSquare className="w-4 h-4 text-slate-950" />
                <span>Enviar Mensagem ao Talento</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CHAT DRAWER LATERAL */}
      <ChatDrawer
        aluno={chatAluno}
        onClose={() => setChatAluno(null)}
      />

    </main>
  );
}
