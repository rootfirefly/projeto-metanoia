import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Remover o cookie de autenticação
  cookies().delete("token")

  return NextResponse.json({ message: "Logout realizado com sucesso" })
}
