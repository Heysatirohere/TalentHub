"use client";

import { useState } from "react";
import { Award, Loader2, CheckCircle2 } from "lucide-react";
import { aprovarMentoria } from "@/services/mentoriaService";
import { useRouter } from "next/navigation";

interface BotaoAprovarMentoriaProps {
  progressoId: string;
  alunoNome: string;
  trilhaNome: string;
  onSuccess?: () => void;
}

export function BotaoAprovarMentoria({
  progressoId,
  alunoNome,
  trilhaNome,
  onSuccess,
}: BotaoAprovarMentoriaProps) {
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const router = useRouter();

  const handleAprovar = async () => {
    setLoading(true);
    try {
      const res = await aprovarMentoria(
        progressoId,
        "Validado presencialmente pela coordenação FECAP"
      );
      if (res.success) {
        setSucesso(true);
        if (onSuccess) {
          onSuccess();
        }
        router.refresh();
      } else {
        alert(res.error || "Erro ao aprovar mentoria.");
      }
    } catch (err) {
      console.error("Erro na validação da mentoria:", err);
      alert("Falha de conexão ao aprovar a mentoria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAprovar}
      disabled={loading || sucesso}
      className={`relative group overflow-hidden flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-md ${
        sucesso
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 cursor-default"
          : "bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 text-slate-950 shadow-amber-500/10 hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]"
      } disabled:opacity-75`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
          <span>Validando...</span>
        </>
      ) : sucesso ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Selo Atribuído!</span>
        </>
      ) : (
        <>
          <Award className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform duration-200" />
          <span>Validar Mentoria (Selo Oficial)</span>
        </>
      )}
    </button>
  );
}
