"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  SlidersHorizontal, 
  ShieldCheck, 
  X, 
  ArrowLeft, 
  MessageSquare, 
  FileCheck, 
  Building2, 
  Sparkles,
  BookOpen,
  Award
} from "lucide-react";
import { Aluno, Vaga, SoftSkills, SOFT_SKILLS_LABELS } from "@/types/talent";
import { ChatDrawer } from "@/components/ChatDrawer";
import { useTalent } from "@/context/TalentContext";

interface BancoTalentosClientProps {
  talentosReais: Aluno[];
  trilhasDisponiveis?: string[];
  vagasDisponiveis?: Vaga[];
}

export function BancoTalentosClient({
  talentosReais: talentosReaisProp = [],
  trilhasDisponiveis: trilhasDisponiveisProp,
  vagasDisponiveis: vagasDisponiveisProp = [],
}: BancoTalentosClientProps) {
  const { alunos: contextAlunos, vagas: contextVagas } = useTalent();

  const talentosReais = useMemo(() => {
    if (talentosReaisProp && talentosReaisProp.length > 0) return talentosReaisProp;
    return contextAlunos || [];
  }, [talentosReaisProp, contextAlunos]);

  const vagasDisponiveis = useMemo(() => {
    if (vagasDisponiveisProp && vagasDisponiveisProp.length > 0) return vagasDisponiveisProp;
    return contextVagas || [];
  }, [vagasDisponiveisProp, contextVagas]);

  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [chatAluno, setChatAluno] = useState<Aluno | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [cursoFilter, setCursoFilter] = useState("TODOS");
  const [selectedVagaId, setSelectedVagaId] = useState("TODAS");
  const [apenasCinquentaOuCemPorCentoSoftSkills, setApenasCinquentaOuCemPorCentoSoftSkills] = useState(false);

  // Selected Soft Skills required (Dynamic track names from DB)
  const [requiredSoftSkills, setRequiredSoftSkills] = useState<Record<string, boolean>>({});

  const [minNotaMateria, setMinNotaMateria] = useState<number>(0);

  // Real Trilhas dynamically computed from prop or student data
  const realTrilhas = useMemo(() => {
    if (trilhasDisponiveisProp && trilhasDisponiveisProp.length > 0) {
      return trilhasDisponiveisProp;
    }
    const set = new Set<string>();
    talentosReais.forEach((a) => {
      a.progressosTrilha?.forEach((p) => {
        const name = p.trilhaNome || (p as any).trilha?.nome;
        if (name) set.add(name);
      });
    });
    if (set.size === 0) {
      Object.values(SOFT_SKILLS_LABELS).forEach((label) => set.add(label));
    }
    return Array.from(set);
  }, [trilhasDisponiveisProp, talentosReais]);

  const toggleSoftSkillFilter = (nomeTrilha: string) => {
    setRequiredSoftSkills((prev) => ({
      ...prev,
      [nomeTrilha]: !prev[nomeTrilha],
    }));
  };

  // Filter real students pro-actively from DB talentosReais prop
  const filteredAlunos = useMemo(() => {
    return talentosReais.filter((aluno) => {
      // 1. Keyword search (Nome, RA, Email, Curso, Disciplinas do Histórico)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
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

      // Extract valid student soft skills (VALIDADO_MENTORIA or TESTE_APROVADO)
      const studentSoftSkills = (aluno.progressosTrilha || [])
        .filter((p) => p.status === "VALIDADO_MENTORIA" || p.status === "TESTE_APROVADO")
        .map((p) => (p.trilhaNome || (p as any).trilha?.nome || "").toLowerCase().trim());

      if (aluno.softSkills) {
        Object.entries(aluno.softSkills).forEach(([k, v]) => {
          if (v) {
            studentSoftSkills.push(k.toLowerCase().trim());
            const label = (SOFT_SKILLS_LABELS as any)[k];
            if (label) studentSoftSkills.push(label.toLowerCase().trim());
          }
        });
      }

      // 3. Mandatory Soft Skills from manual checkboxes
      const selectedReqSkills = Object.keys(requiredSoftSkills).filter(
        (k) => requiredSoftSkills[k]
      );
      for (const reqSkill of selectedReqSkills) {
        const reqLower = reqSkill.toLowerCase().trim();
        const labelLower = (SOFT_SKILLS_LABELS[reqSkill as keyof typeof SOFT_SKILLS_LABELS] || reqSkill).toLowerCase().trim();

        const hasSkill = studentSoftSkills.some(
          (s) => s === reqLower || s === labelLower || s.includes(reqLower) || reqLower.includes(s)
        );
        if (!hasSkill) return false;
      }

      // 4. Vaga Filter ("Apenas 100% de Soft Skills da Vaga atendidas")
      if (selectedVagaId && selectedVagaId !== "TODAS" && apenasCinquentaOuCemPorCentoSoftSkills) {
        const vaga = vagasDisponiveis.find((v) => v.id === selectedVagaId);
        if (vaga && vaga.requisitosSoftSkills && vaga.requisitosSoftSkills.length > 0) {
          for (const reqSoft of vaga.requisitosSoftSkills) {
            const reqStr = String(reqSoft).trim().toLowerCase();
            const labelStr = (SOFT_SKILLS_LABELS[reqSoft as keyof typeof SOFT_SKILLS_LABELS] || reqSoft).toLowerCase().trim();

            const hasSkill = studentSoftSkills.some(
              (s) => s === reqStr || s === labelStr || s.includes(reqStr) || reqStr.includes(s)
            );
            if (!hasSkill) return false;
          }
        }
      }

      // 5. Média Mínima Acadêmica
      if (minNotaMateria > 0) {
        const mediaGeral =
          aluno.historicoAcademico && aluno.historicoAcademico.length > 0
            ? aluno.historicoAcademico.reduce((acc, h) => acc + h.nota, 0) / aluno.historicoAcademico.length
            : 0;
        if (mediaGeral < minNotaMateria) return false;
      }

      return true;
    });
  }, [
    talentosReais,
    searchQuery,
    cursoFilter,
    requiredSoftSkills,
    selectedVagaId,
    apenasCinquentaOuCemPorCentoSoftSkills,
    vagasDisponiveis,
    minNotaMateria,
  ]);

  const cursosDisponiveis = useMemo(() => {
    const set = new Set(talentosReais.map((a) => a.curso));
    return Array.from(set);
  }, [talentosReais]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-4 animate-fade-up"
        style={{ borderBottom: "1px solid var(--border-light)" }}>
        <div className="flex items-center space-x-3">
          <Link href="/empresa" className="p-2 rounded-xl npa-btn-ghost">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="npa-badge inline-flex mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Busca Ativa & Prospecção — PostgreSQL</span>
            </div>
            <h1 className="text-2xl font-extrabold text-head">Banco de Talentos FECAP</h1>
            <p className="text-sm text-muted">
              Perfis acadêmicos com notas reais e validação institucional.
            </p>
          </div>
        </div>

        <div
          className="flex items-center space-x-3 p-3 rounded-2xl border self-start md:self-auto"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border-light)" }}
        >
          <div className="text-right">
            <p className="text-xs text-muted">Encontrados</p>
            <p className="text-lg font-bold text-npa">{filteredAlunos.length} <span className="text-subtle font-normal text-sm">de {talentosReais.length}</span></p>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar (4 cols) & Candidates Grid (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (4 cols): Multi-filter Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="npa-card rounded-2xl p-5 space-y-5">
            <h2 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-npa" />
              <span>Filtros de Prospecção</span>
            </h2>

            {/* Keyword Search */}
            <div>
              <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
                Palavra-chave / Matéria / RA
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5" style={{ color: 'var(--text-subtle)' }} />
                <input
                  type="text"
                  placeholder="Ex: Cybersecurity, Lucas, RA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="npa-input pl-9"
                />
              </div>
            </div>

            {/* Curso Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
                Filtrar por Curso
              </label>
              <select
                value={cursoFilter}
                onChange={(e) => setCursoFilter(e.target.value)}
                className="npa-select"
              >
                <option value="TODOS">Todos os Cursos</option>
                {cursosDisponiveis.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Vaga Filter */}
            {vagasDisponiveis && vagasDisponiveis.length > 0 && (
              <div className="space-y-2 pt-2" style={{ borderTop: '1px solid var(--border-light)' }}>
                <label className="block text-[11px] font-semibold text-npa uppercase tracking-wider">
                  Cruzar com Vaga
                </label>
                <select
                  value={selectedVagaId}
                  onChange={(e) => setSelectedVagaId(e.target.value)}
                  className="npa-select"
                >
                  <option value="TODAS">Todas as Vagas</option>
                  {vagasDisponiveis.map((v) => (
                    <option key={v.id} value={v.id}>{v.titulo} ({v.empresa})</option>
                  ))}
                </select>

                {selectedVagaId !== "TODAS" && (
                  <label className="flex items-center space-x-2 text-xs cursor-pointer pt-1" style={{ color: 'var(--amber-text)' }}>
                    <input
                      type="checkbox"
                      checked={apenasCinquentaOuCemPorCentoSoftSkills}
                      onChange={(e) => setApenasCinquentaOuCemPorCentoSoftSkills(e.target.checked)}
                      className="rounded"
                    />
                    <span>Apenas 100% das Soft Skills</span>
                  </label>
                )}
              </div>
            )}

            {/* Média Mínima */}
            <div className="space-y-2 pt-2" style={{ borderTop: '1px solid var(--border-light)' }}>
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-semibold text-muted uppercase">Média Mínima (CR)</span>
                <span className="font-mono font-bold text-npa">
                  {minNotaMateria > 0 ? `${minNotaMateria.toFixed(1)}/10` : "Qualquer"}
                </span>
              </div>
              <input
                type="range" min={0} max={10} step={0.5}
                value={minNotaMateria}
                onChange={(e) => setMinNotaMateria(Number(e.target.value))}
                className="w-full" style={{ accentColor: '#004A30' }}
              />
            </div>

            {/* Soft Skills Obrigatórias */}
            <div className="space-y-2 pt-2" style={{ borderTop: '1px solid var(--border-light)' }}>
              <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--amber-text)' }}>
                Exigir Soft Skills
              </label>
              <div className="space-y-1.5">
                {realTrilhas.map((nomeTrilha) => {
                  const isChecked = Boolean(requiredSoftSkills[nomeTrilha]);
                  return (
                    <button
                      key={nomeTrilha}
                      type="button"
                      onClick={() => toggleSoftSkillFilter(nomeTrilha)}
                      className="w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition-all border"
                      style={isChecked
                        ? { background: 'rgba(0,74,48,0.08)', borderColor: 'rgba(0,74,48,0.25)', color: '#004A30', fontWeight: 600 }
                        : { background: 'var(--bg-sunken)', borderColor: 'var(--border-light)', color: 'var(--text-muted)' }
                      }
                    >
                      <span>{nomeTrilha}</span>
                      <span className="text-[10px] font-mono">{isChecked ? "✓" : "—"}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                setSearchQuery("");
                setCursoFilter("TODOS");
                setSelectedVagaId("TODAS");
                setApenasCinquentaOuCemPorCentoSoftSkills(false);
                setMinNotaMateria(0);
                setRequiredSoftSkills({});
              }}
              className="npa-btn-ghost w-full justify-center text-xs rounded-xl"
            >
              Limpar Filtros
            </button>

          </div>

        </div>

        {/* Right Column (8 cols): Candidates Grid */}
        <div className="lg:col-span-8 space-y-4">
          
          {filteredAlunos.length === 0 ? (
            <div className="p-12 text-center npa-card rounded-2xl space-y-3">
              <BookOpen className="w-10 h-10 mx-auto" style={{ color: 'var(--text-subtle)' }} strokeWidth={1} />
              <h3 className="text-base font-bold text-head">Nenhum aluno atende aos critérios</h3>
              <p className="text-xs text-muted max-w-md mx-auto">
                Tente afrouxar as soft skills exigidas ou reduzir a média mínima.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAlunos.map((aluno) => {
                const historico = aluno.historicoAcademico || [];
                const mediaGeral = historico.length > 0
                  ? (historico.reduce((acc, h) => acc + h.nota, 0) / historico.length).toFixed(1)
                  : "N/A";

                const targetUserId = aluno.userId || aluno.id;

                return (
                  <div
                    key={aluno.id}
                    onClick={() => setSelectedAluno(aluno)}
                    className="npa-card npa-card-interactive rounded-xl p-4 space-y-3 cursor-pointer group flex flex-col justify-between"
                  >
                    {/* Top Row */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={aluno.avatarUrl}
                          alt={aluno.nome}
                          className="w-11 h-11 rounded-xl object-cover shrink-0 border-2"
                          style={{ borderColor: 'var(--border-strong)' }}
                        />
                        <div>
                          <h3 className="font-bold text-head text-sm group-hover:text-npa transition-colors">
                            {aluno.nome}
                          </h3>
                          <p className="text-xs text-muted">{aluno.curso} • {aluno.semestre}º Sem.</p>
                          <span className="text-[10px] font-mono font-bold text-npa">RA: {aluno.ra}</span>
                        </div>
                      </div>

                      {/* Transcript summary */}
                      <div className="p-2.5 rounded-xl space-y-1.5" style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-light)' }}>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted font-semibold flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-npa" />
                            CR Médio:
                          </span>
                          <span className="font-mono font-bold text-npa text-sm">{mediaGeral}</span>
                        </div>
                        <div className="space-y-1" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '6px' }}>
                          {historico.slice(0, 2).map((h, i) => (
                            <div key={i} className="flex justify-between text-[11px]">
                              <span className="truncate pr-2 text-body">{h.materia}</span>
                              <span className="font-mono font-bold text-npa">{h.nota.toFixed(1)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="flex items-center justify-between gap-2" style={{ paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                      <span className="npa-badge text-[10px]">
                        <FileCheck className="w-3 h-3" />
                        Verificado
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setChatAluno({ ...aluno, userId: targetUserId });
                        }}
                        className="npa-btn-primary px-2.5 py-1.5 rounded-lg text-[11px]"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Mensagem
                      </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#004A30]/60 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative shadow-2xl">
            
            <button
              onClick={() => setSelectedAluno(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 text-slate-500 hover:text-slate-800 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4" style={{ borderBottom: '1px solid var(--border-light)' }}>
              <img
                src={selectedAluno.avatarUrl}
                alt={selectedAluno.nome}
                className="w-14 h-14 rounded-2xl object-cover shrink-0 border-2"
                style={{ borderColor: 'var(--border-strong)' }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-extrabold text-head">{selectedAluno.nome}</h2>
                  <span className="npa-badge text-[10px]">
                    RA: {selectedAluno.ra}
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">
                  {selectedAluno.curso} &bull; {selectedAluno.idade} anos &bull; {selectedAluno.email}
                </p>
              </div>
            </div>

            {/* Official Academic Transcript (Boletim) Table */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-xs font-bold text-npa uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-npa" />
                  <span>Boletim / Histórico Validado FECAP</span>
                </h3>
                <span className="npa-badge text-[10px] self-start sm:self-auto">
                  Validação Oficial
                </span>
              </div>

              <div className="rounded-xl border overflow-x-auto" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border-light)' }}>
                {!selectedAluno.historicoAcademico || selectedAluno.historicoAcademico.length === 0 ? (
                  <p className="text-xs text-muted italic p-4 text-center">Histórico acadêmico não importado.</p>
                ) : (
                  <table className="w-full text-left text-xs min-w-[480px] npa-table">
                    <thead>
                      <tr>
                        <th>Matéria / Disciplina</th>
                        <th>Semestre</th>
                        <th className="text-center">Nota (0 a 10)</th>
                        <th className="text-right">Selo Institucional</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border-light)' }}>
                      {selectedAluno.historicoAcademico.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-semibold text-head">{item.materia}</td>
                          <td className="p-3 font-mono text-muted">{item.semestre}</td>
                          <td className="p-3 text-center">
                            <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded ${
                              item.nota >= 8.5
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : item.nota >= 7.0
                                ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            }`}>
                              {item.nota.toFixed(1)}
                            </span>
                          </td>
                          <td className="p-3 text-right text-[10px] font-semibold text-npa">
                            ✓ Verificado
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Soft Skills Badges */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Competências Comportamentais (Soft Skills)</span>
              </h3>
              {(() => {
                const softSkillsValidadas = selectedAluno?.progressosTrilha?.filter(
                  (p) => p.status === "VALIDADO_MENTORIA" || p.status === "TESTE_APROVADO"
                ) || [];

                if (softSkillsValidadas.length === 0) {
                  return (
                    <p className="text-xs text-slate-400 italic">
                      Nenhuma competência comportamental mapeada ainda.
                    </p>
                  );
                }

                return (
                  <div className="flex flex-wrap gap-2">
                    {softSkillsValidadas.map((progresso) => {
                      const isValidated = progresso.status === "VALIDADO_MENTORIA";
                      const nomeTrilha = (progresso as any).trilha?.nome || progresso.trilhaNome || "Soft Skill";

                      return (
                        <div
                          key={progresso.id || progresso.trilhaNome}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
                            isValidated
                              ? "bg-amber-50 border-amber-200 text-amber-700"
                              : "bg-[#004A30]/8 border-[#004A30]/20 text-[#004A30]"
                          }`}
                        >
                          <span>{nomeTrilha}</span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-current">
                            ✓ {isValidated ? "VALIDADO" : "APROVADO"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Experiences */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-npa uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-npa" />
                <span>Histórico de Experiências ({selectedAluno.experiencias?.length || 0})</span>
              </h3>
              {!selectedAluno.experiencias || selectedAluno.experiencias.length === 0 ? (
                <p className="text-xs text-muted italic">Nenhuma experiência profissional cadastrada.</p>
              ) : (
                <div className="space-y-2">
                  {selectedAluno.experiencias.map((exp) => (
                    <div key={exp.id} className="p-3 rounded-xl border text-xs space-y-1" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border-light)' }}>
                      <div className="flex flex-col sm:flex-row sm:justify-between font-bold text-head gap-0.5">
                        <span>{exp.cargo}</span>
                        <span className="text-npa text-[10px]">{exp.periodo}</span>
                      </div>
                      <p className="text-npa font-semibold">{exp.empresa}</p>
                      <p className="text-muted">{exp.descricao}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Teacher Feedback */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>Feedbacks dos Professores FECAP</span>
              </h3>
              <div className="space-y-2">
                {selectedAluno.feedbacksProfessores.map((fb, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs italic text-slate-600">
                    &quot;{fb}&quot;
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-2" style={{ borderTop: '1px solid var(--border-light)' }}>
              <button
                onClick={() => setSelectedAluno(null)}
                className="npa-btn-ghost justify-center text-xs py-2.5 rounded-xl"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  if (selectedAluno) {
                    const targetUserId = selectedAluno.userId || selectedAluno.id;
                    const target = {
                      ...selectedAluno,
                      userId: targetUserId,
                    };
                    setSelectedAluno(null);
                    setChatAluno(target);
                  }
                }}
                className="npa-btn-primary justify-center text-xs py-2.5 rounded-xl"
              >
                <MessageSquare className="w-4 h-4" />
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
