import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { StatusCampanha as PrismaStatusCampanha } from "@prisma/client";
import { requireAuth } from "@/lib/authGuard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const dbVagas = await prisma.vaga.findMany({
      include: { materiasRequeridas: true },
      orderBy: { createdAt: "desc" },
    });

    const mapped = dbVagas.map((v: any) => ({
      id: v.id,
      titulo: v.titulo,
      empresa: v.empresa,
      localizacao: v.localizacao,
      tipoContrato: v.tipoContrato,
      descricao: v.descricao,
      requisitosSoftSkills: v.requisitosSoftSkills || [],
      materiasRequeridas: (v.materiasRequeridas || []).map((m: any) => ({
        nomeDaMateria: m.nomeDaMateria,
        peso: m.peso,
      })),
      status: "aprovada",
      dataCriacao: v.dataCriacao,
      createdAt: v.createdAt.toISOString(),
      updatedAt: v.updatedAt.toISOString(),
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Erro ao buscar vagas no PostgreSQL:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth(["EMPRESA", "MASTER"]);
    const vagaData = await req.json();
    const dataHoje = new Date().toISOString().split("T")[0];

    const dbVaga = await prisma.vaga.create({
      data: {
        titulo: vagaData.titulo,
        empresa: vagaData.empresa,
        localizacao: vagaData.localizacao,
        tipoContrato: vagaData.tipoContrato,
        descricao: vagaData.descricao,
        requisitosSoftSkills: vagaData.requisitosSoftSkills || [],
        status: PrismaStatusCampanha.APROVADA,
        dataCriacao: dataHoje,
        materiasRequeridas: {
          create: vagaData.materiasRequeridas?.map((m: any) => ({
            nomeDaMateria: m.nomeDaMateria,
            peso: Number(m.peso),
          })),
        },
      },
      include: { materiasRequeridas: true },
    });

    return NextResponse.json({
      id: dbVaga.id,
      titulo: dbVaga.titulo,
      empresa: dbVaga.empresa,
      localizacao: dbVaga.localizacao,
      tipoContrato: dbVaga.tipoContrato,
      descricao: dbVaga.descricao,
      requisitosSoftSkills: dbVaga.requisitosSoftSkills || [],
      materiasRequeridas: dbVaga.materiasRequeridas.map((m: any) => ({
        nomeDaMateria: m.nomeDaMateria,
        peso: m.peso,
      })),
      status: "aprovada",
      dataCriacao: dbVaga.dataCriacao,
    });
  } catch (error) {
    console.error("Erro ao criar vaga no POST /api/vagas:", error);
    return NextResponse.json({ error: "Erro ao criar vaga" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAuth(["EMPRESA", "MASTER"]);
    const { vagaId } = await req.json();

    const dbVaga = await prisma.vaga.update({
      where: { id: vagaId },
      data: { status: PrismaStatusCampanha.APROVADA },
      include: { materiasRequeridas: true },
    });

    return NextResponse.json({
      id: dbVaga.id,
      titulo: dbVaga.titulo,
      empresa: dbVaga.empresa,
      localizacao: dbVaga.localizacao,
      tipoContrato: dbVaga.tipoContrato,
      descricao: dbVaga.descricao,
      requisitosSoftSkills: dbVaga.requisitosSoftSkills || [],
      materiasRequeridas: dbVaga.materiasRequeridas.map((m: any) => ({
        nomeDaMateria: m.nomeDaMateria,
        peso: m.peso,
      })),
      status: "aprovada",
      dataCriacao: dbVaga.dataCriacao,
    });
  } catch (error) {
    console.error("Erro ao atualizar vaga no PATCH /api/vagas:", error);
    return NextResponse.json({ error: "Erro ao atualizar vaga" }, { status: 500 });
  }
}
