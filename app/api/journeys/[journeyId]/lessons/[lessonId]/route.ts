import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { journeyId: string; lessonId: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const journeyId = Number.parseInt(params.journeyId)
    const lessonId = Number.parseInt(params.lessonId)

    // Verificar se o usuário está inscrito na jornada ou é o professor
    const accessResult = await query(
      `
      SELECT 1
      FROM journeys j
      LEFT JOIN enrollments e ON j.id = e.journey_id AND e.user_id = $1
      WHERE j.id = $2 AND (e.id IS NOT NULL OR j.teacher_id = $1 OR $3 = true)
    `,
      [user.id, journeyId, user.role === "admin"],
    )

    if (accessResult.rows.length === 0) {
      return NextResponse.json({ message: "Acesso negado a esta jornada" }, { status: 403 })
    }

    // Buscar dados da aula
    const lessonResult = await query(
      `
      SELECT l.id, l.title, l.description, l.video_path
      FROM lessons l
      WHERE l.id = $1 AND l.journey_id = $2
    `,
      [lessonId, journeyId],
    )

    if (lessonResult.rows.length === 0) {
      return NextResponse.json({ message: "Aula não encontrada" }, { status: 404 })
    }

    const lesson = lessonResult.rows[0]

    // Buscar materiais da aula
    const materialsResult = await query(
      `
      SELECT id, title, type, content
      FROM materials
      WHERE lesson_id = $1
      ORDER BY id
    `,
      [lessonId],
    )

    // Buscar progresso do usuário
    const progressResult = await query(
      `
      SELECT completed, last_watched_position
      FROM progress
      WHERE user_id = $1 AND lesson_id = $2
    `,
      [user.id, lessonId],
    )

    const completed = progressResult.rows.length > 0 ? progressResult.rows[0].completed : false
    const lastWatchedPosition = progressResult.rows.length > 0 ? progressResult.rows[0].last_watched_position : 0

    // Formatar resposta
    const formattedLesson = {
      ...lesson,
      materials: materialsResult.rows,
    }

    return NextResponse.json({
      lesson: formattedLesson,
      completed,
      lastWatchedPosition,
    })
  } catch (error) {
    console.error("Erro ao buscar aula:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
