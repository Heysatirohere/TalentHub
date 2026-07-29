"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BrainCircuit, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Check
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { SoftSkills, HardSkills, SOFT_SKILLS_LABELS } from "@/types/talent";

export default function TestesAlunoPage() {
  const router = useRouter();
  const { currentAluno, atualizarHabilidadesAluno } = useTalent();

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

  const [respostasVocacionais, setRespostasVocacionais] = useState<HardSkills>({
    tecnologia: currentAluno?.hardSkills.tecnologia || 85,
    humanas: currentAluno?.hardSkills.humanas || 75,
    negocios: currentAluno?.hardSkills.negocios || 80,
    exatas: currentAluno?.hardSkills.exatas || 85,
    design: currentAluno?.hardSkills.design || 70,
  });

  const toggleSkill = (key: keyof SoftSkills) => {
    setSoftSkillsState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSalvarTestes = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentAluno) return;

    await atualizarHabilidadesAluno(currentAluno.id, softSkillsState, respostasVocacionais);

    alert("Testes salvos com sucesso! Seu perfil foi atualizado no Banco de Talentos FECAP.");
    router.push("/aluno");
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      
      <div className="flex items-center space-x-3">
        <Link href="/aluno" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Teste Vocacional & Mapeamento de Soft Skills</h1>
          <p className="text-xs text-slate-400">
            Atualize suas aptidões para recalcular seu algoritmo de match corporativo.
          </p>
        </div>
      </div>

      <form onSubmit={handleSalvarTestes} className="space-y-8">
        
        {/* Soft Skills Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-amber-400 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Mapeamento de Competências Comportamentais (Soft Skills)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Marque as habilidades interpessoais que você domina. Vagas exigem critérios obrigatórios.
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
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                    {active ? "true" : "false"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hard Skills Sliders (Vocacional) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h2 className="text-base font-bold text-teal-400 flex items-center space-x-2">
            <BrainCircuit className="w-5 h-5 text-teal-400" />
            <span>Autoavaliação Vocacional de Hard Skills (0 a 100)</span>
          </h2>

          <div className="space-y-4">
            {Object.entries(respostasVocacionais).map(([cat, nota]) => (
              <div key={cat} className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white uppercase">{cat}</span>
                  <span className="font-mono font-bold text-teal-400">{nota} / 100</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={nota}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setRespostasVocacionais((prev) => ({ ...prev, [cat as keyof HardSkills]: v }));
                  }}
                  className="w-full accent-teal-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 flex items-center space-x-2"
          >
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            <span>Salvar Alterações de Perfil</span>
          </button>
        </div>

      </form>

    </main>
  );
}
