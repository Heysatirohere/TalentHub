import { ICandidatura } from "@/types/talent";

export async function getCandidaturasDoAluno(alunoId: string): Promise<ICandidatura[]> {
  try {
    const res = await fetch(`/api/candidaturas?alunoId=${encodeURIComponent(alunoId)}`, { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Erro ao buscar candidaturas via API:", e);
  }
  return [];
}

export async function candidatarAVagaService(
  alunoId: string,
  vagaId: string,
  matchScore: number = 0
): Promise<ICandidatura | null> {
  try {
    const res = await fetch("/api/candidaturas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alunoId, vagaId, matchScore }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Erro ao candidatar via API:", e);
  }
  return null;
}

export async function cancelarCandidaturaService(
  alunoId: string,
  vagaId: string
): Promise<boolean> {
  try {
    const res = await fetch("/api/candidaturas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alunoId, vagaId }),
    });
    return res.ok;
  } catch (e) {
    console.error("Erro ao cancelar candidatura via API:", e);
    return false;
  }
}
