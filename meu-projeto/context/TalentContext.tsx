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
  IMatchResult 
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
  alterarStatusCampanha: (vagaId: string, status: StatusCampanha, feedback?: string) => Promise<IVaga>;
  adicionarExperienciaAluno: (alunoId: string, exp: Omit<IExperiencia, "id">) => Promise<IExperiencia>;
  enviarDocumentoAluno: (alunoId: string, doc: Omit<IDocumentoSimulado, "id" | "dataEnvio" | "status">) => Promise<IDocumentoSimulado>;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentAlunoId, setCurrentAlunoId] = useState<string>("26010001");

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        setIsLoading(true);
        const [loadedAlunos, loadedVagas] = await Promise.all([getAlunos(), getVagas()]);
        if (isMounted) {
          setAlunos(loadedAlunos);
          setVagas(loadedVagas);
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

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ROLE, userRole);
    } catch (e) {
      console.error("Erro ao salvar papel do usuário:", e);
    }
  }, [userRole]);

  const currentAluno =
    alunos.find(
      (a) =>
        a.ra === currentAlunoId ||
        a.email === currentAlunoId ||
        a.id === currentAlunoId
    ) || alunos[0];

  const loginAs = (role: UserRole, alunoIdOrRa?: string) => {
    setUserRole(role);
    if (role === "aluno") {
      const searchKey = alunoIdOrRa || "26010001";
      const alunoAchado = alunos.find(
        (a) => a.ra === searchKey || a.id === searchKey || a.email === searchKey
      );
      if (alunoAchado) {
        setCurrentAlunoId(alunoAchado.ra || alunoAchado.id);
      } else {
        setCurrentAlunoId(searchKey);
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
    status: StatusCampanha,
    feedbackMaster?: string
  ): Promise<IVaga> => {
    const vagaAtualizada = await updateVagaStatusService(vagaId, status, feedbackMaster);
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
