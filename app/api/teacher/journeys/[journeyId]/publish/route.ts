import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/utils"
import { isTeacher } from "@/lib/utils"

export async function POST(request: NextRequest, { params }: { params: { journeyId: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || !isTeacher(user)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const journeyId = Number.parseInt(params.journeyId)

    // Resto do código permanece o mesmo
  } catch (error) {
    console.error("Erro ao processar a requisição:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
