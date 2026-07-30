/**
 * Utilitário FECAP para informações acadêmicas atreladas ao RA e Banco de Dados.
 * A fonte de verdade do semestre é o campo `semestre` persistido no banco de dados (Aluno.semestre).
 * O RA é utilizado para inferir o ano de ingresso inicial e sugerir o semestre padrão no cadastro.
 */

export interface InfoAcademicaRA {
  ra: string;
  anoIngresso: number;
  semestreSugerido: number;
  semestreEfetivo: number;
  fonte: "Banco de Dados" | "Sugestão RA";
  anoLetivo: string;
  statusRA: "Válido" | "Invalido";
}

export function parseRA(ra: string, semestreBanco?: number): InfoAcademicaRA {
  const raLimpo = ra.trim().replace(/\D/g, "");

  if (raLimpo.length < 5) {
    const sem = semestreBanco || 1;
    return {
      ra,
      anoIngresso: 2026,
      semestreSugerido: 1,
      semestreEfetivo: sem,
      fonte: semestreBanco !== undefined ? "Banco de Dados" : "Sugestão RA",
      anoLetivo: `${Math.ceil(sem / 2)}º Ano`,
      statusRA: "Invalido",
    };
  }

  // Ano de ingresso estimado pelos 2 primeiros dígitos do RA
  const doisPrimeirosDigitos = parseInt(raLimpo.substring(0, 2), 10);
  const anoIngresso = 2000 + doisPrimeirosDigitos;

  const anoAtual = new Date().getFullYear();
  const anosDecorridos = Math.max(0, anoAtual - anoIngresso);
  const semestreSugerido = Math.min(8, Math.max(1, anosDecorridos * 2 + 1));

  // A fonte primária da verdade é sempre o valor persistido no Banco de Dados
  const semestreEfetivo = semestreBanco !== undefined ? semestreBanco : semestreSugerido;
  const anoLetivo = `${Math.ceil(semestreEfetivo / 2)}º Ano`;

  return {
    ra: raLimpo,
    anoIngresso,
    semestreSugerido,
    semestreEfetivo,
    fonte: semestreBanco !== undefined ? "Banco de Dados" : "Sugestão RA",
    anoLetivo,
    statusRA: "Válido",
  };
}
