import { IAluno, IVaga, IMatchResult, ISoftSkills } from "@/types/talent";
import { getAlunos } from "./alunoService";
import { getVagaById } from "./vagaService";

const simulateNetworkDelay = () => new Promise((resolve) => setTimeout(resolve, 200));

/**
 * Lógica do Algoritmo de Match entre Aluno e Vaga.
 *
 * 1. Soft Skills: Validação dos requisitos comportamentais obrigatórios.
 * 2. Histórico Acadêmico: Média Ponderada cruzando as matérias exigidas pela vaga com as notas reais (0-10) do aluno.
 *    Exemplo: Vaga pede Cybersecurity (peso 3). Aluno tirou 8.0 -> contribuição: (8.0 * 10) * 3 = 240.
 */
export function calculateMatchScore(aluno: IAluno, vaga: IVaga): IMatchResult {
  const reqSofts = vaga.requisitosSoftSkills || [];
  const softsFaltantes: (keyof ISoftSkills)[] = [];
  let softsAtendidas = 0;
  let mentoriaValidadaCount = 0;

  for (const softKey of reqSofts) {
    const keyStr = String(softKey).toLowerCase();
    const progresso = aluno.progressosTrilha?.find(
      (p) => p.trilhaNome.toLowerCase() === keyStr || p.trilhaId?.toLowerCase() === keyStr
    );

    if (progresso) {
      if (progresso.status === "VALIDADO_MENTORIA") {
        softsAtendidas++;
        mentoriaValidadaCount++;
      } else if (progresso.status === "TESTE_APROVADO") {
        softsAtendidas++;
      } else {
        softsFaltantes.push(softKey);
      }
    } else if (aluno.softSkills && aluno.softSkills[softKey]) {
      softsAtendidas++;
    } else {
      softsFaltantes.push(softKey);
    }
  }

  const passouSoftSkills = softsFaltantes.length === 0;
  const softRatio = reqSofts.length > 0 ? softsAtendidas / reqSofts.length : 1;

  // Média Ponderada das Matérias Requeridas
  let somaPonderada = 0;
  let somaPesos = 0;

  const materiasReq = vaga.materiasRequeridas || [];

  for (const req of materiasReq) {
    const peso = req.peso || 1;
    const reqNomeNorm = req.nomeDaMateria.toLowerCase().trim();

    // Busca no histórico do aluno por correspondência de nome
    const itemHistorico = aluno.historicoAcademico?.find(
      (h) => h.materia.toLowerCase().trim() === reqNomeNorm || h.materia.toLowerCase().includes(reqNomeNorm) || reqNomeNorm.includes(h.materia.toLowerCase())
    );

    const nota = itemHistorico ? itemHistorico.nota : 0; // 0.0 a 10.0
    const notaEmEscala100 = nota * 10;

    somaPonderada += notaEmEscala100 * peso;
    somaPesos += peso;
  }

  const historicoScore = somaPesos > 0 ? Math.round(somaPonderada / somaPesos) : 0;
  const softSkillScore = Math.round(softRatio * 100);

  // Multiplicador (Peso extra) por chancela de mentoria validada pela coordenação (Hub Master)
  const multiplicadorMentoria = 1 + (mentoriaValidadaCount * 0.15);

  // Score Final com Penalização por Soft Skills faltantes ou Multiplicador de Mentoria
  let scoreFinal = historicoScore;
  if (!passouSoftSkills) {
    const fatorPenalizacao = 0.35 + 0.25 * softRatio;
    scoreFinal = Math.round(historicoScore * fatorPenalizacao * multiplicadorMentoria);
  } else {
    scoreFinal = Math.round(historicoScore * multiplicadorMentoria);
  }

  return {
    aluno,
    scoreFinal: Math.max(0, Math.min(100, scoreFinal)),
    historicoScore,
    softSkillScore,
    softSkillsAtendidasCount: softsAtendidas,
    softSkillsFaltantes: softsFaltantes,
    passouSoftSkills,
  };
}

/**
 * Função de serviço assíncrona para ranqueamento de candidatos por vaga.
 */
export async function getAlunosRanqueadosPorVaga(vagaId: string): Promise<IMatchResult[]> {
  await simulateNetworkDelay();

  const vaga = await getVagaById(vagaId);
  if (!vaga) return [];

  const alunos = await getAlunos();

  return alunos
    .map((aluno) => calculateMatchScore(aluno, vaga))
    .sort((a, b) => b.scoreFinal - a.scoreFinal);
}

export interface IFiltrosBuscaAtiva {
  searchQuery?: string;
  curso?: string;
  requiredSoftSkills?: Record<keyof ISoftSkills, boolean>;
  minNotaMateria?: number;
}

/**
 * Busca Ativa de Talentos por filtros proativos.
 */
export async function searchTalentosProativo(filtros: IFiltrosBuscaAtiva): Promise<IAluno[]> {
  await simulateNetworkDelay();
  const alunos = await getAlunos();

  return alunos.filter((aluno) => {
    // 1. Termo de Busca
    if (filtros.searchQuery && filtros.searchQuery.trim()) {
      const q = filtros.searchQuery.toLowerCase();
      const matchName = aluno.nome.toLowerCase().includes(q);
      const matchRa = aluno.ra.toLowerCase().includes(q);
      const matchEmail = aluno.email.toLowerCase().includes(q);
      const matchCurso = aluno.curso.toLowerCase().includes(q);
      const matchMateria = aluno.historicoAcademico?.some((h) => h.materia.toLowerCase().includes(q));
      if (!matchName && !matchRa && !matchEmail && !matchCurso && !matchMateria) return false;
    }

    // 2. Curso
    if (filtros.curso && filtros.curso !== "TODOS" && aluno.curso !== filtros.curso) {
      return false;
    }

    // 3. Soft Skills Obrigatórias
    if (filtros.requiredSoftSkills) {
      const reqKeys = (Object.keys(filtros.requiredSoftSkills) as (keyof ISoftSkills)[]).filter(
        (k) => filtros.requiredSoftSkills![k]
      );
      for (const k of reqKeys) {
        const kStr = String(k).toLowerCase();
        const progresso = aluno.progressosTrilha?.find(
          (p) => p.trilhaNome.toLowerCase() === kStr || p.trilhaId?.toLowerCase() === kStr
        );
        const atendeu = progresso
          ? progresso.status === "TESTE_APROVADO" || progresso.status === "VALIDADO_MENTORIA"
          : !!aluno.softSkills?.[k];
        if (!atendeu) return false;
      }
    }

    // 4. Nota mínima geral no histórico
    if (filtros.minNotaMateria && filtros.minNotaMateria > 0) {
      const mediaAluno = aluno.historicoAcademico && aluno.historicoAcademico.length > 0
        ? aluno.historicoAcademico.reduce((acc, h) => acc + h.nota, 0) / aluno.historicoAcademico.length
        : 0;
      if (mediaAluno < filtros.minNotaMateria) return false;
    }

    return true;
  });
}
