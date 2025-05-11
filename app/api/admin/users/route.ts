import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest, isAdmin, hashPassword } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || !isAdmin(user)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    // Buscar todos os usuários
    const result = await query(
      `
      SELECT id, name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
      `,
    )

    return NextResponse.json({ users: result.rows })
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || !isAdmin(user)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const { name, email, password, role } = await request.json()

    // Validar campos
    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Validar função
    if (!["admin", "teacher", "student"].includes(role)) {
      return NextResponse.json({ message: "Função inválida" }, { status: 400 })
    }

    // Verificar se o email já está em uso
    const existingUser = await query("SELECT id FROM users WHERE email = $1", [email])

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ message: "Este email já está em uso" }, { status: 409 })
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password)

    // Inserir novo usuário
    const result = await query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id", [
      name,
      email,
      hashedPassword,
      role,
    ])

    return NextResponse.json({
      message: "Usuário criado com sucesso",
      userId: result.rows[0].id,
    })
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
