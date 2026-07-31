import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/authGuard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Helper para resolver um Aluno ID (UUID) válido no banco a partir de ID, RA, E-mail ou userId.
 */
async function resolveAlunoId(idOrKey: string): Promise<string | null> {
  if (!idOrKey) return null;
  const key = idOrKey.trim();

  // 1. Busca por ID direto
  const byId = await prisma.aluno.findUnique({ where: { id: key } });
  if (byId) return byId.id;

  // 2. Busca por RA, E-mail ou userId
  const byMatch = await prisma.aluno.findFirst({
    where: {
      OR: [
        { ra: key },
        { email: key.toLowerCase() },
        { userId: key },
      ],
    },
  });
  if (byMatch) return byMatch.id;

  // 3. Fallback: Primeiro aluno cadastrado
  const firstAluno = await prisma.aluno.findFirst();
  return firstAluno ? firstAluno.id : null;
}

/**
 * Helper para resolver um Vaga ID válido no banco.
 */
async function resolveVagaId(idOrKey: string): Promise<string | null> {
  if (!idOrKey) return null;
  const key = idOrKey.trim();

  const byId = await prisma.vaga.findUnique({ where: { id: key } });
  if (byId) return byId.id;

  const firstVaga = await prisma.vaga.findFirst();
  return firstVaga ? firstVaga.id : null;
}

export async function GET(req: Request) {
  try {
    await requireAuth(["ALUNO", "EMPRESA", "MASTER"]);
    const { searchParams } = new URL(req.url);
    const rawAlunoId = searchParams.get("alunoId");

    let whereClause = {};
    if (rawAlunoId) {
      const realAlunoId = await resolveAlunoId(rawAlunoId);
      if (realAlunoId) {
        whereClause = { alunoId: realAlunoId };
      }
    }

    const candidaturas = await prisma.candidatura.findMany({
      where: whereClause,
      include: {
        vaga: {
          include: { materiasRequeridas: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = candidaturas.map((c: any) => ({
      id: c.id,
      alunoId: c.alunoId,
      vagaId: c.vagaId,
      matchScore: c.matchScore,
      status: c.status,
      createdAt: c.createdAt.toISOString(),
      vaga: c.vaga
        ? {
            id: c.vaga.id,
            titulo: c.vaga.titulo,
            empresa: c.vaga.empresa,
            localizacao: c.vaga.localizacao,
            tipoContrato: c.vaga.tipoContrato,
            descricao: c.vaga.descricao,
            requisitosSoftSkills: c.vaga.requisitosSoftSkills || [],
            materiasRequeridas: (c.vaga.materiasRequeridas || []).map((m: any) => ({
              nomeDaMateria: m.nomeDaMateria,
              peso: m.peso,
            })),
            status: "aprovada",
            dataCriacao: c.vaga.dataCriacao,
          }
        : undefined,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Erro ao buscar candidaturas:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth(["ALUNO", "MASTER"]);
    const { alunoId: rawAlunoId, vagaId: rawVagaId, matchScore } = await req.json();

    if (!rawAlunoId || !rawVagaId) {
      return NextResponse.json({ error: "alunoId e vagaId são obrigatórios" }, { status: 400 });
    }

    const realAlunoId = await resolveAlunoId(rawAlunoId);
    const realVagaId = await resolveVagaId(rawVagaId);

    if (!realAlunoId || !realVagaId) {
      return NextResponse.json({ error: "Aluno ou vaga não encontrados no banco." }, { status: 404 });
    }

    const candidatura = await prisma.candidatura.upsert({
      where: {
        alunoId_vagaId: { alunoId: realAlunoId, vagaId: realVagaId },
      },
      update: {
        matchScore: Number(matchScore) || 0,
        status: "CANDIDATADO",
      },
      create: {
        alunoId: realAlunoId,
        vagaId: realVagaId,
        matchScore: Number(matchScore) || 0,
        status: "CANDIDATADO",
      },
      include: {
        vaga: {
          include: { materiasRequeridas: true },
        },
      },
    });

    return NextResponse.json({
      id: candidatura.id,
      alunoId: candidatura.alunoId,
      vagaId: candidatura.vagaId,
      matchScore: candidatura.matchScore,
      status: candidatura.status,
      createdAt: candidatura.createdAt.toISOString(),
      vaga: candidatura.vaga
        ? {
            id: candidatura.vaga.id,
            titulo: candidatura.vaga.titulo,
            empresa: candidatura.vaga.empresa,
            localizacao: candidatura.vaga.localizacao,
            tipoContrato: candidatura.vaga.tipoContrato,
            descricao: candidatura.vaga.descricao,
            requisitosSoftSkills: candidatura.vaga.requisitosSoftSkills || [],
            materiasRequeridas: (candidatura.vaga.materiasRequeridas || []).map((m: any) => ({
              nomeDaMateria: m.nomeDaMateria,
              peso: m.peso,
            })),
            status: "aprovada",
            dataCriacao: candidatura.vaga.dataCriacao,
          }
        : undefined,
    });
  } catch (error: any) {
    console.error("Erro ao realizar candidatura:", error);
    return NextResponse.json({ error: error?.message || "Erro ao realizar candidatura" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAuth(["ALUNO", "MASTER"]);
    const { alunoId: rawAlunoId, vagaId: rawVagaId } = await req.json();

    const realAlunoId = await resolveAlunoId(rawAlunoId);
    const realVagaId = await resolveVagaId(rawVagaId);

    if (realAlunoId && realVagaId) {
      await prisma.candidatura.deleteMany({
        where: { alunoId: realAlunoId, vagaId: realVagaId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao cancelar candidatura:", error);
    return NextResponse.json({ error: "Erro ao cancelar candidatura" }, { status: 500 });
  }
}
