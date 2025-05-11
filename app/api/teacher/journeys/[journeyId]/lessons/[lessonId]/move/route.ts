import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest, isTeacher } from "@/lib/auth"
import { query } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { journeyId: string; lessonId: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || !isTeacher(user)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const journeyId = Number.parseInt(params.journeyId)
    const lessonId = Number.parseInt(params.lessonId)

    // Verificar se a jornada pertence ao professor
    const journeyResult = await query("SELECT id FROM journeys WHERE id = $1 AND (teacher_id = $2 OR $3 = true)", [
      journeyId,
      user.id,
      user.role === "admin",
    ])

    if (journeyResult.rows.length === 0) {
      return NextResponse.json({ message: "Jornada não encontrada" }, { status: 404 })
    }

    // Verificar se a aula existe
    const lessonResult = await query("SELECT id, order_number FROM lessons WHERE id = $1 AND journey_id = $2", [
      lessonId,
      journeyId,
    ])

    if (lessonResult.rows.length === 0) {
      return NextResponse.json({ message: "Aula não encontrada" }, { status: 404 })
    }

    const currentOrder = lessonResult.rows[0].order_number

    // Obter a direção do movimento
    const { direction } = await request.json()

    if (direction !== "up" && direction !== "down") {
      return NextResponse.json({ message: "Direção inválida" }, { status: 400 })
    }

    // Buscar a aula adjacente
    const adjacentResult = await query(
      `
      SELECT id, order_number
      FROM lessons
      WHERE journey_id = $1 AND order_number = $2
      `,
      [journeyId, direction === "up" ? currentOrder - 1 : currentOrder + 1],
    )

    if (adjacentResult.rows.length === 0) {
      return NextResponse.json(
        { message: `Não é possível mover a aula para ${direction === "up" ? "cima" : "baixo"}` },
        { status: 400 },
      )
    }

    const adjacentLesson = adjacentResult.rows[0]

    // Trocar as ordens
    await query("UPDATE lessons SET order_number = $1 WHERE id = $2", [adjacentLesson.order_number, lessonId])

    await query("UPDATE lessons SET order_number = $1 WHERE id = $2", [currentOrder, adjacentLesson.id])

    return NextResponse.json({
      message: `Aula movida para ${direction === "up" ? "cima" : "baixo"} com sucesso`,
    })
  } catch (error) {
    console.error("Erro ao mover aula:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
