"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  TrendingUp, 
  BrainCircuit,
  GraduationCap
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { SOFT_SKILLS_LABELS, SoftSkills } from "@/types/talent";

export default function MasterDashboardPage() {
  const { alunos, vagas } = useTalent();

  const pendentesCount = vagas.filter((v) => v.status === "pendente_aprovacao").length;
  const aprovadasCount = vagas.filter((v) => v.status === "aprovada").length;
  const rejeitadasCount = vagas.filter((v) => v.status === "rejeitada").length;

  // Calculo de estatísticas gerais de Soft Skills na universidade
  const softSkillsStats = useMemo(() => {
    const totalAlunos = alunos.length || 1;
    const stats: Record<keyof SoftSkills, number> = {
      comunicacao: 0,
      trabalhoEmEquipe: 0,
      lideranca: 0,
      resolucaoProblemas: 0,
      adaptabilidade: 0,
      pensamentoCritico: 0,
    };

    alunos.forEach((a) => {
      (Object.keys(stats) as (keyof SoftSkills)[]).forEach((key) => {
        if (a.softSkills?.[key] || a.progressosTrilha?.some(p => p.trilhaNome.toLowerCase() === key.toLowerCase() && p.status !== "EM_TRILHA")) stats[key]++;
      });
    });

    return (Object.keys(stats) as (keyof SoftSkills)[]).map((key) => ({
      key,
      label: SOFT_SKILLS_LABELS[key],
      count: stats[key],
      percent: Math.round((stats[key] / totalAlunos) * 100),
    }));
  }, [alunos]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Painel da Coordenação Master FECAP</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Métricas de Match & Governança</h1>
          <p className="text-slate-400 text-sm mt-1">
            Acompanhamento analítico da empregabilidade universitária e auditoria de campanhas empresariais.
          </p>
        </div>

        {/* Action Call for Pending Approvals */}
        <Link
          href="/master/campanhas"
          className={`px-6 py-3.5 rounded-2xl font-bold text-xs flex items-center space-x-2 transition-all border ${
            pendentesCount > 0
              ? "bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20"
              : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Fila de Aprovação ({pendentesCount} Pendente)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Tempo Médio de Match</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">4.2 <span className="text-sm font-normal text-slate-400">Dias</span></p>
          <p className="text-[11px] text-emerald-400 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>18% mais rápido que o trimestre anterior</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Total de Alunos Base</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-3xl font-extrabold text-teal-400">{alunos.length}</p>
          <p className="text-[11px] text-slate-400">Perfís acadêmicos ativos</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Campanhas Aprovadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">{aprovadasCount}</p>
          <p className="text-[11px] text-slate-400">Vagas corporativas no ar</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Campanhas Pendentes</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400">{pendentesCount}</p>
          <p className="text-[11px] text-amber-300 font-medium">Aguardando aceite da coordenação</p>
        </div>

      </div>

      {/* Analytics Section: Soft Skills Distribution across FECAP Students */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Soft Skills Distribution */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-cyan-400" />
              <span>Distribuição de Soft Skills nos Alunos FECAP</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Porcentagem de estudantes com validação em cada competência comportamental.
            </p>
          </div>

          <div className="space-y-4">
            {softSkillsStats.map((item) => (
              <div key={item.key} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.label}</span>
                  <span className="font-bold text-cyan-400">
                    {item.percent}% ({item.count} de {alunos.length} alunos)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Campaign Approval Preview */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Governança de Campanhas Empresariais</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Todas as vagas submetidas por recrutadores passam pela aprovação da Coordenação Master FECAP antes de ficarem visíveis para os alunos ou entrarem no algoritmo de match.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span>Vagas no ar (Aprovadas)</span>
                <span className="font-bold text-emerald-400">{aprovadasCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span>Vagas em análise (Pendentes)</span>
                <span className="font-bold text-amber-400">{pendentesCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span>Vagas devolvidas (Rejeitadas)</span>
                <span className="font-bold text-rose-400">{rejeitadasCount}</span>
              </div>
            </div>
          </div>

          <Link
            href="/master/campanhas"
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
          >
            <span>Ir para Fila de Aprovação de Campanhas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </main>
  );
}
