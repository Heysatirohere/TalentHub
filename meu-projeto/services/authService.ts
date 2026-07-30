"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export interface RegisterUserData {
  email: string;
  senha: string;
  role: "ALUNO" | "EMPRESA" | "MASTER" | "aluno" | "empresa" | "master";
  // Campos específicos de Aluno
  ra?: string;
  nome?: string;
  curso?: string;
  semestre?: number;
  idade?: number;
  // Campos específicos de Empresa
  nomeEmpresa?: string;
  cnpj?: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  role?: string;
  userId?: string;
}

/**
 * Registra um novo usuário com transação Prisma (User + Aluno/Empresa) e hash de senha via bcrypt.
 */
export async function registerUser(data: RegisterUserData): Promise<AuthResponse> {
  const { email, senha, role: rawRole } = data;

  if (!email || !senha) {
    return { success: false, error: "E-mail e senha são obrigatórios." };
  }

  const roleUpper = rawRole.toUpperCase() as Role;

  try {
    // 1. Verificar se o e-mail já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, error: "Este e-mail já está cadastrado no sistema." };
    }

    // 2. Hash da senha com bcrypt
    const hashedPassword = await bcrypt.hash(senha, 10);

    // 3. Transação atômica no Prisma para criar User + Perfil específico
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          senha: hashedPassword,
          role: roleUpper,
        },
      });

      if (roleUpper === Role.ALUNO) {
        const raCalculado = data.ra || "260" + Math.floor(1000 + Math.random() * 9000);
        await tx.aluno.create({
          data: {
            userId: user.id,
            ra: raCalculado,
            nome: data.nome || "Estudante FECAP",
            email: email.toLowerCase(),
            curso: data.curso || "Ciência da Computação",
            semestre: data.semestre || 5,
            idade: data.idade || 21,
            avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
          },
        });
      } else if (roleUpper === Role.EMPRESA) {
        await tx.empresa.create({
          data: {
            userId: user.id,
            nomeEmpresa: data.nomeEmpresa || "Empresa Parceira FECAP",
            cnpj: data.cnpj || "00.000.000/0001-00",
          },
        });
      }

      return user;
    });

    return {
      success: true,
      userId: result.id,
      role: result.role.toLowerCase(),
    };
  } catch (error: any) {
    console.error("Erro no registro do usuário:", error);
    return { success: false, error: "Falha ao registrar usuário no banco de dados." };
  }
}

/**
 * Autentica o usuário pelo e-mail/senha com bcrypt.compare e define os cookies de sessão.
 */
export async function loginUser(email: string, senha: string): Promise<AuthResponse> {
  if (!email || !senha) {
    return { success: false, error: "Por favor, preencha o e-mail e a senha." };
  }

  try {
    // 1. Buscar usuário pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        aluno: true,
        empresa: true,
      },
    });

    if (!user) {
      return { success: false, error: "Usuário não encontrado" };
    }

    // 2. Comparar senha com bcrypt
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return { success: false, error: "Senha incorreta" };
    }

    const roleLower = user.role.toLowerCase();

    // 3. Criar Cookie HttpOnly auth_session via API cookies() do Next.js
    const cookieStore = await cookies();
    const sessionPayload = JSON.stringify({
      userId: user.id,
      role: roleLower,
      email: user.email,
    });

    cookieStore.set("auth_session", sessionPayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    cookieStore.set("user_role", roleLower, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    cookieStore.set("user_email", user.email, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    if (user.aluno?.ra) {
      cookieStore.set("user_ra", user.aluno.ra, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });
    }

    return {
      success: true,
      role: roleLower,
      userId: user.id,
      email: user.email,
      ra: user.aluno?.ra,
    } as any;
  } catch (error: any) {
    console.error("Erro no login do usuário:", error);
    return { success: false, error: "Erro interno no servidor durante a autenticação." };
  }
}

/**
 * Retorna os dados do usuário autenticado no servidor via cookies.
 */
export async function getLoggedUserServer() {
  const cookieStore = await cookies();
  const email = cookieStore.get("user_email")?.value;
  const ra = cookieStore.get("user_ra")?.value;
  const role = cookieStore.get("user_role")?.value;
  return { email, ra, role };
}

import { revalidatePath } from "next/cache";

/**
 * Remove os cookies de sessão, invalida o cache do Next.js e redireciona para a página de login.
 */
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  cookieStore.delete("user_role");
  cookieStore.delete("user_email");
  cookieStore.delete("user_ra");

  revalidatePath("/", "layout");
  redirect("/login");
}
