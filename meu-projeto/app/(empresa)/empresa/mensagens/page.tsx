import { getConversasAtivas, IConversaAtiva } from "@/services/chatService";
import { EmpresaInboxClient } from "@/components/EmpresaInboxClient";
import { MessageSquare, ShieldCheck, Radio } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Dynamic server component

export default async function EmpresaMensagensPage() {
  let empresaUserId = "empresa-user-default-id";
  let conversas: IConversaAtiva[] = [];

  try {
    const { prisma } = await import("@/lib/prisma");
    const empUser = await prisma.user.findFirst({
      where: { role: "EMPRESA" },
    });
    if (empUser) {
      empresaUserId = empUser.id;
    }

    conversas = await getConversasAtivas(empresaUserId);
  } catch (e) {
    console.warn("Fallback ao carregar mensagens da empresa:", e);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Caixa de Entrada & Prospecção Direta</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Central de Mensagens da Empresa
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Gerencie todas as conversas ativas com os estudantes FECAP em tempo real via Supabase WebSockets. Responda dúvidas, agende conversas e acompanhe candidaturas.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 shrink-0 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase">Supabase Realtime</span>
              <span className="text-xs font-extrabold text-cyan-400">Transmissão Ativa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Client Inbox Container */}
      <EmpresaInboxClient empresaUserId={empresaUserId} conversasIniciais={conversas} />
    </div>
  );
}
