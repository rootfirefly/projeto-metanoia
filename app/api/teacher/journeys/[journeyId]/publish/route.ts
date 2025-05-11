import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest, isTeacher } from "@/lib/auth"
import { query } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { journeyId: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || !isTeacher(user)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const journeyId = Number.parseInt(params.journeyId)

    // Verificar se a jornada pertence ao professor
    const journeyResult = await query("SELECT id FROM journeys WHERE id = $1 AND (teacher_id = $2 OR $3 = true)", [
      journeyId,
      user.id,
      user.role === "admin",
    ])

    if (journeyResult.rows.length === 0) {
      return NextResponse.json({ message: "Jornada não encontrada" }, { status: 404 })
    }

    // Obter o novo status de publicação
    const { published } = await request.json()

    if (typeof published !== "boolean") {
      return NextResponse.json({ message: "Status de publicação inválido" }, { status: 400 })
    }

    // Atualizar o status de publicação
    await query("UPDATE journeys SET is_published = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [
      published,
      journeyId,
    ])

    return NextResponse.json({
      message: published ? "Jornada publicada com sucesso" : "Jornada despublicada com sucesso",
    })
  } catch (error) {
    console.error("Erro ao alterar status de publicação:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
