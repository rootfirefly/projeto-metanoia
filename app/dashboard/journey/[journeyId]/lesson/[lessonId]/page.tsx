"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Download, ExternalLink, CheckCircle } from "lucide-react"

interface Material {
  id: number
  title: string
  type: "pdf" | "link"
  content: string
}

interface Lesson {
  id: number
  title: string
  description: string
  video_path: string | null
  materials: Material[]
}

interface LessonPageProps {
  params: {
    journeyId: string
    lessonId: string
  }
}

export default function LessonPage({ params }: LessonPageProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleting, setIsCompleting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const journeyId = Number.parseInt(params.journeyId)
  const lessonId = Number.parseInt(params.lessonId)

  useEffect(() => {
    async function fetchLesson() {
      try {
        const response = await fetch(`/api/journeys/${journeyId}/lessons/${lessonId}`)

        if (!response.ok) {
          throw new Error("Erro ao buscar aula")
        }

        const data = await response.json()
        setLesson(data.lesson)
        setIsCompleted(data.completed || false)

        // Se houver uma posição salva, definir o tempo do vídeo
        if (data.lastWatchedPosition && videoRef.current) {
          videoRef.current.currentTime = data.lastWatchedPosition
        }
      } catch (error) {
        console.error("Erro ao buscar aula:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLesson()

    // Salvar o progresso do vídeo a cada 30 segundos
    const saveInterval = setInterval(() => {
      saveVideoProgress()
    }, 30000)

    return () => {
      clearInterval(saveInterval)
      saveVideoProgress()
    }
  }, [journeyId, lessonId])

  async function saveVideoProgress() {
    if (!videoRef.current) return

    const currentTime = Math.floor(videoRef.current.currentTime)

    if (currentTime > 0 && currentTime !== videoProgress) {
      setVideoProgress(currentTime)

      try {
        await fetch(`/api/journeys/${journeyId}/lessons/${lessonId}/progress`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ position: currentTime }),
        })
      } catch (error) {
        console.error("Erro ao salvar progresso:", error)
      }
    }
  }

  async function handleCompleteLesson() {
    setIsCompleting(true)

    try {
      const response = await fetch(`/api/journeys/${journeyId}/lessons/${lessonId}/complete`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Erro ao marcar aula como concluída")
      }

      setIsCompleted(true)
    } catch (error) {
      console.error("Erro ao completar aula:", error)
      alert("Erro ao marcar aula como concluída. Tente novamente.")
    } finally {
      setIsCompleting(false)
    }
  }

  function handleVideoEnded() {
    if (!isCompleted) {
      handleCompleteLesson()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Aula não encontrada.</p>
        <Link href={`/dashboard/journey/${journeyId}`} className="text-blue-900 hover:text-blue-700 mt-4 inline-block">
          Voltar para a jornada
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/dashboard/journey/${journeyId}`}
          className="inline-flex items-center text-blue-900 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para a jornada
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">{lesson.title}</h1>
          <p className="text-gray-600 mb-6">{lesson.description}</p>

          {lesson.video_path ? (
            <div className="aspect-w-16 aspect-h-9 mb-6">
              <video
                ref={videoRef}
                src={`/api/files/${lesson.video_path}`}
                controls
                className="w-full rounded-lg"
                onEnded={handleVideoEnded}
              />
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-6 mb-6 text-center">
              <p className="text-gray-600">Esta aula não possui vídeo.</p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              {isCompleted ? (
                <div className="inline-flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-1" />
                  <span>Aula concluída</span>
                </div>
              ) : (
                <button
                  onClick={handleCompleteLesson}
                  disabled={isCompleting}
                  className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-70"
                >
                  {isCompleting ? "Marcando..." : "Marcar como concluída"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-blue-900 mb-4">Materiais de Apoio</h2>

      {lesson.materials.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Esta aula não possui materiais de apoio.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {lesson.materials.map((material) => (
              <li key={material.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-blue-900">{material.title}</h3>
                    <p className="text-sm text-gray-500">
                      {material.type === "pdf" ? "Documento PDF" : "Link Externo"}
                    </p>
                  </div>

                  {material.type === "pdf" ? (
                    <a
                      href={`/api/files/${material.content}`}
                      download
                      className="inline-flex items-center text-sm font-medium text-blue-900 hover:text-blue-700"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </a>
                  ) : (
                    <a
                      href={material.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-blue-900 hover:text-blue-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Acessar
                    </a>
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
