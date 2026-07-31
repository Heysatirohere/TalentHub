import { PrismaClient, Role, StatusCampanha } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || "";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando o Super Seeding do Banco de Dados PostgreSQL...");

  const defaultPasswordHash = await bcrypt.hash("123456", 10);

  // 1. Limpeza Nuclear na ordem exata das Foreign Keys
  console.log("🧹 Limpando o banco de dados...");
  await prisma.mensagem.deleteMany({});
  await prisma.progressoAlunoTrilha.deleteMany({});
  await prisma.documentoSimulado.deleteMany({});
  await prisma.experiencia.deleteMany({});
  await prisma.historicoAcademico.deleteMany({});
  await prisma.materiaRequerida.deleteMany({});
  await prisma.vaga.deleteMany({});
  await prisma.empresa.deleteMany({});
  await prisma.trilhaSoftSkill.deleteMany({});
  await prisma.aluno.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Trilhas de Soft Skills (A base do Match Comportamental)
  console.log("🎯 Criando 5 Trilhas de Soft Skill...");
  const [trilhaCom, trilhaLid, trilhaRes, trilhaCrit, trilhaEqp] = await Promise.all([
    prisma.trilhaSoftSkill.create({ data: { nome: "Comunicação Efetiva", descricao: "Oratória e clareza." } }),
    prisma.trilhaSoftSkill.create({ data: { nome: "Liderança e Gestão", descricao: "Gestão de times e projetos." } }),
    prisma.trilhaSoftSkill.create({ data: { nome: "Resiliência", descricao: "Inteligência emocional." } }),
    prisma.trilhaSoftSkill.create({ data: { nome: "Pensamento Crítico", descricao: "Resolução de problemas complexos." } }),
    prisma.trilhaSoftSkill.create({ data: { nome: "Trabalho em Equipe", descricao: "Colaboração e agilidade." } }),
  ]);

  // 3. Usuário MASTER
  await prisma.user.create({
    data: { email: "master@fecap.br", senha: defaultPasswordHash, role: Role.MASTER },
  });

  // 4. EMPRESAS E VAGAS (Com Requisitos Específicos para testar o Match)
  console.log("🏢 Criando Empresas e Vagas super detalhadas...");
  const techInova = await prisma.user.create({
    data: {
      email: "empresa@tech.com", senha: defaultPasswordHash, role: Role.EMPRESA,
      empresa: { create: { nomeEmpresa: "TechInova Soluções & IA", cnpj: "12.345.678/0001-90" } },
    },
    include: { empresa: true },
  });

  // Vaga 1: Focada em Dados (Feita para dar 100% no Gabriel)
  await prisma.vaga.create({
    data: {
      empresaId: techInova.empresa!.id,
      titulo: "Estágio em Engenharia de Dados & IA",
      empresa: techInova.empresa!.nomeEmpresa,
      localizacao: "São Paulo, SP (Híbrido)",
      tipoContrato: "Estágio",
      descricao: "Atuação com pipelines de dados, SQL e modelagem preditiva.",
      requisitosSoftSkills: ["Liderança e Gestão", "Pensamento Crítico"],
      status: "APROVADA",
      dataCriacao: new Date().toISOString().split("T")[0],
      materiasRequeridas: {
        create: [
          { nomeDaMateria: "Banco de Dados SQL", peso: 3 },
          { nomeDaMateria: "Estatística e Análise de Dados", peso: 3 },
          { nomeDaMateria: "Python para Dados", peso: 2 },
        ],
      },
    },
  });

  // Vaga 2: Focada em Fullstack (Feita para dar 100% no Sátiro)
  await prisma.vaga.create({
    data: {
      empresaId: techInova.empresa!.id,
      titulo: "Desenvolvedor Web Fullstack Jr",
      empresa: techInova.empresa!.nomeEmpresa,
      localizacao: "Remoto",
      tipoContrato: "CLT",
      descricao: "Desenvolvimento com React, Next.js e Node.js.",
      requisitosSoftSkills: ["Comunicação Efetiva", "Trabalho em Equipe"],
      status: "APROVADA",
      dataCriacao: new Date().toISOString().split("T")[0],
      materiasRequeridas: {
        create: [
          { nomeDaMateria: "Engenharia de Software", peso: 3 },
          { nomeDaMateria: "Programação Web", peso: 3 },
        ],
      },
    },
  });

  // 5. ALUNOS (Com o novo formato de tabelas)
  console.log("🎓 Criando Alunos Turbinados para o Match...");

  // Aluno 1: Gabriel (Vai dar Match altíssimo na Vaga de Dados)
  await prisma.user.create({
    data: {
      email: "gabriel@fecap.br", senha: defaultPasswordHash, role: Role.ALUNO,
      aluno: {
        create: {
          ra: "26010001", nome: "Gabriel Silva", email: "gabriel@fecap.br", curso: "Ciência da Computação", semestre: 5, idade: 21,
          avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250",
          feedbacksProfessores: ["Excelente aluno, liderou a equipe no PI."],
          historicoAcademico: {
            create: [
              { materia: "Banco de Dados SQL", nota: 9.5, semestre: "2025.2" },
              { materia: "Estatística e Análise de Dados", nota: 8.8, semestre: "2025.1" },
              { materia: "Python para Dados", nota: 9.0, semestre: "2024.2" },
            ]
          },
          experiencias: { create: [{ empresa: "FECAP", cargo: "Monitor de Algoritmos", periodo: "Fev 2024 - Atual", descricao: "Apoio a turmas iniciantes." }] },
          progressosTrilha: {
            create: [
              { trilhaId: trilhaLid.id, status: "VALIDADO_MENTORIA" },
              { trilhaId: trilhaCrit.id, status: "TESTE_APROVADO" }
            ]
          },
          packDocumentos: { create: [{ nome: "CV Lattes", tipo: "PDF", dataEnvio: "2024-05-10", arquivoUrl: "link" }] }
        },
      },
    },
  });

  // Aluno 2: Sátiro (Vai dar Match altíssimo na Vaga de Fullstack)
  await prisma.user.create({
    data: {
      email: "satiro@gmail.com", senha: defaultPasswordHash, role: Role.ALUNO,
      aluno: {
        create: {
          ra: "2609895", nome: "Sátiro", email: "satiro@gmail.com", curso: "Ciência da Computação", semestre: 5, idade: 21,
          avatarUrl: "https://ui-avatars.com/api/?name=Satiro&background=0D8ABC&color=fff",
          feedbacksProfessores: ["Grande facilidade com arquitetura de software."],
          historicoAcademico: {
            create: [
              { materia: "Engenharia de Software", nota: 10.0, semestre: "2025.1" },
              { materia: "Programação Web", nota: 9.5, semestre: "2024.2" },
              { materia: "Banco de Dados SQL", nota: 7.0, semestre: "2025.2" },
            ]
          },
          experiencias: { create: [{ empresa: "Projeto TalentHub", cargo: "Desenvolvedor Fullstack", periodo: "Jan 2024 - Atual", descricao: "Desenvolvimento do MVP." }] },
          progressosTrilha: {
            create: [
              { trilhaId: trilhaCom.id, status: "VALIDADO_MENTORIA" },
              { trilhaId: trilhaEqp.id, status: "TESTE_APROVADO" }
            ]
          },
        },
      },
    },
  });

  // Aluno 3: Beatriz (Sem fit para Dados ou Fullstack, match = 0%)
  await prisma.user.create({
    data: {
      email: "beatriz@fecap.br", senha: defaultPasswordHash, role: Role.ALUNO,
      aluno: {
        create: {
          ra: "26010002", nome: "Beatriz Oliveira", email: "beatriz@fecap.br", curso: "Publicidade e Propaganda", semestre: 3, idade: 20,
          avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
          historicoAcademico: {
            create: [
              { materia: "Marketing Digital", nota: 9.2, semestre: "2025.2" },
              { materia: "Comunicação Visual", nota: 8.5, semestre: "2025.1" },
            ]
          },
          progressosTrilha: { create: [{ trilhaId: trilhaCom.id, status: "TESTE_APROVADO" }] }
        },
      },
    },
  });

  // Aluno 4: Lucas (Um candidato mediano, para testar as porcentagens do meio)
  await prisma.user.create({
    data: {
      email: "lucas@fecap.br", senha: defaultPasswordHash, role: Role.ALUNO,
      aluno: {
        create: {
          ra: "2609896", nome: "Lucas Ferreira", email: "lucas@fecap.br", curso: "Sistemas de Informação", semestre: 4, idade: 22,
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
          historicoAcademico: {
            create: [
              { materia: "Banco de Dados SQL", nota: 6.0, semestre: "2024.2" }, // Nota baixa, deve afetar o match
              { materia: "Programação Web", nota: 7.5, semestre: "2025.1" },
            ]
          },
          progressosTrilha: { create: [{ trilhaId: trilhaLid.id, status: "EM_TRILHA" }] } // Ainda não concluiu a soft skill
        },
      },
    },
  });

  console.log("✅ SUPER SEED CONCLUÍDO COM SUCESSO!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });