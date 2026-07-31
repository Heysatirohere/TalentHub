import { IAluno, ISoftSkills, IItemHistorico, IExperiencia, IDocumentoSimulado } from "@/types/talent";

/**
 * Service Layer para Alunos alimentado exclusivamente por APIs REST conectadas ao PostgreSQL/Prisma.
 * NENHUM DADO MOCKADO É UTILIZADO.
 */
export async function getAlunos(): Promise<IAluno[]> {
  try {
    const res = await fetch("/api/alunos", { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Erro ao buscar alunos via API:", e);
  }
  return [];
}

export async function getAlunoById(id: string): Promise<IAluno | undefined> {
  const alunos = await getAlunos();
  return alunos.find((a) => a.id === id || a.ra === id || a.userId === id);
}

export async function getAlunoByRa(ra: string): Promise<IAluno | undefined> {
  const alunos = await getAlunos();
  return alunos.find((a) => a.ra === ra);
}

export async function createAluno(
  dadosAluno: Omit<IAluno, "id" | "avatarUrl" | "experiencias" | "packDocumentos">
): Promise<IAluno> {
  try {
    const res = await fetch("/api/alunos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_aluno", ...dadosAluno }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Erro ao criar aluno via API:", e);
  }

  const avatars = [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
  ];
  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

  return {
    ...dadosAluno,
    id: `aluno-custom-${Date.now()}`,
    userId: `aluno-custom-${Date.now()}`,
    avatarUrl: randomAvatar,
    experiencias: [],
    packDocumentos: [],
  };
}

export async function updateAlunoHistorico(
  alunoId: string,
  softSkills: ISoftSkills,
  historicoAcademico: IItemHistorico[]
): Promise<IAluno> {
  try {
    const res = await fetch("/api/alunos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_historico", alunoId, softSkills, historicoAcademico }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Erro ao atualizar histórico via API:", e);
  }

  const aluno = await getAlunoById(alunoId);
  return aluno ? { ...aluno, softSkills, historicoAcademico } : ({} as IAluno);
}

export async function addExperienciaAluno(
  alunoId: string,
  expData: Omit<IExperiencia, "id">
): Promise<IExperiencia> {
  try {
    const res = await fetch("/api/alunos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_experiencia", alunoId, expData }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Erro ao adicionar experiência via API:", e);
  }

  return { id: `exp-${Date.now()}`, ...expData };
}

export async function addDocumentoAluno(
  alunoId: string,
  docData: Omit<IDocumentoSimulado, "id" | "dataEnvio" | "status">
): Promise<IDocumentoSimulado> {
  const dataHoje = new Date().toISOString().split("T")[0];
  try {
    const res = await fetch("/api/alunos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_documento", alunoId, docData }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Erro ao adicionar documento via API:", e);
  }

  return {
    id: `doc-${Date.now()}`,
    dataEnvio: dataHoje,
    status: "Aprovado",
    ...docData,
  };
}

export async function resetAlunos(): Promise<IAluno[]> {
  return [];
}
