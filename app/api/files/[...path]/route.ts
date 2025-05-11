import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { STORAGE_PATH } from "@/lib/config"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    // Verificar autenticação
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    // Construir caminho do arquivo
    const filePath = path.join(STORAGE_PATH, ...params.path)

    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ message: "Arquivo não encontrado" }, { status: 404 })
    }

    // Ler o arquivo
    const fileBuffer = fs.readFileSync(filePath)

    // Determinar o tipo MIME com base na extensão
    const ext = path.extname(filePath).toLowerCase()
    let contentType = "application/octet-stream"

    if (ext === ".pdf") {
      contentType = "application/pdf"
    } else if (ext === ".mp4") {
      contentType = "video/mp4"
    } else if (ext === ".webm") {
      contentType = "video/webm"
    } else if (ext === ".ogg") {
      contentType = "video/ogg"
    }

    // Retornar o arquivo
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${path.basename(filePath)}"`,
      },
    })
  } catch (error) {
    console.error("Erro ao servir arquivo:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
