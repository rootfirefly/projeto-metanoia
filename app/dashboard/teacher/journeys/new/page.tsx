"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, X } from "lucide-react"

export default function NewJourneyPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()

  function handleThumbnailChange(e: ChangeEvent<HTMLInputElement>) {
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
      setThumbnailPreview(URL.createObjectURL(file))
      setError("")
    }
  }

  function handleRemoveThumbnail() {
    setThumbnail(null)
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview)
      setThumbnailPreview(null)
    }
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

      const response = await fetch("/api/teacher/journeys", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Erro ao criar jornada")
      }

      const data = await response.json()

      // Redirecionar para a página de edição da jornada
      router.push(`/dashboard/teacher/journeys/${data.journeyId}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/teacher/journeys" className="inline-flex items-center text-blue-900 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para minhas jornadas
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">Nova Jornada</h1>

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
              <Link
                href="/dashboard/teacher/journeys"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors mr-2"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? "Criando..." : "Criar Jornada"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
