import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"
import { comparePasswords, createToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validar campos
    if (!email || !password) {
      return NextResponse.json({ message: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Buscar usuário pelo email
    const result = await query("SELECT id, name, email, password, role FROM users WHERE email = $1", [email])

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Email ou senha incorretos" }, { status: 401 })
    }

    const user = result.rows[0]

    // Verificar senha
    const passwordMatch = await comparePasswords(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ message: "Email ou senha incorretos" }, { status: 401 })
    }

    // Criar token JWT
    const token = await createToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    // Definir cookie
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    // Retornar usuário (sem a senha)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "Login realizado com sucesso",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
