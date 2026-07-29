"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Mail, 
  ArrowLeft, 
  GraduationCap, 
  MessageSquare, 
  FileCheck, 
  Building2, 
  Sparkles,
  Check
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { Aluno, SoftSkills, HardSkills, SOFT_SKILLS_LABELS, HARD_SKILLS_LABELS } from "@/types/talent";

export default function BancoTalentosBuscaAtivaPage() {
  const { alunos } = useTalent();

  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [cursoFilter, setCursoFilter] = useState("TODOS");

  // Selected Soft Skills required (all checked must be true for the student)
  const [requiredSoftSkills, setRequiredSoftSkills] = useState<Record<keyof SoftSkills, boolean>>({
    comunicacao: false,
    trabalhoEmEquipe: false,
    lideranca: false,
    resolucaoProblemas: false,
    adaptabilidade: false,
    pensamentoCritico: false,
  });

  // Minimum Hard Skills sliders (0 to 100)
  const [minHardSkills, setMinHardSkills] = useState<HardSkills>({
    tecnologia: 0,
    negocios: 0,
    exatas: 0,
    humanas: 0,
    design: 0,
  });

  const toggleSoftSkillFilter = (key: keyof SoftSkills) => {
    setRequiredSoftSkills((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filter students pro-actively
  const filteredAlunos = useMemo(() => {
    return alunos.filter((aluno) => {
      // 1. Keyword search (Nome, RA, Email, Curso)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = aluno.nome.toLowerCase().includes(q);
        const matchRa = aluno.ra.toLowerCase().includes(q);
        const matchEmail = aluno.email.toLowerCase().includes(q);
        const matchCurso = aluno.curso.toLowerCase().includes(q);
        if (!matchName && !matchRa && !matchEmail && !matchCurso) return false;
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
        if (!aluno.softSkills[k]) return false;
      }

      // 4. Minimum Hard Skills
      const hardKeys = Object.keys(minHardSkills) as (keyof HardSkills)[];
      for (const k of hardKeys) {
        const minVal = minHardSkills[k];
        if (minVal > 0 && (aluno.hardSkills[k] || 0) < minVal) {
          return false;
        }
      }

      return true;
    });
  }, [alunos, searchQuery, cursoFilter, requiredSoftSkills, minHardSkills]);

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
              <span>Busca Ativa & Prospecção Livre</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Banco de Talentos Universitários FECAP</h1>
            <p className="text-slate-400 text-sm">
              Encontre perfis ideais para futuras contratações sem necessidade de vaga aberta.
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
                Palavra-chave / RA / Nome
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Ex: Lucas, 26028671, React..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="TODOS">Todos os Cursos</option>
                {cursosDisponiveis.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Soft Skills Mandatory Checkboxes */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                Exigir Soft Skills (Filtro Obrigatório)
              </label>
              <div className="space-y-1.5">
                {(Object.keys(SOFT_SKILLS_LABELS) as (keyof SoftSkills)[]).map((key) => {
                  const checked = requiredSoftSkills[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleSoftSkillFilter(key)}
                      className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between text-xs transition-all ${
                        checked
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-300 font-semibold"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${checked ? "bg-amber-500 border-amber-500 text-slate-950" : "border-slate-700"}`}>
                          {checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{SOFT_SKILLS_LABELS[key]}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minimum Hard Skills Sliders */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="block text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
                Pontuação Mínima por Categoria Técnico
              </label>

              {(Object.keys(HARD_SKILLS_LABELS) as (keyof HardSkills)[]).map((cat) => {
                const val = minHardSkills[cat];
                return (
                  <div key={cat} className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-300">{HARD_SKILLS_LABELS[cat]}:</span>
                      <span className="font-mono font-bold text-teal-400">{val} / 100</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={90}
                      step={10}
                      value={val}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setMinHardSkills((prev) => ({ ...prev, [cat]: v }));
                      }}
                      className="w-full accent-teal-500"
                    />
                  </div>
                );
              })}
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSearchQuery("");
                setCursoFilter("TODOS");
                setRequiredSoftSkills({
                  comunicacao: false,
                  trabalhoEmEquipe: false,
                  lideranca: false,
                  resolucaoProblemas: false,
                  adaptabilidade: false,
                  pensamentoCritico: false,
                });
                setMinHardSkills({
                  tecnologia: 0,
                  negocios: 0,
                  exatas: 0,
                  humanas: 0,
                  design: 0,
                });
              }}
              className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Limpar Todos os Filtros
            </button>

          </div>

        </div>

        {/* Right Column (8 cols): Talent Cards Grid */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-teal-400" />
              <span>Candidatos Disponíveis ({filteredAlunos.length})</span>
            </h2>
          </div>

          {filteredAlunos.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
              <Filter className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-bold">Nenhum aluno atende aos filtros de busca ativa simultâneos.</p>
              <p className="text-xs text-slate-500">Tente reduzir as pontuações mínimas ou desmarcar soft skills obrigatórias.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAlunos.map((aluno) => (
                <div
                  key={aluno.id}
                  onClick={() => setSelectedAluno(aluno)}
                  className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all cursor-pointer shadow-lg space-y-4 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <img
                        src={aluno.avatarUrl}
                        alt={aluno.nome}
                        className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 shrink-0"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-white text-sm group-hover:text-teal-400 transition-colors">
                            {aluno.nome}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400">
                          {aluno.curso} ({aluno.idade} anos) &bull; {aluno.semestre}º Semestre
                        </p>
                        <span className="inline-block text-[10px] font-mono font-semibold text-teal-300 mt-0.5">
                          RA: {aluno.ra}
                        </span>
                      </div>
                    </div>

                    {/* Hard Skill Top Badges */}
                    <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-300">
                      <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                        <span className="text-slate-500 block">Tecnologia</span>
                        <strong className="text-teal-400">{aluno.hardSkills.tecnologia}</strong>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                        <span className="text-slate-500 block">Negócios</span>
                        <strong className="text-teal-400">{aluno.hardSkills.negocios}</strong>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                        <span className="text-slate-500 block">Exatas</span>
                        <strong className="text-teal-400">{aluno.hardSkills.exatas}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{aluno.packDocumentos?.length || 0} Doc(s) OK</span>
                    </span>

                    <button className="px-3 py-1.5 rounded-xl bg-slate-800 group-hover:bg-teal-500 group-hover:text-slate-950 font-bold text-xs text-slate-200 transition-colors">
                      Ver Perfil Completo
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* STUDENT PROFILE DRAWER */}
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

            {/* Soft Skills Badges */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Competências Comportamentais (Soft Skills)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(SOFT_SKILLS_LABELS) as (keyof SoftSkills)[]).map((key) => {
                  const active = selectedAluno.softSkills[key];
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

            {/* Hard Skills Progress */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Pontuação em Hard Skills
              </h3>
              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {Object.entries(selectedAluno.hardSkills).map(([cat, score]) => (
                  <div key={cat} className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-300">{HARD_SKILLS_LABELS[cat as keyof typeof HARD_SKILLS_LABELS]}:</span>
                      <span className="font-mono font-bold text-teal-400">{score}/100</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                ))}
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
            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => setSelectedAluno(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Fechar
              </button>
              <button
                onClick={() => alert(`Convite de entrevista enviado com sucesso para ${selectedAluno.email} (RA ${selectedAluno.ra})!`)}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 text-xs font-bold flex items-center space-x-2 shadow-lg shadow-teal-500/20"
              >
                <Mail className="w-4 h-4 text-slate-950" />
                <span>Enviar Convite Direto para Entrevista</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
