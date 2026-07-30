"use client";

import { useState } from "react";
import { ChatBox } from "@/components/ChatBox";
import { IConversaAtiva } from "@/services/chatService";
import { Search, MessageSquare, GraduationCap, UserCheck, ShieldCheck } from "lucide-react";

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
    conversasIniciais[0] || null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const conversasFiltradas = conversas.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.alunoNome.toLowerCase().includes(q) ||
      c.alunoRa.toLowerCase().includes(q) ||
      c.alunoCurso.toLowerCase().includes(q)
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Coluna da Esquerda (Lista estilo WhatsApp/LinkedIn) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <span>Candidatos & Contatos ({conversasFiltradas.length})</span>
          </h2>
        </div>

        {/* Campo de Busca de Alunos */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por aluno, RA ou curso..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Lista de Conversas */}
        <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
          {conversasFiltradas.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-400">
              Nenhuma conversa encontrada.
            </div>
          ) : (
            conversasFiltradas.map((item) => {
              const isSelected = alunoSelecionado?.alunoId === item.alunoId;
              const horaFormatada = new Date(item.ultimaMensagemData).toLocaleTimeString(
                "pt-BR",
                { hour: "2-digit", minute: "2-digit" }
              );

              return (
                <div
                  key={item.alunoId}
                  onClick={() => setAlunoSelecionado(item)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start space-x-3.5 ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-950/50 to-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/10"
                      : "bg-slate-900/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  {/* Avatar do Aluno */}
                  <div className="relative shrink-0">
                    <img
                      src={item.alunoAvatarUrl}
                      alt={item.alunoNome}
                      className={`w-12 h-12 rounded-2xl object-cover border ${
                        isSelected ? "border-cyan-400" : "border-slate-700"
                      }`}
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
                  </div>

                  {/* Informações Resumidas */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-sm font-bold truncate ${
                          isSelected ? "text-cyan-300" : "text-white"
                        }`}
                      >
                        {item.alunoNome}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-1">
                        {horaFormatada}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.alunoCurso} • RA: {item.alunoRa}
                    </p>

                    <p className="text-xs text-slate-300 truncate mt-1 italic">
                      "{item.ultimaMensagem}"
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Coluna da Direita (ChatBox Principal) */}
      <div className="lg:col-span-8 space-y-4">
        {alunoSelecionado ? (
          <ChatBox
            key={`${empresaUserId}_${alunoSelecionado.alunoUserId}`}
            usuarioLogadoId={empresaUserId}
            destinatarioId={alunoSelecionado.alunoUserId}
            destinatarioNome={alunoSelecionado.alunoNome}
            destinatarioAvatar={alunoSelecionado.alunoAvatarUrl}
            destinatarioSubtitulo={`${alunoSelecionado.alunoCurso} • RA ${alunoSelecionado.alunoRa}`}
          />
        ) : (
          <div className="h-[560px] rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white">Selecione uma conversa</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Clique em um aluno na lista ao lado para abrir a conversa ao vivo via Supabase Realtime WebSockets.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
