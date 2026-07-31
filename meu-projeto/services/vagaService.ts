import { IVaga, StatusCampanha } from "@/types/talent";

/**
 * Service Layer para Vagas via API REST conectada ao PostgreSQL/Prisma.
 * Todas as vagas criadas são AUTO-APROVADAS (Status: APROVADA).
 */
export async function getVagas(): Promise<IVaga[]> {
  try {
    const res = await fetch("/api/vagas", { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Erro ao buscar vagas via API:", e);
  }
  return [];
}

export async function getVagasAprovadas(): Promise<IVaga[]> {
  return await getVagas();
}

export async function getVagasPendentes(): Promise<IVaga[]> {
  return [];
}

export async function getVagaById(id: string): Promise<IVaga | undefined> {
  const vagas = await getVagas();
  return vagas.find((v) => v.id === id);
}

export async function createCampanha(
  vagaData: Omit<IVaga, "id" | "status" | "dataCriacao">
): Promise<IVaga> {
  try {
    const res = await fetch("/api/vagas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...vagaData, status: "APROVADA" }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Erro ao criar vaga via API:", e);
  }

  const dataHoje = new Date().toISOString().split("T")[0];
  return {
    ...vagaData,
    id: `vaga-${Date.now()}`,
    status: "aprovada",
    dataCriacao: dataHoje,
  };
}

export async function updateCampanhaStatus(
  vagaId: string,
  status: StatusCampanha
): Promise<IVaga> {
  const vaga = await getVagaById(vagaId);
  return vaga ? { ...vaga, status: "aprovada" } : ({} as IVaga);
}

export async function resetVagas(): Promise<IVaga[]> {
  return [];
}
