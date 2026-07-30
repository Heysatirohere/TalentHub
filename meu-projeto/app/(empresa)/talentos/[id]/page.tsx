import { getAlunoById } from "@/services/alunoService";
import { ChatBox } from "@/components/ChatBox";
import {
  GraduationCap,
  BookOpen,
  Award,
  Briefcase,
  FileCheck,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  Star,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0; // Dynamic server component

export default async function TalentoDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const aluno = await getAlunoById(id);

  if (!aluno) {
    notFound();
  }

  // Busca o ID do usuário da empresa logada
  let empresaUserId = "empresa-user-default-id";
  try {
    const { prisma } = await import("@/lib/prisma");
    const empUser = await prisma.user.findFirst({
      where: { role: "EMPRESA" },
    });
    if (empUser) {
      empresaUserId = empUser.id;
    }
  } catch (e) {
    console.warn("Fallback de busca do id do usuario empresa:", e);
  }

  // Target User ID do Aluno para o Supabase Realtime
  const alunoUserId = aluno.userId || aluno.id;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/empresa/banco-talentos"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Banco de Talentos</span>
        </Link>
        <span className="text-xs text-slate-500 font-mono">ID Talento: {aluno.id}</span>
      </div>

      {/* Header Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-5">
            <img
              src={aluno.avatarUrl}
              alt={aluno.nome}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-xl shadow-cyan-500/10 shrink-0"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold uppercase">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Estudante FECAP</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{aluno.nome}</h1>
              <p className="text-xs text-slate-400 flex items-center space-x-2">
                <span>{aluno.curso}</span>
                <span>•</span>
                <span>{aluno.semestre}º Semestre</span>
                <span>•</span>
                <span className="font-mono text-slate-300">RA: {aluno.ra}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 shrink-0 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase">Status FECAP</span>
              <span className="text-xs font-extrabold text-emerald-400">Perfil Verificado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Academic Info & Soft Skills */}
        <div className="lg:col-span-7 space-y-6">
          {/* Soft Skills Section */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Competências Comportamentais & Trilhas</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aluno.progressosTrilha && aluno.progressosTrilha.length > 0 ? (
                aluno.progressosTrilha.map((prog) => {
                  const isValidated = prog.status === "VALIDADO_MENTORIA";
                  const isTestApp = prog.status === "TESTE_APROVADO";

                  return (
                    <div
                      key={prog.trilhaNome}
                      className={`p-3.5 rounded-2xl border flex flex-col justify-between space-y-2 ${
                        isValidated
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
                          : isTestApp
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{prog.trilhaNome}</span>
                        {isValidated ? (
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ) : isTestApp ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : null}
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider">
                        {isValidated
                          ? "Chancela FECAP: Validado"
                          : isTestApp
                          ? "Teste Aprovado"
                          : "Em Trilha"}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 col-span-2">
                  Trilhas em mapeamento inicial.
                </p>
              )}
            </div>
          </div>

          {/* Histórico Acadêmico Section */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Desempenho Acadêmico Exemplo</span>
            </h2>

            <div className="space-y-2">
              {aluno.historicoAcademico?.map((item) => (
                <div
                  key={item.materia}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <span className="font-medium text-slate-300">{item.materia}</span>
                  <span className="font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    Nota: {item.nota.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Realtime Chat Section ("Falar com o Talento") */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Falar com o Talento</h2>
          </div>

          {/* Realtime ChatBox Component */}
          <ChatBox
            key={`${empresaUserId}_${alunoUserId}`}
            usuarioLogadoId={empresaUserId}
            destinatarioId={alunoUserId}
            destinatarioNome={aluno.nome}
            destinatarioAvatar={aluno.avatarUrl}
            destinatarioSubtitulo={`${aluno.curso} • RA ${aluno.ra}`}
          />
        </div>
      </div>
    </div>
  );
}
