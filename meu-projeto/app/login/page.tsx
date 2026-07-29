"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  LogIn, 
  GraduationCap, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight, 
  UserPlus
} from "lucide-react";
import { useTalent, UserRole } from "@/context/TalentContext";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { alunos, loginAs } = useTalent();

  const roleParam = searchParams.get("role") as UserRole | null;

  const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
    if (roleParam && ["aluno", "master", "empresa"].includes(roleParam)) {
      return roleParam;
    }
    return "aluno";
  });
  const [selectedRa, setSelectedRa] = useState<string>(alunos[0]?.ra || "26028671");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginAs(selectedRole, selectedRole === "aluno" ? selectedRa : undefined);

    if (selectedRole === "aluno") {
      router.push("/aluno");
    } else if (selectedRole === "master") {
      router.push("/master");
    } else {
      router.push("/empresa");
    }
  };

  return (
    <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
          <LogIn className="w-6 h-6 text-slate-950" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Autenticação FECAP</h1>
        <p className="text-xs text-slate-400">
          Selecione seu perfil para ser direcionado ao seu Hub correspondente.
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => setSelectedRole("aluno")}
          className={`py-2 rounded-xl font-bold flex flex-col items-center space-y-1 transition-all ${
            selectedRole === "aluno"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Aluno</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedRole("master")}
          className={`py-2 rounded-xl font-bold flex flex-col items-center space-y-1 transition-all ${
            selectedRole === "master"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Master</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedRole("empresa")}
          className={`py-2 rounded-xl font-bold flex flex-col items-center space-y-1 transition-all ${
            selectedRole === "empresa"
              ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Empresa</span>
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        
        {selectedRole === "aluno" && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Selecione o Registro Acadêmico (RA)
            </label>
            <select
              value={selectedRa}
              onChange={(e) => setSelectedRa(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {alunos.map((a) => (
                <option key={a.id} value={a.ra}>
                  RA: {a.ra} - {a.nome} ({a.curso})
                </option>
              ))}
            </select>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Primeiro acesso?</span>
              <Link href="/cadastro" className="text-emerald-400 hover:underline font-bold">
                Cadastrar via RA &rarr;
              </Link>
            </div>
          </div>
        )}

        {selectedRole === "master" && (
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-2 text-xs text-cyan-200">
            <div className="flex items-center space-x-2 font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Perfil: Coordenação Master</span>
            </div>
            <p className="text-slate-300">
              Você será direcionado para o Hub Master (`/master`) com controle de aprovação de vagas e estatísticas institucionais.
            </p>
          </div>
        )}

        {selectedRole === "empresa" && (
          <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 space-y-2 text-xs text-teal-200">
            <div className="flex items-center space-x-2 font-bold text-white">
              <Briefcase className="w-4 h-4 text-teal-400" />
              <span>Perfil: Recrutador / Empresa</span>
            </div>
            <p className="text-slate-300">
              Você será direcionado para o Hub da Empresa (`/empresa`) com abertura de vagas e **Busca Ativa de Talentos**.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 flex items-center justify-center space-x-2 transition-all"
        >
          <span>Confirmar Login & Ir para o Hub</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </form>

      <div className="pt-4 border-t border-slate-800 text-center">
        <Link href="/cadastro" className="text-xs text-slate-400 hover:text-white flex items-center justify-center space-x-1">
          <UserPlus className="w-3.5 h-3.5 text-teal-400" />
          <span>Criar novo cadastro de Aluno FECAP</span>
        </Link>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center text-slate-400 text-xs">Carregando autenticação...</div>}>
        <LoginFormContent />
      </Suspense>
    </main>
  );
}
