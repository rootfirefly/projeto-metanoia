import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    // Buscar jornadas em que o usuário está inscrito
    const result = await query(
      `
      SELECT j.id, j.title, j.description, j.thumbnail_path
      FROM journeys j
      JOIN enrollments e ON j.id = e.journey_id
      WHERE e.user_id = $1 AND j.is_published = true
      ORDER BY e.created_at DESC
    `,
      [user.id],
    )

    return NextResponse.json({ journeys: result.rows })
  } catch (error) {
    console.error("Erro ao buscar jornadas inscritas:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
