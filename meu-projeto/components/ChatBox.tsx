"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Loader2,
  ShieldCheck,
  CheckCheck,
  AlertCircle,
  MessageSquare,
  Radio,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  getHistoricoMensagens,
  enviarMensagemAction,
  IMensagemChat,
} from "@/services/chatService";

interface ChatBoxProps {
  usuarioLogadoId: string;
  destinatarioId: string;
  destinatarioNome: string;
  destinatarioAvatar: string;
  destinatarioSubtitulo?: string;
}

export function ChatBox({
  usuarioLogadoId,
  destinatarioId,
  destinatarioNome,
  destinatarioAvatar,
  destinatarioSubtitulo = "Estudante FECAP",
}: ChatBoxProps) {
  const [mensagens, setMensagens] = useState<IMensagemChat[]>([]);
  const [novoTexto, setNovoTexto] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const channelRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    let cancelado = false;

    async function carregarHistorico() {
      if (!usuarioLogadoId || !destinatarioId) return;

      setCarregando(true);
      setErroEnvio(null);

      try {
        const data = await getHistoricoMensagens(
          usuarioLogadoId,
          destinatarioId
        );
        if (!cancelado) {
          setMensagens(data);
          setTimeout(scrollToBottom, 100);
        }
      } catch (err) {
        console.error("Erro ao carregar historico:", err);
        if (!cancelado) {
          setErroEnvio("Não foi possível carregar o histórico de mensagens.");
        }
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    }

    carregarHistorico();

    return () => {
      cancelado = true;
    };
  }, [usuarioLogadoId, destinatarioId]);

  useEffect(() => {
    if (!usuarioLogadoId || !destinatarioId) return;

    if (!supabase) {
      console.warn("Supabase Client não inicializado no navegador.");
      return;
    }

    const ids = [usuarioLogadoId, destinatarioId].sort();
    const channelName = `chat_room_${ids.join("_")}`;

    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false },
      },
    });

    channel
      .on("broadcast", { event: "new_message" }, (payload) => {
        if (payload?.payload) {
          const novaMsg = payload.payload as IMensagemChat;
          setMensagens((prev) => {
            if (prev.some((m) => m.id === novaMsg.id)) return prev;
            return [...prev, novaMsg];
          });
          setTimeout(scrollToBottom, 50);
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`[Supabase Realtime] Conectado ao canal ${channelName}`);
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [usuarioLogadoId, destinatarioId]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const handleEnviarMensagem = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErroEnvio(null);

    const textoLimpo = novoTexto.trim();

    if (!destinatarioId || destinatarioId === "undefined") {
      setErroEnvio("Erro: Usuário destinatário inválido.");
      return;
    }

    if (!usuarioLogadoId || usuarioLogadoId === "undefined") {
      setErroEnvio("Erro: Sessão do usuário logado inválida.");
      return;
    }

    if (!textoLimpo || enviando) return;

    setEnviando(true);
    const textoParaEnviar = textoLimpo;
    setNovoTexto("");

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
      const res = await enviarMensagemAction(
        usuarioLogadoId,
        destinatarioId,
        textoParaEnviar
      );
      if (res.success && res.data) {
        const msgFinal = res.data as IMensagemChat;
        setMensagens((prev) =>
          prev.map((m) => (m.id === msgOtimista.id ? msgFinal : m))
        );

        try {
          channelRef.current?.send({
            type: "broadcast",
            event: "new_message",
            payload: msgFinal,
          });
        } catch (bErr) {
          console.warn("Erro no Supabase Broadcast:", bErr);
        }
      } else {
        setErroEnvio(res.error || "Falha ao enviar mensagem.");
        setMensagens((prev) => prev.filter((m) => m.id !== msgOtimista.id));
        setNovoTexto(textoParaEnviar);
      }
    } catch {
      setErroEnvio("Erro de comunicação ao enviar mensagem.");
      setMensagens((prev) => prev.filter((m) => m.id !== msgOtimista.id));
      setNovoTexto(textoParaEnviar);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="flex flex-col h-[480px] sm:h-[540px] max-h-[80vh] w-full max-w-3xl mx-auto rounded-2xl border shadow-lg overflow-hidden"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-light)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between gap-3 shrink-0"
        style={{
          background: "var(--bg-raised)",
          borderColor: "var(--border-light)",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={destinatarioAvatar}
              alt={destinatarioNome}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border"
              style={{ borderColor: "var(--border-strong)" }}
            />
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2"
              style={{ borderColor: "var(--bg-raised)" }}
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-head truncate">
              {destinatarioNome}
            </h3>
            <p className="text-[11px] text-muted flex items-center gap-1 truncate">
              <ShieldCheck className="w-3 h-3 text-npa shrink-0" />
              <span className="truncate">{destinatarioSubtitulo}</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full npa-badge text-[10px]">
          <Radio className="w-3 h-3 text-npa animate-pulse" />
          <span>Realtime</span>
        </div>
      </div>

      {/* Histórico */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {carregando ? (
          <div className="h-full flex items-center justify-center gap-2 text-muted text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-npa" />
            <span>Carregando mensagens...</span>
          </div>
        ) : mensagens.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
            <MessageSquare className="w-8 h-8 text-subtle" strokeWidth={1} />
            <h4 className="text-xs font-bold text-head">Inicie a Conversa</h4>
            <p className="text-[11px] text-muted max-w-xs">
              Envie uma mensagem abaixo para abrir o canal direto.
            </p>
          </div>
        ) : (
          mensagens.map((msg) => {
            const ehRemetente = msg.remetenteId === usuarioLogadoId;
            const horaFormatada = new Date(msg.createdAt).toLocaleTimeString(
              "pt-BR",
              { hour: "2-digit", minute: "2-digit" }
            );

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  ehRemetente ? "items-end" : "items-start"
                } space-y-0.5`}
              >
                <div
                  className="max-w-[85%] sm:max-w-[75%] px-3.5 py-2.5 text-xs leading-relaxed rounded-2xl shadow-sm"
                  style={
                    ehRemetente
                      ? {
                          background: "#004A30",
                          color: "#ffffff",
                          borderBottomRightRadius: "4px",
                        }
                      : {
                          background: "var(--bg-raised)",
                          color: "var(--text-head)",
                          border: "1px solid var(--border-light)",
                          borderBottomLeftRadius: "4px",
                        }
                  }
                >
                  {msg.conteudo}
                </div>
                <div className="flex items-center gap-1 px-1 text-[10px] text-subtle">
                  <span>{horaFormatada}</span>
                  {ehRemetente && <CheckCheck className="w-3 h-3 text-npa" />}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Erro */}
      {erroEnvio && (
        <div
          className="px-4 py-2 text-xs flex items-center justify-between animate-fade-in"
          style={{
            background: "var(--red-bg)",
            color: "var(--red-text)",
            borderTop: "1px solid var(--red-border)",
          }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{erroEnvio}</span>
          </div>
          <button
            type="button"
            onClick={() => setErroEnvio(null)}
            className="font-bold text-xs underline ml-2"
          >
            Dispensar
          </button>
        </div>
      )}

      {/* Form Envio */}
      <form
        onSubmit={handleEnviarMensagem}
        className="p-3 border-t flex items-center gap-2 shrink-0"
        style={{
          background: "var(--bg-raised)",
          borderColor: "var(--border-light)",
        }}
      >
        <input
          type="text"
          value={novoTexto}
          onChange={(e) => setNovoTexto(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="npa-input flex-1 py-2"
        />
        <button
          type="submit"
          disabled={!novoTexto.trim() || enviando}
          className="npa-btn-primary px-3.5 py-2 text-xs rounded-xl disabled:opacity-50 shrink-0"
        >
          {enviando ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline">Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
