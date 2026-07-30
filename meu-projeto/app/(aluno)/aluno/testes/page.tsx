"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Check,
  Award,
  FileCheck
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
    <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Link href="/aluno" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <span>Histórico Escolar Oficial & Competências</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Validado pela Instituição
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Notas integradas diretamente do sistema acadêmico FECAP para cálculo de Média Ponderada com Vagas.
          </p>
        </div>
      </div>

      {/* Card de Resumo Acadêmico (CR) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>Média Ponderada Geral (Coeficiente de Rendimento)</span>
          </div>
          <p className="text-xs text-slate-400">
            Média oficial computada com base nas disciplinas concluídas na graduação FECAP.
          </p>
        </div>
        <div className="text-center px-6 py-3 bg-slate-950/80 rounded-2xl border border-emerald-500/30">
          <span className="block text-3xl font-extrabold text-emerald-400">{mediaPonderadaGeral}</span>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Nota Média (0 a 10)</span>
        </div>
      </div>

      {/* Tabela do Boletim Acadêmico */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Boletim de Disciplinas FECAP</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">{historico.length} Matérias Cadastradas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Disciplina / Matéria</th>
                <th className="p-3">Semestre Letivo</th>
                <th className="p-3 text-center">Nota Final (0-10)</th>
                <th className="p-3 text-right">Status de Validação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {historico.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-white flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item.materia}</span>
                  </td>
                  <td className="p-3 font-mono text-slate-400">{item.semestre}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block font-mono font-bold text-sm px-2.5 py-0.5 rounded-lg border ${
                        item.nota >= 8.5
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : item.nota >= 7.0
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      }`}
                    >
                      {item.nota.toFixed(1)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Validado FECAP</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mapeamento de Soft Skills */}
      <form onSubmit={handleSalvar} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-amber-400 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Mapeamento de Competências Comportamentais (Soft Skills)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Selecione suas habilidades interpessoais ativas para cruzamento com os requisitos das vagas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {(Object.keys(SOFT_SKILLS_LABELS) as (keyof SoftSkills)[]).map((key) => {
              const active = softSkillsState[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleSkill(key)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    active
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                      : "bg-slate-950 border-slate-800 text-slate-500"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${active ? "bg-amber-500 border-amber-500 text-slate-950" : "border-slate-700"}`}>
                      {active && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-semibold">{SOFT_SKILLS_LABELS[key]}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center space-x-2"
          >
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            <span>Salvar Preferências Comportamentais</span>
          </button>
        </div>
      </form>

    </main>
  );
}
