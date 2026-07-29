"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Plus, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  Calendar 
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";

export default function ExperienciasAlunoPage() {
  const { currentAluno, adicionarExperienciaAluno } = useTalent();

  const [empresa, setEmpresa] = useState("");
  const [cargo, setCargo] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [descricao, setDescricao] = useState("");

  if (!currentAluno) return null;

  const handleAddExp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!empresa.trim() || !cargo.trim()) {
      alert("Informe a Empresa e o Cargo.");
      return;
    }

    await adicionarExperienciaAluno(currentAluno.id, {
      empresa,
      cargo,
      periodo: periodo || "Atual",
      descricao,
    });

    setEmpresa("");
    setCargo("");
    setPeriodo("");
    setDescricao("");

    alert("Experiência profissional adicionada ao perfil!");
  };

  const experiencias = currentAluno.experiencias || [];

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      
      <div className="flex items-center space-x-3">
        <Link href="/aluno" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Experiências Profissionais e Acadêmicas</h1>
          <p className="text-xs text-slate-400">
            Cadastre atuações corporativas, projetos de extensão ou cargos em Entidades Estudantis FECAP.
          </p>
        </div>
      </div>

      {/* Form New Experience */}
      <form onSubmit={handleAddExp} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Adicionar Nova Experiência</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Empresa / Instituição *</label>
            <input
              type="text"
              required
              placeholder="Ex: Itaú, Empresa Júnior FECAP, TechInova"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Cargo / Posição *</label>
            <input
              type="text"
              required
              placeholder="Ex: Estagiário de Dados, Desenvolvedor"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Período</label>
            <input
              type="text"
              placeholder="Ex: Jan 2025 - Atual"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Descrição Breve</label>
            <input
              type="text"
              placeholder="Ex: Desenvolvimento de dashboards e automações."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Salvar Experiência</span>
        </button>
      </form>

      {/* List Existing */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Experiências Salvas ({experiencias.length})
        </h2>

        {experiencias.length === 0 ? (
          <p className="text-xs text-slate-500 italic">Nenhuma experiência cadastrada ainda.</p>
        ) : (
          <div className="space-y-3">
            {experiencias.map((exp) => (
              <div key={exp.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white text-sm">{exp.cargo}</span>
                  <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    {exp.periodo}
                  </span>
                </div>
                <p className="text-xs text-teal-400 font-semibold flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{exp.empresa}</span>
                </p>
                <p className="text-xs text-slate-300 mt-1">{exp.descricao}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}
