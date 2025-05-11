import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest, isTeacher } from "@/lib/auth"
import { query } from "@/lib/db"
import { saveFile } from "@/lib/file-utils"

// Verificar se este arquivo está usando os parâmetros corretos
// Deve usar [journeyId]
export async function POST(request: NextRequest, { params }: { params: { journeyId: string } }) {
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

    // Processar o FormData
    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const video = formData.get("video") as File | null
    const materialsJson = formData.get("materials") as string

    if (!title) {
      return NextResponse.json({ message: "O título é obrigatório" }, { status: 400 })
    }

    // Obter a ordem mais alta atual
    const orderResult = await query(
      "SELECT COALESCE(MAX(order_number), 0) as max_order FROM lessons WHERE journey_id = $1",
      [journeyId],
    )

    const orderNumber = orderResult.rows[0].max_order + 1

    // Criar a aula
    const lessonResult = await query(
      `
      INSERT INTO lessons (journey_id, title, description, order_number)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [journeyId, title, description, orderNumber],
    )

    const lessonId = lessonResult.rows[0].id

    // Salvar vídeo se fornecido
    let videoPath = null
    if (video) {
      try {
        videoPath = await saveFile(video, journeyId, lessonId, "video")

        // Atualizar a aula com o caminho do vídeo
        await query("UPDATE lessons SET video_path = $1 WHERE id = $2", [videoPath, lessonId])
      } catch (error) {
        console.error("Erro ao salvar vídeo:", error)
        // Continuar mesmo se houver erro no vídeo
      }
    }

    // Processar materiais
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
        // Continuar mesmo se houver erro nos materiais
      }
    }

    return NextResponse.json({
      message: "Aula criada com sucesso",
      lessonId,
    })
  } catch (error) {
    console.error("Erro ao criar aula:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
