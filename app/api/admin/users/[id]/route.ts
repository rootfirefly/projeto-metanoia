import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest, isAdmin, hashPassword } from "@/lib/auth"
import { query } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || !isAdmin(user)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(params.id)

    // Verificar se o usuário existe
    const userResult = await query("SELECT id FROM users WHERE id = $1", [userId])

    if (userResult.rows.length === 0) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 })
    }

    const { name, email, role, password } = await request.json()

    // Validar campos obrigatórios
    if (!name || !email || !role) {
      return NextResponse.json({ message: "Nome, email e função são obrigatórios" }, { status: 400 })
    }

    // Validar função
    if (!["admin", "teacher", "student"].includes(role)) {
      return NextResponse.json({ message: "Função inválida" }, { status: 400 })
    }

    // Verificar se o email já está em uso por outro usuário
    const existingUser = await query("SELECT id FROM users WHERE email = $1 AND id != $2", [email, userId])

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ message: "Este email já está em uso por outro usuário" }, { status: 409 })
    }

    // Atualizar usuário
    if (password) {
      // Se uma nova senha foi fornecida, hash e atualiza
      const hashedPassword = await hashPassword(password)

      await query(
        "UPDATE users SET name = $1, email = $2, role = $3, password = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5",
        [name, email, role, hashedPassword, userId],
      )
    } else {
      // Atualizar sem alterar a senha
      await query("UPDATE users SET name = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4", [
        name,
        email,
        role,
        userId,
      ])
    }

    return NextResponse.json({ message: "Usuário atualizado com sucesso" })
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || !isAdmin(user)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(params.id)

    // Não permitir excluir o próprio usuário
    if (userId === user.id) {
      return NextResponse.json({ message: "Não é possível excluir seu próprio usuário" }, { status: 400 })
    }

    // Verificar se o usuário existe
    const userResult = await query("SELECT id FROM users WHERE id = $1", [userId])

    if (userResult.rows.length === 0) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 })
    }

    // Excluir o usuário
    await query("DELETE FROM users WHERE id = $1", [userId])

    return NextResponse.json({ message: "Usuário excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir usuário:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
