"use client"

import { useState, useEffect } from "react"

interface Journey {
  id: string
  title: string
  description: string
  enrolled?: boolean
}

interface Props {
  params: { journeyId: string }
}

export default function JourneyPage({ params }: Props) {
  const { journeyId } = params
  const [journey, setJourney] = useState<Journey | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolling, setIsEnrolling] = useState(false)

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
    return <div>Carregando...</div>
  }

  if (!journey) {
    return <div>Jornada não encontrada.</div>
  }

  return (
    <div>
      <h1>{journey.title}</h1>
      <p>{journey.description}</p>
      {journey.enrolled ? (
        <p>Inscrito!</p>
      ) : (
        <button onClick={handleEnroll} disabled={isEnrolling}>
          {isEnrolling ? "Inscrevendo..." : "Inscrever-se"}
        </button>
      )}
    </div>
  )
}
