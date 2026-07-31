export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { ChatBox } from "@/components/ChatBox";
import { MessageSquare, Building2, Radio } from "lucide-react";

export default async function AlunoMensagensPage() {
  let alunoUserId = "aluno1-user-id";
  let empresaUserId = "";
  let empresaNome = "TechInova Soluções & IA";
  let temEmpresaAtiva = false;

  try {
    const { prisma } = await import("@/lib/prisma");

    const { getLoggedUserServer } = await import("@/services/authService");
    const { email: loggedEmail } = await getLoggedUserServer();

    if (loggedEmail) {
      const alunoUser = await prisma.user.findFirst({
        where: { email: loggedEmail.toLowerCase() },
      });
      if (alunoUser) {
        alunoUserId = alunoUser.id;
      }
    }

    const empresaUser = await prisma.user.findFirst({
      where: { role: "EMPRESA" },
      include: { empresa: true },
    });
    if (empresaUser) {
      empresaUserId = empresaUser.id;
      temEmpresaAtiva = true;
      if (empresaUser.empresa?.nomeEmpresa) {
        empresaNome = empresaUser.empresa.nomeEmpresa;
      }
    }
  } catch (e) {
    console.warn("Fallback de busca de usuarios no Chat do Aluno:", e);
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">

      {/* ── Header ── */}
      <div
        className="rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border animate-fade-up"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border-light)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="space-y-1 flex-1 min-w-0">
          <div className="npa-badge inline-flex">
            <MessageSquare className="w-3 h-3" />
            Central de Mensagens
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-head leading-tight">
            Comunicação com Recrutadores
          </h1>
          <p className="text-xs text-muted leading-relaxed">
            Chat em tempo real para conversa direta com recrutadores.
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
            <span className="block text-xs font-bold text-head">Canal Realtime</span>
            <span className="text-[10px] text-npa font-semibold">Ativo & Criptografado</span>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Sidebar contatos */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-head flex items-center gap-2">
              <Building2 className="w-4 h-4 text-npa" />
              <span>Empresas Contatadas</span>
            </h2>
            <span className="text-xs text-muted">
              {temEmpresaAtiva ? "1 Conversa" : "0 Conversas"}
            </span>
          </div>

          {!temEmpresaAtiva ? (
            <div className="p-8 text-center npa-card rounded-2xl space-y-2">
              <Building2 className="w-8 h-8 mx-auto text-subtle" strokeWidth={1} />
              <p className="font-bold text-xs text-head">Nenhuma conversa ativa</p>
              <p className="text-[11px] text-muted">
                Recrutadores que entrarem em contato aparecerão nesta lista.
              </p>
            </div>
          ) : (
            <div
              className="p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all"
              style={{ background: "var(--bg-surface)", borderColor: "var(--border-strong)", boxShadow: "var(--shadow-sm)" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(0,74,48,0.1)", border: "1px solid rgba(0,74,48,0.2)" }}
              >
                <Building2 className="w-5 h-5 text-npa" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-head truncate">{empresaNome}</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                </div>
                <p className="text-[11px] text-muted truncate mt-0.5">Recrutamento & Seleção IA</p>
                <span className="inline-block text-[10px] text-npa font-semibold mt-0.5">
                  Conexão Aberta
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Chat box */}
        <div className="lg:col-span-8 space-y-4">
          {temEmpresaAtiva && empresaUserId ? (
            <ChatBox
              key={`${alunoUserId}_${empresaUserId}`}
              usuarioLogadoId={alunoUserId}
              destinatarioId={empresaUserId}
              destinatarioNome={empresaNome}
              destinatarioAvatar="https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=250"
              destinatarioSubtitulo="Recrutador Responsável • TechInova"
            />
          ) : (
            <div className="min-h-[300px] sm:min-h-[450px] rounded-2xl npa-card flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(0,74,48,0.1)", border: "1px solid rgba(0,74,48,0.2)" }}
              >
                <MessageSquare className="w-7 h-7 text-npa" />
              </div>
              <h3 className="text-sm font-bold text-head">Sem conversa selecionada</h3>
              <p className="text-xs text-muted max-w-xs">
                Aguarde o contato de uma empresa ou explore as vagas.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
