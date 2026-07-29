"use client";

import React from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  BrainCircuit, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck,
  User,
  Sparkles
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { SOFT_SKILLS_LABELS } from "@/types/talent";

export default function HubAlunoDashboard() {
  const { currentAluno } = useTalent();

  if (!currentAluno) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Nenhum aluno selecionado. Por favor, acesse a página de login.</p>
        <Link href="/login" className="text-teal-400 font-bold underline mt-2 block">
          Ir para Login
        </Link>
      </div>
    );
  }

  const experiencias = currentAluno.experiencias || [];
  const documentos = currentAluno.packDocumentos || [];

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      
      {/* Header Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center space-x-5">
          <img
            src={currentAluno.avatarUrl}
            alt={currentAluno.nome}
            className="w-20 h-20 rounded-2xl border-2 border-teal-400 object-cover shadow-xl"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                RA: {currentAluno.ra}
              </span>
              <span className="text-xs text-slate-400">{currentAluno.idade} anos</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{currentAluno.nome}</h1>
            <p className="text-xs text-slate-400">
              {currentAluno.curso} &bull; {currentAluno.semestre}º Semestre FECAP &bull; {currentAluno.email}
            </p>
          </div>
        </div>

        {/* Action Status */}
        <div className="flex items-center space-x-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div className="text-right">
            <p className="text-xs text-slate-400">Pack de Documentos</p>
            <p className="text-sm font-bold text-emerald-400 flex items-center space-x-1 justify-end">
              <CheckCircle2 className="w-4 h-4" />
              <span>{documentos.length} Enviado(s)</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3 Core Hub Cards for Students */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Testes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-teal-500/40 transition-colors flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-teal-400" />
            </div>
            <h2 className="text-lg font-bold text-white">1. Teste Vocacional & SoftSkills</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Realize os testes interativos nativos para recalcular suas competências técnicas (Hard Skills) e mapear suas Soft Skills obrigatórias para vagas.
            </p>
          </div>
          <Link
            href="/aluno/testes"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-teal-500 hover:text-slate-950 font-bold text-xs text-slate-200 flex items-center justify-center space-x-1 transition-all"
          >
            <span>Fazer / Refazer Testes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 2: Experiências */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/40 transition-colors flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-white">2. Cadastrar Experiências</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adicione históricos de estágios, projetos acadêmicos, trabalhos voluntários ou participação no Diretório / Empresa Júnior FECAP.
            </p>
            <p className="text-xs text-emerald-400 font-semibold">
              {experiencias.length} experiência(s) cadastrada(s)
            </p>
          </div>
          <Link
            href="/aluno/experiencias"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs text-slate-200 flex items-center justify-center space-x-1 transition-all"
          >
            <span>Gerenciar Experiências</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 3: Pack de Documentos */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-colors flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-lg font-bold text-white">3. Pack de Documentos</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Envie de forma simulada seu Comprovante de Matrícula, Histórico Acadêmico, RG/CPF e Certificados para validação junto aos recrutadores.
            </p>
          </div>
          <Link
            href="/aluno/documentos"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 font-bold text-xs text-slate-200 flex items-center justify-center space-x-1 transition-all"
          >
            <span>Enviar / Ver Documentos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Detailed Profile Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Soft skills badges */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Suas Soft Skills Mapeadas</span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(SOFT_SKILLS_LABELS) as (keyof typeof SOFT_SKILLS_LABELS)[]).map((key) => {
              const active = currentAluno.softSkills[key];
              return (
                <div
                  key={key}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                    active
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                      : "bg-slate-950 border-slate-800 text-slate-500"
                  }`}
                >
                  <span>{SOFT_SKILLS_LABELS[key]}</span>
                  <span className="text-[9px] font-mono">{active ? "OK" : "Off"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Experiencias ativas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>Histórico de Experiências</span>
          </h3>
          
          {experiencias.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Nenhuma experiência cadastrada ainda.</p>
          ) : (
            <div className="space-y-3">
              {experiencias.map((exp) => (
                <div key={exp.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{exp.cargo}</span>
                    <span className="text-[10px] text-emerald-400">{exp.periodo}</span>
                  </div>
                  <p className="text-xs text-teal-400 font-semibold">{exp.empresa}</p>
                  <p className="text-xs text-slate-400">{exp.descricao}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </main>
  );
}
