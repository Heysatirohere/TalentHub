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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:w-[540px] h-full bg-slate-900 border-l border-slate-800 p-4 sm:p-6 flex flex-col space-y-4 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Chat Direto com {aluno.nome}</h2>
              <span className="text-[11px] text-slate-400 font-mono">RA: {aluno.ra}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatBox
            key={`${empresaUserId}_${aluno.userId || aluno.id}`}
            usuarioLogadoId={empresaUserId}
            destinatarioId={aluno.userId || aluno.id}
            destinatarioNome={aluno.nome}
            destinatarioAvatar={aluno.avatarUrl}
            destinatarioSubtitulo={`${aluno.curso} • RA ${aluno.ra}`}
          />
        </div>
      </div>
    </div>
  );
}
