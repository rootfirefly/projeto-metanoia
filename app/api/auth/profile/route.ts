import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { query } from "@/lib/db"

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json({ message: "O nome é obrigatório" }, { status: 400 })
    }

    // Atualizar o nome do usuário
    await query("UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [name, user.id])

    return NextResponse.json({ message: "Perfil atualizado com sucesso" })
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
