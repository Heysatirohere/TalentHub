import { Aluno, Vaga, MatchResult, SoftSkills, HardSkills } from "@/types/talent";

/**
 * Algoritmo de Match entre Aluno FECAP e Vaga de Recrutamento.
 *
 * 1. Soft Skills: Verifica se o aluno possui TODAS as soft skills obrigatórias da vaga.
 *    Caso não possua, o aluno recebe penalização drástica (ex: redução de 60% na nota final).
 *
 * 2. Hard Skills: Calcula a média ponderada entre a nota do aluno em cada categoria (0-100)
 *    e o peso exigido pela vaga (0-5).
 *
 * 3. Ranking Final: Retorna score percentual (0 a 100%).
 */
export function calculateMatchScore(aluno: Aluno, vaga: Vaga): MatchResult {
  const reqSofts = vaga.requisitosSoftSkills || [];
  const softsFaltantes: (keyof SoftSkills)[] = [];
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

  // Cálculo da Média Ponderada das Hard Skills
  let somaPonderada = 0;
  let somaPesos = 0;

  const categorias: (keyof HardSkills)[] = ["tecnologia", "humanas", "negocios", "exatas", "design"];

  for (const cat of categorias) {
    const peso = vaga.pesosHardSkills[cat] || 0;
    const notaAluno = aluno.hardSkills[cat] || 0;

    somaPonderada += notaAluno * peso;
    somaPesos += peso;
  }

  const hardSkillScore = somaPesos > 0 ? Math.round(somaPonderada / somaPesos) : 0;
  const softSkillScore = Math.round(softRatio * 100);

  // Score Final:
  // Se passou em todas as Soft Skills requeridas: 100% da média ponderada de Hard Skills.
  // Se NÃO passou: aplica redução severa de 60% e pondera pelo ratio de soft skills atendidas.
  let scoreFinal = hardSkillScore;
  if (!passouSoftSkills) {
    // Penalização drástica: reduz drasticamente a nota
    const fatorPenalizacao = 0.35 + 0.25 * softRatio; // entre 0.35 e 0.60 do valor original
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
 * Função utilitária para ranquear a lista de alunos para uma vaga específica.
 */
export function rankAlunosParaVaga(alunos: Aluno[], vaga: Vaga): MatchResult[] {
  return alunos
    .map((aluno) => calculateMatchScore(aluno, vaga))
    .sort((a, b) => b.scoreFinal - a.scoreFinal);
}
