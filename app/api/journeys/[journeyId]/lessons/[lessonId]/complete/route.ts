import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { query } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { journeyId: string; lessonId: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const journeyId = Number.parseInt(params.journeyId)
    const lessonId = Number.parseInt(params.lessonId)

    // Verificar se o usuário está inscrito na jornada
    const enrollmentResult = await query("SELECT id FROM enrollments WHERE user_id = $1 AND journey_id = $2", [
      user.id,
      journeyId,
    ])

    if (enrollmentResult.rows.length === 0) {
      return NextResponse.json({ message: "Você não está inscrito nesta jornada" }, { status: 403 })
    }

    // Verificar se a aula pertence à jornada
    const lessonResult = await query("SELECT id FROM lessons WHERE id = $1 AND journey_id = $2", [lessonId, journeyId])

    if (lessonResult.rows.length === 0) {
      return NextResponse.json({ message: "Aula não encontrada nesta jornada" }, { status: 404 })
    }

    // Atualizar ou inserir o progresso
    const progressResult = await query("SELECT id FROM progress WHERE user_id = $1 AND lesson_id = $2", [
      user.id,
      lessonId,
    ])

    if (progressResult.rows.length === 0) {
      // Inserir novo registro de progresso
      await query("INSERT INTO progress (user_id, lesson_id, completed) VALUES ($1, $2, true)", [user.id, lessonId])
    } else {
      // Atualizar registro existente
      await query(
        "UPDATE progress SET completed = true, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND lesson_id = $2",
        [user.id, lessonId],
      )
    }

    return NextResponse.json({ message: "Aula marcada como concluída" })
  } catch (error) {
    console.error("Erro ao marcar aula como concluída:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
