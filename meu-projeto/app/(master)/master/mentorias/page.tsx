import { getMentoriasPendentes } from "@/services/mentoriaService";
import { BotaoAprovarMentoria } from "@/components/BotaoAprovarMentoria";
import {
  ShieldCheck, GraduationCap, Sparkles,
  Clock, Award, CheckCircle2,
} from "lucide-react";

export const revalidate = 0;

export default async function MentoriasPage() {
  const mentorias = await getMentoriasPendentes();

  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-6 lg:p-8" style={{ background: "var(--bg-base)" }}>

      {/* ── Banner ── */}
      <div
        className="rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border animate-fade-up"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border-light)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="space-y-2 flex-1 min-w-0">
          <div className="npa-badge inline-flex">
            <ShieldCheck className="w-3 h-3" />
            Coordenação Master
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-head leading-tight">
            Validação de Mentorias
          </h1>
          <p className="text-xs text-muted leading-relaxed max-w-xl">
            Alunos que concluíram testes de soft skills aguardando validação presencial e emissão do selo institucional FECAP.
          </p>
        </div>

        <div
          className="flex items-center gap-3 rounded-xl p-3 border shrink-0 self-start sm:self-auto"
          style={{ background: "var(--bg-raised)", borderColor: "var(--border-base)" }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "var(--amber-bg)", border: "1px solid var(--amber-border)" }}
          >
            <Clock className="w-4 h-4" style={{ color: "var(--amber-text)" }} />
          </div>
          <div>
            <p className="text-2xl font-black text-head">{mentorias.length}</p>
            <p className="text-[10px] text-muted uppercase font-bold tracking-wider">Aguardando</p>
          </div>
        </div>
      </div>

      {/* ── Lista ── */}
      {mentorias.length === 0 ? (
        <div
          className="npa-card rounded-2xl p-8 sm:p-12 text-center space-y-4 max-w-md mx-auto"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: "rgba(0,74,48,0.1)", border: "1px solid rgba(0,74,48,0.2)" }}
          >
            <CheckCircle2 className="w-7 h-7 text-npa" />
          </div>
          <h3 className="text-base font-bold text-head">Fila de Mentorias Zerada!</h3>
          <p className="text-xs text-muted leading-relaxed">
            Nenhum aluno aguardando validação de soft skills. Todos os testes aprovados foram chancelados.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Cabeçalho da fila — responsivo */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-sm font-bold text-head flex items-center gap-2">
              <Award className="w-4 h-4" style={{ color: "var(--amber-text)" }} />
              Fila de Alunos Pendentes ({mentorias.length})
            </h2>
            <p
              className="text-[11px] leading-relaxed sm:ml-auto"
              style={{ color: "var(--amber-text)", opacity: 0.8 }}
            >
              * Aprovação concede selo institucional e multiplicador no Match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentorias.map((item) => (
              <div
                key={item.id}
                className="npa-card rounded-2xl p-5 flex flex-col justify-between gap-4"
              >
                {/* Header do aluno */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.alunoAvatarUrl}
                      alt={item.alunoNome}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border-2"
                      style={{ borderColor: "var(--border-strong)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-head truncate">{item.alunoNome}</h3>
                      <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                        <GraduationCap className="w-3 h-3 shrink-0 text-npa" />
                        <span className="truncate">{item.alunoCurso}</span>
                      </p>
                      <span
                        className="inline-block mt-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                        style={{ background: "var(--bg-sunken)", color: "var(--text-muted)", border: "1px solid var(--border-base)" }}
                      >
                        RA: {item.alunoRa}
                      </span>
                    </div>
                  </div>

                  {/* Trilha em aguardo */}
                  <div
                    className="rounded-xl p-3 space-y-2"
                    style={{ background: "var(--amber-bg)", border: "1px solid var(--amber-border)" }}
                  >
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider block"
                      style={{ color: "var(--amber-text)", opacity: 0.7 }}
                    >
                      Trilha em Aguardo:
                    </span>
                    {/* Flex com wrap para nomes longos */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Sparkles className="w-4 h-4 shrink-0" style={{ color: "var(--amber-text)" }} />
                        <span className="text-sm font-extrabold truncate" style={{ color: "var(--amber-text)" }}>
                          {item.trilhaNome}
                        </span>
                      </div>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: "rgba(146,64,14,0.12)", color: "var(--amber-text)", border: "1px solid var(--amber-border)" }}
                      >
                        Aprovado
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botão de ação */}
                <div
                  className="pt-3 flex justify-end"
                  style={{ borderTop: "1px solid var(--border-light)" }}
                >
                  <BotaoAprovarMentoria
                    progressoId={item.id}
                    alunoNome={item.alunoNome}
                    trilhaNome={item.trilhaNome}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
