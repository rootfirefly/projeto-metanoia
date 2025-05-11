"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit, Trash, Eye, EyeOff } from "lucide-react"

interface Journey {
  id: number
  title: string
  description: string
  thumbnail_path: string | null
  is_published: boolean
}

export default function TeacherJourneysPage() {
  const [journeys, setJourneys] = useState<Journey[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchJourneys() {
      try {
        const response = await fetch("/api/teacher/journeys")

        if (!response.ok) {
          throw new Error("Erro ao buscar jornadas")
        }

        const data = await response.json()
        setJourneys(data.journeys || [])
      } catch (error) {
        console.error("Erro ao buscar jornadas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJourneys()
  }, [])

  async function handleTogglePublish(journeyId: number, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/teacher/journeys/${journeyId}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error("Erro ao alterar status da jornada")
      }

      // Atualizar o estado local
      setJourneys((prevJourneys) =>
        prevJourneys.map((journey) =>
          journey.id === journeyId ? { ...journey, is_published: !currentStatus } : journey,
        ),
      )
    } catch (error) {
      console.error("Erro ao alterar status:", error)
      alert("Erro ao alterar status da jornada. Tente novamente.")
    }
  }

  async function handleDeleteJourney(journeyId: number) {
    if (!confirm("Tem certeza que deseja excluir esta jornada? Esta ação não pode ser desfeita.")) {
      return
    }

    try {
      const response = await fetch(`/api/teacher/journeys/${journeyId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir jornada")
      }

      // Remover a jornada do estado local
      setJourneys((prevJourneys) => prevJourneys.filter((journey) => journey.id !== journeyId))
    } catch (error) {
      console.error("Erro ao excluir jornada:", error)
      alert("Erro ao excluir jornada. Tente novamente.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Minhas Jornadas</h1>
        <Link
          href="/dashboard/teacher/journeys/new"
          className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Nova Jornada
        </Link>
      </div>

      {journeys.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Você ainda não criou nenhuma jornada.</p>
          <Link href="/dashboard/teacher/journeys/new" className="text-blue-900 hover:text-blue-700 mt-4 inline-block">
            Criar minha primeira jornada
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jornada
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {journeys.map((journey) => (
                <tr key={journey.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full overflow-hidden">
                        {journey.thumbnail_path ? (
                          <img
                            src={`/api/files/${journey.thumbnail_path}`}
                            alt={journey.title}
                            className="h-10 w-10 object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 flex items-center justify-center bg-blue-900 text-white text-xs">
                            {journey.title.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{journey.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{journey.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        journey.is_published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {journey.is_published ? "Publicada" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleTogglePublish(journey.id, journey.is_published)}
                        className="text-blue-900 hover:text-blue-700"
                        title={journey.is_published ? "Despublicar" : "Publicar"}
                      >
                        {journey.is_published ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      <Link
                        href={`/dashboard/teacher/journeys/${journey.id}`}
                        className="text-blue-900 hover:text-blue-700"
                        title="Editar"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteJourney(journey.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
