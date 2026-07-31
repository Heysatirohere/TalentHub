import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ler os cookies de autenticação (auth_session e user_role)
  const authSessionCookie = request.cookies.get("auth_session")?.value;
  const legacyRoleCookie = request.cookies.get("user_role")?.value;

  let userRole: string | undefined = legacyRoleCookie?.toUpperCase();

  if (authSessionCookie) {
    try {
      const parsed = JSON.parse(authSessionCookie);
      if (parsed?.role) {
        userRole = String(parsed.role).toUpperCase();
      }
    } catch {
      userRole = authSessionCookie.toUpperCase();
    }
  }

  // Redirecionamento de compatibilidade para rotas legadas do recrutador
  if (pathname.startsWith("/recrutador")) {
    return NextResponse.redirect(new URL("/empresa", request.url));
  }

  // Verifica se o caminho atual é uma rota protegida
  const isProtectedPath =
    pathname.startsWith("/aluno") ||
    pathname.startsWith("/hub") ||
    pathname.startsWith("/empresa") ||
    pathname.startsWith("/banco-talentos") ||
    pathname.startsWith("/vagas") ||
    pathname.startsWith("/master") ||
    pathname.startsWith("/admin");

  // 2. Se a rota for protegida e o usuário não estiver autenticado -> Redireciona para /login
  if (!userRole && isProtectedPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Proteção RBAC estrita para rotas /aluno e /hub (Role permitida: ALUNO)
  if (pathname.startsWith("/aluno") || pathname.startsWith("/hub")) {
    if (userRole !== "ALUNO") {
      return NextResponse.redirect(new URL("/acesso-negado", request.url));
    }
  }

  // 4. Proteção RBAC estrita para rotas /empresa, /banco-talentos e /vagas (Role permitida: EMPRESA)
  if (
    pathname.startsWith("/empresa") ||
    pathname.startsWith("/banco-talentos") ||
    pathname.startsWith("/vagas")
  ) {
    if (userRole !== "EMPRESA") {
      return NextResponse.redirect(new URL("/acesso-negado", request.url));
    }
  }

  // 5. Proteção RBAC estrita para rotas /master e /admin (Role permitida: MASTER)
  if (pathname.startsWith("/master") || pathname.startsWith("/admin")) {
    if (userRole !== "MASTER") {
      return NextResponse.redirect(new URL("/acesso-negado", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/aluno/:path*",
    "/hub/:path*",
    "/empresa/:path*",
    "/banco-talentos/:path*",
    "/vagas/:path*",
    "/master/:path*",
    "/admin/:path*",
    "/recrutador/:path*",
  ],
};
