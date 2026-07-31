"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  IAluno, 
  IVaga, 
  StatusCampanha, 
  IExperiencia, 
  IDocumentoSimulado, 
  ISoftSkills, 
  IItemHistorico, 
  IMatchResult,
  ICandidatura
} from "@/types/talent";
import { 
  getAlunos, 
  createAluno, 
  updateAlunoHistorico as updateAlunoHistoricoService, 
  addExperienciaAluno as addExpService, 
  addDocumentoAluno as addDocService, 
  resetAlunos 
} from "@/services/alunoService";
import { 
  getVagas, 
  createCampanha as createVagaService, 
  updateCampanhaStatus as updateVagaStatusService, 
  resetVagas 
} from "@/services/vagaService";
import { 
  getCandidaturasDoAluno, 
  candidatarAVagaService, 
  cancelarCandidaturaService 
} from "@/services/candidaturaService";
import { getAlunosRanqueadosPorVaga } from "@/services/matchService";

export type UserRole = "aluno" | "master" | "empresa";

interface TalentContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  alunos: IAluno[];
  vagas: IVaga[];
  isLoading: boolean;
  currentAlunoId: string;
  currentAluno: IAluno | undefined;
  setCurrentAlunoId: (id: string) => void;
  loginAs: (role: UserRole, alunoIdOrRa?: string) => void;
  adicionarAluno: (aluno: Omit<IAluno, "id" | "avatarUrl" | "experiencias" | "packDocumentos">) => Promise<IAluno>;
  atualizarHistoricoAluno: (alunoId: string, softSkills: ISoftSkills, historicoAcademico: IItemHistorico[]) => Promise<IAluno>;
  adicionarCampanha: (vaga: Omit<IVaga, "id" | "status" | "dataCriacao">) => Promise<IVaga>;
  alterarStatusCampanha: (vagaId: string, status: StatusCampanha) => Promise<IVaga>;
  adicionarExperienciaAluno: (alunoId: string, exp: Omit<IExperiencia, "id">) => Promise<IExperiencia>;
  enviarDocumentoAluno: (alunoId: string, doc: Omit<IDocumentoSimulado, "id" | "dataEnvio" | "status">) => Promise<IDocumentoSimulado>;
  candidaturas: ICandidatura[];
  candidatarAVaga: (vagaId: string, matchScore?: number) => Promise<boolean>;
  cancelarCandidatura: (vagaId: string) => Promise<boolean>;
  fetchRankedAlunosPorVaga: (vagaId: string) => Promise<IMatchResult[]>;
  resetarDados: () => Promise<void>;
}

const TalentContext = createContext<TalentContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_ROLE = "fecap_talent_role_v5";

export function TalentProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedRole = localStorage.getItem(LOCAL_STORAGE_KEY_ROLE) as UserRole;
        if (savedRole && ["aluno", "master", "empresa"].includes(savedRole)) {
          return savedRole;
        }
      } catch (e) {
        console.error("Erro ao carregar papel do usuário:", e);
      }
    }
    return "aluno";
  });

  const [alunos, setAlunos] = useState<IAluno[]>([]);
  const [vagas, setVagas] = useState<IVaga[]>([]);
  const [candidaturas, setCandidaturas] = useState<ICandidatura[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const LOCAL_STORAGE_KEY_ALUNO_ID = "fecap_talent_aluno_id_v2";

  const [currentAlunoId, setCurrentAlunoId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ALUNO_ID);
        if (saved) return saved;
      } catch (e) {
        console.error("Erro ao carregar ID do aluno:", e);
      }
    }
    return "26010001";
  });

  useEffect(() => {
    let isMounted = true;
    async function loadInitialData() {
      try {
        const [alunosData, vagasData] = await Promise.all([getAlunos(), getVagas()]);
        if (isMounted) {
          setAlunos(alunosData);
          setVagas(vagasData);
        }
      } catch (e) {
        console.error("Erro ao carregar dados dos serviços:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentAluno = currentAlunoId
    ? alunos.find(
        (a) =>
          a.ra === currentAlunoId ||
          a.email === currentAlunoId ||
          a.id === currentAlunoId ||
          a.userId === currentAlunoId
      ) || alunos[0]
    : alunos[0];

  useEffect(() => {
    let isMounted = true;
    async function loadCandidaturas() {
      if (currentAluno?.id) {
        const data = await getCandidaturasDoAluno(currentAluno.id);
        if (isMounted) setCandidaturas(data);
      }
    }
    loadCandidaturas();
    return () => {
      isMounted = false;
    };
  }, [currentAluno?.id]);

  const candidatarAVaga = async (vagaId: string, matchScore: number = 0): Promise<boolean> => {
    if (!currentAluno) return false;
    const alunoIdToUse = currentAluno.id || currentAluno.ra;
    const res = await candidatarAVagaService(alunoIdToUse, vagaId, matchScore);
    const vagaObj = vagas.find((v) => v.id === vagaId);

    const candidaturaObj: ICandidatura = res || {
      id: `cand-${Date.now()}`,
      alunoId: alunoIdToUse,
      vagaId,
      matchScore,
      status: "CANDIDATADO",
      createdAt: new Date().toISOString(),
      vaga: vagaObj,
    };

    setCandidaturas((prev) => {
      const exists = prev.some((c) => c.vagaId === vagaId);
      if (exists) return prev.map((c) => (c.vagaId === vagaId ? candidaturaObj : c));
      return [candidaturaObj, ...prev];
    });
    return true;
  };

  const cancelarCandidatura = async (vagaId: string): Promise<boolean> => {
    if (!currentAluno) return false;
    const alunoIdToUse = currentAluno.id || currentAluno.ra;
    await cancelarCandidaturaService(alunoIdToUse, vagaId);
    setCandidaturas((prev) => prev.filter((c) => c.vagaId !== vagaId));
    return true;
  };

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ROLE, userRole);
    } catch (e) {
      console.error("Erro ao salvar papel do usuário:", e);
    }
  }, [userRole]);

  useEffect(() => {
    try {
      if (currentAlunoId) {
        localStorage.setItem(LOCAL_STORAGE_KEY_ALUNO_ID, currentAlunoId);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY_ALUNO_ID);
      }
    } catch (e) {
      console.error("Erro ao salvar ID do aluno:", e);
    }
  }, [currentAlunoId]);

  const loginAs = (role: UserRole, alunoIdOrRa?: string) => {
    setUserRole(role);
    if (role === "aluno") {
      const searchKey = alunoIdOrRa || "";
      if (searchKey) {
        const alunoAchado = alunos.find(
          (a) => a.ra === searchKey || a.id === searchKey || a.email === searchKey || a.userId === searchKey
        );
        if (alunoAchado) {
          setCurrentAlunoId(alunoAchado.ra || alunoAchado.id);
        } else {
          setCurrentAlunoId(searchKey);
        }
      } else {
        setCurrentAlunoId("");
      }
    }
  };

  const adicionarAluno = async (
    dadosAluno: Omit<IAluno, "id" | "avatarUrl" | "experiencias" | "packDocumentos">
  ): Promise<IAluno> => {
    const novoAluno = await createAluno(dadosAluno);
    setAlunos((prev) => [novoAluno, ...prev]);
    setCurrentAlunoId(novoAluno.id);
    setUserRole("aluno");
    return novoAluno;
  };

  const atualizarHistoricoAluno = async (
    alunoId: string,
    softSkills: ISoftSkills,
    historicoAcademico: IItemHistorico[]
  ): Promise<IAluno> => {
    const alunoAtualizado = await updateAlunoHistoricoService(alunoId, softSkills, historicoAcademico);
    setAlunos((prev) => prev.map((a) => (a.id === alunoId || a.ra === alunoId ? alunoAtualizado : a)));
    return alunoAtualizado;
  };

  const adicionarCampanha = async (
    vagaData: Omit<IVaga, "id" | "status" | "dataCriacao">
  ): Promise<IVaga> => {
    const novaVaga = await createVagaService(vagaData);
    setVagas((prev) => [novaVaga, ...prev]);
    return novaVaga;
  };

  const alterarStatusCampanha = async (
    vagaId: string,
    status: StatusCampanha
  ): Promise<IVaga> => {
    const vagaAtualizada = await updateVagaStatusService(vagaId, status);
    setVagas((prev) => prev.map((v) => (v.id === vagaId ? vagaAtualizada : v)));
    return vagaAtualizada;
  };

  const adicionarExperienciaAluno = async (
    alunoId: string,
    expData: Omit<IExperiencia, "id">
  ): Promise<IExperiencia> => {
    const novaExp = await addExpService(alunoId, expData);
    const alunosAtualizados = await getAlunos();
    setAlunos(alunosAtualizados);
    return novaExp;
  };

  const enviarDocumentoAluno = async (
    alunoId: string,
    docData: Omit<IDocumentoSimulado, "id" | "dataEnvio" | "status">
  ): Promise<IDocumentoSimulado> => {
    const novoDoc = await addDocService(alunoId, docData);
    const alunosAtualizados = await getAlunos();
    setAlunos(alunosAtualizados);
    return novoDoc;
  };

  const fetchRankedAlunosPorVaga = async (vagaId: string): Promise<IMatchResult[]> => {
    return getAlunosRanqueadosPorVaga(vagaId);
  };

  const resetarDados = async (): Promise<void> => {
    setIsLoading(true);
    const [resAlunos, resVagas] = await Promise.all([resetAlunos(), resetVagas()]);
    setAlunos(resAlunos);
    setVagas(resVagas);
    setUserRole("aluno");
    setIsLoading(false);
  };

  return (
    <TalentContext.Provider
      value={{
        userRole,
        setUserRole,
        alunos,
        vagas,
        isLoading,
        currentAlunoId,
        currentAluno,
        setCurrentAlunoId,
        loginAs,
        adicionarAluno,
        atualizarHistoricoAluno,
        adicionarCampanha,
        alterarStatusCampanha,
        adicionarExperienciaAluno,
        enviarDocumentoAluno,
        candidaturas,
        candidatarAVaga,
        cancelarCandidatura,
        fetchRankedAlunosPorVaga,
        resetarDados,
      }}
    >
      {children}
    </TalentContext.Provider>
  );
}

export function useTalent() {
  const context = useContext(TalentContext);
  if (!context) {
    throw new Error("useTalent deve ser usado dentro de um TalentProvider");
  }
  return context;
}
