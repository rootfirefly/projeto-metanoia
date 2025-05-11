import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { query } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const journeyId = Number.parseInt(params.id)

    // Verificar se a jornada existe e está publicada
    const journeyResult = await query("SELECT id FROM journeys WHERE id = $1 AND is_published = true", [journeyId])

    if (journeyResult.rows.length === 0) {
      return NextResponse.json({ message: "Jornada não encontrada ou não publicada" }, { status: 404 })
    }

    // Verificar se o usuário já está inscrito
    const enrollmentResult = await query("SELECT id FROM enrollments WHERE user_id = $1 AND journey_id = $2", [
      user.id,
      journeyId,
    ])

    if (enrollmentResult.rows.length > 0) {
      return NextResponse.json({ message: "Você já está inscrito nesta jornada" }, { status: 400 })
    }

    // Inscrever o usuário
    await query("INSERT INTO enrollments (user_id, journey_id) VALUES ($1, $2)", [user.id, journeyId])

    return NextResponse.json({ message: "Inscrição realizada com sucesso" })
  } catch (error) {
    console.error("Erro ao inscrever usuário:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
