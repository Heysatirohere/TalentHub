import { cookies } from "next/headers";

export interface SessionUser {
  userId: string;
  email: string;
  role: "ALUNO" | "EMPRESA" | "MASTER";
}

/**
 * Valida se a requisição possui uma sessão ativa e se a role do usuário está entre as permitidas.
 * Lança um Error("Unauthorized") ou Error("Forbidden") caso a verificação falhe.
 */
export async function requireAuth(
  allowedRoles?: Array<"ALUNO" | "EMPRESA" | "MASTER" | "aluno" | "empresa" | "master">
): Promise<SessionUser> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("auth_session")?.value;
  const roleCookie = cookieStore.get("user_role")?.value;
  const emailCookie = cookieStore.get("user_email")?.value;

  let sessionUser: SessionUser | null = null;

  if (sessionCookie) {
    try {
      const parsed = JSON.parse(sessionCookie);
      if (parsed?.role) {
        sessionUser = {
          userId: parsed.userId || "",
          email: parsed.email || emailCookie || "",
          role: String(parsed.role).toUpperCase() as "ALUNO" | "EMPRESA" | "MASTER",
        };
      }
    } catch {
      // Se não for JSON válido, tenta ler como string
      sessionUser = {
        userId: "",
        email: emailCookie || "",
        role: sessionCookie.toUpperCase() as "ALUNO" | "EMPRESA" | "MASTER",
      };
    }
  }

  if (!sessionUser && roleCookie) {
    sessionUser = {
      userId: "",
      email: emailCookie || "",
      role: roleCookie.toUpperCase() as "ALUNO" | "EMPRESA" | "MASTER",
    };
  }

  if (!sessionUser || !sessionUser.role) {
    throw new Error("Unauthorized: Sessão de usuário não encontrada ou inválida.");
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());
    if (!normalizedAllowed.includes(sessionUser.role)) {
      throw new Error(`Forbidden: Acesso negado para o perfil ${sessionUser.role}.`);
    }
  }

  return sessionUser;
}
