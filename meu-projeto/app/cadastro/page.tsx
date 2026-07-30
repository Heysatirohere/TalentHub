"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  UserPlus, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  LogIn,
  KeyRound,
  Mail,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { registerUser } from "@/services/authService";
import { parseRA } from "@/lib/fecapRa";

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

  // Recalcular automaticamente o semestre quando o RA for alterado
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
      setErrorMessage("Por favor, preencha todos os campos obrigatórios (RA, Nome, E-mail e Senha).");
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
      // 1. Criar o User com senha criptografada via Server Action
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

      // 2. Adicionar no contexto de aplicação
      await adicionarAluno({
        ra,
        nome,
        email,
        curso,
        semestre,
        idade,
        feedbacksProfessores: [
          `Aluno cadastrado com sucesso no RA ${ra} e aprovado pela Secretaria Acadêmica FECAP.`,
        ],
        softSkills: {
          comunicacao: true,
          trabalhoEmEquipe: true,
          lideranca: false,
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
    } catch (err: any) {
      console.error("Erro no cadastro:", err);
      setErrorMessage("Erro inesperado durante o cadastro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const infoRA = parseRA(ra);

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6 text-slate-950" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Criar Perfil de Aluno FECAP</h1>
          <p className="text-xs text-slate-400">
            Preencha seus dados acadêmicos e defina sua senha para acessar o sistema.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                RA (Registro Acadêmico) *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: 26028671"
                value={ra}
                onChange={(e) => setRa(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-teal-500"
              />
              <span className="text-[10px] text-teal-400 mt-1 block">
                Ano Ingresso: {infoRA.anoIngresso} &bull; {infoRA.anoLetivo}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Idade *
              </label>
              <input
                type="number"
                required
                min={17}
                max={99}
                value={idade}
                onChange={(e) => setIdade(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Lucas Ferreira"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              E-mail Institucional *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="seu.nome@aluno.fecap.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Senha e Confirmar Senha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Senha de Acesso *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Confirmar Senha *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Repita a senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Curso FECAP
              </label>
              <select
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
              >
                {CURSOS_FECAP.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Semestre Atual Gravado no Banco ({semestre}º)
              </label>
              <input
                type="range"
                min={1}
                max={8}
                value={semestre}
                onChange={(e) => setSemestre(Number(e.target.value))}
                className="w-full accent-teal-500 mt-2"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Ajuste manualmente em caso de reprovação/trancamento.
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            <span>{isSubmitting ? "Criando Perfil com Hashing..." : "Criar Perfil & Entrar no Hub do Aluno"}</span>
          </button>

        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <Link href="/login" className="text-xs text-slate-400 hover:text-white flex items-center justify-center space-x-1">
            <LogIn className="w-3.5 h-3.5 text-teal-400" />
            <span>Já possui conta cadastrada? Fazer Login</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
