"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap, ArrowRight, CheckCircle2, LogIn,
  KeyRound, Mail, AlertCircle, User, Sun, Moon
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { registerUser } from "@/services/authService";
import { parseRA } from "@/lib/fecapRa";
import { useTheme } from "@/context/ThemeContext";

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

const CURSOS_FECAP = [
  "Ciência da Computação",
  "Análise e Desenvolvimento de Sistemas",
  "Administração de Empresas",
  "Economia",
  "Publicidade e Propaganda",
  "Ciências Contábeis",
  "Relações Internacionais",
];

export default function CadastroInicialPage() {
  const router = useRouter();
  const { adicionarAluno, loginAs } = useTalent();
  const { theme, toggle } = useTheme();

  const [ra, setRa] = useState(() => "260" + Math.floor(1000 + Math.random() * 9000));
  const [nome, setNome] = useState("");
  const [curso, setCurso] = useState(CURSOS_FECAP[0]);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [idade, setIdade] = useState<number>(21);
  const [semestre, setSemestre] = useState<number>(1);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const info = parseRA(ra);
    if (info.statusRA === "Válido") {
      setSemestre(info.semestreSugerido);
    }
  }, [ra]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!ra.trim() || !nome.trim() || !email.trim() || !senha.trim()) {
      setErrorMessage("Preencha todos os campos obrigatórios.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErrorMessage("As senhas digitadas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      setErrorMessage("A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await registerUser({
        email,
        senha,
        role: "ALUNO",
        ra,
        nome,
        curso,
        semestre,
        idade,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Erro ao realizar o cadastro.");
        setIsSubmitting(false);
        return;
      }

      await adicionarAluno({
        ra,
        nome,
        email,
        curso,
        semestre,
        idade,
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250`,
        feedbacksProfessores: ["Perfil em processo de validação."],
        softSkills: {
          comunicacao: true,
          trabalhoEmEquipe: true,
          lideranca: true,
          resolucaoProblemas: true,
          adaptabilidade: true,
          pensamentoCritico: true,
        },
        historicoAcademico: [
          { materia: "Engenharia de Software", nota: 9.0, semestre: "2025.2" },
          { materia: "Desenvolvimento Web Front-End", nota: 8.8, semestre: "2025.1" },
          { materia: "Banco de Dados SQL", nota: 8.5, semestre: "2024.2" },
        ],
      });

      loginAs("aluno", ra);
      router.push("/aluno");
    } catch {
      setErrorMessage("Erro inesperado durante o cadastro.");
    } flex-1 {
      setIsSubmitting(false);
    }
  };

  const infoRA = parseRA(ra);

  return (
    <main
      className="flex-1 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="w-full max-w-lg mx-auto animate-fade-up">
        <div
          className="rounded-3xl border overflow-hidden"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-base)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {/* Top accent line */}
          <div className="h-1 bg-gradient-to-r from-[#004A30] via-[#00FF55] to-[#004A30]" />

          <div className="p-6 sm:p-8 space-y-6">

            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <NpaLogomark size={40} />
                <div>
                  <h1 className="text-xl font-black text-head tracking-tight leading-none">NPA FECAP</h1>
                  <p className="text-[11px] text-muted uppercase tracking-widest font-medium">
                    Cadastro de Aluno
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

            {errorMessage && (
              <div
                className="p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in"
                style={{ background: "var(--red-bg)", borderColor: "var(--red-border)", border: "1px solid", color: "var(--red-text)" }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
                    RA (Registro Acadêmico) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 26028671"
                    value={ra}
                    onChange={(e) => setRa(e.target.value)}
                    className="npa-input font-mono"
                  />
                  <span className="text-[10px] text-npa font-semibold block mt-0.5">
                    Ano Ingresso: {infoRA.anoIngresso} &bull; {infoRA.anoLetivo}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
                    Idade *
                  </label>
                  <input
                    type="number"
                    required
                    min={16}
                    max={99}
                    value={idade}
                    onChange={(e) => setIdade(Number(e.target.value))}
                    className="npa-input"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5" style={{ color: "var(--text-subtle)" }} />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Gabriel Silva"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="npa-input pl-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
                    Curso FECAP *
                  </label>
                  <select
                    value={curso}
                    onChange={(e) => setCurso(e.target.value)}
                    className="npa-select"
                  >
                    {CURSOS_FECAP.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
                    Semestre Atual *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={10}
                    value={semestre}
                    onChange={(e) => setSemestre(Number(e.target.value))}
                    className="npa-input"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
                  E-mail Institucional *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5" style={{ color: "var(--text-subtle)" }} />
                  <input
                    type="email"
                    required
                    placeholder="ex: aluno@fecap.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="npa-input pl-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
                    Senha de Acesso *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-2.5" style={{ color: "var(--text-subtle)" }} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="npa-input pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-2.5" style={{ color: "var(--text-subtle)" }} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      className="npa-input pl-9"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="npa-btn-primary w-full justify-center py-3.5 rounded-xl text-sm disabled:opacity-50 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? "Cadastrando..." : "Concluir Cadastro"}</span>
              </button>
            </form>

            <div className="pt-4 border-t text-center" style={{ borderColor: "var(--border-light)" }}>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-head transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                Já possui conta? Faça login aqui
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
