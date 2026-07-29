import { IAluno, ISoftSkills, IHardSkills, IExperiencia, IDocumentoSimulado } from "@/types/talent";
import { MOCK_ALUNOS } from "@/lib/mocks/data";

const LOCAL_STORAGE_KEY_ALUNOS = "fecap_talent_alunos_v4";

// Funções utilitárias de persistência simulada (DAL)
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
      console.error("Erro ao ler repositório de alunos:", e);
    }
  }
  return MOCK_ALUNOS;
}

function saveAlunosToStorage(alunos: IAluno[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ALUNOS, JSON.stringify(alunos));
    } catch (e) {
      console.error("Erro ao salvar no repositório de alunos:", e);
    }
  }
}

// Simulação de latência de rede assíncrona (~300ms)
const simulateNetworkDelay = () => new Promise((resolve) => setTimeout(resolve, 300));

/**
 * Service Pattern para a entidade Aluno / Estudantes FECAP.
 * Todas as funções são assíncronas e retornam Promise<T>.
 */
export async function getAlunos(): Promise<IAluno[]> {
  await simulateNetworkDelay();
  return loadAlunosFromStorage();
}

export async function getAlunoById(id: string): Promise<IAluno | undefined> {
  await simulateNetworkDelay();
  const alunos = loadAlunosFromStorage();
  return alunos.find((a) => a.id === id || a.ra === id);
}

export async function getAlunoByRa(ra: string): Promise<IAluno | undefined> {
  await simulateNetworkDelay();
  const alunos = loadAlunosFromStorage();
  return alunos.find((a) => a.ra === ra);
}

export async function createAluno(
  dadosAluno: Omit<IAluno, "id" | "avatarUrl" | "experiencias" | "packDocumentos">
): Promise<IAluno> {
  await simulateNetworkDelay();
  const alunos = loadAlunosFromStorage();

  const avatars = [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250",
  ];
  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

  const novoAluno: IAluno = {
    ...dadosAluno,
    id: `aluno-custom-${Date.now()}`,
    avatarUrl: randomAvatar,
    experiencias: [],
    packDocumentos: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const listaAtualizada = [novoAluno, ...alunos];
  saveAlunosToStorage(listaAtualizada);
  return novoAluno;
}

export async function updateAlunoSkills(
  alunoId: string,
  softSkills: ISoftSkills,
  hardSkills: IHardSkills
): Promise<IAluno> {
  await simulateNetworkDelay();
  const alunos = loadAlunosFromStorage();

  let alunoAtualizado: IAluno | undefined;

  const listaAtualizada = alunos.map((a) => {
    if (a.id === alunoId || a.ra === alunoId) {
      alunoAtualizado = {
        ...a,
        softSkills,
        hardSkills,
        updatedAt: new Date().toISOString(),
      };
      return alunoAtualizado;
    }
    return a;
  });

  saveAlunosToStorage(listaAtualizada);

  if (!alunoAtualizado) {
    throw new Error(`Aluno com ID ${alunoId} não foi encontrado.`);
  }

  return alunoAtualizado;
}

export async function addExperienciaAluno(
  alunoId: string,
  expData: Omit<IExperiencia, "id">
): Promise<IExperiencia> {
  await simulateNetworkDelay();
  const alunos = loadAlunosFromStorage();

  const novaExp: IExperiencia = {
    ...expData,
    id: `exp-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const listaAtualizada = alunos.map((a) => {
    if (a.id === alunoId || a.ra === alunoId) {
      return {
        ...a,
        experiencias: [novaExp, ...(a.experiencias || [])],
        updatedAt: new Date().toISOString(),
      };
    }
    return a;
  });

  saveAlunosToStorage(listaAtualizada);
  return novaExp;
}

export async function addDocumentoAluno(
  alunoId: string,
  docData: Omit<IDocumentoSimulado, "id" | "dataEnvio" | "status">
): Promise<IDocumentoSimulado> {
  await simulateNetworkDelay();
  const alunos = loadAlunosFromStorage();

  const novoDoc: IDocumentoSimulado = {
    ...docData,
    id: `doc-${Date.now()}`,
    dataEnvio: new Date().toISOString().split("T")[0],
    status: "Aprovado",
  };

  const listaAtualizada = alunos.map((a) => {
    if (a.id === alunoId || a.ra === alunoId) {
      return {
        ...a,
        packDocumentos: [novoDoc, ...(a.packDocumentos || [])],
        updatedAt: new Date().toISOString(),
      };
    }
    return a;
  });

  saveAlunosToStorage(listaAtualizada);
  return novoDoc;
}

export async function resetAlunos(): Promise<IAluno[]> {
  await simulateNetworkDelay();
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ALUNOS);
    } catch (e) {
      console.error(e);
    }
  }
  return MOCK_ALUNOS;
}
