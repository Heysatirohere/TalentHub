import { getAlunos } from "@/services/alunoService";
import {
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  ArrowRight,
  ShieldCheck,
  Trophy,
  Flame,
  Star,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { StatusSoftSkill } from "@prisma/client";

export const revalidate = 0; // Dynamic server component

export default async function AlunoTrilhasPage() {
  let trilhasDisponiveis: { id: string; nome: string; descricao: string }[] = [];
  let studentProgress: Record<string, { status: StatusSoftSkill; dataConclusao?: string | null; feedback?: string | null }> = {};
  let studentName = "Gabriel Silva";

  try {
    const { prisma } = await import("@/lib/prisma");

    // 1. Busca todas as Trilhas cadastradas no banco
    if ("trilhaSoftSkill" in prisma && (prisma as any).trilhaSoftSkill) {
      const dbTrilhas = await (prisma as any).trilhaSoftSkill.findMany({
        orderBy: { nome: "asc" },
      });

      if (dbTrilhas && dbTrilhas.length > 0) {
        trilhasDisponiveis = dbTrilhas;
      }
    }

    // 2. Busca o aluno logado e seus progressos
    const { getLoggedUserServer } = await import("@/services/authService");
    const { email: loggedEmail, ra: loggedRa } = await getLoggedUserServer();
    const searchEmail = loggedEmail || "aluno1@fecap.br";

    const includeObj: any = {};
    if ("progressoAlunoTrilha" in prisma) {
      includeObj.progressosTrilha = {
        include: { trilha: true },
      };
    }

    const dbAluno = await prisma.aluno.findFirst({
      where: {
        OR: [
          { email: searchEmail },
          ...(loggedRa ? [{ ra: loggedRa }] : [{ ra: "26010001" }]),
        ],
      },
      include: includeObj,
    });

    if (dbAluno) {
      studentName = dbAluno.nome;
      if (Array.isArray((dbAluno as any).progressosTrilha)) {
        (dbAluno as any).progressosTrilha.forEach((p: any) => {
          if (p.trilha?.nome) {
            studentProgress[p.trilha.nome.toLowerCase()] = {
              status: p.status as StatusSoftSkill,
              dataConclusao: p.dataConclusao ? new Date(p.dataConclusao).toLocaleDateString("pt-BR") : null,
              feedback: p.feedback,
            };
          }
        });
      }
    }
  } catch (e) {
    console.warn("Fallback de busca no Prisma para trilhas do aluno:", e);
  }

  // Se não retornou trilhas do banco, usa a lista padrão de suporte
  if (trilhasDisponiveis.length === 0) {
    trilhasDisponiveis = [
      {
        id: "trilha-lideranca",
        nome: "Liderança e Gestão",
        descricao: "Desenvolvimento de liderança técnica, gestão de pessoas e visão estratégica.",
      },
      {
        id: "trilha-comunicacao",
        nome: "Comunicação Efetiva",
        descricao: "Desenvolvimento de oratória, empatia e comunicação assertiva.",
      },
      {
        id: "trilha-resiliencia",
        nome: "Resiliência",
        descricao: "Inteligência emocional, adaptação a mudanças e trabalho sob pressão.",
      },
      {
        id: "trilha-resolucao",
        nome: "Resolução de Problemas",
        descricao: "Raciocínio lógico analítico e resolução de problemas estruturados.",
      },
      {
        id: "trilha-equipe",
        nome: "Trabalho em Equipe",
        descricao: "Colaboração eficaz e facilidade de integração em equipes de tecnologia.",
      },
      {
        id: "trilha-critico",
        nome: "Pensamento Crítico",
        descricao: "Análise profunda de cenários e tomada de decisão embasada.",
      },
    ];
  }

  // Fallback de progresso se o aluno não estiver no DB
  if (Object.keys(studentProgress).length === 0) {
    const alunos = await getAlunos();
    const aluno = alunos.find((a) => a.ra === "26010001" || a.email === "aluno1@fecap.br") || alunos[0];
    if (aluno) {
      studentName = aluno.nome;
      aluno.progressosTrilha?.forEach((p) => {
        studentProgress[p.trilhaNome.toLowerCase()] = {
          status: p.status,
          dataConclusao: p.dataConclusao,
          feedback: p.feedback,
        };
      });
    }
  }

  // Estatísticas de Conquistas Gamificadas
  const totalTrilhas = trilhasDisponiveis.length;
  const validadasCount = Object.values(studentProgress).filter(
    (p) => p.status === "VALIDADO_MENTORIA"
  ).length;
  const aguardandoCount = Object.values(studentProgress).filter(
    (p) => p.status === "TESTE_APROVADO"
  ).length;
  const emAndamentoCount = Object.values(studentProgress).filter(
    (p) => p.status === "EM_TRILHA"
  ).length;

  const xpTotal = validadasCount * 500 + aguardandoCount * 250 + emAndamentoCount * 100;
  const nivel = Math.floor(xpTotal / 300) + 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Banner de Gamificação & Nível do Aluno */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Hub de Conquistas & Soft Skills FECAP</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center space-x-3">
              <span>Trilhas de Desenvolvimento</span>
            </h1>
            
            <p className="text-sm text-slate-400 max-w-2xl">
              Desenvolva suas habilidades comportamentais, realize os testes simulados e obtenha a **Chancela Oficial FECAP** via mentoria com a coordenação para se destacar no topo do ranking das empresas.
            </p>
          </div>

          {/* Gamification Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            {/* Level Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-lg">
                L{nivel}
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Nível Atual</span>
                <span className="text-sm font-extrabold text-amber-300">{xpTotal} XP</span>
              </div>
            </div>

            {/* Validated Seals Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
                <Award className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Selos FECAP</span>
                <span className="text-sm font-extrabold text-amber-400">{validadasCount} Validados</span>
              </div>
            </div>

            {/* In Progress Card */}
            <div className="col-span-2 sm:col-span-1 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Flame className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Em Fila / Trilha</span>
                <span className="text-sm font-extrabold text-cyan-300">{aguardandoCount + emAndamentoCount} Ativas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Cards Gamificados */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Suas Trilhas ({trilhasDisponiveis.length})</span>
          </h2>
          <span className="text-xs text-slate-400">
            Status: Não Iniciada • Em Andamento • Aguardando Mentoria • Chancela Validada
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trilhasDisponiveis.map((trilha) => {
            const normNome = trilha.nome.toLowerCase();
            const progressoInfo = studentProgress[normNome];
            const status = progressoInfo?.status;

            // Determina a estilização e estado do card conforme a especificação do usuário
            let cardClasses = "";
            let statusBadge = null;
            let iconElement = null;
            let progressPercentage = 0;

            if (status === "VALIDADO_MENTORIA") {
              // 1. VALIDADO_MENTORIA: Design premium (borda dourada/amarela, fundo destacado, Selo/Medalha)
              cardClasses =
                "border-2 border-amber-400/90 bg-gradient-to-br from-amber-500/15 via-slate-900 to-amber-950/30 text-amber-100 shadow-2xl shadow-amber-500/10 hover:border-amber-300";
              iconElement = (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-pulse">
                  <Award className="w-7 h-7 text-slate-950" />
                </div>
              );
              statusBadge = (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/50 text-xs font-extrabold uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Chancela FECAP: Validado</span>
                </div>
              );
              progressPercentage = 100;
            } else if (status === "TESTE_APROVADO") {
              // 2. TESTE_APROVADO: Borda verde, ícone check, "Aguardando Mentoria"
              cardClasses =
                "border-2 border-emerald-500/60 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 shadow-xl shadow-emerald-500/5 hover:border-emerald-400";
              iconElement = (
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
              );
              statusBadge = (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Aguardando Mentoria</span>
                </div>
              );
              progressPercentage = 80;
            } else if (status === "EM_TRILHA") {
              // 3. EM_TRILHA: Borda azul, barra de progresso visual, "Em andamento"
              cardClasses =
                "border-2 border-blue-500/50 bg-gradient-to-br from-blue-950/30 via-slate-900 to-slate-900 hover:border-blue-400";
              iconElement = (
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
              );
              statusBadge = (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold">
                  <Play className="w-3.5 h-3.5 text-blue-400" />
                  <span>Em andamento</span>
                </div>
              );
              progressPercentage = 45;
            } else {
              // 4. Inexistente / null: Card acinzentado, botão "Iniciar Trilha"
              cardClasses =
                "border border-slate-800 bg-slate-900/60 opacity-85 hover:opacity-100 hover:border-slate-700";
              iconElement = (
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                  <Lock className="w-6 h-6 text-slate-400" />
                </div>
              );
              statusBadge = (
                <div className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-semibold">
                  Disponível
                </div>
              );
              progressPercentage = 0;
            }

            return (
              <div
                key={trilha.id}
                className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between space-y-6 ${cardClasses}`}
              >
                {/* Top Section */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    {iconElement}
                    {statusBadge}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">
                      {trilha.nome}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {trilha.descricao}
                    </p>
                  </div>

                  {/* Barra de Progresso Visual (Simulada) */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-400">Progresso do Mapeamento</span>
                      <span className={status === "VALIDADO_MENTORIA" ? "text-amber-400 font-extrabold" : "text-slate-300"}>
                        {progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          status === "VALIDADO_MENTORIA"
                            ? "bg-gradient-to-r from-amber-400 to-yellow-300"
                            : status === "TESTE_APROVADO"
                            ? "bg-emerald-500"
                            : status === "EM_TRILHA"
                            ? "bg-blue-500"
                            : "bg-slate-700"
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Parecer do Mentor (se validado) */}
                  {status === "VALIDADO_MENTORIA" && progressoInfo?.feedback && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-xs text-amber-200 space-y-1 mt-2">
                      <span className="font-bold flex items-center space-x-1 text-amber-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Parecer do Mentor FECAP:</span>
                      </span>
                      <p className="italic text-[11px] opacity-90">"{progressoInfo.feedback}"</p>
                    </div>
                  )}
                </div>

                {/* Bottom Action Button */}
                <div className="pt-4 border-t border-slate-800/80">
                  {status === "VALIDADO_MENTORIA" ? (
                    <div className="w-full py-3 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider text-center flex items-center justify-center space-x-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Selo Conquistado!</span>
                    </div>
                  ) : status === "TESTE_APROVADO" ? (
                    <div className="w-full py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span>Agendado no Hub Master</span>
                    </div>
                  ) : status === "EM_TRILHA" ? (
                    <Link
                      href="/aluno/testes"
                      className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold text-center transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20"
                    >
                      <span>Continuar Trilha</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link
                      href="/aluno/testes"
                      className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold text-center transition-all flex items-center justify-center space-x-2 border border-slate-700"
                    >
                      <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                      <span>Iniciar Trilha</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
