"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Play, Check, Clock, ArrowLeft } from "lucide-react"

interface Lesson {
  id: number
  title: string
  description: string
  order_number: number
  completed: boolean
}

interface Journey {
  id: number
  title: string
  description: string
  thumbnail_path: string | null
  teacher: {
    id: number
    name: string
  }
  enrolled: boolean
  lessons: Lesson[]
}

// Atualizar a interface de parâmetros para usar journeyId em vez de id
interface JourneyPageProps {
  params: {
    journeyId: string
  }
}

// Atualizar a referência ao parâmetro no código
export default function JourneyPage({ params }: JourneyPageProps) {
  const [journey, setJourney] = useState<Journey | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolling, setIsEnrolling] = useState(false)

  const router = useRouter()
  const journeyId = Number.parseInt(params.journeyId)

  useEffect(() => {
    async function fetchJourney() {
      try {
        const response = await fetch(`/api/journeys/${journeyId}`)

        if (!response.ok) {
          throw new Error("Erro ao buscar jornada")
        }

        const data = await response.json()
        setJourney(data.journey)
      } catch (error) {
        console.error("Erro ao buscar jornada:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJourney()
  }, [journeyId])

  async function handleEnroll() {
    setIsEnrolling(true)

    try {
      const response = await fetch(`/api/journeys/${journeyId}/enroll`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Erro ao se inscrever na jornada")
      }

      // Atualizar o estado para mostrar que o usuário está inscrito
      setJourney((prev) => (prev ? { ...prev, enrolled: true } : null))
    } catch (error) {
      console.error("Erro ao se inscrever:", error)
      alert("Erro ao se inscrever na jornada. Tente novamente.")
    } finally {
      setIsEnrolling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  if (!journey) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Jornada não encontrada.</p>
        <Link href="/dashboard" className="text-blue-900 hover:text-blue-700 mt-4 inline-block">
          Voltar para o painel
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-blue-900 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para o painel
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="h-48 bg-blue-100 relative">
          {journey.thumbnail_path ? (
            <img
              src={`/api/files/${journey.thumbnail_path}`}
              alt={journey.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-900">
              <span className="text-white text-2xl font-bold opacity-50">{journey.title}</span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">{journey.title}</h1>
          <p className="text-gray-600 mb-4">{journey.description}</p>
          <p className="text-sm text-gray-500 mb-6">Professor: {journey.teacher.name}</p>

          {!journey.enrolled ? (
            <button
              onClick={handleEnroll}
              disabled={isEnrolling}
              className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-70"
            >
              {isEnrolling ? "Inscrevendo..." : "Inscrever-se nesta jornada"}
            </button>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
              <p className="flex items-center">
                <Check className="h-5 w-5 mr-2" />
                Você está inscrito nesta jornada
              </p>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold text-blue-900 mb-4">Aulas</h2>

      {journey.lessons.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Esta jornada ainda não possui aulas.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {journey.lessons.map((lesson) => (
              <li key={lesson.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {lesson.completed ? (
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-blue-900">{lesson.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{lesson.description}</p>
                    </div>
                  </div>

                  {journey.enrolled ? (
                    <Link
                      href={`/dashboard/journey/${journey.id}/lesson/${lesson.id}`}
                      className="inline-flex items-center text-sm font-medium text-blue-900 hover:text-blue-700"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      {lesson.completed ? "Rever aula" : "Iniciar aula"}
                    </Link>
                  ) : (
                    <span className="text-sm text-gray-400">Inscreva-se para acessar</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
