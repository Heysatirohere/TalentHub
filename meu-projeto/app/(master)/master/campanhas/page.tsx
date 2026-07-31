"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin } from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { SOFT_SKILLS_LABELS } from "@/types/talent";

export default function MasterCampanhasPage() {
  const { vagas } = useTalent();

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 animate-fade-up">
        <Link href="/master" className="npa-btn-ghost p-2 rounded-xl shrink-0" aria-label="Voltar">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-head leading-tight">
            Catálogo de Campanhas
          </h1>
          <p className="text-xs text-muted">
            Vagas ativas cadastradas pelas empresas parceiras da FECAP.
          </p>
        </div>
      </div>

      {/* ── Lista ── */}
      {vagas.length === 0 ? (
        <div className="npa-card rounded-2xl p-8 sm:p-12 text-center space-y-3">
          <Briefcase className="w-10 h-10 mx-auto" style={{ color: "var(--text-subtle)" }} strokeWidth={1} />
          <p className="text-sm font-bold text-head">Nenhuma campanha cadastrada.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {vagas.map((vaga) => (
            <div
              key={vaga.id}
              className="npa-card rounded-2xl p-5 space-y-4"
            >
              {/* Cabeçalho da vaga */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4"
                style={{ borderBottom: "1px solid var(--border-light)" }}
              >
                <div className="min-w-0 flex-1">
                  {/* Contrato + localização com wrap */}
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span
                      className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded"
                      style={{ background: "var(--bg-sunken)", color: "var(--text-muted)", border: "1px solid var(--border-base)" }}
                    >
                      {vaga.tipoContrato}
                    </span>
                    <span className="text-[11px] text-muted flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate max-w-[200px]">{vaga.localizacao}</span>
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-head leading-snug">{vaga.titulo}</h3>
                  <p className="text-xs font-semibold text-npa">{vaga.empresa}</p>
                </div>

                <span
                  className="self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "rgba(0,74,48,0.1)", color: "#004A30", border: "1px solid rgba(0,74,48,0.2)" }}
                >
                  ✓ Ativa
                </span>
              </div>

              <p className="text-xs text-body leading-relaxed">{vaga.descricao}</p>

              {/* Requisitos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div
                  className="p-3 rounded-xl space-y-2"
                  style={{ background: "var(--amber-bg)", border: "1px solid var(--amber-border)" }}
                >
                  <span className="font-bold block" style={{ color: "var(--amber-text)" }}>
                    Soft Skills Exigidas:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {vaga.requisitosSoftSkills.map((sk) => (
                      <span
                        key={sk}
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: "rgba(146,64,14,0.08)", color: "var(--amber-text)", border: "1px solid var(--amber-border)" }}
                      >
                        {SOFT_SKILLS_LABELS[sk] || sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className="p-3 rounded-xl space-y-2"
                  style={{ background: "var(--bg-raised)", border: "1px solid var(--border-base)" }}
                >
                  <span className="font-bold text-npa block">Matérias Requeridas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {vaga.materiasRequeridas?.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded font-medium"
                        style={{ background: "var(--bg-sunken)", color: "var(--text-body)", border: "1px solid var(--border-light)" }}
                      >
                        {item.nomeDaMateria}: <strong className="text-npa">Peso {item.peso}x</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
