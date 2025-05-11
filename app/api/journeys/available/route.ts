import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    // Buscar jornadas disponíveis (publicadas e em que o usuário não está inscrito)
    const result = await query(
      `
      SELECT j.id, j.title, j.description, j.thumbnail_path
      FROM journeys j
      WHERE j.is_published = true
      AND NOT EXISTS (
        SELECT 1 FROM enrollments e
        WHERE e.journey_id = j.id AND e.user_id = $1
      )
      ORDER BY j.created_at DESC
    `,
      [user.id],
    )

    return NextResponse.json({ journeys: result.rows })
  } catch (error) {
    console.error("Erro ao buscar jornadas disponíveis:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
