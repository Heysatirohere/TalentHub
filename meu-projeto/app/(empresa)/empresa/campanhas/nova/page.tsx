"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle, ArrowLeft, ShieldCheck, BookOpen,
  Check, Trash2, Plus, Building2
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
      `Campanha "${titulo}" publicada com sucesso!\n\nStatus: Aprovada e Ativa para o Ranking de Talentos.`
    );
    router.push("/empresa");
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 animate-fade-up">
        <Link href="/empresa" className="npa-btn-ghost p-2 rounded-xl shrink-0" aria-label="Voltar">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="min-w-0">
          <div className="npa-badge inline-flex mb-1">
            <Building2 className="w-3 h-3" />
            Nova Campanha
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-head leading-tight">
            Abertura de Vaga
          </h1>
          <p className="text-xs text-muted">
            Cadastre os requisitos acadêmicos e matérias ponderadas para o algoritmo de match.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── 1. Dados Gerais ── */}
        <div className="npa-card rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-xs font-bold text-npa uppercase tracking-wider">
            1. Dados Gerais da Vaga
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
                Título da Vaga / Posição *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Estagiário de Desenvolvimento Full Stack"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="npa-input"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
                Nome da Empresa *
              </label>
              <input
                type="text"
                required
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                className="npa-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
                Tipo de Contrato
              </label>
              <select
                value={tipoContrato}
                onChange={(e) => setTipoContrato(e.target.value)}
                className="npa-select"
              >
                <option value="Estágio">Estágio</option>
                <option value="Júnior">Júnior</option>
                <option value="Trainee">Trainee</option>
                <option value="Pleno">Pleno</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
                Localização / Modelo
              </label>
              <input
                type="text"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                className="npa-input"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
              Descrição das Atividades *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Descreva brevemente o escopo de atuação e desafios da vaga..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="npa-input"
            />
          </div>
        </div>

        {/* ── 2. Matérias do Histórico ── */}
        <div className="npa-card rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h2 className="text-xs font-bold text-npa uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-npa" />
              <span>2. Matérias Requeridas & Pesos (1 a 5)</span>
            </h2>
            <span className="text-xs text-muted font-mono">{materiasRequeridas.length} Adicionada(s)</span>
          </div>

          <p className="text-xs text-muted">
            Defina matérias cujas notas validadas serão ponderadas no match de talentos.
          </p>

          {/* Form de adição */}
          <div
            className="p-4 rounded-xl space-y-3 border"
            style={{ background: "var(--bg-sunken)", borderColor: "var(--border-light)" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-7 space-y-1">
                <label className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                  Matéria / Disciplina
                </label>
                <input
                  type="text"
                  placeholder="Selecione ou digite..."
                  list="sugestoes-materias"
                  value={novaMateriaInput}
                  onChange={(e) => setNovaMateriaInput(e.target.value)}
                  className="npa-input"
                />
                <datalist id="sugestoes-materias">
                  {SUGESTOES_MATERIAS.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                  Peso (1 a 5)
                </label>
                <select
                  value={novoPesoInput}
                  onChange={(e) => setNovoPesoInput(Number(e.target.value))}
                  className="npa-select"
                >
                  <option value={1}>1 (Baixo)</option>
                  <option value={2}>2 (Médio-Baixo)</option>
                  <option value={3}>3 (Médio)</option>
                  <option value={4}>4 (Alto)</option>
                  <option value={5}>5 (Essencial)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAdicionarMateria}
                  className="npa-btn-primary w-full justify-center py-2.5 rounded-xl text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Lista de matérias */}
          <div className="space-y-2">
            {materiasRequeridas.length === 0 ? (
              <p className="text-xs text-muted italic p-3 text-center border border-dashed rounded-xl" style={{ borderColor: "var(--border-light)" }}>
                Nenhuma matéria adicionada ainda.
              </p>
            ) : (
              materiasRequeridas.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border flex items-center justify-between text-xs gap-2"
                  style={{ background: "var(--bg-raised)", borderColor: "var(--border-light)" }}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <BookOpen className="w-4 h-4 text-npa shrink-0" />
                    <span className="font-semibold text-head truncate">{item.nomeDaMateria}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="npa-badge text-[10px]">
                      Peso {item.peso}x
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoverMateria(idx)}
                      className="npa-btn-ghost p-1.5 rounded-lg text-xs"
                      title="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" style={{ color: "var(--red-text)" }} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── 3. Soft Skills ── */}
        <div className="npa-card rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--amber-text)" }}>
            <ShieldCheck className="w-4 h-4" />
            <span>3. Soft Skills Obrigatórias (Filtro Rigoroso)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(Object.keys(SOFT_SKILLS_LABELS) as (keyof SoftSkills)[]).map((key) => {
              const active = requisitosSoftSkills[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleSoft(key)}
                  className="p-3 rounded-xl border flex items-center justify-between transition-all"
                  style={
                    active
                      ? { background: "var(--amber-bg)", borderColor: "var(--amber-border)", color: "var(--amber-text)" }
                      : { background: "var(--bg-sunken)", borderColor: "var(--border-light)", color: "var(--text-muted)" }
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center border shrink-0 text-white font-bold"
                      style={active ? { background: "var(--amber-text)", borderColor: "var(--amber-text)" } : { borderColor: "var(--border-strong)" }}
                    >
                      {active && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-semibold">{SOFT_SKILLS_LABELS[key]}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Banner de aviso */}
        <div
          className="p-4 rounded-xl text-xs flex items-center gap-3 border"
          style={{ background: "rgba(0,74,48,0.06)", borderColor: "rgba(0,74,48,0.2)", color: "#004A30" }}
        >
          <Check className="w-5 h-5 text-npa shrink-0" />
          <span>Sua vaga é ativada instantaneamente após a publicação para o algoritmo de match.</span>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            type="submit"
            className="npa-btn-primary w-full sm:w-auto justify-center py-3.5 rounded-xl text-sm"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Publicar Vaga Instantaneamente</span>
          </button>
        </div>

      </form>

    </main>
  );
}
