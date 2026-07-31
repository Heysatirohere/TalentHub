export type StatusSoftSkill = "EM_TRILHA" | "TESTE_APROVADO" | "VALIDADO_MENTORIA";

export interface ITrilhaSoftSkill {
  id: string;
  nome: string;
  descricao: string;
}

export interface IProgressoTrilha {
  id?: string;
  alunoId?: string;
  trilhaId?: string;
  trilhaNome: string;
  status: StatusSoftSkill;
  dataConclusao?: string | null;
  feedback?: string | null;
}

export interface ISoftSkills {
  comunicacao: boolean;
  trabalhoEmEquipe: boolean;
  lideranca: boolean;
  resolucaoProblemas: boolean;
  adaptabilidade: boolean;
  pensamentoCritico: boolean;
}

export interface IItemHistorico {
  materia: string;
  nota: number; // 0.0 a 10.0
  semestre: string; // ex: "2024.1", "5º Semestre"
}

export interface IMateriaRequerida {
  nomeDaMateria: string;
  peso: number; // 1 a 5
}

export interface IExperiencia {
  id: string;
  empresa: string;
  cargo: string;
  periodo: string;
  descricao: string;
  createdAt?: string;
}

export interface IDocumentoSimulado {
  id: string;
  nome: string;
  tipo: "ComprovanteMatricula" | "HistoricoEscolar" | "DocumentoIdentidade" | "Certificado";
  dataEnvio: string;
  status: "Pendente" | "Aprovado" | "Rejeitado";
  arquivoUrl?: string;
}

export interface ICandidatura {
  id: string;
  alunoId: string;
  vagaId: string;
  matchScore: number;
  status: string;
  createdAt: string;
  vaga?: IVaga;
}

export interface IAluno {
  id: string;
  userId?: string;
  ra: string;           // Registro Acadêmico FECAP (ex: "26028671")
  nome: string;
  email: string;
  curso: string;
  semestre: number;
  idade: number;
  avatarUrl: string;
  feedbacksProfessores: string[];
  softSkills?: ISoftSkills;
  progressosTrilha?: IProgressoTrilha[];
  historicoAcademico: IItemHistorico[];
  experiencias: IExperiencia[];
  packDocumentos: IDocumentoSimulado[];
  candidaturas?: ICandidatura[];
  createdAt?: string;
  updatedAt?: string;
}

export type StatusCampanha = "aprovada" | "APROVADA";

export interface IVaga {
  id: string;
  titulo: string;
  empresa: string;
  localizacao: string;
  tipoContrato: string;
  descricao: string;
  requisitosSoftSkills: (keyof ISoftSkills)[];
  materiasRequeridas: IMateriaRequerida[];
  status: StatusCampanha;
  dataCriacao: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMatchResult {
  aluno: IAluno;
  scoreFinal: number; // 0 a 100
  historicoScore: number; // Média ponderada do histórico (0 a 100)
  softSkillScore: number;
  softSkillsAtendidasCount: number;
  softSkillsFaltantes: string[];
  passouSoftSkills: boolean;
}

// Aliases para compatibilidade
export type SoftSkills = ISoftSkills;
export type ItemHistorico = IItemHistorico;
export type MateriaRequerida = IMateriaRequerida;
export type Experiencia = IExperiencia;
export type DocumentoSimulado = IDocumentoSimulado;
export type Aluno = IAluno;
export type Vaga = IVaga;
export type MatchResult = IMatchResult;

export const SOFT_SKILLS_LABELS: Record<keyof ISoftSkills, string> = {
  comunicacao: "Comunicação Eficiente",
  trabalhoEmEquipe: "Trabalho em Equipe",
  lideranca: "Liderança",
  resolucaoProblemas: "Resolução de Problemas",
  adaptabilidade: "Adaptabilidade",
  pensamentoCritico: "Pensamento Crítico",
};
