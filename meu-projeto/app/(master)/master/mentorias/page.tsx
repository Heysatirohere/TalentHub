import { getMentoriasPendentes } from "@/services/mentoriaService";
import { BotaoAprovarMentoria } from "@/components/BotaoAprovarMentoria";
import {
  ShieldCheck,
  GraduationCap,
  Sparkles,
  User,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
} from "lucide-react";

export const revalidate = 0; // Dynamic server component

export default async function MentoriasPage() {
  const mentorias = await getMentoriasPendentes();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>FECAP Hub Master • Coordenação</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-3">
              <span>Validação de Mentorias de Soft Skills</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Alunos que concluíram com sucesso os testes simulados de soft skills e aguardam a validação presencial e emissão do selo institucional da coordenação FECAP.
            </p>
          </div>

          {/* Stats Badge */}
          <div className="flex items-center space-x-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 shrink-0 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="block text-2xl font-black text-white">{mentorias.length}</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Aguardando Chancela
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Pending Queue List */}
      {mentorias.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Fila de Mentorias Zerada!</h3>
          <p className="text-sm text-slate-400">
            Não há alunos aguardando validação de mentoria de Soft Skills no momento. Todos os testes aprovados foram chancelados pela coordenação.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Fila de Alunos Pendentes ({mentorias.length})</span>
            </h2>
            <span className="text-xs text-slate-400">
              * A aprovação concede ao aluno um selo institucional e multiplicador no Match de vagas.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {mentorias.map((item) => (
              <div
                key={item.id}
                className="group relative bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between space-y-6"
              >
                {/* Header Profile Info */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.alunoAvatarUrl}
                      alt={item.alunoNome}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-cyan-500/50 transition-colors shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {item.alunoNome}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center space-x-1.5 mt-0.5">
                        <GraduationCap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{item.alunoCurso}</span>
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        RA: {item.alunoRa}
                      </span>
                    </div>
                  </div>

                  {/* Soft Skill Track Request Card */}
                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Trilha de Soft Skill em Aguardo:
                    </span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-extrabold text-amber-300">
                          {item.trilhaNome}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                        TESTE_APROVADO
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-end">
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
