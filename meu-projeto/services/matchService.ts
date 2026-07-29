import { IAluno, IVaga, IMatchResult, ISoftSkills, IHardSkills } from "@/types/talent";
import { getAlunos } from "./alunoService";
import { getVagaById } from "./vagaService";

const simulateNetworkDelay = () => new Promise((resolve) => setTimeout(resolve, 200));

/**
 * Lógica isolada do Algoritmo de Match entre Aluno e Vaga.
 *
 * 1. Soft Skills: Validação rigorosa dos requisitos obrigatórios da vaga.
 *    Caso o aluno não atenda a alguma soft skill, sofre penalização drástica (ex: ~60%).
 * 2. Hard Skills: Média Ponderada entre nota do aluno (0-100) e peso exigido pela vaga (0-5).
 */
export function calculateMatchScore(aluno: IAluno, vaga: IVaga): IMatchResult {
  const reqSofts = vaga.requisitosSoftSkills || [];
  const softsFaltantes: (keyof ISoftSkills)[] = [];
  let softsAtendidas = 0;

  for (const softKey of reqSofts) {
    if (aluno.softSkills && aluno.softSkills[softKey]) {
      softsAtendidas++;
    } else {
      softsFaltantes.push(softKey);
    }
  }

  const passouSoftSkills = softsFaltantes.length === 0;
  const softRatio = reqSofts.length > 0 ? softsAtendidas / reqSofts.length : 1;

  // Cálculo da Média Ponderada de Hard Skills
  let somaPonderada = 0;
  let somaPesos = 0;

  const categorias: (keyof IHardSkills)[] = ["tecnologia", "humanas", "negocios", "exatas", "design"];

  for (const cat of categorias) {
    const peso = vaga.pesosHardSkills[cat] || 0;
    const notaAluno = aluno.hardSkills[cat] || 0;

    somaPonderada += notaAluno * peso;
    somaPesos += peso;
  }

  const hardSkillScore = somaPesos > 0 ? Math.round(somaPonderada / somaPesos) : 0;
  const softSkillScore = Math.round(softRatio * 100);

  // Score Final com Penalização de Corte
  let scoreFinal = hardSkillScore;
  if (!passouSoftSkills) {
    const fatorPenalizacao = 0.35 + 0.25 * softRatio;
    scoreFinal = Math.round(hardSkillScore * fatorPenalizacao);
  }

  return {
    aluno,
    scoreFinal: Math.max(0, Math.min(100, scoreFinal)),
    hardSkillScore,
    softSkillScore,
    softSkillsAtendidasCount: softsAtendidas,
    softSkillsFaltantes: softsFaltantes,
    passouSoftSkills,
  };
}

/**
 * Função de serviço assíncrona que executa o algoritmo de match e ranqueia os alunos para uma vaga.
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
  minHardSkills?: Partial<IHardSkills>;
}

/**
 * Função de serviço assíncrona para Busca Ativa (Banco Livre de Talentos).
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
      if (!matchName && !matchRa && !matchEmail && !matchCurso) return false;
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
        if (!aluno.softSkills[k]) return false;
      }
    }

    // 4. Notas mínimas de Hard Skills
    if (filtros.minHardSkills) {
      const hardKeys = Object.keys(filtros.minHardSkills) as (keyof IHardSkills)[];
      for (const k of hardKeys) {
        const minVal = filtros.minHardSkills[k] || 0;
        if (minVal > 0 && (aluno.hardSkills[k] || 0) < minVal) {
          return false;
        }
      }
    }

    return true;
  });
}
