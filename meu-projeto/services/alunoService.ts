import { IAluno, ISoftSkills, IItemHistorico, IExperiencia, IDocumentoSimulado } from "@/types/talent";
import { MOCK_ALUNOS } from "@/lib/mocks/data";

const LOCAL_STORAGE_KEY_ALUNOS = "fecap_talent_alunos_v6";

function loadAlunosFromStorage(): IAluno[] {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ALUNOS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Erro ao ler repositório local de alunos:", e);
    }
  }
  return MOCK_ALUNOS;
}

function saveAlunosToStorage(alunos: IAluno[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ALUNOS, JSON.stringify(alunos));
    } catch (e) {
      console.error("Erro ao salvar no repositório local de alunos:", e);
    }
  }
}

/**
 * Service Layer (DAL real) para Alunos via Prisma ORM & PostgreSQL no servidor, com fallback seguro no browser.
 */
export async function getAlunos(): Promise<IAluno[]> {
  if (typeof window !== "undefined") {
    return loadAlunosFromStorage();
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const count = await prisma.aluno.count();
    if (count === 0) {
      for (const a of MOCK_ALUNOS) {
        await prisma.aluno.create({
          data: {
            id: a.id,
            ra: a.ra,
            nome: a.nome,
            email: a.email,
            curso: a.curso,
            semestre: a.semestre,
            idade: a.idade,
            avatarUrl: a.avatarUrl,
            feedbacksProfessores: a.feedbacksProfessores,
            historicoAcademico: {
              create: a.historicoAcademico?.map((h) => ({
                materia: h.materia,
                nota: h.nota,
                semestre: h.semestre,
              })),
            },
          },
        });
      }
    }

    const includeQuery: any = {
      historicoAcademico: true,
      experiencias: true,
      packDocumentos: true,
    };

    if ("progressoAlunoTrilha" in prisma) {
      includeQuery.progressosTrilha = {
        include: {
          trilha: true,
        },
      };
    }

    const dbAlunos = await prisma.aluno.findMany({
      include: includeQuery,
      orderBy: { ra: "asc" },
    });

    return dbAlunos.map((a: any) => {
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

      return {
        id: a.id,
        userId: a.userId || a.id,
        ra: a.ra,
        nome: a.nome,
        email: a.email,
        curso: a.curso,
        semestre: a.semestre,
        idade: a.idade,
        avatarUrl: a.avatarUrl,
        feedbacksProfessores: a.feedbacksProfessores,
        softSkills: softSkillsObj as any,
        progressosTrilha: progressosMapped,
        historicoAcademico: Array.isArray(a.historicoAcademico) ? a.historicoAcademico.map((h: any) => ({
          materia: h.materia,
          nota: h.nota,
          semestre: h.semestre,
        })) : [],
        experiencias: Array.isArray(a.experiencias) ? a.experiencias.map((e: any) => ({
          id: e.id,
          empresa: e.empresa,
          cargo: e.cargo,
          periodo: e.periodo,
          descricao: e.descricao,
        })) : [],
        packDocumentos: Array.isArray(a.packDocumentos) ? a.packDocumentos.map((d: any) => ({
          id: d.id,
          nome: d.nome,
          tipo: d.tipo as IDocumentoSimulado["tipo"],
          dataEnvio: d.dataEnvio,
          status: d.status as IDocumentoSimulado["status"],
        })) : [],
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      };
    });
  } catch (e) {
    console.warn("Prisma Server Fetch fallback:", e);
    return MOCK_ALUNOS;
  }
}

export async function getAlunoById(id: string): Promise<IAluno | undefined> {
  const alunos = await getAlunos();
  return alunos.find((a) => a.id === id || a.ra === id);
}

export async function getAlunoByRa(ra: string): Promise<IAluno | undefined> {
  const alunos = await getAlunos();
  return alunos.find((a) => a.ra === ra);
}

export async function createAluno(
  dadosAluno: Omit<IAluno, "id" | "avatarUrl" | "experiencias" | "packDocumentos">
): Promise<IAluno> {
  const avatars = [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250",
  ];
  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

  if (typeof window !== "undefined") {
    const localAlunos = loadAlunosFromStorage();
    const novoLocal: IAluno = {
      ...dadosAluno,
      id: `aluno-custom-${Date.now()}`,
      avatarUrl: randomAvatar,
      experiencias: [],
      packDocumentos: [],
    };
    saveAlunosToStorage([novoLocal, ...localAlunos]);
    return novoLocal;
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const dbAluno = await prisma.aluno.create({
      data: {
        ra: dadosAluno.ra,
        nome: dadosAluno.nome,
        email: dadosAluno.email,
        curso: dadosAluno.curso,
        semestre: dadosAluno.semestre,
        idade: dadosAluno.idade,
        avatarUrl: randomAvatar,
        feedbacksProfessores: dadosAluno.feedbacksProfessores,
        historicoAcademico: {
          create: dadosAluno.historicoAcademico?.map((h) => ({
            materia: h.materia,
            nota: h.nota,
            semestre: h.semestre,
          })),
        },
      },
      include: {
        historicoAcademico: true,
        experiencias: true,
        packDocumentos: true,
      },
    });

    return {
      id: dbAluno.id,
      ra: dbAluno.ra,
      nome: dbAluno.nome,
      email: dbAluno.email,
      curso: dbAluno.curso,
      semestre: dbAluno.semestre,
      idade: dbAluno.idade,
      avatarUrl: dbAluno.avatarUrl,
      feedbacksProfessores: dbAluno.feedbacksProfessores,
      softSkills: {} as any,
      historicoAcademico: dbAluno.historicoAcademico.map((h) => ({
        materia: h.materia,
        nota: h.nota,
        semestre: h.semestre,
      })),
      experiencias: [],
      packDocumentos: [],
    };
  } catch (e) {
    console.error("Erro ao criar aluno no servidor:", e);
    return {
      ...dadosAluno,
      id: `aluno-custom-${Date.now()}`,
      avatarUrl: randomAvatar,
      experiencias: [],
      packDocumentos: [],
    };
  }
}

export async function updateAlunoHistorico(
  alunoId: string,
  softSkills: ISoftSkills,
  historicoAcademico: IItemHistorico[]
): Promise<IAluno> {
  if (typeof window !== "undefined") {
    const alunos = loadAlunosFromStorage();
    const listaAtualizada = alunos.map((a) =>
      a.id === alunoId || a.ra === alunoId ? { ...a, softSkills, historicoAcademico } : a
    );
    saveAlunosToStorage(listaAtualizada);
    return listaAtualizada.find((a) => a.id === alunoId || a.ra === alunoId)!;
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const dbAlunoExistente = await prisma.aluno.findFirst({
      where: { OR: [{ id: alunoId }, { ra: alunoId }] },
    });

    if (dbAlunoExistente) {
      await prisma.historicoAcademico.deleteMany({
        where: { alunoId: dbAlunoExistente.id },
      });

      const dbAlunoAtualizado = await prisma.aluno.update({
        where: { id: dbAlunoExistente.id },
        data: {
          historicoAcademico: {
            create: historicoAcademico.map((h) => ({
              materia: h.materia,
              nota: h.nota,
              semestre: h.semestre,
            })),
          },
        },
        include: {
          historicoAcademico: true,
          experiencias: true,
          packDocumentos: true,
        },
      });

      return {
        id: dbAlunoAtualizado.id,
        ra: dbAlunoAtualizado.ra,
        nome: dbAlunoAtualizado.nome,
        email: dbAlunoAtualizado.email,
        curso: dbAlunoAtualizado.curso,
        semestre: dbAlunoAtualizado.semestre,
        idade: dbAlunoAtualizado.idade,
        avatarUrl: dbAlunoAtualizado.avatarUrl,
        feedbacksProfessores: dbAlunoAtualizado.feedbacksProfessores,
        softSkills: {} as any,
        historicoAcademico: dbAlunoAtualizado.historicoAcademico.map((h) => ({
          materia: h.materia,
          nota: h.nota,
          semestre: h.semestre,
        })),
        experiencias: [],
        packDocumentos: [],
      };
    }
  } catch (e) {
    console.error("Erro ao atualizar histórico no servidor:", e);
  }

  const aluno = await getAlunoById(alunoId);
  return { ...aluno!, softSkills, historicoAcademico };
}

export async function addExperienciaAluno(
  alunoId: string,
  expData: Omit<IExperiencia, "id">
): Promise<IExperiencia> {
  const novaExp: IExperiencia = { id: `exp-${Date.now()}`, ...expData };
  if (typeof window !== "undefined") {
    const alunos = loadAlunosFromStorage();
    const listaAtualizada = alunos.map((a) =>
      a.id === alunoId || a.ra === alunoId
        ? { ...a, experiencias: [novaExp, ...(a.experiencias || [])] }
        : a
    );
    saveAlunosToStorage(listaAtualizada);
  }
  return novaExp;
}

export async function addDocumentoAluno(
  alunoId: string,
  docData: Omit<IDocumentoSimulado, "id" | "dataEnvio" | "status">
): Promise<IDocumentoSimulado> {
  const novoDoc: IDocumentoSimulado = {
    id: `doc-${Date.now()}`,
    dataEnvio: new Date().toISOString().split("T")[0],
    status: "Aprovado",
    ...docData,
  };
  if (typeof window !== "undefined") {
    const alunos = loadAlunosFromStorage();
    const listaAtualizada = alunos.map((a) =>
      a.id === alunoId || a.ra === alunoId
        ? { ...a, packDocumentos: [novoDoc, ...(a.packDocumentos || [])] }
        : a
    );
    saveAlunosToStorage(listaAtualizada);
  }
  return novoDoc;
}

export async function resetAlunos(): Promise<IAluno[]> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_KEY_ALUNOS);
  }
  return MOCK_ALUNOS;
}
