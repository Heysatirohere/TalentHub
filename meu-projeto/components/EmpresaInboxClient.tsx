"use client";

import React, { useState } from "react";
import { ChatBox } from "@/components/ChatBox";
import { IConversaAtiva } from "@/services/chatService";
import { MessageSquare, Users, Search } from "lucide-react";

interface EmpresaInboxClientProps {
  empresaUserId: string;
  conversasIniciais: IConversaAtiva[];
}

export function EmpresaInboxClient({
  empresaUserId,
  conversasIniciais,
}: EmpresaInboxClientProps) {
  const [conversas] = useState<IConversaAtiva[]>(conversasIniciais);
  const [alunoSelecionado, setAlunoSelecionado] = useState<IConversaAtiva | null>(
    conversasIniciais.length > 0 ? conversasIniciais[0] : null
  );
  const [buscaQuery, setBuscaQuery] = useState("");

  const conversasFiltradas = conversas.filter((c) => {
    const q = buscaQuery.toLowerCase();
    return (
      c.alunoNome.toLowerCase().includes(q) ||
      c.alunoCurso.toLowerCase().includes(q) ||
      c.alunoRa.toLowerCase().includes(q)
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* Sidebar de conversas */}
      <div className="lg:col-span-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-head flex items-center gap-2">
            <Users className="w-4 h-4 text-npa" />
            <span>Conversas Ativas</span>
          </h2>
          <span className="npa-badge text-[10px]">
            {conversas.length}
          </span>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5" style={{ color: "var(--text-subtle)" }} />
          <input
            type="text"
            placeholder="Buscar por aluno, curso, RA..."
            value={buscaQuery}
            onChange={(e) => setBuscaQuery(e.target.value)}
            className="npa-input pl-9"
          />
        </div>

        {/* Lista */}
        <div className="space-y-2">
          {conversasFiltradas.length === 0 ? (
            <div className="p-8 text-center npa-card rounded-2xl space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-subtle" strokeWidth={1} />
              <p className="font-bold text-xs text-head">Nenhuma conversa encontrada</p>
              <p className="text-[11px] text-muted">
                Inicie uma prospecção ativa no Banco de Talentos.
              </p>
            </div>
          ) : (
            conversasFiltradas.map((item) => {
              const isSelected = alunoSelecionado?.alunoId === item.alunoId;
              const dataMsg = new Date(item.dataUltimaMensagem);
              const horaFormatada = dataMsg.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={item.alunoId}
                  onClick={() => setAlunoSelecionado(item)}
                  className="p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3"
                  style={
                    isSelected
                      ? { background: "rgba(0,74,48,0.08)", borderColor: "rgba(0,74,48,0.25)", boxShadow: "var(--shadow-sm)" }
                      : { background: "var(--bg-surface)", borderColor: "var(--border-light)" }
                  }
                >
                  <div className="relative shrink-0">
                    <img
                      src={item.alunoAvatarUrl}
                      alt={item.alunoNome}
                      className="w-11 h-11 rounded-xl object-cover border-2"
                      style={{ borderColor: isSelected ? "#00C951" : "var(--border-strong)" }}
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2" style={{ borderColor: "var(--bg-surface)" }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className={`text-xs font-bold truncate ${isSelected ? "text-npa" : "text-head"}`}>
                        {item.alunoNome}
                      </h3>
                      <span className="text-[10px] text-subtle font-mono shrink-0">
                        {horaFormatada}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted truncate mt-0.5">
                      {item.alunoCurso} • RA: {item.alunoRa}
                    </p>

                    <p className="text-xs text-body truncate mt-1 italic">
                      &quot;{item.ultimaMensagem}&quot;
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ChatBox */}
      <div className="lg:col-span-8 space-y-4">
        {alunoSelecionado ? (
          <ChatBox
            key={`inbox_chat_${empresaUserId}_${alunoSelecionado.alunoUserId || alunoSelecionado.alunoId}`}
            usuarioLogadoId={empresaUserId}
            destinatarioId={alunoSelecionado.alunoUserId || alunoSelecionado.alunoId}
            destinatarioNome={alunoSelecionado.alunoNome}
            destinatarioAvatar={alunoSelecionado.alunoAvatarUrl}
            destinatarioSubtitulo={`${alunoSelecionado.alunoCurso} • RA ${alunoSelecionado.alunoRa}`}
          />
        ) : (
          <div className="min-h-[300px] sm:min-h-[450px] rounded-2xl npa-card flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(0,74,48,0.1)", border: "1px solid rgba(0,74,48,0.2)" }}
            >
              <MessageSquare className="w-7 h-7 text-npa" />
            </div>
            <h3 className="text-sm font-bold text-head">Selecione uma conversa</h3>
            <p className="text-xs text-muted max-w-xs">
              Clique em um aluno na lista para abrir a conversa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
