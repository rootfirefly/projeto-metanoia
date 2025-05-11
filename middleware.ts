import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export async function middleware(request: NextRequest) {
  // Rotas públicas que não precisam de autenticação
  const publicPaths = [
    "/",
    "/sobre",
    "/palestras",
    "/cursos-tecnicos",
    "/area-jovens",
    "/area-familias",
    "/contato",
    "/login",
    "/register",
  ]

  // Verificar se a rota atual é pública
  const path = request.nextUrl.pathname
  if (publicPaths.some((publicPath) => path === publicPath || path.startsWith("/api/public"))) {
    return NextResponse.next()
  }

  // Verificar se o usuário está autenticado
  const token = request.cookies.get("token")?.value

  if (!token) {
    // Redirecionar para a página de login se não estiver autenticado
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", path)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar se o token é válido
  const user = await verifyToken(token)

  if (!user) {
    // Redirecionar para a página de login se o token for inválido
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", path)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar permissões para rotas específicas
  if (path.startsWith("/dashboard/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (path.startsWith("/dashboard/teacher") && user.role !== "admin" && user.role !== "teacher") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
