import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ler o cookie HttpOnly auth_session
  const authSessionCookie = request.cookies.get("auth_session")?.value;
  const legacyRoleCookie = request.cookies.get("user_role")?.value;

  let userRole: string | undefined = legacyRoleCookie?.toLowerCase();

  if (authSessionCookie) {
    try {
      const parsed = JSON.parse(authSessionCookie);
      if (parsed?.role) {
        userRole = String(parsed.role).toLowerCase();
      }
    } catch {
      // Se não for JSON, trata como string simples
      userRole = authSessionCookie.toLowerCase();
    }
  }

  // Redirecionamento legado para rotas do recrutador
  if (pathname.startsWith("/recrutador")) {
    return NextResponse.redirect(new URL("/empresa", request.url));
  }

  // Se não houver cookie ativo e tentar acessar qualquer rota privada
  if (!userRole && (pathname.startsWith("/aluno") || pathname.startsWith("/empresa") || pathname.startsWith("/master"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Proteção RBAC da área Aluno (/aluno)
  if (pathname.startsWith("/aluno")) {
    if (userRole !== "aluno") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Proteção RBAC da área Empresa (/empresa)
  if (pathname.startsWith("/empresa")) {
    if (userRole !== "empresa") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Proteção RBAC da área Master (/master)
  if (pathname.startsWith("/master")) {
    if (userRole !== "master") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/aluno/:path*",
    "/empresa/:path*",
    "/master/:path*",
    "/recrutador/:path*",
  ],
};
