"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Check,
  Award,
  ShieldCheck,
  KeyRound,
  Mail,
  AlertCircle
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { SoftSkills, SOFT_SKILLS_LABELS, IItemHistorico } from "@/types/talent";
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

export default function CadastroAlunoPage() {
  const router = useRouter();
  const { adicionarAluno, loginAs } = useTalent();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [ra, setRa] = useState(() => "260" + Math.floor(1000 + Math.random() * 9000));
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [curso, setCurso] = useState(CURSOS_FECAP[0]);
  const [semestre, setSemestre] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Recalcular automaticamente o semestre quando o RA for alterado
  useEffect(() => {
    const info = parseRA(ra);
    if (info.statusRA === "Válido") {
      setSemestre(info.semestreSugerido);
    }
  }, [ra]);

  // Soft Skills
  const [softSkills, setSoftSkills] = useState<SoftSkills>({
    comunicacao: true,
    trabalhoEmEquipe: true,
    lideranca: false,
    resolucaoProblemas: true,
    adaptabilidade: true,
    pensamentoCritico: false,
  });

  const [feedbackInput, setFeedbackInput] = useState(
    "Aluno proativo em sala de aula, demonstrando excelente capacidade de aprendizado autônomo e colaboração em trabalhos em grupo."
  );

  const toggleSoftSkill = (key: keyof SoftSkills) => {
    setSoftSkills((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const generateDefaultHistorico = (): IItemHistorico[] => {
    if (curso.includes("Computação") || curso.includes("Sistemas")) {
      return [
        { materia: "Engenharia de Software", nota: 9.0, semestre: "2025.2" },
        { materia: "Desenvolvimento Web Front-End", nota: 9.2, semestre: "2025.1" },
        { materia: "Banco de Dados SQL", nota: 8.8, semestre: "2024.2" },
        { materia: "Cybersecurity", nota: 8.5, semestre: "2024.1" },
      ];
    }
    if (curso.includes("Administração") || curso.includes("Economia")) {
      return [
        { materia: "Gestão Estratégica & Negócios", nota: 9.5, semestre: "2025.2" },
        { materia: "Matemática Financeira", nota: 9.0, semestre: "2025.1" },
        { materia: "Finanças Corporativas", nota: 9.2, semestre: "2024.2" },
        { materia: "Análise de Dados para Gestão", nota: 8.7, semestre: "2024.1" },
      ];
    }
    return [
      { materia: "UX/UI Design & Prototipagem", nota: 9.4, semestre: "2025.2" },
      { materia: "Branding e Identidade Visual", nota: 9.0, semestre: "2025.1" },
      { materia: "Marketing Digital & Growth", nota: 9.1, semestre: "2024.2" },
      { materia: "Pesquisa de Mercado", nota: 8.5, semestre: "2024.1" },
    ];
  };

  const handleFinishRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!nome.trim() || !email.trim() || !senha.trim() || !ra.trim()) {
      setErrorMessage("Por favor, preencha nome, RA, e-mail e senha.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErrorMessage("As senhas digitadas não coincidem.");
      return;
    }

    const defaultHistorico = generateDefaultHistorico();

    // 1. Criar o User no Supabase PostgreSQL via Server Action
    const regResult = await registerUser({
      email,
      senha,
      role: "ALUNO",
      ra,
      nome,
      curso,
      semestre,
      idade: 21,
    });

    if (!regResult.success) {
      setErrorMessage(regResult.error || "Erro ao registrar usuário.");
      return;
    }

    // 2. Adicionar no contexto da aplicação
    await adicionarAluno({
      ra,
      nome,
      email,
      curso,
      semestre,
      idade: 21,
      feedbacksProfessores: [
        feedbackInput,
        `Recomendado pelo corpo docente da FECAP para vagas em ${curso}.`
      ],
      softSkills,
      historicoAcademico: defaultHistorico,
    });

    loginAs("aluno", ra);
    router.push("/aluno");
  };

  const infoRA = parseRA(ra);

  return (
    <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Page Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Portal do Estudante FECAP</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Cadastro do Estudante FECAP</h1>
        <p className="text-slate-400 text-sm mt-1">
          Preencha seus dados com RA e senha para ter seu Histórico Escolar vinculado.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Stepper Progress Header */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -z-10 transform -translate-y-1/2" />
        
        {[
          { num: 1, title: "Dados & Senha" },
          { num: 2, title: "Soft Skills" },
          { num: 3, title: "Revisão & Envio" },
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                step === s.num
                  ? "bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/30 ring-4 ring-slate-950"
                  : step > s.num
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {step > s.num ? <Check className="w-5 h-5" /> : s.num}
            </div>
            <span className="text-[11px] font-medium text-slate-400 mt-2 hidden sm:block">
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Step Form Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        
        {/* STEP 1: DADOS PESSOAIS E SENHA */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <User className="w-5 h-5 text-teal-400" />
              <span>Etapa 1: Dados Pessoais, RA e Senha</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  RA (Registro Acadêmico) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 26028671"
                  value={ra}
                  onChange={(e) => setRa(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                />
                <span className="text-[11px] text-teal-400 mt-1 block font-mono">
                  Vinculado: {infoRA.anoIngresso} ({infoRA.anoLetivo} &bull; {infoRA.semestreEfetivo}º Semestre DB)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo de Souza"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  E-mail FECAP *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="seu.nome@aluno.fecap.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Curso FECAP
                </label>
                <select
                  value={curso}
                  onChange={(e) => setCurso(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                >
                  {CURSOS_FECAP.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Senha de Acesso *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Confirmar Senha *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Repita a senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!nome || !email || !senha) {
                    alert("Preencha nome, e-mail e senha para prosseguir.");
                    return;
                  }
                  if (senha !== confirmarSenha) {
                    alert("As senhas não coincidem.");
                    return;
                  }
                  setStep(2);
                }}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center space-x-2 transition-colors"
              >
                <span>Avançar para Soft Skills</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: AUTOAVALIAÇÃO DE SOFT SKILLS */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Etapa 2: Mapeamento de Soft Skills (Competências Comportamentais)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Selecione as competências comportamentais com as quais você se identifica.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {(Object.keys(SOFT_SKILLS_LABELS) as (keyof SoftSkills)[]).map((key) => {
                const checked = softSkills[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSoftSkill(key)}
                    className={`p-4 rounded-xl text-left border flex items-center justify-between transition-all ${
                      checked
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${checked ? "bg-amber-500 border-amber-500 text-slate-950" : "border-slate-700"}`}>
                        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm font-semibold">{SOFT_SKILLS_LABELS[key]}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-800 flex flex-col-reverse sm:flex-row justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm flex items-center justify-center space-x-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 transition-colors"
              >
                <span>Revisão Final</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVISÃO & CONFIRMAÇÃO */}
        {step === 3 && (
          <form onSubmit={handleFinishRegistration} className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Etapa 3: Resumo do Perfil & Finalização</span>
            </h2>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-sm">
              <div className="flex flex-col sm:flex-row justify-between border-b border-slate-800/80 pb-3 gap-2">
                <div>
                  <p className="text-lg font-bold text-white">{nome}</p>
                  <p className="text-xs text-slate-400">RA {ra} &bull; {email} &bull; {curso} ({semestre}º Semestre)</p>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 self-start">
                  Integração FECAP Ativa
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Disciplinas Importadas do Histórico FECAP</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {generateDefaultHistorico().map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                      <span className="text-white font-medium">{item.materia}</span>
                      <span className="font-mono font-bold text-emerald-400">{item.nota.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex flex-col-reverse sm:flex-row justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm flex items-center justify-center space-x-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-transform duration-150 active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>Concluir Cadastro com Senha</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </main>
  );
}
