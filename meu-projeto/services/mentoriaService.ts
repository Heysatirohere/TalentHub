"use server";

import { StatusSoftSkill } from "@prisma/client";
import { IProgressoTrilha } from "@/types/talent";
import { getAlunos } from "./alunoService";
import { requireAuth } from "@/lib/authGuard";

export interface IMentoriaPendente {
  id: string;
  alunoId: string;
  alunoNome: string;
  alunoRa: string;
  alunoEmail: string;
  alunoCurso: string;
  alunoAvatarUrl: string;
  trilhaId: string;
  trilhaNome: string;
  status: StatusSoftSkill;
  createdAt: string;
}

/**
 * Busca todos os progressos de alunos com o status TESTE_APROVADO (aguardando a conversa com o mentor no Hub Master).
 */
export async function getMentoriasPendentes(): Promise<IMentoriaPendente[]> {
  await requireAuth(["MASTER"]);
  try {
    const { prisma } = await import("@/lib/prisma");
    if ("progressoAlunoTrilha" in prisma && (prisma as any).progressoAlunoTrilha) {
      const dbProgressos = await (prisma as any).progressoAlunoTrilha.findMany({
        where: {
          status: "TESTE_APROVADO",
        },
        include: {
          aluno: true,
          trilha: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      if (dbProgressos && dbProgressos.length > 0) {
        return dbProgressos.map((p: any) => ({
          id: p.id,
          alunoId: p.alunoId,
          alunoNome: p.aluno.nome,
          alunoRa: p.aluno.ra,
          alunoEmail: p.aluno.email,
          alunoCurso: p.aluno.curso,
          alunoAvatarUrl: p.aluno.avatarUrl,
          trilhaId: p.trilhaId,
          trilhaNome: p.trilha.nome,
          status: p.status as StatusSoftSkill,
          createdAt: p.createdAt.toISOString(),
        }));
      }
    }
  } catch (e) {
    console.warn("Prisma getMentoriasPendentes fallback (usando mock de alunos):", e);
  }

  // Fallback seguro usando mock alunos
  const alunos = await getAlunos();
  const pendentes: IMentoriaPendente[] = [];

  for (const a of alunos) {
    if (a.progressosTrilha) {
      for (const p of a.progressosTrilha) {
        if (p.status === "TESTE_APROVADO") {
          pendentes.push({
            id: p.id || `progresso-${a.id}-${p.trilhaNome}`,
            alunoId: a.id,
            alunoNome: a.nome,
            alunoRa: a.ra,
            alunoEmail: a.email,
            alunoCurso: a.curso,
            alunoAvatarUrl: a.avatarUrl,
            trilhaId: p.trilhaId || p.trilhaNome,
            trilhaNome: p.trilhaNome,
            status: p.status,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }
  }

  return pendentes;
}

import { revalidatePath } from "next/cache";

export async function aprovarMentoria(progressoId: string, feedback?: string) {
  await requireAuth(["MASTER"]);
  try {
    const { prisma } = await import("@/lib/prisma");
    const progressoAtualizado = await prisma.progressoAlunoTrilha.update({
      where: { id: progressoId },
      data: {
        status: "VALIDADO_MENTORIA",
        dataConclusao: new Date(),
        feedback: feedback || "Validado presencialmente pela coordenação FECAP.",
      },
      include: {
        aluno: true,
        trilha: true,
      },
    });

    revalidatePath("/master/mentorias");
    revalidatePath("/master");
    revalidatePath("/empresa/banco-talentos");

    return {
      success: true,
      data: {
        id: progressoAtualizado.id,
        status: progressoAtualizado.status,
        dataConclusao: progressoAtualizado.dataConclusao,
        feedback: progressoAtualizado.feedback,
        alunoNome: progressoAtualizado.aluno.nome,
        trilhaNome: progressoAtualizado.trilha.nome,
      },
    };
  } catch (e) {
    console.error("Erro ao aprovar mentoria no banco de dados:", e);
    return {
      success: false,
      error: "Não foi possível aprovar a mentoria. Verifique se o registro existe no banco de dados.",
    };
  }
}
