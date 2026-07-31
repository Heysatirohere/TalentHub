export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { getConversasAtivas, IConversaAtiva } from "@/services/chatService";
import { EmpresaInboxClient } from "@/components/EmpresaInboxClient";
import { MessageSquare, Radio } from "lucide-react";

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
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">

      {/* ── Header Banner ── */}
      <div
        className="rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border animate-fade-up"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border-light)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="space-y-1 flex-1 min-w-0">
          <div className="npa-badge inline-flex">
            <MessageSquare className="w-3 h-3" />
            Caixa de Entrada Corporativa
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-head leading-tight">
            Central de Mensagens
          </h1>
          <p className="text-xs text-muted leading-relaxed">
            Gerencie conversas ativas com os estudantes FECAP em tempo real.
          </p>
        </div>

        <div
          className="flex items-center gap-3 rounded-xl p-3 border shrink-0 self-start sm:self-auto"
          style={{ background: "var(--bg-raised)", borderColor: "var(--border-base)" }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(0,74,48,0.1)", border: "1px solid rgba(0,74,48,0.2)" }}
          >
            <Radio className="w-4 h-4 text-npa animate-pulse" />
          </div>
          <div>
            <span className="block text-xs font-bold text-head">Realtime</span>
            <span className="text-[10px] text-npa font-semibold">Conexão Ativa</span>
          </div>
        </div>
      </div>

      {/* ── Main Two-Column Client Inbox Container ── */}
      <EmpresaInboxClient empresaUserId={empresaUserId} conversasIniciais={conversas} />
    </div>
  );
}
