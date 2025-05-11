import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest, isTeacher } from "@/lib/auth"
import { query } from "@/lib/db"
import { saveFile, deleteFile } from "@/lib/file-utils"

// Verificar se este arquivo está usando os parâmetros corretos
// Deve usar [journeyId] e [lessonId]
export async function GET(request: NextRequest, { params }: { params: { journeyId: string; lessonId: string } }) {
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

    // Buscar dados da aula
    const lessonResult = await query(
      `
      SELECT id, title, description, video_path, order_number
      FROM lessons
      WHERE id = $1 AND journey_id = $2
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

    // Formatar resposta
    const formattedLesson = {
      ...lesson,
      materials: materialsResult.rows,
    }

    return NextResponse.json({ lesson: formattedLesson })
  } catch (error) {
    console.error("Erro ao buscar aula:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { journeyId: string; lessonId: string } }) {
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
    const lessonResult = await query("SELECT id, video_path FROM lessons WHERE id = $1 AND journey_id = $2", [
      lessonId,
      journeyId,
    ])

    if (lessonResult.rows.length === 0) {
      return NextResponse.json({ message: "Aula não encontrada" }, { status: 404 })
    }

    const currentLesson = lessonResult.rows[0]

    // Processar o FormData
    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const video = formData.get("video") as File | null
    const removeVideo = formData.get("removeVideo") === "true"
    const materialsJson = formData.get("materials") as string
    const removeMaterialsIds = formData.get("removeMaterials") as string

    if (!title) {
      return NextResponse.json({ message: "O título é obrigatório" }, { status: 400 })
    }

    let videoPath = currentLesson.video_path

    // Remover vídeo existente se solicitado
    if (removeVideo && videoPath) {
      deleteFile(videoPath)
      videoPath = null
    }

    // Salvar novo vídeo se fornecido
    if (video) {
      // Remover vídeo antigo se existir
      if (videoPath) {
        deleteFile(videoPath)
      }

      // Salvar o novo arquivo
      videoPath = await saveFile(video, journeyId, lessonId, "video")
    }

    // Atualizar a aula
    await query(
      "UPDATE lessons SET title = $1, description = $2, video_path = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4",
      [title, description, videoPath, lessonId],
    )

    // Remover materiais se solicitado
    if (removeMaterialsIds) {
      try {
        const materialIds = JSON.parse(removeMaterialsIds) as number[]

        for (const materialId of materialIds) {
          // Buscar o material para verificar se é um arquivo
          const materialResult = await query("SELECT type, content FROM materials WHERE id = $1 AND lesson_id = $2", [
            materialId,
            lessonId,
          ])

          if (materialResult.rows.length > 0) {
            const material = materialResult.rows[0]

            // Se for um arquivo, excluí-lo do armazenamento
            if (material.type === "pdf") {
              deleteFile(material.content)
            }

            // Excluir o material do banco de dados
            await query("DELETE FROM materials WHERE id = $1", [materialId])
          }
        }
      } catch (error) {
        console.error("Erro ao remover materiais:", error)
        // Continuar mesmo se houver erro
      }
    }

    // Adicionar novos materiais
    if (materialsJson) {
      try {
        const materials = JSON.parse(materialsJson)

        for (const material of materials) {
          if (material.type === "link") {
            // Salvar link diretamente
            await query("INSERT INTO materials (lesson_id, title, type, content) VALUES ($1, $2, $3, $4)", [
              lessonId,
              material.title,
              "link",
              material.content,
            ])
          } else if (material.type === "pdf") {
            // Buscar o arquivo do FormData
            const pdfFile = formData.get(`material_${material.id}`) as File

            if (pdfFile) {
              // Salvar o arquivo
              const pdfPath = await saveFile(pdfFile, journeyId, lessonId, "document")

              // Salvar o material com o caminho do arquivo
              await query("INSERT INTO materials (lesson_id, title, type, content) VALUES ($1, $2, $3, $4)", [
                lessonId,
                material.title,
                "pdf",
                pdfPath,
              ])
            }
          }
        }
      } catch (error) {
        console.error("Erro ao processar materiais:", error)
        // Continuar mesmo se houver erro
      }
    }

    return NextResponse.json({ message: "Aula atualizada com sucesso" })
  } catch (error) {
    console.error("Erro ao atualizar aula:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { journeyId: string; lessonId: string } }) {
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
    const lessonResult = await query("SELECT id, video_path FROM lessons WHERE id = $1 AND journey_id = $2", [
      lessonId,
      journeyId,
    ])

    if (lessonResult.rows.length === 0) {
      return NextResponse.json({ message: "Aula não encontrada" }, { status: 404 })
    }

    // Buscar materiais para excluir arquivos
    const materialsResult = await query("SELECT id, type, content FROM materials WHERE lesson_id = $1", [lessonId])

    // Excluir arquivos de materiais
    for (const material of materialsResult.rows) {
      if (material.type === "pdf") {
        deleteFile(material.content)
      }
    }

    // Excluir vídeo se existir
    if (lessonResult.rows[0].video_path) {
      deleteFile(lessonResult.rows[0].video_path)
    }

    // Excluir a aula (os materiais serão excluídos em cascata)
    await query("DELETE FROM lessons WHERE id = $1", [lessonId])

    // Reordenar as aulas restantes
    await query(
      `
      WITH ordered_lessons AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY order_number) as new_order
        FROM lessons
        WHERE journey_id = $1
      )
      UPDATE lessons l
      SET order_number = ol.new_order
      FROM ordered_lessons ol
      WHERE l.id = ol.id
      `,
      [journeyId],
    )

    return NextResponse.json({ message: "Aula excluída com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir aula:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
