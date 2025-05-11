"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"

// Define the Journey type (or import it if it exists elsewhere)
interface Journey {
  id: number
  title: string
  description: string
  thumbnailUrl: string
  thumbnail_path: string
}

// Atualizar a interface de parâmetros
export default function EditJourneyPage({ params }: { params: { journeyId: string } }) {
  const [journey, setJourney] = useState<Journey | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const journeyId = Number.parseInt(params.journeyId)

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

  return (
    <div>
      {/* Your JSX code here */}
      <h1>Edit Journey</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label htmlFor="thumbnail">Thumbnail:</label>
          <input
            type="file"
            id="thumbnail"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setThumbnail(file)
                setThumbnailPreview(URL.createObjectURL(file))
              }
            }}
          />
          {thumbnailPreview && (
            <img src={thumbnailPreview || "/placeholder.svg"} alt="Thumbnail Preview" style={{ maxWidth: "200px" }} />
          )}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Journey"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  )
}
