"use client";

import { ChatBox } from "@/components/ChatBox";
import { X, MessageSquare } from "lucide-react";
import { Aluno } from "@/types/talent";

interface ChatDrawerProps {
  aluno: Aluno | null;
  empresaUserId?: string;
  onClose: () => void;
}

export function ChatDrawer({
  aluno,
  empresaUserId = "empresa-user-id",
  onClose,
}: ChatDrawerProps) {
  if (!aluno) return null;

  const targetUserId = aluno.userId || aluno.id;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full sm:w-[500px] h-full p-4 sm:p-6 flex flex-col space-y-4 border-l shadow-2xl relative"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border-base)" }}
      >
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: "1px solid var(--border-light)" }}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(0,74,48,0.1)", border: "1px solid rgba(0,74,48,0.2)" }}
            >
              <MessageSquare className="w-4 h-4 text-npa" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-head truncate">Chat com {aluno.nome}</h2>
              <span className="text-[10px] text-muted font-mono">RA: {aluno.ra}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="npa-btn-ghost w-8 h-8 p-0 justify-center rounded-full shrink-0"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatBox
            key={`chat_box_${empresaUserId}_${targetUserId}`}
            usuarioLogadoId={empresaUserId}
            destinatarioId={targetUserId}
            destinatarioNome={aluno.nome}
            destinatarioAvatar={aluno.avatarUrl}
            destinatarioSubtitulo={`${aluno.curso} • RA ${aluno.ra}`}
          />
        </div>
      </div>
    </div>
  );
}
