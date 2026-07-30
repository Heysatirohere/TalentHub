import { Aluno, Vaga, MatchResult, SoftSkills } from "@/types/talent";

/**
 * Algoritmo de Match entre Aluno FECAP e Vaga de Recrutamento.
 *
 * 1. Soft Skills: Validação das habilidades comportamentais requeridas.
 * 2. Histórico Acadêmico: Média ponderada entre notas de 0 a 10 do aluno e o peso (1-5) exigido pela vaga.
 */
export function calculateMatchScore(aluno: Aluno, vaga: Vaga): MatchResult {
  const reqSofts = vaga.requisitosSoftSkills || [];
  const softsFaltantes: (keyof SoftSkills)[] = [];
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

  // Cálculo da Média Ponderada das Matérias Requeridas
  let somaPonderada = 0;
  let somaPesos = 0;

  const materiasReq = vaga.materiasRequeridas || [];

  for (const req of materiasReq) {
    const peso = req.peso || 1;
    const reqNomeNorm = req.nomeDaMateria.toLowerCase().trim();

    const itemHistorico = aluno.historicoAcademico?.find(
      (h) => h.materia.toLowerCase().trim() === reqNomeNorm || h.materia.toLowerCase().includes(reqNomeNorm) || reqNomeNorm.includes(h.materia.toLowerCase())
    );

    const nota = itemHistorico ? itemHistorico.nota : 0;
    const notaEmEscala100 = nota * 10;

    somaPonderada += notaEmEscala100 * peso;
    somaPesos += peso;
  }

  const historicoScore = somaPesos > 0 ? Math.round(somaPonderada / somaPesos) : 0;
  const softSkillScore = Math.round(softRatio * 100);

  // Multiplicador (Peso extra) por chancela de mentoria validada pela coordenação (Hub Master)
  const multiplicadorMentoria = 1 + (mentoriaValidadaCount * 0.15);

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

export function rankAlunosParaVaga(alunos: Aluno[], vaga: Vaga): MatchResult[] {
  return alunos
    .map((aluno) => calculateMatchScore(aluno, vaga))
    .sort((a, b) => b.scoreFinal - a.scoreFinal);
}
