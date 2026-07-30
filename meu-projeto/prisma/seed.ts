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
  console.log("🌱 Iniciando o Seeding do Banco de Dados PostgreSQL (Supabase)...");

  // 1. Senha padrão criptografada para todos os usuários de teste (Senha: "123456")
  const defaultPasswordHash = await bcrypt.hash("123456", 10);

  // 2. Limpar o banco de dados na ordem correta respeitando Foreign Keys
  console.log("🧹 Limpando dados legados existentes...");
  await prisma.materiaRequerida.deleteMany({});
  await prisma.vaga.deleteMany({});
  await prisma.empresa.deleteMany({});
  await prisma.historicoAcademico.deleteMany({});
  await prisma.experiencia.deleteMany({});
  await prisma.documentoSimulado.deleteMany({});
  await prisma.progressoAlunoTrilha.deleteMany({});
  await prisma.trilhaSoftSkill.deleteMany({});
  await prisma.aluno.deleteMany({});
  await prisma.user.deleteMany({});

  // 2b. Criar Trilhas de Soft Skill
  console.log("🎯 Criando Trilhas de Soft Skill...");
  const trilhaComunicacao = await prisma.trilhaSoftSkill.create({
    data: {
      nome: "Comunicação Efetiva",
      descricao: "Trilha de desenvolvimento de oratória, empatia e comunicação assertiva.",
    },
  });
  const trilhaLideranca = await prisma.trilhaSoftSkill.create({
    data: {
      nome: "Liderança e Gestão",
      descricao: "Trilha de desenvolvimento de liderança técnica, gestão de pessoas e visão estratégica.",
    },
  });
  const trilhaResiliencia = await prisma.trilhaSoftSkill.create({
    data: {
      nome: "Resiliência",
      descricao: "Trilha de inteligência emocional, adaptação a mudanças e trabalho sob pressão.",
    },
  });

  // 3. Criação do Usuário MASTER
  console.log("👤 Criando usuário MASTER...");
  const masterUser = await prisma.user.create({
    data: {
      email: "master@fecap.br",
      senha: defaultPasswordHash,
      role: Role.MASTER,
    },
  });
  console.log(`   ✓ Master criado: ${masterUser.email} (ID: ${masterUser.id})`);

  // 4. Criação da EMPRESA e VAGA com Matérias Requeridas
  console.log("🏢 Criando empresa e vaga de teste...");
  const empresaUser = await prisma.user.create({
    data: {
      email: "empresa@tech.com",
      senha: defaultPasswordHash,
      role: Role.EMPRESA,
      empresa: {
        create: {
          nomeEmpresa: "TechInova Soluções & IA",
          cnpj: "12.345.678/0001-90",
        },
      },
    },
    include: {
      empresa: true,
    },
  });

  const empresaPerfil = empresaUser.empresa!;

  const vagaEstagio = await prisma.vaga.create({
    data: {
      empresaId: empresaPerfil.id,
      titulo: "Estágio em Engenharia de Dados & IA",
      empresa: empresaPerfil.nomeEmpresa,
      localizacao: "São Paulo, SP (Híbrido)",
      tipoContrato: "Estágio",
      descricao: "Atuação direta em projetos de engenharia de dados, criação de pipelines ETL, bancos de dados SQL relacionais e algoritmos de análise preditiva.",
      requisitosSoftSkills: ["Liderança e Gestão", "Comunicação Efetiva"],
      status: StatusCampanha.APROVADA,
      dataCriacao: new Date().toISOString().split("T")[0],
      materiasRequeridas: {
        create: [
          { nomeDaMateria: "Banco de Dados SQL", peso: 3 },
          { nomeDaMateria: "Estatística e Análise de Dados", peso: 2 },
        ],
      },
    },
    include: {
      materiasRequeridas: true,
    },
  });
  console.log(`   ✓ Vaga "${vagaEstagio.titulo}" criada com ${vagaEstagio.materiasRequeridas.length} matérias requeridas.`);

  // 5. Criação do ALUNO 1 (O Match Perfeito com Mentoria Validada em Liderança)
  console.log("🎓 Criando Aluno 1 (O Match Perfeito - Mentoria Validada em Liderança e Gestão)...");
  const aluno1User = await prisma.user.create({
    data: {
      email: "aluno1@fecap.br",
      senha: defaultPasswordHash,
      role: Role.ALUNO,
      aluno: {
        create: {
          ra: "26010001",
          nome: "Gabriel Silva (Match Perfeito)",
          email: "aluno1@fecap.br",
          curso: "Ciência da Computação",
          semestre: 5,
          idade: 21,
          avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250",
          feedbacksProfessores: [
            "Excelente desempenho acadêmico em Banco de Dados e Modelagem Estruturada.",
            "Demonstrou liderança técnica no projeto integrador da FECAP.",
          ],
          progressosTrilha: {
            create: [
              {
                trilhaId: trilhaLideranca.id,
                status: "VALIDADO_MENTORIA",
                dataConclusao: new Date(),
                feedback: "Aluno demonstrou maturidade e liderança técnica na mentoria FECAP com nota máxima.",
              },
              {
                trilhaId: trilhaComunicacao.id,
                status: "TESTE_APROVADO",
              },
              {
                trilhaId: trilhaResiliencia.id,
                status: "EM_TRILHA",
              },
            ],
          },
          historicoAcademico: {
            create: [
              { materia: "Banco de Dados SQL", nota: 9.5, semestre: "2025.2" },
              { materia: "Estatística e Análise de Dados", nota: 9.0, semestre: "2025.1" },
              { materia: "Engenharia de Software", nota: 8.8, semestre: "2024.2" },
              { materia: "Estruturas de Dados Avançadas", nota: 9.2, semestre: "2024.1" },
            ],
          },
        },
      },
    },
    include: {
      aluno: {
        include: { historicoAcademico: true, progressosTrilha: true },
      },
    },
  });
  console.log(`   ✓ Aluno 1 criado: ${aluno1User.aluno?.nome} (RA ${aluno1User.aluno?.ra}) com Mentoria Validada em Liderança e Gestão!`);

  // 6. Criação do ALUNO 2 (O Match Ruim com Teste Aprovado em Comunicação)
  console.log("🎓 Criando Aluno 2 (Match Ruim - Teste Aprovado em Comunicação Efetiva)...");
  const aluno2User = await prisma.user.create({
    data: {
      email: "aluno2@fecap.br",
      senha: defaultPasswordHash,
      role: Role.ALUNO,
      aluno: {
        create: {
          ra: "26010002",
          nome: "Beatriz Oliveira (Match Ruim)",
          email: "aluno2@fecap.br",
          curso: "Publicidade e Propaganda",
          semestre: 3,
          idade: 20,
          avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
          feedbacksProfessores: [
            "Foco expressivo em comunicação verbal e design de marca.",
          ],
          progressosTrilha: {
            create: [
              {
                trilhaId: trilhaComunicacao.id,
                status: "TESTE_APROVADO",
              },
              {
                trilhaId: trilhaResiliencia.id,
                status: "EM_TRILHA",
              },
            ],
          },
          historicoAcademico: {
            create: [
              { materia: "Marketing Digital & Growth", nota: 9.2, semestre: "2025.2" },
              { materia: "Branding e Identidade Visual", nota: 9.0, semestre: "2025.1" },
              { materia: "Banco de Dados SQL", nota: 4.0, semestre: "2024.2" },
              { materia: "Estatística e Análise de Dados", nota: 3.5, semestre: "2024.1" },
            ],
          },
        },
      },
    },
    include: {
      aluno: {
        include: { historicoAcademico: true, progressosTrilha: true },
      },
    },
  });
  console.log(`   ✓ Aluno 2 criado: ${aluno2User.aluno?.nome} (RA ${aluno2User.aluno?.ra}) com Teste Aprovado em Comunicação Efetiva.`);

  console.log("✅ SEED CONCLUÍDO COM SUCESSO!");
  console.log("-------------------------------------------------------");
  console.log("Credenciais para teste (Senha padrão de todos: 123456):");
  console.log("  • MASTER:   master@fecap.br");
  console.log("  • EMPRESA:  empresa@tech.com");
  console.log("  • ALUNO 1:  aluno1@fecap.br (Match ~93% na vaga de Dados)");
  console.log("  • ALUNO 2:  aluno2@fecap.br (Match ~38% na vaga de Dados)");
  console.log("-------------------------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Erro fatal durante a execução do seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
