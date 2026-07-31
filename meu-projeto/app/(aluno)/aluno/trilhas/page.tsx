import {
  Award, CheckCircle2, Clock, Sparkles, Play, ArrowRight,
  ShieldCheck, Trophy, Flame, Star, Lock,
} from "lucide-react";
import Link from "next/link";
import { StatusSoftSkill } from "@prisma/client";

export const revalidate = 0;

export default async function AlunoTrilhasPage() {
  let trilhasDisponiveis: { id: string; nome: string; descricao: string }[] = [];
  let studentProgress: Record<string, { status: StatusSoftSkill; dataConclusao?: string | null; feedback?: string | null }> = {};

  try {
    const { prisma } = await import("@/lib/prisma");

    if ("trilhaSoftSkill" in prisma && (prisma as any).trilhaSoftSkill) {
      const dbTrilhas = await (prisma as any).trilhaSoftSkill.findMany({
        orderBy: { nome: "asc" },
      });
      if (dbTrilhas && dbTrilhas.length > 0) {
        trilhasDisponiveis = dbTrilhas;
      }
    }

    const { getLoggedUserServer } = await import("@/services/authService");
    const { email: loggedEmail, ra: loggedRa } = await getLoggedUserServer();

    const OR_CLAUSES: any[] = [];
    if (loggedEmail) OR_CLAUSES.push({ email: loggedEmail.toLowerCase() });
    if (loggedRa) OR_CLAUSES.push({ ra: loggedRa });

    const includeObj: any = {};
    if ("progressoAlunoTrilha" in prisma) {
      includeObj.progressosTrilha = {
        include: { trilha: true },
      };
    }

    const dbAluno = OR_CLAUSES.length > 0 ? await prisma.aluno.findFirst({
      where: { OR: OR_CLAUSES },
      include: includeObj,
    }) : null;

    if (dbAluno) {
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

  if (trilhasDisponiveis.length === 0) {
    trilhasDisponiveis = [
      { id: "trilha-lideranca", nome: "Liderança e Gestão", descricao: "Desenvolvimento de liderança técnica, gestão de pessoas e visão estratégica." },
      { id: "trilha-comunicacao", nome: "Comunicação Efetiva", descricao: "Desenvolvimento de oratória, empatia e comunicação assertiva." },
      { id: "trilha-resiliencia", nome: "Resiliência", descricao: "Inteligência emocional, adaptação a mudanças e trabalho sob pressão." },
      { id: "trilha-resolucao", nome: "Resolução de Problemas", descricao: "Raciocínio lógico analítico e resolução de problemas estruturados." },
      { id: "trilha-equipe", nome: "Trabalho em Equipe", descricao: "Colaboração eficaz e facilidade de integração em equipes de tecnologia." },
      { id: "trilha-critico", nome: "Pensamento Crítico", descricao: "Análise profunda de cenários e tomada de decisão embasada." },
    ];
  }

  const validadasCount = Object.values(studentProgress).filter((p) => p.status === "VALIDADO_MENTORIA").length;
  const aguardandoCount = Object.values(studentProgress).filter((p) => p.status === "TESTE_APROVADO").length;
  const emAndamentoCount = Object.values(studentProgress).filter((p) => p.status === "EM_TRILHA").length;

  const xpTotal = validadasCount * 500 + aguardandoCount * 250 + emAndamentoCount * 100;
  const nivel = Math.floor(xpTotal / 300) + 1;

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">

      {/* ── Banner Gamificação ── */}
      <div
        className="rounded-2xl p-5 sm:p-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border animate-fade-up"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border-light)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="space-y-2 max-w-2xl">
          <div className="npa-badge inline-flex">
            <Trophy className="w-3.5 h-3.5 text-npa" />
            <span>Soft Skills & Trilhas FECAP</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-head tracking-tight leading-tight">
            Trilhas de Desenvolvimento
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            Desenvolva suas habilidades comportamentais e obtenha a Chancela Oficial FECAP via mentoria com a coordenação.
          </p>
        </div>

        {/* Gamification Stats */}
        <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
          <div
            className="p-3 sm:p-4 rounded-xl border text-center"
            style={{ background: "var(--bg-raised)", borderColor: "var(--border-base)" }}
          >
            <span className="block text-xs font-bold text-muted uppercase">Nível</span>
            <span className="text-lg sm:text-xl font-black text-npa">L{nivel}</span>
            <span className="block text-[10px] text-subtle font-mono">{xpTotal} XP</span>
          </div>
          <div
            className="p-3 sm:p-4 rounded-xl border text-center"
            style={{ background: "var(--amber-bg)", borderColor: "var(--amber-border)" }}
          >
            <span className="block text-xs font-bold uppercase" style={{ color: "var(--amber-text)" }}>Selos</span>
            <span className="text-lg sm:text-xl font-black" style={{ color: "var(--amber-text)" }}>{validadasCount}</span>
            <span className="block text-[10px] uppercase font-semibold" style={{ color: "var(--amber-text)" }}>Validados</span>
          </div>
          <div
            className="p-3 sm:p-4 rounded-xl border text-center"
            style={{ background: "var(--bg-raised)", borderColor: "var(--border-base)" }}
          >
            <span className="block text-xs font-bold text-muted uppercase">Ativas</span>
            <span className="text-lg sm:text-xl font-black text-head">{aguardandoCount + emAndamentoCount}</span>
            <span className="block text-[10px] text-subtle uppercase">Em Fila</span>
          </div>
        </div>
      </div>

      {/* ── Grid de Trilhas ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="text-sm font-bold text-head flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-npa" />
            <span>Suas Trilhas ({trilhasDisponiveis.length})</span>
          </h2>
          <span className="text-[11px] text-muted">
            Status: Disponível &bull; Em Andamento &bull; Aprovado &bull; Validado
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trilhasDisponiveis.map((trilha) => {
            const normNome = trilha.nome.toLowerCase();
            const progressoInfo = studentProgress[normNome];
            const status = progressoInfo?.status;

            let statusBadge = null;
            let iconElement = null;
            let progressPercentage = 0;

            if (status === "VALIDADO_MENTORIA") {
              iconElement = <Award className="w-6 h-6 text-amber-500" />;
              statusBadge = (
                <span className="npa-badge npa-badge-amber text-[10px]">
                  <Star className="w-3 h-3 fill-current" />
                  Chancela FECAP
                </span>
              );
              progressPercentage = 100;
            } else if (status === "TESTE_APROVADO") {
              iconElement = <CheckCircle2 className="w-6 h-6 text-npa" />;
              statusBadge = (
                <span className="npa-badge text-[10px]">
                  <Clock className="w-3 h-3" />
                  Aguardando Mentoria
                </span>
              );
              progressPercentage = 80;
            } else if (status === "EM_TRILHA") {
              iconElement = <Clock className="w-6 h-6" style={{ color: "var(--blue-text)" }} />;
              statusBadge = (
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                  style={{ background: "var(--blue-bg)", borderColor: "var(--blue-border)", color: "var(--blue-text)" }}
                >
                  Em andamento
                </span>
              );
              progressPercentage = 45;
            } else {
              iconElement = <Lock className="w-6 h-6 text-subtle" />;
              statusBadge = (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: "var(--bg-sunken)", color: "var(--text-subtle)" }}>
                  Disponível
                </span>
              );
              progressPercentage = 0;
            }

            return (
              <div
                key={trilha.id}
                className="npa-card rounded-2xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    {iconElement}
                    {statusBadge}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-head">{trilha.nome}</h3>
                    <p className="text-xs text-muted mt-1 leading-relaxed">{trilha.descricao}</p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-muted">Progresso</span>
                      <span className="text-head">{progressPercentage}%</span>
                    </div>
                    <div className="npa-progress-track">
                      <div className="npa-progress-bar" style={{ width: `${progressPercentage}%` }} />
                    </div>
                  </div>

                  {/* Feedback */}
                  {status === "VALIDADO_MENTORIA" && progressoInfo?.feedback && (
                    <div
                      className="rounded-xl p-3 text-xs space-y-1"
                      style={{ background: "var(--amber-bg)", border: "1px solid var(--amber-border)" }}
                    >
                      <span className="font-bold flex items-center gap-1" style={{ color: "var(--amber-text)" }}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Parecer do Mentor FECAP:
                      </span>
                      <p className="italic text-[11px]" style={{ color: "var(--amber-text)" }}>
                        &quot;{progressoInfo.feedback}&quot;
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t" style={{ borderColor: "var(--border-light)" }}>
                  {status === "VALIDADO_MENTORIA" ? (
                    <div className="w-full py-2.5 rounded-xl border text-xs font-bold text-center flex items-center justify-center gap-1.5" style={{ background: "var(--amber-bg)", borderColor: "var(--amber-border)", color: "var(--amber-text)" }}>
                      <Award className="w-4 h-4" />
                      <span>Selo Conquistado!</span>
                    </div>
                  ) : status === "TESTE_APROVADO" ? (
                    <div className="w-full py-2.5 rounded-xl border text-xs font-bold text-center flex items-center justify-center gap-1.5" style={{ background: "rgba(0,74,48,0.08)", borderColor: "rgba(0,74,48,0.25)", color: "#004A30" }}>
                      <Clock className="w-4 h-4 text-npa" />
                      <span>Agendado no Hub Master</span>
                    </div>
                  ) : (
                    <Link
                      href="/aluno/testes"
                      className="npa-btn-ghost w-full justify-center rounded-xl text-xs py-2.5"
                    >
                      <Play className="w-3.5 h-3.5 text-npa fill-current" />
                      <span>{status === "EM_TRILHA" ? "Continuar Trilha" : "Iniciar Trilha"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
