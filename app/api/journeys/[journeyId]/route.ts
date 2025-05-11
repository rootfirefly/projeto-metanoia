import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { query } from "@/lib/db"

// Atualizar a interface de parâmetros
export async function GET(request: NextRequest, { params }: { params: { journeyId: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const journeyId = Number.parseInt(params.journeyId)

    // Verificar se a jornada existe e está publicada
    const journeyResult = await query(
      `
      SELECT j.id, j.title, j.description, j.thumbnail_path, j.is_published,
             u.id as teacher_id, u.name as teacher_name
      FROM journeys j
      JOIN users u ON j.teacher_id = u.id
      WHERE j.id = $1 AND (j.is_published = true OR j.teacher_id = $2)
    `,
      [journeyId, user.id],
    )

    if (journeyResult.rows.length === 0) {
      return NextResponse.json({ message: "Jornada não encontrada" }, { status: 404 })
    }

    const journey = journeyResult.rows[0]

    // Verificar se o usuário está inscrito
    const enrollmentResult = await query("SELECT id FROM enrollments WHERE user_id = $1 AND journey_id = $2", [
      user.id,
      journeyId,
    ])

    const enrolled = enrollmentResult.rows.length > 0

    // Buscar aulas da jornada
    const lessonsResult = await query(
      `
      SELECT l.id, l.title, l.description, l.order_number,
             CASE WHEN p.completed IS NULL THEN false ELSE p.completed END as completed
      FROM lessons l
      LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = $1
      WHERE l.journey_id = $2
      ORDER BY l.order_number
    `,
      [user.id, journeyId],
    )

    // Formatar resposta
    const formattedJourney = {
      id: journey.id,
      title: journey.title,
      description: journey.description,
      thumbnail_path: journey.thumbnail_path,
      is_published: journey.is_published,
      teacher: {
        id: journey.teacher_id,
        name: journey.teacher_name,
      },
      enrolled,
      lessons: lessonsResult.rows,
    }

    return NextResponse.json({ journey: formattedJourney })
  } catch (error) {
    console.error("Erro ao buscar jornada:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
