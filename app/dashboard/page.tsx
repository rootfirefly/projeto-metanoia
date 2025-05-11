"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Play, Clock, BookOpen } from "lucide-react"

interface Journey {
  id: number
  title: string
  description: string
  thumbnail_path: string | null
}

export default function DashboardPage() {
  const [enrolledJourneys, setEnrolledJourneys] = useState<Journey[]>([])
  const [availableJourneys, setAvailableJourneys] = useState<Journey[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchJourneys() {
      try {
        // Buscar jornadas em que o usuário está inscrito
        const enrolledResponse = await fetch("/api/journeys/enrolled")
        const enrolledData = await enrolledResponse.json()

        // Buscar jornadas disponíveis para inscrição
        const availableResponse = await fetch("/api/journeys/available")
        const availableData = await availableResponse.json()

        setEnrolledJourneys(enrolledData.journeys || [])
        setAvailableJourneys(availableData.journeys || [])
      } catch (error) {
        console.error("Erro ao buscar jornadas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJourneys()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-900 mb-8">Meu Painel</h1>

      {/* Jornadas em andamento */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Minhas Jornadas</h2>

        {enrolledJourneys.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">
              Você ainda não está inscrito em nenhuma jornada. Explore as jornadas disponíveis abaixo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledJourneys.map((journey) => (
              <div key={journey.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-blue-100 relative">
                  {journey.thumbnail_path ? (
                    <img
                      src={`/api/files/${journey.thumbnail_path}`}
                      alt={journey.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-900">
                      <BookOpen className="h-16 w-16 text-white opacity-50" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">{journey.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{journey.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Em andamento</span>
                    </div>
                    <Link
                      href={`/dashboard/journey/${journey.id}`}
                      className="inline-flex items-center text-sm font-medium text-blue-900 hover:text-blue-700"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Continuar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Jornadas disponíveis */}
      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Jornadas Disponíveis</h2>

        {availableJourneys.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">Não há jornadas disponíveis no momento. Volte mais tarde para novidades.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableJourneys.map((journey) => (
              <div key={journey.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-blue-100 relative">
                  {journey.thumbnail_path ? (
                    <img
                      src={`/api/files/${journey.thumbnail_path}`}
                      alt={journey.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-900">
                      <BookOpen className="h-16 w-16 text-white opacity-50" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">{journey.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{journey.description}</p>
                  <Link
                    href={`/dashboard/journey/${journey.id}`}
                    className="inline-block w-full bg-blue-900 text-white text-center py-2 rounded-md hover:bg-blue-800 transition-colors"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
