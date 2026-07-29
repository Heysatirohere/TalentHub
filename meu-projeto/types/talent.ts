export interface ISoftSkills {
  comunicacao: boolean;
  trabalhoEmEquipe: boolean;
  lideranca: boolean;
  resolucaoProblemas: boolean;
  adaptabilidade: boolean;
  pensamentoCritico: boolean;
}

export interface IHardSkills {
  tecnologia: number;  // 0 a 100
  humanas: number;     // 0 a 100
  negocios: number;    // 0 a 100
  exatas: number;      // 0 a 100
  design: number;      // 0 a 100
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

export interface IAluno {
  id: string;
  ra: string;           // Registro Acadêmico FECAP (ex: "26028671")
  nome: string;
  email: string;
  curso: string;
  semestre: number;
  idade: number;
  avatarUrl: string;
  feedbacksProfessores: string[];
  softSkills: ISoftSkills;
  hardSkills: IHardSkills;
  experiencias: IExperiencia[];
  packDocumentos: IDocumentoSimulado[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IPesosHardSkills {
  tecnologia: number; // 0 a 5
  humanas: number;    // 0 a 5
  negocios: number;   // 0 a 5
  exatas: number;     // 0 a 5
  design: number;     // 0 a 5
}

export type StatusCampanha = "pendente_aprovacao" | "aprovada" | "rejeitada";

export interface IVaga {
  id: string;
  titulo: string;
  empresa: string;
  localizacao: string;
  tipoContrato: string;
  descricao: string;
  requisitosSoftSkills: (keyof ISoftSkills)[];
  pesosHardSkills: IPesosHardSkills;
  status: StatusCampanha;
  dataCriacao: string;
  feedbackMaster?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMatchResult {
  aluno: IAluno;
  scoreFinal: number; // 0 a 100
  hardSkillScore: number;
  softSkillScore: number;
  softSkillsAtendidasCount: number;
  softSkillsFaltantes: (keyof ISoftSkills)[];
  passouSoftSkills: boolean;
}

// Aliases para compatibilidade de código legado
export type SoftSkills = ISoftSkills;
export type HardSkills = IHardSkills;
export type Experiencia = IExperiencia;
export type DocumentoSimulado = IDocumentoSimulado;
export type Aluno = IAluno;
export type PesosHardSkills = IPesosHardSkills;
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

export const HARD_SKILLS_LABELS: Record<keyof IHardSkills, string> = {
  tecnologia: "Tecnologia & Programação",
  humanas: "Humanas & Comunicação",
  negocios: "Gestão & Negócios",
  exatas: "Exatas & Análise de Dados",
  design: "Design & UX/UI",
};
