import React from "react";
import { prisma } from "@/lib/prisma";
import { IAluno, IVaga, IDocumentoSimulado } from "@/types/talent";
import { BancoTalentosClient } from "@/components/BancoTalentosClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function BancoTalentosBuscaAtivaPage() {
  let talentosReais: IAluno[] = [];
  let trilhasDisponiveis: string[] = [];
  let vagasDisponiveis: IVaga[] = [];

  try {
    const [talentosReaisRaw, trilhasRaw, vagasRaw] = await Promise.all([
      prisma.aluno.findMany({
        where: {
          nome: { not: "" },
        },
        include: {
          user: true,
          historicoAcademico: true,
          progressosTrilha: {
            include: {
              trilha: true,
            },
          },
          experiencias: true,
          packDocumentos: true,
        },
        orderBy: { ra: "asc" },
      }),
      prisma.trilhaSoftSkill.findMany({
        select: { nome: true },
        orderBy: { nome: "asc" },
      }),
      prisma.vaga.findMany({
        where: { status: "APROVADA" },
        include: {
          materiasRequeridas: true,
        },
        orderBy: { titulo: "asc" },
      }),
    ]);

    trilhasDisponiveis = trilhasRaw.map((t) => t.nome);

    vagasDisponiveis = vagasRaw.map((v: any) => ({
      id: v.id,
      titulo: v.titulo,
      empresa: v.empresa,
      localizacao: v.localizacao,
      tipoContrato: v.tipoContrato,
      descricao: v.descricao,
      requisitosSoftSkills: v.requisitosSoftSkills || [],
      materiasRequeridas: Array.isArray(v.materiasRequeridas)
        ? v.materiasRequeridas.map((m: any) => ({
            nomeDaMateria: m.nomeDaMateria,
            peso: m.peso,
          }))
        : [],
      status: (v.status ? v.status.toLowerCase() : "aprovada") as any,
      dataCriacao: v.dataCriacao,
      feedbackMaster: v.feedbackMaster || undefined,
    }));

    talentosReais = talentosReaisRaw.map((a: any) => {
      const progressosMapped = Array.isArray(a.progressosTrilha)
        ? a.progressosTrilha.map((pt: any) => ({
            id: pt.id,
            alunoId: pt.alunoId,
            trilhaId: pt.trilhaId,
            trilhaNome: pt.trilha?.nome || pt.trilhaId,
            status: pt.status,
            dataConclusao: pt.dataConclusao ? new Date(pt.dataConclusao).toISOString() : null,
            feedback: pt.feedback,
          }))
        : [];

      const softSkillsObj: Record<string, boolean> = {};
      progressosMapped.forEach((p: { trilhaNome: string; status: any }) => {
        softSkillsObj[p.trilhaNome] = p.status === "TESTE_APROVADO" || p.status === "VALIDADO_MENTORIA";
      });

      const realUserId = a.userId || a.user?.id || a.id;

      return {
        id: a.id,
        userId: realUserId,
        ra: a.ra,
        nome: a.nome,
        email: a.email,
        curso: a.curso,
        semestre: a.semestre,
        idade: a.idade,
        avatarUrl: a.avatarUrl,
        feedbacksProfessores: a.feedbacksProfessores || [],
        softSkills: softSkillsObj as any,
        progressosTrilha: progressosMapped,
        historicoAcademico: Array.isArray(a.historicoAcademico)
          ? a.historicoAcademico.map((h: any) => ({
              materia: h.materia,
              nota: h.nota,
              semestre: h.semestre,
            }))
          : [],
        experiencias: Array.isArray(a.experiencias)
          ? a.experiencias.map((e: any) => ({
              id: e.id,
              empresa: e.empresa,
              cargo: e.cargo,
              periodo: e.periodo,
              descricao: e.descricao,
            }))
          : [],
        packDocumentos: Array.isArray(a.packDocumentos)
          ? a.packDocumentos.map((d: any) => ({
              id: d.id,
              nome: d.nome,
              tipo: d.tipo as IDocumentoSimulado["tipo"],
              dataEnvio: d.dataEnvio,
              status: d.status as IDocumentoSimulado["status"],
            }))
          : [],
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      };
    });
  } catch (e) {
    console.error("Erro ao buscar dados no banco de dados via Prisma:", e);
  }

  return (
    <BancoTalentosClient
      talentosReais={talentosReais}
      trilhasDisponiveis={trilhasDisponiveis}
      vagasDisponiveis={vagasDisponiveis}
    />
  );
}
