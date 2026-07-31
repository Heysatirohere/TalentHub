"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LogIn, GraduationCap, ShieldCheck, Briefcase,
  ArrowRight, UserPlus, AlertCircle, KeyRound, Mail,
  Sparkles, Loader2, Sun, Moon
} from "lucide-react";
import { useTalent, UserRole } from "@/context/TalentContext";
import { loginUser } from "@/services/authService";
import { useTheme } from "@/context/ThemeContext";

/* ── Logo SVG NPA ───────────────────────────────── */
function NpaLogomark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <rect width="44" height="44" rx="13" fill="#00FF55" />
      <path d="M8 12v20M8 12l11 12V12M19 32V12" stroke="#004A30" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="33" cy="14" r="3" fill="#004A30"/>
      <path d="M25 32l5.5-11 5.5 11M26.8 27h7.4" stroke="#004A30" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Role card (acesso rápido) ──────────────────── */
function RoleCard({
  icon: Icon, title, email, tag, accent, onEnter, isLoading, loadingTarget, target,
}: {
  icon: React.ElementType; title: string; email: string; tag: string;
  accent: string; onEnter: () => void; isLoading: boolean; loadingTarget: string | null; target: string;
}) {
  const loading = isLoading && loadingTarget === target;
  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={onEnter}
      className="group w-full text-left rounded-2xl border p-4 flex items-center justify-between gap-3 transition-all disabled:opacity-60"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-base)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = accent;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${accent}22`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-base)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
        >
          {loading
            ? <Loader2 className="w-5 h-5 animate-spin" style={{ color: accent }} />
            : <Icon className="w-5 h-5" style={{ color: accent }} strokeWidth={1.8} />
          }
        </div>
        <div>
          <p className="text-xs font-bold text-head leading-none mb-0.5">{title}</p>
          <p className="text-[11px] text-muted">{email}</p>
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: accent }}
          >
            {tag}
          </span>
        </div>
      </div>
      <ArrowRight
        className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform"
        style={{ color: accent, opacity: 0.7 }}
      />
    </button>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginAs } = useTalent();
  const { theme, toggle } = useTheme();

  const initialMode = searchParams.get("mode") === "login" ? "login" : "quick";
  const [activeTab, setActiveTab] = useState<"quick" | "login">(initialMode);
  const [emailInput, setEmailInput] = useState("");
  const [senhaInput, setSenhaInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingTarget, setLoadingTarget] = useState<string | null>(null);

  const handleAuthResponse = (
    result: { success: boolean; error?: string; role?: string; email?: string; ra?: string }
  ) => {
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

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!emailInput.trim() || !senhaInput.trim()) {
      setErrorMessage("Preencha o e-mail e a senha.");
      return;
    }
    setIsLoading(true);
    setLoadingTarget("form");
    try {
      const response = await loginUser(emailInput, senhaInput);
      handleAuthResponse(response);
    } catch {
      setErrorMessage("Erro no servidor ao realizar login.");
      setIsLoading(false);
      setLoadingTarget(null);
    }
  };

  const handleQuickLogin = async (email: string, password: string, label: string) => {
    setErrorMessage(null);
    setIsLoading(true);
    setLoadingTarget(label);
    try {
      const response = await loginUser(email, password);
      handleAuthResponse(response);
    } catch {
      setErrorMessage(`Erro ao conectar com a conta ${label}.`);
      setIsLoading(false);
      setLoadingTarget(null);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto animate-fade-up">

      {/* ── Card principal ── */}
      <div
        className="rounded-3xl border overflow-hidden"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-base)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Linha de acento superior */}
        <div className="h-1 bg-gradient-to-r from-[#004A30] via-[#00FF55] to-[#004A30]" />

        <div className="p-7 space-y-6">

          {/* ── Header ── */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <NpaLogomark size={40} />
              <div>
                <h1 className="text-xl font-black text-head tracking-tight leading-none">NPA</h1>
                <p className="text-[11px] text-muted uppercase tracking-widest font-medium">
                  FECAP — Acesso
                </p>
              </div>
            </div>
            <button
              onClick={toggle}
              className="npa-btn-ghost w-8 h-8 p-0 justify-center"
              aria-label="Alternar tema"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* ── Tabs ── */}
          <div
            className="grid grid-cols-2 gap-1 p-1 rounded-xl text-xs"
            style={{ background: "var(--bg-sunken)" }}
          >
            {[
              { id: "quick" as const, label: "Acesso Rápido", icon: Sparkles },
              { id: "login" as const, label: "Com Senha",     icon: KeyRound  },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => { setActiveTab(id); setErrorMessage(null); }}
                className="py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all"
                style={
                  activeTab === id
                    ? { background: "var(--bg-surface)", color: "#004A30", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-base)" }
                    : { color: "var(--text-muted)", background: "transparent", border: "1px solid transparent" }
                }
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* ── Erro ── */}
          {errorMessage && (
            <div
              className="p-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in"
              style={{ background: "var(--red-bg)", borderColor: "var(--red-border)", border: "1px solid", color: "var(--red-text)" }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          {/* ── Acesso Rápido (MVP) ── */}
          {activeTab === "quick" && (
            <div className="space-y-3 animate-fade-in">
              <p
                className="text-center text-[11px] py-2 px-3 rounded-xl font-medium"
                style={{ background: "var(--bg-raised)", color: "var(--text-muted)", border: "1px solid var(--border-light)" }}
              >
                💡 Contas de demonstração — senha: <code className="font-mono font-bold">123456</code>
              </p>

              <RoleCard
                icon={GraduationCap}
                title="Hub do Aluno"
                email="aluno1@fecap.br"
                tag="Gabriel Silva · Match 93%"
                accent="#004A30"
                target="Aluno"
                isLoading={isLoading}
                loadingTarget={loadingTarget}
                onEnter={() => handleQuickLogin("aluno1@fecap.br", "123456", "Aluno")}
              />
              <RoleCard
                icon={Briefcase}
                title="Hub Empresas"
                email="empresa@tech.com"
                tag="TechInova IA · Gestão de Vagas"
                accent="#006944"
                target="Empresa"
                isLoading={isLoading}
                loadingTarget={loadingTarget}
                onEnter={() => handleQuickLogin("empresa@tech.com", "123456", "Empresa")}
              />
              <RoleCard
                icon={ShieldCheck}
                title="Hub Master"
                email="master@fecap.br"
                tag="Coordenação FECAP · Aprovações"
                accent="#008040"
                target="Master"
                isLoading={isLoading}
                loadingTarget={loadingTarget}
                onEnter={() => handleQuickLogin("master@fecap.br", "123456", "Master")}
              />
            </div>
          )}

          {/* ── Login com Senha ── */}
          {activeTab === "login" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4 animate-fade-in">
              <div className="space-y-1.5">
                <label
                  className="block text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  E-mail Institucional
                </label>
                <div className="relative">
                  <Mail
                    className="w-4 h-4 absolute left-3 top-2.5"
                    style={{ color: "var(--text-subtle)" }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="aluno1@fecap.br"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="npa-input pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  className="block text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Senha
                </label>
                <div className="relative">
                  <KeyRound
                    className="w-4 h-4 absolute left-3 top-2.5"
                    style={{ color: "var(--text-subtle)" }}
                  />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={senhaInput}
                    onChange={(e) => setSenhaInput(e.target.value)}
                    className="npa-input pl-9"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="npa-btn-primary w-full justify-center py-3 rounded-xl text-sm disabled:opacity-60"
              >
                {isLoading && loadingTarget === "form" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Validando...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Entrar
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── Footer do card ── */}
          <div
            className="pt-4 text-center"
            style={{ borderTop: "1px solid var(--border-light)" }}
          >
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-head transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Criar cadastro de Aluno FECAP
            </Link>
          </div>

        </div>
      </div>

      {/* ── Back link ── */}
      <p className="text-center mt-4 text-xs text-muted">
        <Link href="/" className="hover:text-head transition-colors font-medium">
          ← Voltar ao início
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main
      className="flex-1 flex items-center justify-center min-h-screen py-12 px-4"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Blob decorativo */}
      <div
        aria-hidden="true"
        className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #00FF55 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
      />
      <div
        aria-hidden="true"
        className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, #004A30 0%, transparent 70%)", transform: "translate(-30%, 30%)" }}
      />

      <Suspense fallback={
        <div className="text-center text-muted text-xs">Carregando...</div>
      }>
        <LoginFormContent />
      </Suspense>
    </main>
  );
}
