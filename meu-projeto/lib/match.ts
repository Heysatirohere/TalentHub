import { Aluno, Vaga, MatchResult, SOFT_SKILLS_LABELS } from "@/types/talent";

/**
 * Algoritmo de Match Ponderado entre Aluno e Vaga FECAP (60% Hard / 40% Soft).
 *
 * 1. Extração Segura das Soft Skills do Aluno:
 *    Filtra apenas trilhas com status VALIDADO_MENTORIA ou TESTE_APROVADO.
 *
 * 2. Cálculo Ponderado:
 *    - Score Hard (60%): Porcentagem ponderada pelas notas do histórico acadêmico.
 *    - Score Soft (40%): Porcentagem de soft skills exigidas pela vaga que o aluno possui.
 *    - Se a vaga NÃO exigir Soft Skills, Score Hard vale 100%.
 *
 * 3. Faltas (Missing Items):
 *    Combina soft skills faltantes (com sufixo "(Soft Skill)") e matérias não cursadas ou nota < 7.0 (com sufixo "(Matéria)").
 */
export function calculateMatchScore(aluno: Aluno, vaga: Vaga): MatchResult {
  // 1. Extração Segura das Soft Skills do Aluno
  const alunoSoftSkills: string[] = [];

  if (Array.isArray(aluno.progressosTrilha)) {
    aluno.progressosTrilha
      .filter((p) => p.status === "VALIDADO_MENTORIA" || p.status === "TESTE_APROVADO")
      .forEach((p) => {
        const nome = (p.trilhaNome || (p as any).trilha?.nome || p.trilhaId || "").toLowerCase().trim();
        if (nome) alunoSoftSkills.push(nome);
      });
  }

  if (aluno.softSkills) {
    Object.entries(aluno.softSkills).forEach(([key, val]) => {
      if (val) {
        alunoSoftSkills.push(key.toLowerCase().trim());
        const label = SOFT_SKILLS_LABELS[key as keyof typeof SOFT_SKILLS_LABELS];
        if (label) alunoSoftSkills.push(label.toLowerCase().trim());
      }
    });
  }

  // 2. Cálculo do Score Hard (60%) & Faltas Hard
  let somaPonderada = 0;
  let somaPesos = 0;
  const faltasHard: string[] = [];

  const materiasReq = vaga.materiasRequeridas || [];

  for (const req of materiasReq) {
    const peso = req.peso || 1;
    const reqNomeNorm = req.nomeDaMateria.toLowerCase().trim();

    const itemHistorico = aluno.historicoAcademico?.find(
      (h) =>
        h.materia.toLowerCase().trim() === reqNomeNorm ||
        h.materia.toLowerCase().includes(reqNomeNorm) ||
        reqNomeNorm.includes(h.materia.toLowerCase().trim())
    );

    const nota = itemHistorico ? itemHistorico.nota : 0;
    if (!itemHistorico || nota < 7.0) {
      faltasHard.push(`${req.nomeDaMateria} (Matéria)`);
    }

    const notaEmEscala100 = nota * 10;
    somaPonderada += notaEmEscala100 * peso;
    somaPesos += peso;
  }

  const hardScore = somaPesos > 0 ? somaPonderada / somaPesos : 100;

  // 3. Cálculo do Score Soft (40%) & Faltas Soft
  const reqSofts = (vaga.requisitosSoftSkills || []).filter(Boolean);
  const faltasSoft: string[] = [];
  let softsAtendidas = 0;

  for (const softKey of reqSofts) {
    const rawStr = String(softKey).trim();
    const keyLower = rawStr.toLowerCase();
    const label = SOFT_SKILLS_LABELS[softKey as keyof typeof SOFT_SKILLS_LABELS] || rawStr;
    const labelLower = label.toLowerCase().trim();

    const hasSkill = alunoSoftSkills.some(
      (s) => s === keyLower || s === labelLower || s.includes(keyLower) || keyLower.includes(s)
    );

    if (hasSkill) {
      softsAtendidas++;
    } else {
      faltasSoft.push(`${label} (Soft Skill)`);
    }
  }

  const softScore = reqSofts.length > 0 ? (softsAtendidas / reqSofts.length) * 100 : 100;

  // 4. Match Final (Ponderação 60% / 40%)
  let scoreFinal = 0;
  if (reqSofts.length === 0) {
    scoreFinal = Math.round(hardScore);
  } else {
    scoreFinal = Math.round((hardScore * 0.60) + (softScore * 0.40));
  }

  const allFaltantes = [...faltasSoft, ...faltasHard].filter(Boolean);

  return {
    aluno,
    scoreFinal: Math.max(0, Math.min(100, scoreFinal)),
    historicoScore: Math.round(hardScore),
    softSkillScore: Math.round(softScore),
    softSkillsAtendidasCount: softsAtendidas,
    softSkillsFaltantes: allFaltantes,
    passouSoftSkills: faltasSoft.length === 0,
  };
}

export function rankAlunosParaVaga(alunos: Aluno[], vaga: Vaga): MatchResult[] {
  const validAlunos = (alunos || []).filter((a) => a && a.nome && a.nome.trim() !== "");

  return validAlunos
    .map((aluno) => calculateMatchScore(aluno, vaga))
    .sort((a, b) => b.scoreFinal - a.scoreFinal);
}
