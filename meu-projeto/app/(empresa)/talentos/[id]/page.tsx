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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-8" style={{ background: "var(--bg-base)", color: "var(--text-body)" }}>
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/empresa/banco-talentos"
          className="inline-flex items-center space-x-2 text-xs font-bold npa-btn-ghost px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Banco de Talentos</span>
        </Link>
        <span className="text-xs text-muted font-mono">ID Talento: {aluno.id}</span>
      </div>

      {/* Header Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl npa-card p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00FF55]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-5">
            <img
              src={aluno.avatarUrl}
              alt={aluno.nome}
              className="w-20 h-20 rounded-2xl object-cover border-2 shrink-0"
              style={{ borderColor: "var(--border-strong)" }}
            />
            <div className="space-y-1">
              <div className="npa-badge inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Estudante FECAP</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-head">{aluno.nome}</h1>
              <p className="text-xs text-muted flex items-center space-x-2">
                <span>{aluno.curso}</span>
                <span>•</span>
                <span>{aluno.semestre}º Semestre</span>
                <span>•</span>
                <span className="font-mono text-head">RA: {aluno.ra}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-2xl border shrink-0 backdrop-blur-md" style={{ background: "var(--bg-raised)", borderColor: "var(--border-light)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,74,48,0.1)", border: "1px solid rgba(0,74,48,0.2)" }}>
              <ShieldCheck className="w-5 h-5 text-npa" />
            </div>
            <div>
              <span className="block text-xs font-bold text-muted uppercase">Status FECAP</span>
              <span className="text-xs font-extrabold text-npa">Perfil Verificado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Academic Info & Soft Skills */}
        <div className="lg:col-span-7 space-y-6">
          {/* Soft Skills Section */}
          <div className="npa-card rounded-3xl p-6 space-y-4">
            <h2 className="text-base font-bold text-head flex items-center space-x-2">
              <Award className="w-5 h-5" style={{ color: "var(--amber-text)" }} />
              <span>Competências Comportamentais & Trilhas</span>
            </h2>

            {(() => {
              const validProgressos = (aluno.progressosTrilha || []).filter(
                (p) => p.status === "VALIDADO_MENTORIA" || p.status === "TESTE_APROVADO"
              );

              if (validProgressos.length === 0) {
                return (
                  <p className="text-xs text-muted italic">
                    Nenhuma soft skill validada até o momento.
                  </p>
                );
              }

              return (
                <div className="flex flex-wrap gap-2">
                  {validProgressos.map((prog, idx) => {
                    const isValidated = prog.status === "VALIDADO_MENTORIA";
                    const nomeTrilha = (prog as any).trilha?.nome || prog.trilhaNome || "Soft Skill";

                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2"
                        style={
                          isValidated
                            ? { background: "var(--amber-bg)", borderColor: "var(--amber-border)", color: "var(--amber-text)" }
                            : { background: "rgba(0,74,48,0.1)", borderColor: "rgba(0,74,48,0.25)", color: "var(--npa-green)" }
                        }
                      >
                        <span>{nomeTrilha}</span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border" style={{ background: "var(--bg-surface)", borderColor: "var(--border-base)" }}>
                          {isValidated ? "✓ VALIDADO" : "✓ APROVADO"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Histórico Acadêmico Section */}
          <div className="npa-card rounded-3xl p-6 space-y-4">
            <h2 className="text-base font-bold text-head flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-npa" />
              <span>Desempenho Acadêmico Validado FECAP</span>
            </h2>

            {!aluno.historicoAcademico || aluno.historicoAcademico.length === 0 ? (
              <p className="text-xs text-muted italic">Histórico acadêmico não importado.</p>
            ) : (
              <div className="space-y-2">
                {aluno.historicoAcademico.map((item) => (
                  <div
                    key={item.materia}
                    className="flex items-center justify-between p-3 rounded-xl border text-xs"
                    style={{ background: "var(--bg-raised)", borderColor: "var(--border-light)" }}
                  >
                    <span className="font-medium text-head">{item.materia}</span>
                    <span className="font-mono font-bold text-npa bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Nota: {item.nota.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Experiências Profissionais Section */}
          <div className="npa-card rounded-3xl p-6 space-y-4">
            <h2 className="text-base font-bold text-head flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-npa" />
              <span>Histórico de Experiências</span>
            </h2>

            {!aluno.experiencias || aluno.experiencias.length === 0 ? (
              <p className="text-xs text-muted italic">Nenhuma experiência profissional cadastrada.</p>
            ) : (
              <div className="space-y-2">
                {aluno.experiencias.map((exp) => (
                  <div key={exp.id} className="p-3 rounded-xl border text-xs space-y-1" style={{ background: "var(--bg-raised)", borderColor: "var(--border-light)" }}>
                    <div className="flex justify-between font-bold text-head">
                      <span>{exp.cargo}</span>
                      <span className="text-npa text-[10px]">{exp.periodo}</span>
                    </div>
                    <p className="text-npa font-semibold">{exp.empresa}</p>
                    <p className="text-muted">{exp.descricao}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Realtime Chat Section ("Falar com o Talento") */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-npa" />
            <h2 className="text-base font-bold text-head">Falar com o Talento</h2>
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
