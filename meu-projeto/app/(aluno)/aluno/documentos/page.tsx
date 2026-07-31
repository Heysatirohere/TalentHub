"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText, Upload, ArrowLeft, FileCheck
} from "lucide-react";
import { useTalent } from "@/context/TalentContext";
import { DocumentoSimulado } from "@/types/talent";

export default function DocumentosAlunoPage() {
  const { currentAluno, enviarDocumentoAluno } = useTalent();

  const [nomeDoc, setNomeDoc] = useState("");
  const [tipoDoc, setTipoDoc] = useState<DocumentoSimulado["tipo"]>("ComprovanteMatricula");

  if (!currentAluno) return null;

  const handleUploadSimulado = async (e: React.FormEvent) => {
    e.preventDefault();

    const fileName = nomeDoc.trim() || `${tipoDoc}_${currentAluno.ra}.pdf`;

    await enviarDocumentoAluno(currentAluno.id, {
      nome: fileName,
      tipo: tipoDoc,
    });

    setNomeDoc("");
    alert(`Documento "${fileName}" enviado com sucesso no Pack do Aluno!`);
  };

  const documentos = currentAluno.packDocumentos || [];

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 animate-fade-up">
        <Link href="/aluno" className="npa-btn-ghost p-2 rounded-xl shrink-0" aria-label="Voltar">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-head leading-tight">
            Pack de Documentos
          </h1>
          <p className="text-xs text-muted">
            Envio simulado de documentos para validação institucional.
          </p>
        </div>
      </div>

      {/* ── Upload Box ── */}
      <form onSubmit={handleUploadSimulado} className="npa-card rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-npa uppercase tracking-wider flex items-center gap-2">
          <Upload className="w-4 h-4 text-npa" />
          <span>Upload Simulado de Documento</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
              Tipo de Documento
            </label>
            <select
              value={tipoDoc}
              onChange={(e) => setTipoDoc(e.target.value as DocumentoSimulado["tipo"])}
              className="npa-select"
            >
              <option value="ComprovanteMatricula">Comprovante de Matrícula FECAP</option>
              <option value="HistoricoEscolar">Histórico Escolar Completo</option>
              <option value="DocumentoIdentidade">RG / CPF / CNH</option>
              <option value="Certificado">Certificado de Curso / Evento</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
              Nome do Arquivo (Simulado)
            </label>
            <input
              type="text"
              placeholder={`Ex: ${tipoDoc}_${currentAluno.ra}.pdf`}
              value={nomeDoc}
              onChange={(e) => setNomeDoc(e.target.value)}
              className="npa-input"
            />
          </div>
        </div>

        <div
          className="p-4 rounded-xl border border-dashed text-center space-y-1"
          style={{ background: "var(--bg-sunken)", borderColor: "var(--border-strong)" }}
        >
          <FileText className="w-6 h-6 text-npa mx-auto" />
          <p className="text-xs text-muted">Arraste ou clique para simular upload de PDF/PNG</p>
        </div>

        <button
          type="submit"
          className="npa-btn-primary w-full sm:w-auto justify-center rounded-xl text-xs py-2.5"
        >
          <Upload className="w-4 h-4" />
          <span>Confirmar Envio</span>
        </button>
      </form>

      {/* ── Documentos enviados ── */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-muted uppercase tracking-wider">
          Documentos no Seu Pack ({documentos.length})
        </h2>

        {documentos.length === 0 ? (
          <p className="text-xs text-muted italic">Nenhum documento enviado ainda.</p>
        ) : (
          <div className="space-y-2">
            {documentos.map((doc) => (
              <div
                key={doc.id}
                className="npa-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(0,74,48,0.1)", border: "1px solid rgba(0,74,48,0.2)" }}
                  >
                    <FileCheck className="w-4 h-4 text-npa" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-head truncate">{doc.nome}</p>
                    <p className="text-[10px] text-muted">Tipo: {doc.tipo} &bull; Enviado em: {doc.dataEnvio}</p>
                  </div>
                </div>

                <span className="npa-badge text-[10px] self-start sm:self-auto shrink-0">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}
