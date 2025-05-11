import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest, isTeacher } from "@/lib/auth"
import { query } from "@/lib/db"
import { saveFile, deleteFile } from "@/lib/file-utils"

export async function GET(request: NextRequest, { params }: { params: { journeyId: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || !isTeacher(user)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const journeyId = Number.parseInt(params.journeyId)

    // Verificar se a jornada pertence ao professor
    const journeyResult = await query(
      `
      SELECT j.id, j.title, j.description, j.thumbnail_path, j.is_published
      FROM journeys j
      WHERE j.id = $1 AND (j.teacher_id = $2 OR $3 = true)
      `,
      [journeyId, user.id, user.role === "admin"],
    )

    if (journeyResult.rows.length === 0) {
      return NextResponse.json({ message: "Jornada não encontrada" }, { status: 404 })
    }

    const journey = journeyResult.rows[0]

    // Buscar aulas da jornada
    const lessonsResult = await query(
      `
      SELECT id, title, description, video_path, order_number
      FROM lessons
      WHERE journey_id = $1
      ORDER BY order_number
      `,
      [journeyId],
    )

    // Formatar resposta
    const formattedJourney = {
      ...journey,
      lessons: lessonsResult.rows,
    }

    return NextResponse.json({ journey: formattedJourney })
  } catch (error) {
    console.error("Erro ao buscar jornada:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { journeyId: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || !isTeacher(user)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const journeyId = Number.parseInt(params.journeyId)

    // Verificar se a jornada pertence ao professor
    const journeyResult = await query(
      "SELECT id, thumbnail_path FROM journeys WHERE id = $1 AND (teacher_id = $2 OR $3 = true)",
      [journeyId, user.id, user.role === "admin"],
    )

    if (journeyResult.rows.length === 0) {
      return NextResponse.json({ message: "Jornada não encontrada" }, { status: 404 })
    }

    const currentJourney = journeyResult.rows[0]

    // Processar o FormData
    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const thumbnail = formData.get("thumbnail") as File | null
    const removeThumbnail = formData.get("removeThumbnail") === "true"

    if (!title) {
      return NextResponse.json({ message: "O título é obrigatório" }, { status: 400 })
    }

    let thumbnailPath = currentJourney.thumbnail_path

    // Remover thumbnail existente se solicitado
    if (removeThumbnail && thumbnailPath) {
      deleteFile(thumbnailPath)
      thumbnailPath = null
    }

    // Salvar novo thumbnail se fornecido
    if (thumbnail) {
      // Remover thumbnail antigo se existir
      if (thumbnailPath) {
        deleteFile(thumbnailPath)
      }

      // Salvar o novo arquivo
      thumbnailPath = await saveFile(thumbnail, journeyId, 0, "document")
    }

    // Atualizar a jornada
    await query(
      "UPDATE journeys SET title = $1, description = $2, thumbnail_path = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4",
      [title, description, thumbnailPath, journeyId],
    )

    return NextResponse.json({ message: "Jornada atualizada com sucesso" })
  } catch (error) {
    console.error("Erro ao atualizar jornada:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { journeyId: string } }) {
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

    // Excluir a jornada (as aulas, materiais e inscrições serão excluídos em cascata)
    await query("DELETE FROM journeys WHERE id = $1", [journeyId])

    return NextResponse.json({ message: "Jornada excluída com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir jornada:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
