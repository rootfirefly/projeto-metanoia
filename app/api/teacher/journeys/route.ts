import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest, isTeacher } from "@/lib/auth"
import { query } from "@/lib/db"
import { saveFile } from "@/lib/file-utils"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || !isTeacher(user)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    // Buscar jornadas do professor
    const result = await query(
      `
      SELECT id, title, description, thumbnail_path, is_published
      FROM journeys
      WHERE teacher_id = $1
      ORDER BY created_at DESC
      `,
      [user.id],
    )

    return NextResponse.json({ journeys: result.rows })
  } catch (error) {
    console.error("Erro ao buscar jornadas do professor:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || !isTeacher(user)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    // Processar o FormData
    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const thumbnail = formData.get("thumbnail") as File | null

    if (!title) {
      return NextResponse.json({ message: "O título é obrigatório" }, { status: 400 })
    }

    let thumbnailPath = null

    // Salvar thumbnail se fornecido
    if (thumbnail) {
      try {
        // Criar uma jornada temporária para obter um ID
        const tempResult = await query(
          "INSERT INTO journeys (title, description, teacher_id) VALUES ($1, $2, $3) RETURNING id",
          [title, description, user.id],
        )

        const journeyId = tempResult.rows[0].id

        // Salvar o arquivo
        thumbnailPath = await saveFile(thumbnail, journeyId, 0, "document")

        // Atualizar a jornada com o caminho do thumbnail
        await query("UPDATE journeys SET thumbnail_path = $1 WHERE id = $2", [thumbnailPath, journeyId])

        return NextResponse.json({
          message: "Jornada criada com sucesso",
          journeyId,
        })
      } catch (error) {
        console.error("Erro ao salvar thumbnail:", error)
        return NextResponse.json({ message: "Erro ao salvar imagem de capa" }, { status: 500 })
      }
    } else {
      // Criar jornada sem thumbnail
      const result = await query(
        "INSERT INTO journeys (title, description, teacher_id) VALUES ($1, $2, $3) RETURNING id",
        [title, description, user.id],
      )

      return NextResponse.json({
        message: "Jornada criada com sucesso",
        journeyId: result.rows[0].id,
      })
    }
  } catch (error) {
    console.error("Erro ao criar jornada:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
