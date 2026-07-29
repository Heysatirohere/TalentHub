"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  PlusCircle, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  BrainCircuit, 
  Check,
  AlertTriangle
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { SoftSkills, PesosHardSkills, SOFT_SKILLS_LABELS, HARD_SKILLS_LABELS } from "@/types/talent";

export default function NovaCampanhaVagaPage() {
  const router = useRouter();
  const { adicionarCampanha } = useTalent();

  const [titulo, setTitulo] = useState("");
  const [empresa, setEmpresa] = useState("TechInova FECAP Partner");
  const [localizacao, setLocalizacao] = useState("São Paulo, SP (Híbrido)");
  const [tipoContrato, setTipoContrato] = useState("Estágio");
  const [descricao, setDescricao] = useState("");

  const [requisitosSoftSkills, setRequisitosSoftSkills] = useState<Record<keyof SoftSkills, boolean>>({
    comunicacao: true,
    trabalhoEmEquipe: true,
    lideranca: false,
    resolucaoProblemas: true,
    adaptabilidade: true,
    pensamentoCritico: false,
  });

  const [pesosHardSkills, setPesosHardSkills] = useState<PesosHardSkills>({
    tecnologia: 5,
    exatas: 4,
    negocios: 3,
    humanas: 2,
    design: 1,
  });

  const toggleSoft = (key: keyof SoftSkills) => {
    setRequisitosSoftSkills((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !descricao.trim()) {
      alert("Por favor, preencha o Título e a Descrição da vaga.");
      return;
    }

    const softsObrigatórias = (Object.keys(requisitosSoftSkills) as (keyof SoftSkills)[]).filter(
      (k) => requisitosSoftSkills[k]
    );

    await adicionarCampanha({
      titulo,
      empresa,
      localizacao,
      tipoContrato,
      descricao,
      requisitosSoftSkills: softsObrigatórias,
      pesosHardSkills,
    });

    alert(
      `Campanha "${titulo}" submetida com sucesso!\n\nStatus: Pendente de Aprovação pela Coordenação Master FECAP.`
    );
    router.push("/empresa");
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      
      <div className="flex items-center space-x-3">
        <Link href="/empresa" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Abertura de Nova Campanha de Vaga</h1>
          <p className="text-xs text-slate-400">
            Cadastre os requisitos e parâmetros do algoritmo de match para estudantes FECAP.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-teal-400 uppercase tracking-wider">
            1. Dados Gerais da Vaga
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Título da Vaga / Posição *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Estagiário de Inteligência Financeira"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Nome da Empresa *
              </label>
              <input
                type="text"
                required
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Tipo de Contrato
              </label>
              <select
                value={tipoContrato}
                onChange={(e) => setTipoContrato(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
              >
                <option value="Estágio">Estágio</option>
                <option value="Júnior">Júnior</option>
                <option value="Trainee">Trainee</option>
                <option value="Pleno">Pleno</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Localização / Modelo
              </label>
              <input
                type="text"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Descrição das Atividades & Responsabilidades *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Descreva brevemente o escopo de atuação e desafios da vaga..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Soft Skills Mandatórias */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>2. Soft Skills Obrigatórias (Corte / Filtro Rigoroso)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Alunos que não possuírem as marcadas sofrerão penalização severa no algoritmo de match.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {(Object.keys(SOFT_SKILLS_LABELS) as (keyof SoftSkills)[]).map((key) => {
              const active = requisitosSoftSkills[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleSoft(key)}
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
                    {active ? "Requerida" : "Opcional"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hard Skills Weights */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-teal-400 uppercase tracking-wider flex items-center space-x-2">
            <BrainCircuit className="w-4 h-4 text-teal-400" />
            <span>3. Pesos de Hard Skills (Média Ponderada de 0 a 5)</span>
          </h2>

          <div className="space-y-4">
            {(Object.keys(HARD_SKILLS_LABELS) as (keyof PesosHardSkills)[]).map((cat) => {
              const peso = pesosHardSkills[cat];
              return (
                <div key={cat} className="space-y-1 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">{HARD_SKILLS_LABELS[cat]}</span>
                    <span className="font-mono font-bold text-teal-400">Peso {peso}x</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={1}
                    value={peso}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setPesosHardSkills((prev) => ({ ...prev, [cat]: v }));
                    }}
                    className="w-full accent-teal-500"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Sua campanha será submetida para revisão da Coordenação Master FECAP antes da publicação.</span>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 flex items-center space-x-2"
          >
            <PlusCircle className="w-5 h-5 text-slate-950" />
            <span>Enviar Campanha para Aprovação</span>
          </button>
        </div>

      </form>

    </main>
  );
}
