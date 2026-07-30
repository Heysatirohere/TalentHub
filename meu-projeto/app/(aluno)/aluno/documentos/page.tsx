"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Upload, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  AlertCircle 
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
    <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      
      <div className="flex items-center space-x-3">
        <Link href="/aluno" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Pack de Documentos Acadêmicos</h1>
          <p className="text-xs text-slate-400">
            Envio simulado de documentos obrigatórios para validação junto aos recrutadores.
          </p>
        </div>
      </div>

      {/* Upload Box Simulado */}
      <form onSubmit={handleUploadSimulado} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
          <Upload className="w-4 h-4 text-cyan-400" />
          <span>Upload Simulado de Documento</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Tipo de Documento
            </label>
            <select
              value={tipoDoc}
              onChange={(e) => setTipoDoc(e.target.value as DocumentoSimulado["tipo"])}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ComprovanteMatricula">Comprovante de Matrícula FECAP</option>
              <option value="HistoricoEscolar">Histórico Escolar Completo</option>
              <option value="DocumentoIdentidade">RG / CPF / CNH</option>
              <option value="Certificado">Certificado de Curso / Evento</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Nome do Arquivo (Simulado)
            </label>
            <input
              type="text"
              placeholder={`Ex: ${tipoDoc}_${currentAluno.ra}.pdf`}
              value={nomeDoc}
              onChange={(e) => setNomeDoc(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-dashed border-slate-700 text-center space-y-2">
          <FileText className="w-8 h-8 text-cyan-400 mx-auto" />
          <p className="text-xs text-slate-300">Arraste ou clique para simular o upload de arquivo PDF/PNG</p>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-colors"
        >
          <Upload className="w-4 h-4 text-slate-950" />
          <span>Confirmar Envio do Documento</span>
        </button>
      </form>

      {/* List Documents */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Documentos no Seu Pack ({documentos.length})
        </h2>

        {documentos.length === 0 ? (
          <p className="text-xs text-slate-500 italic">Nenhum documento enviado ainda.</p>
        ) : (
          <div className="space-y-3">
            {documentos.map((doc) => (
              <div key={doc.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{doc.nome}</p>
                    <p className="text-[10px] text-slate-400">Tipo: {doc.tipo} &bull; Enviado em: {doc.dataEnvio}</p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
