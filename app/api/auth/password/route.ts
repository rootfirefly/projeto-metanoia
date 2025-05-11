import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest, comparePasswords, hashPassword } from "@/lib/auth"
import { query } from "@/lib/db"

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Senha atual e nova senha são obrigatórias" }, { status: 400 })
    }

    // Buscar a senha atual do usuário
    const userResult = await query("SELECT password FROM users WHERE id = $1", [user.id])

    if (userResult.rows.length === 0) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 })
    }

    const storedPassword = userResult.rows[0].password

    // Verificar se a senha atual está correta
    const passwordMatch = await comparePasswords(currentPassword, storedPassword)

    if (!passwordMatch) {
      return NextResponse.json({ message: "Senha atual incorreta" }, { status: 401 })
    }

    // Hash da nova senha
    const hashedPassword = await hashPassword(newPassword)

    // Atualizar a senha
    await query("UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [
      hashedPassword,
      user.id,
    ])

    return NextResponse.json({ message: "Senha alterada com sucesso" })
  } catch (error) {
    console.error("Erro ao alterar senha:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
