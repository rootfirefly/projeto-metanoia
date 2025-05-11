"use client"

import type React from "react"

import { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, X, Plus, Edit, Trash, MoveUp, MoveDown } from "lucide-react"

interface Lesson {
  id: number
  title: string
  description: string
  order_number: number
  video_path: string | null
}

interface Journey {
  id: number
  title: string
  description: string
  thumbnail_path: string | null
  is_published: boolean
  lessons: Lesson[]
}

export default function EditJourneyPage({ params }: { params: { id: string } }) {
  const [journey, setJourney] = useState<Journey | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const journeyId = Number.parseInt(params.id)

  useEffect(() => {
    async function fetchJourney() {
      try {
        const response = await fetch(`/api/teacher/journeys/${journeyId}`)

        if (!response.ok) {
          throw new Error("Erro ao buscar jornada")
        }

        const data = await response.json()
        setJourney(data.journey)
        setTitle(data.journey.title)
        setDescription(data.journey.description || "")

        if (data.journey.thumbnail_path) {
          setThumbnailPreview(`/api/files/${data.journey.thumbnail_path}`)
        }
      } catch (error) {
        console.error("Erro ao buscar jornada:", error)
        setError("Erro ao carregar dados da jornada")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJourney()
  }, [journeyId])

  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Verificar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        setError("O arquivo deve ser uma imagem (JPEG, PNG, etc.)")
        return
      }

      // Verificar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("A imagem deve ter no máximo 5MB")
        return
      }

      setThumbnail(file)

      // Revogar URL anterior se existir
      if (thumbnailPreview && !thumbnailPreview.startsWith("/api/")) {
        URL.revokeObjectURL(thumbnailPreview)
      }

      setThumbnailPreview(URL.createObjectURL(file))
      setError("")
    }
  }

  function handleRemoveThumbnail() {
    setThumbnail(null)

    // Revogar URL se for um objeto URL
    if (thumbnailPreview && !thumbnailPreview.startsWith("/api/")) {
      URL.revokeObjectURL(thumbnailPreview)
    }

    setThumbnailPreview(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("O título é obrigatório")
      return
    }

    setIsSubmitting(true)

    try {
      // Criar FormData para enviar os dados e o arquivo
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)

      if (thumbnail) {
        formData.append("thumbnail", thumbnail)
      }

      // Se o thumbnail foi removido
      if (!thumbnailPreview && journey?.thumbnail_path) {
        formData.append("removeThumbnail", "true")
      }

      const response = await fetch(`/api/teacher/journeys/${journeyId}`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Erro ao atualizar jornada")
      }

      // Atualizar dados locais
      setJourney((prev) => (prev ? { ...prev, title, description } : null))

      alert("Jornada atualizada com sucesso!")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteLesson(lessonId: number) {
    if (!confirm("Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.")) {
      return
    }

    try {
      const response = await fetch(`/api/teacher/journeys/${journeyId}/lessons/${lessonId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir aula")
      }

      // Atualizar lista de aulas
      setJourney((prev) =>
        prev
          ? {
              ...prev,
              lessons: prev.lessons.filter((lesson) => lesson.id !== lessonId),
            }
          : null,
      )
    } catch (error) {
      console.error("Erro ao excluir aula:", error)
      alert("Erro ao excluir aula. Tente novamente.")
    }
  }

  async function handleMoveLesson(lessonId: number, direction: "up" | "down") {
    if (!journey) return

    try {
      const response = await fetch(`/api/teacher/journeys/${journeyId}/lessons/${lessonId}/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction }),
      })

      if (!response.ok) {
        throw new Error("Erro ao mover aula")
      }

      // Recarregar dados da jornada para obter a nova ordem
      const journeyResponse = await fetch(`/api/teacher/journeys/${journeyId}`)
      const data = await journeyResponse.json()
      setJourney(data.journey)
    } catch (error) {
      console.error("Erro ao mover aula:", error)
      alert("Erro ao mover aula. Tente novamente.")
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
        <Link href="/dashboard/teacher/journeys" className="text-blue-900 hover:text-blue-700 mt-4 inline-block">
          Voltar para minhas jornadas
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/teacher/journeys" className="inline-flex items-center text-blue-900 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para minhas jornadas
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">Editar Jornada</h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Digite o título da jornada"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Descreva o conteúdo e objetivos desta jornada"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagem de capa</label>

              {thumbnailPreview ? (
                <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={thumbnailPreview || "/placeholder.svg"}
                    alt="Prévia"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <div className="flex justify-center">
                    <Upload className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Clique para selecionar ou arraste uma imagem</p>
                  <p className="mt-1 text-xs text-gray-400">PNG, JPG, GIF até 5MB</p>
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-900">Aulas</h2>
        <Link
          href={`/dashboard/teacher/journeys/${journeyId}/lessons/new`}
          className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Nova Aula
        </Link>
      </div>

      {journey.lessons.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Esta jornada ainda não possui aulas.</p>
          <Link
            href={`/dashboard/teacher/journeys/${journeyId}/lessons/new`}
            className="text-blue-900 hover:text-blue-700 mt-4 inline-block"
          >
            Adicionar primeira aula
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {journey.lessons.map((lesson, index) => (
              <li key={lesson.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-medium">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-blue-900">{lesson.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{lesson.description}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {index > 0 && (
                      <button
                        onClick={() => handleMoveLesson(lesson.id, "up")}
                        className="text-gray-500 hover:text-gray-700"
                        title="Mover para cima"
                      >
                        <MoveUp className="h-5 w-5" />
                      </button>
                    )}

                    {index < journey.lessons.length - 1 && (
                      <button
                        onClick={() => handleMoveLesson(lesson.id, "down")}
                        className="text-gray-500 hover:text-gray-700"
                        title="Mover para baixo"
                      >
                        <MoveDown className="h-5 w-5" />
                      </button>
                    )}

                    <Link
                      href={`/dashboard/teacher/journeys/${journeyId}/lessons/${lesson.id}`}
                      className="text-blue-900 hover:text-blue-700"
                      title="Editar"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>

                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Excluir"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
