"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  UserPlus, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  LogIn
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";

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
  const { adicionarAluno } = useTalent();

  const [ra, setRa] = useState(() => "260" + Math.floor(1000 + Math.random() * 9000));
  const [nome, setNome] = useState("");
  const [curso, setCurso] = useState(CURSOS_FECAP[0]);
  const [email, setEmail] = useState("");
  const [idade, setIdade] = useState<number>(21);
  const [semestre, setSemestre] = useState<number>(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ra.trim() || !nome.trim() || !email.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios (RA, Nome e E-mail).");
      return;
    }

    await adicionarAluno({
      ra,
      nome,
      email,
      curso,
      semestre,
      idade,
      feedbacksProfessores: [
        `Aluno devidamente cadastrado no RA ${ra} e aprovado pela Secretaria Acadêmica FECAP.`,
      ],
      softSkills: {
        comunicacao: true,
        trabalhoEmEquipe: true,
        lideranca: false,
        resolucaoProblemas: true,
        adaptabilidade: true,
        pensamentoCritico: true,
      },
      hardSkills: {
        tecnologia: 80,
        humanas: 75,
        negocios: 80,
        exatas: 75,
        design: 70,
      },
    });

    alert(`Aluno ${nome} (RA ${ra}) cadastrado com sucesso! Redirecionando para o Hub do Aluno.`);
    router.push("/aluno");
  };

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6 text-slate-950" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Cadastro Inicial de Aluno FECAP</h1>
          <p className="text-xs text-slate-400">
            Informe suas credenciais acadêmicas para liberar o acesso ao Hub do Aluno.
          </p>
        </div>

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
            <input
              type="email"
              required
              placeholder="seu.nome@aluno.fecap.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
            />
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
                Semestre Atual ({semestre}º)
              </label>
              <input
                type="range"
                min={1}
                max={8}
                value={semestre}
                onChange={(e) => setSemestre(Number(e.target.value))}
                className="w-full accent-teal-500 mt-2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all"
          >
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            <span>Criar Perfil & Entrar no Hub do Aluno</span>
          </button>

        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <Link href="/login" className="text-xs text-slate-400 hover:text-white flex items-center justify-center space-x-1">
            <LogIn className="w-3.5 h-3.5 text-teal-400" />
            <span>Já possui RA cadastrado? Fazer Login</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
