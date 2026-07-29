import { IVaga, StatusCampanha } from "@/types/talent";
import { MOCK_VAGAS } from "@/lib/mocks/data";

const LOCAL_STORAGE_KEY_VAGAS = "fecap_talent_vagas_v4";

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
      console.error("Erro ao ler repositório de vagas:", e);
    }
  }
  return MOCK_VAGAS;
}

function saveVagasToStorage(vagas: IVaga[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_VAGAS, JSON.stringify(vagas));
    } catch (e) {
      console.error("Erro ao salvar no repositório de vagas:", e);
    }
  }
}

const simulateNetworkDelay = () => new Promise((resolve) => setTimeout(resolve, 300));

/**
 * Service Pattern para a entidade Vaga / Campanhas Corporativas.
 * Todas as funções são assíncronas e retornam Promise<T>.
 */
export async function getVagas(): Promise<IVaga[]> {
  await simulateNetworkDelay();
  return loadVagasFromStorage();
}

export async function getVagasAprovadas(): Promise<IVaga[]> {
  await simulateNetworkDelay();
  const vagas = loadVagasFromStorage();
  return vagas.filter((v) => v.status === "aprovada");
}

export async function getVagasPendentes(): Promise<IVaga[]> {
  await simulateNetworkDelay();
  const vagas = loadVagasFromStorage();
  return vagas.filter((v) => v.status === "pendente_aprovacao");
}

export async function getVagaById(id: string): Promise<IVaga | undefined> {
  await simulateNetworkDelay();
  const vagas = loadVagasFromStorage();
  return vagas.find((v) => v.id === id);
}

export async function createCampanha(
  vagaData: Omit<IVaga, "id" | "status" | "dataCriacao">
): Promise<IVaga> {
  await simulateNetworkDelay();
  const vagas = loadVagasFromStorage();

  const novaVaga: IVaga = {
    ...vagaData,
    id: `vaga-${Date.now()}`,
    status: "pendente_aprovacao",
    dataCriacao: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const listaAtualizada = [novaVaga, ...vagas];
  saveVagasToStorage(listaAtualizada);
  return novaVaga;
}

export async function updateCampanhaStatus(
  vagaId: string,
  status: StatusCampanha,
  feedbackMaster?: string
): Promise<IVaga> {
  await simulateNetworkDelay();
  const vagas = loadVagasFromStorage();

  let vagaAtualizada: IVaga | undefined;

  const listaAtualizada = vagas.map((v) => {
    if (v.id === vagaId) {
      vagaAtualizada = {
        ...v,
        status,
        feedbackMaster,
        updatedAt: new Date().toISOString(),
      };
      return vagaAtualizada;
    }
    return v;
  });

  saveVagasToStorage(listaAtualizada);

  if (!vagaAtualizada) {
    throw new Error(`Vaga com ID ${vagaId} não foi encontrada.`);
  }

  return vagaAtualizada;
}

export async function resetVagas(): Promise<IVaga[]> {
  await simulateNetworkDelay();
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY_VAGAS);
    } catch (e) {
      console.error(e);
    }
  }
  return MOCK_VAGAS;
}
