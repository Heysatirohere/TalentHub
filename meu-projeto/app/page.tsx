"use client";

import Link from "next/link";
import { 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  LogIn, 
  UserPlus,
  Sparkles,
  Users,
  CheckCircle2,
  BrainCircuit
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";

export default function Home() {
  const { alunos, vagas } = useTalent();

  const vagasAprovadas = vagas.filter((v) => v.status === "aprovada").length;

  return (
    <main className="flex-1 flex flex-col justify-between bg-slate-950">
      {/* Public Header for Landing Page */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                FECAP <span className="text-teal-400">TalentHub</span>
              </span>
              <span className="block text-[10px] font-medium text-slate-400 -mt-1 uppercase tracking-wider">
                Recrutamento & Match
              </span>
            </div>
          </Link>

          <Link
            href="/login"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition-all"
          >
            <LogIn className="w-4 h-4 text-slate-950" />
            <span>Entrar / Selecionar Perfil</span>
          </Link>
        </div>
      </header>

      {/* Hero Section SaaS Style */}
      <section className="relative overflow-hidden py-20 md:py-28 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-950/40 via-slate-950 to-slate-950 -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            
            {/* Top Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold tracking-wide uppercase shadow-sm">
              <GraduationCap className="w-4 h-4 text-teal-400" />
              <span>Fundação Escola de Comércio Álvares Penteado</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                TalentHub <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">FECAP</span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-slate-200 tracking-tight">
                Inteligência de Recrutamento Universitário & Match de Habilidades
              </p>
            </div>

            {/* Subtitle with High Contrast */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
              Ecossistema integrado para conexão entre estudantes, coordenação docente e mercado corporativo com avaliação de Soft Skills e Média Ponderada Técnica.
            </p>

            {/* Premium Clean CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-teal-500/20 flex items-center justify-center space-x-2.5 group transition-all duration-200"
              >
                <span>Acessar Plataforma</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/cadastro"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800/90 text-white font-semibold text-sm border border-slate-700/80 flex items-center justify-center space-x-2 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-teal-400" />
                <span>Novo Aluno (Cadastrar via RA)</span>
              </Link>
            </div>

            {/* Refactored Stats Cards (SaaS Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-800/80 mt-12">
              
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/30 transition-all shadow-xl text-center space-y-1">
                <div className="flex justify-center mb-2">
                  <Users className="w-5 h-5 text-teal-400" />
                </div>
                <p className="text-4xl sm:text-5xl font-extrabold text-teal-400 tracking-tight">{alunos.length}</p>
                <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Estudantes Cadastrados</p>
                <p className="text-[11px] text-slate-500">Base FECAP atualizada</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-all shadow-xl text-center space-y-1">
                <div className="flex justify-center mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-4xl sm:text-5xl font-extrabold text-emerald-400 tracking-tight">{vagasAprovadas}</p>
                <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Campanhas Aprovadas</p>
                <p className="text-[11px] text-slate-500">Validadas pelo Master</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all shadow-xl text-center space-y-1">
                <div className="flex justify-center mb-2">
                  <BrainCircuit className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-4xl sm:text-5xl font-extrabold text-cyan-400 tracking-tight">3 Hubs</p>
                <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Módulos Conectados</p>
                <p className="text-[11px] text-slate-500">Aluno &bull; Master &bull; Empresa</p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3 Hubs Institutional Overview */}
      <section className="py-20 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">Arquitetura em Três Hubs</h2>
            <p className="text-slate-400 text-sm">
              Conheça os fluxos de trabalho projetados para cada ator da plataforma.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Hub 1: Aluno */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 hover:border-emerald-500/40 transition-all shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Hub do Aluno</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Realize os testes de nivelamento técnico e soft skills, gerencie suas experiências profissionais e envie o pack de documentos para validação acadêmica.
                </p>
              </div>
              <Link
                href="/login?role=aluno"
                className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-2"
              >
                <span>Acessar Hub do Aluno</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Hub 2: Master */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 hover:border-cyan-500/40 transition-all shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Hub Master / Coordenação</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Painel de governança universitária com tempo médio de match, estatísticas globais de habilidades da FECAP e auditoria de aprovação de vagas.
                </p>
              </div>
              <Link
                href="/login?role=master"
                className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-2"
              >
                <span>Acessar Hub Master</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Hub 3: Empresa */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 hover:border-teal-500/40 transition-all shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Hub da Empresa</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Publique campanhas de estágio/vagas com pesos técnicos e utilize o módulo de **Busca Ativa** para prospecção proativa de talentos sem necessidade de vaga aberta.
                </p>
              </div>
              <Link
                href="/login?role=empresa"
                className="inline-flex items-center space-x-2 text-xs font-bold text-teal-400 hover:text-teal-300 pt-2"
              >
                <span>Acessar Hub da Empresa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-teal-400" />
            <span className="font-semibold text-slate-300">Fundação Escola de Comércio Álvares Penteado (FECAP)</span>
          </div>
          <p>© {new Date().getFullYear()} TalentHub FECAP &bull; Banco de Talentos Universitário</p>
        </div>
      </footer>

    </main>
  );
}
