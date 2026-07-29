"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Clock, 
  Briefcase, 
  Sparkles,
  AlertTriangle,
  MessageSquare
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { SOFT_SKILLS_LABELS, Vaga } from "@/types/talent";

export default function AprovaçãoCampanhasPage() {
  const { vagas, alterarStatusCampanha } = useTalent();
  const [filterTab, setFilterTab] = useState<"pendente" | "aprovada" | "rejeitada" | "todas">("pendente");

  const filteredVagas = vagas.filter((v) => {
    if (filterTab === "pendente") return v.status === "pendente_aprovacao";
    if (filterTab === "aprovada") return v.status === "aprovada";
    if (filterTab === "rejeitada") return v.status === "rejeitada";
    return true;
  });

  const handleAprovar = async (vagaId: string, titulo: string) => {
    await alterarStatusCampanha(vagaId, "aprovada");
    alert(`Campanha "${titulo}" aprovada com sucesso pela Coordenação Master!`);
  };

  const handleRejeitar = async (vagaId: string, titulo: string) => {
    const feedback = prompt(`Motivo da rejeição para a campanha "${titulo}":`, "Requisitos desalinhados com as diretrizes acadêmicas FECAP.");
    if (feedback !== null) {
      await alterarStatusCampanha(vagaId, "rejeitada", feedback);
      alert(`Campanha "${titulo}" rejeitada.`);
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      
      <div className="flex items-center space-x-3">
        <Link href="/master" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Aprovação de Campanhas de Vagas</h1>
          <p className="text-xs text-slate-400">
            Valide se as vagas criadas por empresas parceiras atendem às diretrizes da FECAP.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-4 overflow-x-auto text-xs font-semibold">
        {[
          { key: "pendente", label: "Pendentes de Aprovação", count: vagas.filter(v => v.status === "pendente_aprovacao").length, color: "text-amber-400" },
          { key: "aprovada", label: "Campanhas Aprovadas", count: vagas.filter(v => v.status === "aprovada").length, color: "text-emerald-400" },
          { key: "rejeitada", label: "Campanhas Rejeitadas", count: vagas.filter(v => v.status === "rejeitada").length, color: "text-rose-400" },
          { key: "todas", label: "Todas", count: vagas.length, color: "text-slate-300" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key as "pendente" | "aprovada" | "rejeitada" | "todas")}
            className={`px-4 py-2 rounded-xl transition-all border flex items-center space-x-2 shrink-0 ${
              filterTab === tab.key
                ? "bg-slate-800 text-white border-cyan-500/50 shadow"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] bg-slate-900 border border-slate-800 font-bold ${tab.color}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* List of Vagas */}
      {filteredVagas.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-300 font-bold">Nenhuma vaga encontrada na categoria selecionada.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVagas.map((vaga) => (
            <div
              key={vaga.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                      {vaga.tipoContrato}
                    </span>
                    <span className="text-xs text-slate-400">&bull; {vaga.localizacao}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{vaga.titulo}</h3>
                  <p className="text-xs font-semibold text-teal-400">{vaga.empresa}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                    vaga.status === "aprovada"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : vaga.status === "pendente_aprovacao"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30 font-extrabold animate-pulse"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                  }`}
                >
                  {vaga.status === "pendente_aprovacao" ? "Pendente Aprovação" : vaga.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{vaga.descricao}</p>

              {/* Requirements breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-1">Soft Skills Requeridas:</span>
                  <div className="flex flex-wrap gap-1">
                    {vaga.requisitosSoftSkills.map((sk) => (
                      <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
                        {SOFT_SKILLS_LABELS[sk]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-teal-400 font-bold block mb-1">Pesos de Hard Skills:</span>
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
                    {Object.entries(vaga.pesosHardSkills).map(([cat, peso]) => (
                      <span key={cat}>
                        {cat}: <strong className="text-teal-400">{peso}x</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {vaga.feedbackMaster && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Feedback da Coordenação: {vaga.feedbackMaster}</span>
                </div>
              )}

              {/* Actions for Master */}
              {vaga.status === "pendente_aprovacao" && (
                <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                  <button
                    onClick={() => handleRejeitar(vaga.id, vaga.titulo)}
                    className="px-5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rejeitar Campanha</span>
                  </button>

                  <button
                    onClick={() => handleAprovar(vaga.id, vaga.titulo)}
                    className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Aprovar Campanha</span>
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </main>
  );
}
