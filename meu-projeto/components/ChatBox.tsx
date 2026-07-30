"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  getHistoricoMensagens,
  enviarMensagemAction,
  IMensagemChat,
} from "@/services/chatService";
import { Send, Loader2, MessageSquare, Radio, ShieldCheck, CheckCheck, AlertCircle } from "lucide-react";

interface ChatBoxProps {
  usuarioLogadoId: string;
  destinatarioId: string;
  destinatarioNome?: string;
  destinatarioAvatar?: string;
  destinatarioSubtitulo?: string;
}

export function ChatBox({
  usuarioLogadoId,
  destinatarioId,
  destinatarioNome = "Contato FECAP",
  destinatarioAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  destinatarioSubtitulo = "Canal de Comunicação Direta",
}: ChatBoxProps) {
  const [mensagens, setMensagens] = useState<IMensagemChat[]>([]);
  const [novoTexto, setNovoTexto] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto Scroll para o final da lista de mensagens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Carrega o histórico inicial de mensagens
  useEffect(() => {
    let isMounted = true;
    async function carregarHistorico() {
      setCarregando(true);
      setErroEnvio(null);
      const historico = await getHistoricoMensagens(usuarioLogadoId, destinatarioId);
      if (isMounted) {
        setMensagens(historico);
        setCarregando(false);
      }
    }
    carregarHistorico();
    return () => {
      isMounted = false;
    };
  }, [usuarioLogadoId, destinatarioId]);

  // 2. Inscrição no Supabase Realtime (escuntando eventos de INSERT na tabela mensagens)
  useEffect(() => {
    const channelName = `chat_${[usuarioLogadoId, destinatarioId].sort().join("_")}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensagens",
        },
        (payload) => {
          const newMsg = payload.new as any;
          if (
            (newMsg.remetenteId === usuarioLogadoId && newMsg.destinatarioId === destinatarioId) ||
            (newMsg.remetenteId === destinatarioId && newMsg.destinatarioId === usuarioLogadoId)
          ) {
            const formattedMsg: IMensagemChat = {
              id: newMsg.id,
              remetenteId: newMsg.remetenteId,
              destinatarioId: newMsg.destinatarioId,
              conteudo: newMsg.conteudo,
              lida: newMsg.lida ?? false,
              createdAt: newMsg.createdAt ? new Date(newMsg.createdAt).toISOString() : new Date().toISOString(),
            };

            setMensagens((prev) => {
              if (prev.some((m) => m.id === formattedMsg.id)) return prev;
              return [...prev, formattedMsg];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [usuarioLogadoId, destinatarioId]);

  // Auto-scroll sempre que a lista de mensagens for atualizada
  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  // 3. Envio de Mensagem Resiliente chamando a Server Action
  const handleEnviarMensagem = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErroEnvio(null);

    const textoLimpo = novoTexto.trim();

    // Validação prévia dos IDs
    if (!destinatarioId || !destinatarioId.trim() || destinatarioId === "undefined" || destinatarioId === "null") {
      setErroEnvio("Erro: Usuário destinatário inválido ou não informado.");
      return;
    }

    if (!usuarioLogadoId || !usuarioLogadoId.trim() || usuarioLogadoId === "undefined" || usuarioLogadoId === "null") {
      setErroEnvio("Erro: Sessão do usuário logado inválida.");
      return;
    }

    if (!textoLimpo || enviando) return;

    setEnviando(true);
    const textoParaEnviar = textoLimpo;
    setNovoTexto("");

    // Adição otimista da mensagem para resposta visual imediata
    const msgOtimista: IMensagemChat = {
      id: `temp-${Date.now()}`,
      remetenteId: usuarioLogadoId,
      destinatarioId,
      conteudo: textoParaEnviar,
      lida: false,
      createdAt: new Date().toISOString(),
    };

    setMensagens((prev) => [...prev, msgOtimista]);

    try {
      const res = await enviarMensagemAction(usuarioLogadoId, destinatarioId, textoParaEnviar);
      if (res.success && res.data) {
        setMensagens((prev) =>
          prev.map((m) => (m.id === msgOtimista.id ? (res.data as IMensagemChat) : m))
        );
      } else {
        setErroEnvio(res.error || "Falha ao enviar mensagem ao servidor.");
        setMensagens((prev) => prev.filter((m) => m.id !== msgOtimista.id));
        setNovoTexto(textoParaEnviar);
      }
    } catch (err: any) {
      console.error("Erro inesperado ao enviar mensagem:", err);
      setErroEnvio("Erro de comunicação ao enviar mensagem.");
      setMensagens((prev) => prev.filter((m) => m.id !== msgOtimista.id));
      setNovoTexto(textoParaEnviar);
    } finally {
      // Garante que o estado de envio SEMPRE é liberado (evita loading infinito)
      setEnviando(false);
    }
  };

  return (
    <div className="flex flex-col h-[560px] w-full max-w-3xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Header do Chat */}
      <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <img
              src={destinatarioAvatar}
              alt={destinatarioNome}
              className="w-11 h-11 rounded-2xl object-cover border border-slate-700 shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <span>{destinatarioNome}</span>
            </h3>
            <p className="text-xs text-slate-400 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{destinatarioSubtitulo}</span>
            </p>
          </div>
        </div>

        {/* Realtime Status Indicator */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Supabase Realtime</span>
        </div>
      </div>

      {/* Área de Histórico de Mensagens */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {carregando ? (
          <div className="h-full flex items-center justify-center space-x-2 text-slate-400 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            <span>Carregando histórico do chat...</span>
          </div>
        ) : mensagens.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-white">Inicie a Conversa</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Envie uma mensagem abaixo para abrir o canal direto via Supabase Realtime WebSockets.
            </p>
          </div>
        ) : (
          mensagens.map((msg) => {
            const ehRemetente = msg.remetenteId === usuarioLogadoId;
            const horaFormatada = new Date(msg.createdAt).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${ehRemetente ? "items-end" : "items-start"} space-y-1`}
              >
                <div
                  className={`max-w-[78%] px-4 py-3 text-xs leading-relaxed transition-all shadow-md ${
                    ehRemetente
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-medium rounded-2xl rounded-tr-none shadow-cyan-500/10"
                      : "bg-slate-800 text-slate-100 rounded-2xl rounded-tl-none border border-slate-700"
                  }`}
                >
                  {msg.conteudo}
                </div>
                <div className="flex items-center space-x-1 px-1 text-[10px] text-slate-500">
                  <span>{horaFormatada}</span>
                  {ehRemetente && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Alerta de Erro de Envio */}
      {erroEnvio && (
        <div className="px-4 py-2 bg-rose-500/10 border-t border-rose-500/30 text-rose-300 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-semibold">{erroEnvio}</span>
          </div>
          <button
            type="button"
            onClick={() => setErroEnvio(null)}
            className="text-rose-400 hover:text-white font-bold text-xs underline ml-2"
          >
            Dispensar
          </button>
        </div>
      )}

      {/* Formulário de Envio de Mensagem */}
      <form
        onSubmit={handleEnviarMensagem}
        className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center space-x-3"
      >
        <input
          type="text"
          value={novoTexto}
          onChange={(e) => setNovoTexto(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!novoTexto.trim() || enviando}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {enviando ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
          ) : (
            <>
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5 text-slate-950" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
