import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/authGuard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const dbAlunos = await prisma.aluno.findMany({
      where: {
        nome: { not: "" },
      },
      include: {
        user: true,
        historicoAcademico: true,
        experiencias: true,
        packDocumentos: true,
        progressosTrilha: {
          include: {
            trilha: true,
          },
        },
      },
      orderBy: { ra: "asc" },
    });

    const mapped = dbAlunos.map((a: any) => {
      const progressosMapped = Array.isArray(a.progressosTrilha)
        ? a.progressosTrilha.map((pt: any) => ({
            id: pt.id,
            alunoId: pt.alunoId,
            trilhaId: pt.trilhaId,
            trilhaNome: pt.trilha?.nome || pt.trilhaId,
            status: pt.status,
            dataConclusao: pt.dataConclusao ? new Date(pt.dataConclusao).toISOString() : null,
            feedback: pt.feedback,
          }))
        : [];

      const softSkillsObj: Record<string, boolean> = {};
      progressosMapped.forEach((p: { trilhaNome: string; status: any }) => {
        softSkillsObj[p.trilhaNome] = p.status === "TESTE_APROVADO" || p.status === "VALIDADO_MENTORIA";
      });

      return {
        id: a.id,
        userId: a.userId || a.user?.id || a.id,
        ra: a.ra,
        nome: a.nome,
        email: a.email,
        curso: a.curso,
        semestre: a.semestre,
        idade: a.idade,
        avatarUrl: a.avatarUrl,
        feedbacksProfessores: a.feedbacksProfessores || [],
        softSkills: softSkillsObj,
        progressosTrilha: progressosMapped,
        historicoAcademico: Array.isArray(a.historicoAcademico)
          ? a.historicoAcademico.map((h: any) => ({
              materia: h.materia,
              nota: h.nota,
              semestre: h.semestre,
            }))
          : [],
        experiencias: Array.isArray(a.experiencias)
          ? a.experiencias.map((e: any) => ({
              id: e.id,
              empresa: e.empresa,
              cargo: e.cargo,
              periodo: e.periodo,
              descricao: e.descricao,
            }))
          : [],
        packDocumentos: Array.isArray(a.packDocumentos)
          ? a.packDocumentos.map((d: any) => ({
              id: d.id,
              nome: d.nome,
              tipo: d.tipo,
              dataEnvio: d.dataEnvio,
              status: d.status,
            }))
          : [],
        createdAt: a.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: a.updatedAt?.toISOString() || new Date().toISOString(),
      };
    });

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Erro ao buscar alunos no PostgreSQL:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth(["ALUNO", "MASTER", "EMPRESA"]);
    const body = await req.json();
    const { action } = body;

    if (action === "create_aluno") {
      const { ra, nome, email, curso, semestre, idade, feedbacksProfessores, historicoAcademico } = body;
      const avatars = [
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
      ];
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

      const dbAluno = await prisma.aluno.create({
        data: {
          ra,
          nome,
          email,
          curso,
          semestre: Number(semestre),
          idade: Number(idade),
          avatarUrl: randomAvatar,
          feedbacksProfessores: feedbacksProfessores || [],
          historicoAcademico: {
            create: historicoAcademico?.map((h: any) => ({
              materia: h.materia,
              nota: Number(h.nota),
              semestre: h.semestre,
            })),
          },
        },
        include: {
          historicoAcademico: true,
          experiencias: true,
          packDocumentos: true,
        },
      });

      return NextResponse.json({
        id: dbAluno.id,
        userId: dbAluno.userId || dbAluno.id,
        ra: dbAluno.ra,
        nome: dbAluno.nome,
        email: dbAluno.email,
        curso: dbAluno.curso,
        semestre: dbAluno.semestre,
        idade: dbAluno.idade,
        avatarUrl: dbAluno.avatarUrl,
        feedbacksProfessores: dbAluno.feedbacksProfessores || [],
        softSkills: {},
        historicoAcademico: dbAluno.historicoAcademico.map((h) => ({
          materia: h.materia,
          nota: h.nota,
          semestre: h.semestre,
        })),
        experiencias: [],
        packDocumentos: [],
      });
    }

    if (action === "add_experiencia") {
      const { alunoId, expData } = body;
      const dbAluno = await prisma.aluno.findFirst({
        where: { OR: [{ id: alunoId }, { ra: alunoId }] },
      });
      if (!dbAluno) return NextResponse.json({ error: "Aluno não encontrado" }, { status: 404 });

      const exp = await prisma.experiencia.create({
        data: {
          alunoId: dbAluno.id,
          empresa: expData.empresa,
          cargo: expData.cargo,
          periodo: expData.periodo,
          descricao: expData.descricao,
        },
      });
      return NextResponse.json({
        id: exp.id,
        empresa: exp.empresa,
        cargo: exp.cargo,
        periodo: exp.periodo,
        descricao: exp.descricao,
      });
    }

    if (action === "add_documento") {
      const { alunoId, docData } = body;
      const dbAluno = await prisma.aluno.findFirst({
        where: { OR: [{ id: alunoId }, { ra: alunoId }] },
      });
      if (!dbAluno) return NextResponse.json({ error: "Aluno não encontrado" }, { status: 404 });

      const dataHoje = new Date().toISOString().split("T")[0];
      const doc = await prisma.documentoSimulado.create({
        data: {
          alunoId: dbAluno.id,
          nome: docData.nome,
          tipo: docData.tipo,
          dataEnvio: dataHoje,
          status: "Aprovado",
        },
      });
      return NextResponse.json({
        id: doc.id,
        nome: doc.nome,
        tipo: doc.tipo,
        dataEnvio: doc.dataEnvio,
        status: doc.status,
      });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (error) {
    console.error("Erro no POST /api/alunos:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
