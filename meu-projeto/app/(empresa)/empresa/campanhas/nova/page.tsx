"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  PlusCircle, 
  ArrowLeft, 
  ShieldCheck, 
  BookOpen, 
  Check,
  AlertTriangle,
  Trash2,
  Plus
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { SoftSkills, SOFT_SKILLS_LABELS, IMateriaRequerida } from "@/types/talent";

const SUGESTOES_MATERIAS = [
  "Engenharia de Software",
  "Desenvolvimento Web Front-End",
  "Banco de Dados SQL",
  "Cybersecurity",
  "Estrutura de Dados",
  "Gestão Estratégica & Negócios",
  "Matemática Financeira",
  "Finanças Corporativas",
  "Análise de Dados para Gestão",
  "Econometria & Estatística",
  "UX/UI Design & Prototipagem",
  "Branding e Identidade Visual",
  "Marketing Digital & Growth",
  "Pesquisa de Mercado",
  "Comunicação Corporativa",
];

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

  // Lista de Matérias Requeridas da Vaga com Pesos
  const [materiasRequeridas, setMateriasRequeridas] = useState<IMateriaRequerida[]>([
    { nomeDaMateria: "Engenharia de Software", peso: 5 },
    { nomeDaMateria: "Banco de Dados SQL", peso: 4 },
  ]);

  const [novaMateriaInput, setNovaMateriaInput] = useState("");
  const [novoPesoInput, setNovoPesoInput] = useState<number>(3);

  const toggleSoft = (key: keyof SoftSkills) => {
    setRequisitosSoftSkills((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAdicionarMateria = () => {
    if (!novaMateriaInput.trim()) return;
    setMateriasRequeridas((prev) => [
      ...prev,
      { nomeDaMateria: novaMateriaInput.trim(), peso: novoPesoInput },
    ]);
    setNovaMateriaInput("");
    setNovoPesoInput(3);
  };

  const handleRemoverMateria = (index: number) => {
    setMateriasRequeridas((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !descricao.trim()) {
      alert("Por favor, preencha o Título e a Descrição da vaga.");
      return;
    }

    if (materiasRequeridas.length === 0) {
      alert("Adicione ao menos uma matéria requerida do histórico universitário para o cálculo do match.");
      return;
    }

    const softsObrigatorias = (Object.keys(requisitosSoftSkills) as (keyof SoftSkills)[]).filter(
      (k) => requisitosSoftSkills[k]
    );

    await adicionarCampanha({
      titulo,
      empresa,
      localizacao,
      tipoContrato,
      descricao,
      requisitosSoftSkills: softsObrigatorias,
      materiasRequeridas,
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
            Cadastre os requisitos acadêmicos e matérias com peso para o cálculo de Média Ponderada.
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
                placeholder="Ex: Estagiário de Desenvolvimento Full Stack"
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

        {/* Requisito de Matérias do Histórico Acadêmico */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-teal-400 uppercase tracking-wider flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>2. Matérias do Histórico Acadêmico Requeridas & Pesos (1 a 5)</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">{materiasRequeridas.length} Matéria(s)</span>
          </div>

          <p className="text-xs text-slate-400">
            Defina as matérias da faculdade cujas notas validadas serão ponderadas no algoritmo de match.
          </p>

          {/* Form para adicionar matéria */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-7">
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Nome da Matéria / Disciplina
                </label>
                <input
                  type="text"
                  placeholder="Selecione ou digite ex: Cybersecurity..."
                  list="sugestoes-materias"
                  value={novaMateriaInput}
                  onChange={(e) => setNovaMateriaInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                />
                <datalist id="sugestoes-materias">
                  {SUGESTOES_MATERIAS.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Peso (1 a 5)
                </label>
                <select
                  value={novoPesoInput}
                  onChange={(e) => setNovoPesoInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono font-bold focus:outline-none focus:border-teal-500"
                >
                  {[1, 2, 3, 4, 5].map((p) => (
                    <option key={p} value={p}>
                      Peso {p}x
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAdicionarMateria}
                  className="w-full py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Lista de matérias adicionadas */}
          <div className="space-y-2 pt-2">
            {materiasRequeridas.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 text-center border border-dashed border-slate-800 rounded-xl">
                Nenhuma matéria adicionada ainda.
              </p>
            ) : (
              materiasRequeridas.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-teal-400" />
                    <span className="font-semibold text-white">{item.nomeDaMateria}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono font-bold border border-teal-500/40">
                      Peso {item.peso}x
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoverMateria(idx)}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Soft Skills Mandatórias */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>3. Soft Skills Obrigatórias (Corte / Filtro Rigoroso)</span>
          </h2>

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
                </button>
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
