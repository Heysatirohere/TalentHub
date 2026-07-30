import { IVaga, StatusCampanha } from "@/types/talent";
import { MOCK_VAGAS } from "@/lib/mocks/data";

const LOCAL_STORAGE_KEY_VAGAS = "fecap_talent_vagas_v6";

function loadVagasFromStorage(): IVaga[] {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_VAGAS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Erro ao ler repositório local de vagas:", e);
    }
  }
  return MOCK_VAGAS;
}

function saveVagasToStorage(vagas: IVaga[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_VAGAS, JSON.stringify(vagas));
    } catch (e) {
      console.error("Erro ao salvar no repositório local de vagas:", e);
    }
  }
}

/**
 * Service Layer (DAL real) para Vagas/Campanhas via Prisma ORM no servidor e fallback no browser.
 */
export async function getVagas(): Promise<IVaga[]> {
  if (typeof window !== "undefined") {
    return loadVagasFromStorage();
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const { StatusCampanha: PrismaStatusCampanha } = await import("@prisma/client");

    const count = await prisma.vaga.count();
    if (count === 0) {
      for (const v of MOCK_VAGAS) {
        const prismaStatus =
          v.status === "aprovada"
            ? PrismaStatusCampanha.APROVADA
            : v.status === "rejeitada"
            ? PrismaStatusCampanha.REJEITADA
            : PrismaStatusCampanha.PENDENTE_APROVACAO;

        await prisma.vaga.create({
          data: {
            id: v.id,
            titulo: v.titulo,
            empresa: v.empresa,
            localizacao: v.localizacao,
            tipoContrato: v.tipoContrato,
            descricao: v.descricao,
            requisitosSoftSkills: v.requisitosSoftSkills as string[],
            status: prismaStatus,
            dataCriacao: v.dataCriacao,
            materiasRequeridas: {
              create: v.materiasRequeridas?.map((m) => ({
                nomeDaMateria: m.nomeDaMateria,
                peso: m.peso,
              })),
            },
          },
        });
      }
    }

    const dbVagas = await prisma.vaga.findMany({
      include: { materiasRequeridas: true },
      orderBy: { createdAt: "desc" },
    });

    return dbVagas.map((v) => {
      const statusFormatted: StatusCampanha =
        v.status === PrismaStatusCampanha.APROVADA
          ? "aprovada"
          : v.status === PrismaStatusCampanha.REJEITADA
          ? "rejeitada"
          : "pendente_aprovacao";

      return {
        id: v.id,
        titulo: v.titulo,
        empresa: v.empresa,
        localizacao: v.localizacao,
        tipoContrato: v.tipoContrato,
        descricao: v.descricao,
        requisitosSoftSkills: (v.requisitosSoftSkills || []) as IVaga["requisitosSoftSkills"],
        materiasRequeridas: v.materiasRequeridas.map((m) => ({
          nomeDaMateria: m.nomeDaMateria,
          peso: m.peso,
        })),
        status: statusFormatted,
        dataCriacao: v.dataCriacao,
        feedbackMaster: v.feedbackMaster || undefined,
        createdAt: v.createdAt.toISOString(),
        updatedAt: v.updatedAt.toISOString(),
      };
    });
  } catch (e) {
    console.warn("Prisma Vaga Fetch fallback:", e);
    return MOCK_VAGAS;
  }
}

export async function getVagasAprovadas(): Promise<IVaga[]> {
  const vagas = await getVagas();
  return vagas.filter((v) => v.status === "aprovada");
}

export async function getVagasPendentes(): Promise<IVaga[]> {
  const vagas = await getVagas();
  return vagas.filter((v) => v.status === "pendente_aprovacao");
}

export async function getVagaById(id: string): Promise<IVaga | undefined> {
  const vagas = await getVagas();
  return vagas.find((v) => v.id === id);
}

export async function createCampanha(
  vagaData: Omit<IVaga, "id" | "status" | "dataCriacao">
): Promise<IVaga> {
  const dataHoje = new Date().toISOString().split("T")[0];
  const novaVaga: IVaga = {
    ...vagaData,
    id: `vaga-${Date.now()}`,
    status: "pendente_aprovacao",
    dataCriacao: dataHoje,
  };

  if (typeof window !== "undefined") {
    const vagasLocais = loadVagasFromStorage();
    saveVagasToStorage([novaVaga, ...vagasLocais]);
    return novaVaga;
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const { StatusCampanha: PrismaStatusCampanha } = await import("@prisma/client");

    const dbVaga = await prisma.vaga.create({
      data: {
        titulo: vagaData.titulo,
        empresa: vagaData.empresa,
        localizacao: vagaData.localizacao,
        tipoContrato: vagaData.tipoContrato,
        descricao: vagaData.descricao,
        requisitosSoftSkills: vagaData.requisitosSoftSkills as string[],
        status: PrismaStatusCampanha.PENDENTE_APROVACAO,
        dataCriacao: dataHoje,
        materiasRequeridas: {
          create: vagaData.materiasRequeridas?.map((m) => ({
            nomeDaMateria: m.nomeDaMateria,
            peso: m.peso,
          })),
        },
      },
      include: { materiasRequeridas: true },
    });

    return {
      id: dbVaga.id,
      titulo: dbVaga.titulo,
      empresa: dbVaga.empresa,
      localizacao: dbVaga.localizacao,
      tipoContrato: dbVaga.tipoContrato,
      descricao: dbVaga.descricao,
      requisitosSoftSkills: (dbVaga.requisitosSoftSkills || []) as IVaga["requisitosSoftSkills"],
      materiasRequeridas: dbVaga.materiasRequeridas.map((m) => ({
        nomeDaMateria: m.nomeDaMateria,
        peso: m.peso,
      })),
      status: "pendente_aprovacao",
      dataCriacao: dbVaga.dataCriacao,
    };
  } catch (e) {
    console.error("Erro ao criar vaga no servidor:", e);
    return novaVaga;
  }
}

export async function updateCampanhaStatus(
  vagaId: string,
  status: StatusCampanha,
  feedbackMaster?: string
): Promise<IVaga> {
  if (typeof window !== "undefined") {
    const vagas = loadVagasFromStorage();
    const listaAtualizada = vagas.map((v) =>
      v.id === vagaId ? { ...v, status, feedbackMaster } : v
    );
    saveVagasToStorage(listaAtualizada);
    return listaAtualizada.find((v) => v.id === vagaId)!;
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const { StatusCampanha: PrismaStatusCampanha } = await import("@prisma/client");

    const prismaStatus =
      status === "aprovada"
        ? PrismaStatusCampanha.APROVADA
        : status === "rejeitada"
        ? PrismaStatusCampanha.REJEITADA
        : PrismaStatusCampanha.PENDENTE_APROVACAO;

    const dbVaga = await prisma.vaga.update({
      where: { id: vagaId },
      data: { status: prismaStatus, feedbackMaster },
      include: { materiasRequeridas: true },
    });

    return {
      id: dbVaga.id,
      titulo: dbVaga.titulo,
      empresa: dbVaga.empresa,
      localizacao: dbVaga.localizacao,
      tipoContrato: dbVaga.tipoContrato,
      descricao: dbVaga.descricao,
      requisitosSoftSkills: (dbVaga.requisitosSoftSkills || []) as IVaga["requisitosSoftSkills"],
      materiasRequeridas: dbVaga.materiasRequeridas.map((m) => ({
        nomeDaMateria: m.nomeDaMateria,
        peso: m.peso,
      })),
      status,
      dataCriacao: dbVaga.dataCriacao,
      feedbackMaster: dbVaga.feedbackMaster || undefined,
    };
  } catch (e) {
    console.error("Erro ao atualizar status da vaga no servidor:", e);
  }

  const vaga = await getVagaById(vagaId);
  return { ...vaga!, status, feedbackMaster };
}

export async function resetVagas(): Promise<IVaga[]> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_KEY_VAGAS);
  }
  return MOCK_VAGAS;
}
