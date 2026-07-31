"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home, LogIn } from "lucide-react";

export default function AcessoNegadoPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-md w-full text-center space-y-8 animate-fade-up">
        {/* Ícone de Alerta com Efeito Glow */}
        <div className="relative inline-flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-30"
            style={{ background: "#EF4444" }}
          />
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center relative border"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              borderColor: "rgba(239, 68, 68, 0.25)",
            }}
          >
            <ShieldAlert className="w-10 h-10 text-red-500" strokeWidth={2} />
          </div>
        </div>

        {/* Título e Mensagem */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider text-red-500 border-red-500/20 bg-red-500/10">
            403 &bull; Acesso Negado
          </div>
          <h1 className="text-3xl font-black tracking-tight text-head">
            Permissão Insuficiente
          </h1>
          <p className="text-sm text-muted leading-relaxed max-w-sm mx-auto">
            Você não possui autorização para acessar esta página ou recurso. O sistema NPA aplica políticas estritas de controle de acesso por perfil (RBAC).
          </p>
        </div>

        {/* Card Informativo */}
        <div className="npa-card rounded-2xl p-5 border text-left space-y-2 text-xs">
          <p className="font-bold text-head flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Por que estou vendo esta página?
          </p>
          <ul className="text-muted list-disc list-inside space-y-1">
            <li>Você tentou acessar a área de um perfil diferente do seu (Ex: Aluno acessando área Empresa).</li>
            <li>Sua sessão pode ter expirado ou exige que você faça login novamente.</li>
          </ul>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="npa-btn-ghost w-full sm:w-auto justify-center px-5 py-2.5 text-xs rounded-xl flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Página Inicial</span>
          </Link>
          <Link
            href="/login"
            className="npa-btn-primary w-full sm:w-auto justify-center px-6 py-2.5 text-xs rounded-xl flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Alternar Conta / Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
