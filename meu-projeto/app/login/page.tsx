"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  LogIn, 
  GraduationCap, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight, 
  UserPlus,
  AlertCircle,
  KeyRound,
  Mail,
  Sparkles,
  Loader2
} from "lucide-react";
import { useTalent, UserRole } from "@/context/TalentContext";
import { loginUser } from "@/services/authService";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginAs } = useTalent();

  // Permite receber a aba via query param (ex: /login?mode=login)
  const initialMode = searchParams.get("mode") === "login" ? "login" : "quick";
  const [activeTab, setActiveTab] = useState<"quick" | "login">(initialMode);

  // Estados para formulário de Login com Senha
  const [emailInput, setEmailInput] = useState("");
  const [senhaInput, setSenhaInput] = useState("");
  
  // Estados globais de feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingTarget, setLoadingTarget] = useState<string | null>(null);

  // Core Function: Trata o redirecionamento com base na resposta da Server Action
  const handleAuthResponse = (result: { success: boolean; error?: string; role?: string; email?: string; ra?: string }, targetLabel?: string) => {
    if (!result.success || !result.role) {
      setErrorMessage(result.error || "Falha na autenticação. Verifique os dados.");
      setIsLoading(false);
      setLoadingTarget(null);
      return;
    }

    const targetRole = result.role.toLowerCase() as UserRole;
    loginAs(targetRole, result.email || result.ra);
    router.push(`/${targetRole}`);
  };

  // 1. Ação para Aba "Login com Senha"
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailInput.trim() || !senhaInput.trim()) {
      setErrorMessage("Por favor, preencha o e-mail e a senha.");
      return;
    }

    setIsLoading(true);
    setLoadingTarget("form");

    try {
      const response = await loginUser(emailInput, senhaInput);
      handleAuthResponse(response, "form");
    } catch (err) {
      console.error("Erro ao autenticar:", err);
      setErrorMessage("Erro no servidor ao tentar realizar login.");
      setIsLoading(false);
      setLoadingTarget(null);
    }
  };

  // 2. Ação para os Botões Gigantes do "Modo Rápido (MVP)" chamando o Seed
  const handleQuickSeedLogin = async (emailSeed: string, passwordSeed: string, label: string) => {
    setErrorMessage(null);
    setIsLoading(true);
    setLoadingTarget(label);

    try {
      const response = await loginUser(emailSeed, passwordSeed);
      handleAuthResponse(response, label);
    } catch (err) {
      console.error(`Erro ao efetuar login no modo rápido (${label}):`, err);
      setErrorMessage(`Erro ao conectar com a conta de ${label}.`);
      setIsLoading(false);
      setLoadingTarget(null);
    }
  };

  return (
    <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Header Visual */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
          <LogIn className="w-6 h-6 text-slate-950" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Autenticação FECAP</h1>
        <p className="text-xs text-slate-400">
          Acesse instantaneamente no Modo MVP ou entre com e-mail e senha.
        </p>
      </div>

      {/* Tabs de Controle (Client Component State) */}
      <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => { setActiveTab("quick"); setErrorMessage(null); }}
          className={`py-2.5 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === "quick"
              ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Modo Rápido (MVP)</span>
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab("login"); setErrorMessage(null); }}
          className={`py-2.5 rounded-xl font-bold transition-all ${
            activeTab === "login"
              ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Login com Senha
        </button>
      </div>

      {/* Alerta de Mensagem de Erro */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* REQUISITO 3: MODO RÁPIDO (MVP) COM BOTÕES GIGANTES INJETANDO O SEED */}
      {activeTab === "quick" && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-300 text-center">
            💡 Utilizando contas reais geradas pelo <strong>Prisma Seed</strong> no Supabase (Senha: <code>123456</code>).
          </div>

          <div className="space-y-3">
            {/* 1. Botão Entrar como Aluno */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 space-y-3 transition-all">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Hub do Aluno (Gabriel Silva)</h3>
                  <p className="text-[11px] text-slate-400">aluno1@fecap.br &bull; Match 93% na vaga</p>
                </div>
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickSeedLogin("aluno1@fecap.br", "123456", "Aluno")}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                {isLoading && loadingTarget === "Aluno" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Autenticando via Server Action...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar como Aluno</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* 2. Botão Entrar como Empresa */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 space-y-3 transition-all">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Hub Empresa (TechInova IA)</h3>
                  <p className="text-[11px] text-slate-400">empresa@tech.com &bull; Gestão de Vagas</p>
                </div>
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickSeedLogin("empresa@tech.com", "123456", "Empresa")}
                className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
              >
                {isLoading && loadingTarget === "Empresa" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Autenticando via Server Action...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar como Empresa</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* 3. Botão Entrar como Master */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 space-y-3 transition-all">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Hub Master (Coordenação FECAP)</h3>
                  <p className="text-[11px] text-slate-400">master@fecap.br &bull; Controle de Aprovação</p>
                </div>
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickSeedLogin("master@fecap.br", "123456", "Master")}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                {isLoading && loadingTarget === "Master" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Autenticando via Server Action...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar como Master</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUISITO 2: FORMULÁRIO DE LOGIN COM SENHA */}
      {activeTab === "login" && (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              E-mail Institucional
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="ex: aluno1@fecap.br"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Senha de Acesso
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={senhaInput}
                onChange={(e) => setSenhaInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {isLoading && loadingTarget === "form" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Validando no PostgreSQL via Server Action...</span>
              </>
            ) : (
              <>
                <span>Entrar com Minhas Credenciais</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Footer */}
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
      <Suspense fallback={<div className="text-center text-slate-400 text-xs">Carregando formulário...</div>}>
        <LoginFormContent />
      </Suspense>
    </main>
  );
}
