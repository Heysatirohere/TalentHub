import { ChatBox } from "@/components/ChatBox";
import { MessageSquare, Building2, ShieldCheck, Search, Radio } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Dynamic server component

export default async function AlunoMensagensPage() {
  let alunoUserId = "aluno1-user-id";
  let empresaUserId = "empresa-user-id";
  let empresaNome = "TechInova Soluções & IA";

  try {
    const { prisma } = await import("@/lib/prisma");

    // Busca usuário do aluno logado dinamicamente via cookies
    const { getLoggedUserServer } = await import("@/services/authService");
    const { email: loggedEmail } = await getLoggedUserServer();
    const searchEmail = loggedEmail || "aluno1@fecap.br";

    const alunoUser = await prisma.user.findFirst({
      where: { email: searchEmail },
    });
    if (alunoUser) {
      alunoUserId = alunoUser.id;
    }

    // Busca usuário da empresa cadastrada
    const empresaUser = await prisma.user.findFirst({
      where: { role: "EMPRESA" },
      include: { empresa: true },
    });
    if (empresaUser) {
      empresaUserId = empresaUser.id;
      if (empresaUser.empresa?.nomeEmpresa) {
        empresaNome = empresaUser.empresa.nomeEmpresa;
      }
    }
  } catch (e) {
    console.warn("Fallback de busca de usuarios no Chat do Aluno:", e);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Central de Mensagens Diretas</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Comunicação com Recrutadores
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Canal oficial de chat em tempo real alimentado por WebSockets. Converse diretamente com empresas interessadas no seu perfil acadêmico e soft skills validadas.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 shrink-0 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase">Canal Realtime</span>
              <span className="text-xs font-extrabold text-emerald-400">Ativo & Criptografado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Contact List + Chat Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Selector Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Empresas Contatadas</span>
            </h2>
            <span className="text-xs text-slate-500">1 Conversa Ativa</span>
          </div>

          <div className="space-y-2">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/80 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/5 cursor-pointer flex items-center space-x-3.5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white truncate">{empresaNome}</h3>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">Recrutamento & Seleção IA</p>
                <span className="inline-block text-[10px] text-emerald-400 font-semibold mt-1">
                  Conexão Aberta
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Box Container */}
        <div className="lg:col-span-8 space-y-4">
          <ChatBox
            key={`${alunoUserId}_${empresaUserId}`}
            usuarioLogadoId={alunoUserId}
            destinatarioId={empresaUserId}
            destinatarioNome={empresaNome}
            destinatarioAvatar="https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=250"
            destinatarioSubtitulo="Recrutador Responsável • TechInova"
          />
        </div>
      </div>
    </div>
  );
}
