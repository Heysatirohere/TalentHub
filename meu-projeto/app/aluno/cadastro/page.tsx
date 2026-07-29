"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  GraduationCap, 
  BrainCircuit, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Check,
  Award,
  ShieldCheck
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { SoftSkills, HardSkills, SOFT_SKILLS_LABELS } from "@/types/talent";

// Perguntas do Teste de Nivelamento (Quiz Nativo)
interface Question {
  id: number;
  categoria: keyof HardSkills;
  tituloCategoria: string;
  pergunta: string;
  opcoes: { texto: string; pontos: number }[];
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    categoria: "tecnologia",
    tituloCategoria: "Tecnologia & Programação",
    pergunta: "Ao desenhar uma arquitetura de software para um sistema de grande porte, qual estratégia garante melhor escalabilidade e manutenibilidade?",
    opcoes: [
      { texto: "Monolito desacoplado com funções utilitárias globais.", pontos: 60 },
      { texto: "Arquitetura modular em microsserviços ou Serverless com APIs desacopladas.", pontos: 100 },
      { texto: "Banco de dados centralizado em memória sem persistência.", pontos: 30 },
      { texto: "Não me sinto confortável com arquiteturas complexas de software.", pontos: 10 },
    ],
  },
  {
    id: 2,
    categoria: "negocios",
    tituloCategoria: "Gestão & Negócios",
    pergunta: "Em um projeto de lançamento de produto, como você valida o Product-Market Fit de forma eficiente?",
    opcoes: [
      { texto: "Investindo alto em marketing antes de criar o protótipo.", pontos: 20 },
      { texto: "Criando um MVP (Produto Mínimo Viável) rápido e medindo feedbacks de usuários reais.", pontos: 100 },
      { texto: "Pesquisando concorrentes apenas em relatórios antigos.", pontos: 50 },
      { texto: "Aguardando o produto estar 100% perfeito antes de mostrar a qualquer cliente.", pontos: 30 },
    ],
  },
  {
    id: 3,
    categoria: "exatas",
    tituloCategoria: "Exatas & Análise de Dados",
    pergunta: "Como você analisa a viabilidade financeira ou retorno sobre investimento (ROI) de uma campanha?",
    opcoes: [
      { texto: "Calculando o ganho líquido dividido pelo custo total investido, analisando payback e margem.", pontos: 100 },
      { texto: "Apenas observando se o número total de seguidores aumentou.", pontos: 40 },
      { texto: "Somando os custos fixos sem considerar receita futura.", pontos: 20 },
      { texto: "Utilizando suposições sem conferir métricas financeiras.", pontos: 10 },
    ],
  },
  {
    id: 4,
    categoria: "humanas",
    tituloCategoria: "Humanas & Comunicação",
    pergunta: "Em uma situação de conflito de ideias entre dois membros sêniores da equipe, qual é a postura ideal?",
    opcoes: [
      { texto: "Ignorar o conflito e deixar que eles se resolvam sozinhos.", pontos: 20 },
      { texto: "Facilitar um debate empático focado em dados e objetivos comuns do projeto.", pontos: 100 },
      { texto: "Tomar o lado de quem fala mais alto ou com maior tempo de casa.", pontos: 30 },
      { texto: "Impor a sua própria vontade sem ouvir as duas partes.", pontos: 10 },
    ],
  },
  {
    id: 5,
    categoria: "design",
    tituloCategoria: "Design & UX/UI",
    pergunta: "Qual princípio é fundamental ao desenhar a interface de um formulário de cadastro crítico?",
    opcoes: [
      { texto: "Usar dezenas de cores chamativas e elementos piscando para atrair atenção.", pontos: 20 },
      { texto: "Minimizar a carga cognitiva, usar boa hierarquia visual, feedback claro de erros e poucas etapas.", pontos: 100 },
      { texto: "Colocar todos os campos imagináveis em uma única tela sem agrupamento.", pontos: 30 },
      { texto: "Não se preocupar com contraste de cores ou acessibilidade.", pontos: 10 },
    ],
  },
];

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
  const { adicionarAluno } = useTalent();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [curso, setCurso] = useState(CURSOS_FECAP[0]);
  const [semestre, setSemestre] = useState(5);

  // Soft Skills (Boolean strictly)
  const [softSkills, setSoftSkills] = useState<SoftSkills>({
    comunicacao: true,
    trabalhoEmEquipe: true,
    lideranca: false,
    resolucaoProblemas: true,
    adaptabilidade: true,
    pensamentoCritico: false,
  });

  // Quiz Answers (Hard Skills mapping)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({
    1: 100, // Tecnologia
    2: 100, // Negócios
    3: 100, // Exatas
    4: 100, // Humanas
    5: 100, // Design
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

  const calculateHardSkillsFromQuiz = (): HardSkills => {
    return {
      tecnologia: quizAnswers[1] ?? 70,
      negocios: quizAnswers[2] ?? 70,
      exatas: quizAnswers[3] ?? 70,
      humanas: quizAnswers[4] ?? 70,
      design: quizAnswers[5] ?? 70,
    };
  };

  const handleFinishRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim() || !email.trim()) {
      alert("Por favor, preencha o seu nome e e-mail.");
      return;
    }

    const computedHardSkills = calculateHardSkillsFromQuiz();

    await adicionarAluno({
      ra: "260" + Math.floor(1000 + Math.random() * 9000),
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
      hardSkills: computedHardSkills,
    });

    alert(`Parabéns ${nome}! Perfil cadastrado com sucesso no Banco de Talentos FECAP.`);
    router.push("/recrutador/dashboard");
  };

  return (
    <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Page Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Portal do Estudante FECAP</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Cadastro & Teste de Nivelamento Nativo</h1>
        <p className="text-slate-400 text-sm mt-1">
          Preencha seus dados e responda ao teste técnico para gerar seu perfil de match com empresas parceiras.
        </p>
      </div>

      {/* Stepper Progress Header */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -z-10 transform -translate-y-1/2" />
        
        {[
          { num: 1, title: "Dados Pessoais" },
          { num: 2, title: "Teste Técnico" },
          { num: 3, title: "Soft Skills" },
          { num: 4, title: "Revisão & Envio" },
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
        
        {/* STEP 1: DADOS PESSOAIS */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <User className="w-5 h-5 text-teal-400" />
              <span>Etapa 1: Dados Pessoais e Acadêmicos</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  E-mail FECAP *
                </label>
                <input
                  type="email"
                  required
                  placeholder="seu.nome@aluno.fecap.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Curso FECAP
                </label>
                <select
                  value={curso}
                  onChange={(e) => setCurso(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500 transition-colors"
                >
                  {CURSOS_FECAP.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Semestre Atual ({semestre}º Semestre)
                </label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={semestre}
                  onChange={(e) => setSemestre(Number(e.target.value))}
                  className="w-full accent-teal-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1º Semestre</span>
                  <span>8º Semestre</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!nome || !email) {
                    alert("Preencha nome e e-mail para prosseguir.");
                    return;
                  }
                  setStep(2);
                }}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center space-x-2 transition-colors"
              >
                <span>Ir para o Teste Técnico</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: QUIZ DE NIVELAMENTO HARD SKILLS */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-teal-400" />
                <span>Etapa 2: Teste de Nivelamento Técnico (Hard Skills)</span>
              </h2>
              <span className="text-xs text-teal-400 font-semibold bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                5 Perguntas Práticas
              </span>
            </div>

            <div className="space-y-8">
              {QUIZ_QUESTIONS.map((q) => (
                <div key={q.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {q.tituloCategoria}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">{q.pergunta}</p>
                  
                  <div className="space-y-2 pt-2">
                    {q.opcoes.map((opcao, idx) => {
                      const isSelected = quizAnswers[q.id] === opcao.pontos;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setQuizAnswers((prev) => ({
                              ...prev,
                              [q.id]: opcao.pontos,
                            }));
                          }}
                          className={`w-full text-left p-3 rounded-lg text-xs font-medium transition-all flex items-start space-x-3 ${
                            isSelected
                              ? "bg-teal-500/15 text-teal-200 border border-teal-500/50"
                              : "bg-slate-900 hover:bg-slate-800/80 text-slate-300 border border-slate-800"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center border ${isSelected ? "border-teal-400 bg-teal-400" : "border-slate-600"}`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                          </div>
                          <span>{opcao.texto}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm flex items-center space-x-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center space-x-2 transition-colors"
              >
                <span>Avançar para Soft Skills</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AUTOAVALIAÇÃO DE SOFT SKILLS */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Etapa 3: Mapeamento de Soft Skills (Competências Comportamentais)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Selecione as competências comportamentais com as quais você se identifica. As empresas usam estas marcas como critério mandatório nas vagas.
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
                    <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {checked ? "Ativo (true)" : "Inativo (false)"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm flex items-center space-x-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Quiz</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center space-x-2 transition-colors"
              >
                <span>Revisão Final</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVISÃO & CONFIRMAÇÃO */}
        {step === 4 && (
          <form onSubmit={handleFinishRegistration} className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Etapa 4: Resumo do Perfil & Finalização</span>
            </h2>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-sm">
              <div className="flex flex-col sm:flex-row justify-between border-b border-slate-800/80 pb-3 gap-2">
                <div>
                  <p className="text-lg font-bold text-white">{nome}</p>
                  <p className="text-xs text-slate-400">{email} &bull; {curso} ({semestre}º Semestre)</p>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 self-start">
                  Pronto para Match
                </span>
              </div>

              {/* Hard skills computed preview */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Notas de Hard Skills Calculadas (Teste Técnico)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  {Object.entries(calculateHardSkillsFromQuiz()).map(([key, score]) => (
                    <div key={key} className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <p className="text-[10px] text-slate-400 uppercase">{key}</p>
                      <p className="text-sm font-bold text-teal-400">{score}/100</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Input */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Feedback de Professor (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm flex items-center space-x-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center space-x-2 transition-transform duration-150 active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>Concluir Cadastro & Ver no Ranking</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </main>
  );
}
