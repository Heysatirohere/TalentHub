"use client";

import React from "react";
import Link from "next/link";
import { 
  Briefcase, 
  PlusCircle, 
  UserCheck, 
  ArrowRight, 
  Sparkles,
  Search,
  Building2
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";

export default function EmpresaDashboardPage() {
  const { vagas, alunos } = useTalent();

  const vagasAprovadas = vagas.filter((v) => v.status === "aprovada");

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/50 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Portal Corporativo & Recrutamento</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Hub da Empresa & Gestão de Talentos</h1>
          <p className="text-slate-400 text-sm mt-1">
            Abra campanhas de vaga ou faça prospecção proativa no Banco de Talentos livre da FECAP.
          </p>
        </div>

        <Link
          href="/empresa/banco-talentos"
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-teal-500/20 transition-all"
        >
          <Search className="w-4 h-4 text-slate-950" />
          <span>Explorar Busca Ativa ({alunos.length} Talentos)</span>
        </Link>
      </div>

      {/* 3 Action Cards for Empresa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Busca Ativa */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-teal-500/40 transition-colors flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <Search className="w-6 h-6 text-teal-400" />
            </div>
            <h2 className="text-lg font-bold text-white">1. Busca Ativa (Banco Livre)</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore toda a base de alunos da FECAP utilizando filtros livres de Soft Skills, notas técnicas mínimas e cursos, sem necessidade de vaga prévia.
            </p>
          </div>
          <Link
            href="/empresa/banco-talentos"
            className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
          >
            <span>Acessar Busca Ativa</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 2: Abertura de Vagas */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/40 transition-colors flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-white">2. Abertura de Vagas</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cadastre posições formais definindo pesos (0-5) em Hard Skills e soft skills obrigatórias. Requer aprovação prévia do Master FECAP.
            </p>
          </div>
          <Link
            href="/empresa/campanhas/nova"
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
          >
            <span>Criar Nova Vaga</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 3: Ranking por Vaga */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-cyan-500/40 transition-colors flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-lg font-bold text-white">3. Ranking por Match</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualize a lista de candidatos ordenados pelo algoritmo em suas vagas aprovadas e acesse os feedbacks oficiais dos docentes.
            </p>
          </div>
          <Link
            href="/empresa/filtragem"
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
          >
            <span>Ver Ranking de Candidatos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Active Campaigns Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-teal-400" />
          <span>Suas Campanhas Ativas ({vagas.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vagas.map((vaga) => (
            <div key={vaga.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400">{vaga.tipoContrato}</span>
                <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${vaga.status === 'aprovada' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                  {vaga.status}
                </span>
              </div>
              <h3 className="font-bold text-white text-sm line-clamp-1">{vaga.titulo}</h3>
              <p className="text-xs text-slate-400">{vaga.empresa}</p>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
