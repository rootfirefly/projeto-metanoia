"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, X, Plus, Trash } from "lucide-react"

interface Material {
  id: string
  title: string
  type: "pdf" | "link"
  content: string | File
}

// Verificar se este arquivo está usando o parâmetro correto
// Deve usar [journeyId]
export default function NewLessonPage({ params }: { params: { journeyId: string } }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [video, setVideo] = useState<File | null>(null)
  const [videoName, setVideoName] = useState("")
  const [materials, setMaterials] = useState<Material[]>([])
  const [materialTitle, setMaterialTitle] = useState("")
  const [materialType, setMaterialType] = useState<"pdf" | "link">("pdf")
  const [materialContent, setMaterialContent] = useState<string | File>("")
  const [materialFileName, setMaterialFileName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const journeyId = Number.parseInt(params.journeyId)

  function handleVideoChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Verificar tipo de arquivo
      if (!file.type.startsWith("video/")) {
        setError("O arquivo deve ser um vídeo (MP4, WEBM, etc.)")
        return
      }

      // Verificar tamanho do arquivo (máximo 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setError("O vídeo deve ter no máximo 100MB")
        return
      }

      setVideo(file)
      setVideoName(file.name)
      setError("")
    }
  }

  function handleRemoveVideo() {
    setVideo(null)
    setVideoName("")
  }

  function handleMaterialFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Verificar tipo de arquivo
      if (file.type !== "application/pdf") {
        setError("O arquivo deve ser um PDF")
        return
      }

      // Verificar tamanho do arquivo (máximo 20MB)
      if (file.size > 20 * 1024 * 1024) {
        setError("O PDF deve ter no máximo 20MB")
        return
      }

      setMaterialContent(file)
      setMaterialFileName(file.name)
      setError("")
    }
  }

  function handleAddMaterial() {
    if (!materialTitle.trim()) {
      setError("O título do material é obrigatório")
      return
    }

    if (materialType === "link" && typeof materialContent === "string" && !materialContent.trim()) {
      setError("O link é obrigatório")
      return
    }

    if (materialType === "pdf" && !(materialContent instanceof File)) {
      setError("O arquivo PDF é obrigatório")
      return
    }

    // Adicionar material à lista
    const newMaterial: Material = {
      id: Date.now().toString(),
      title: materialTitle,
      type: materialType,
      content: materialContent,
    }

    setMaterials([...materials, newMaterial])

    // Limpar campos
    setMaterialTitle("")
    setMaterialType("pdf")
    setMaterialContent("")
    setMaterialFileName("")
    setError("")
  }

  function handleRemoveMaterial(id: string) {
    setMaterials(materials.filter((material) => material.id !== id))
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
      // Criar FormData para enviar os dados e os arquivos
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)

      if (video) {
        formData.append("video", video)
      }

      // Adicionar materiais
      formData.append(
        "materials",
        JSON.stringify(
          materials.map((m) => ({
            id: m.id,
            title: m.title,
            type: m.type,
            // Para links, incluir o conteúdo; para arquivos, apenas um placeholder
            content: m.type === "link" ? m.content : null,
          })),
        ),
      )

      // Adicionar arquivos de materiais separadamente
      materials.forEach((material) => {
        if (material.type === "pdf" && material.content instanceof File) {
          formData.append(`material_${material.id}`, material.content)
        }
      })

      const response = await fetch(`/api/teacher/journeys/${journeyId}/lessons`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Erro ao criar aula")
      }

      // Redirecionar para a página de edição da jornada
      router.push(`/dashboard/teacher/journeys/${journeyId}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/dashboard/teacher/journeys/${journeyId}`}
          className="inline-flex items-center text-blue-900 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para a jornada
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">Nova Aula</h1>

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
                placeholder="Digite o título da aula"
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
                placeholder="Descreva o conteúdo desta aula"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Vídeo da aula</label>

              {videoName ? (
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                  <span className="text-sm text-gray-700">{videoName}</span>
                  <button type="button" onClick={handleRemoveVideo} className="text-red-600 hover:text-red-900">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <div className="flex justify-center">
                    <Upload className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Clique para selecionar ou arraste um vídeo</p>
                  <p className="mt-1 text-xs text-gray-400">MP4, WEBM até 100MB</p>
                  <input
                    type="file"
                    id="video"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-blue-900 mb-4">Materiais de Apoio</h3>

              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="materialTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      id="materialTitle"
                      value={materialTitle}
                      onChange={(e) => setMaterialTitle(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Título do material"
                    />
                  </div>

                  <div>
                    <label htmlFor="materialType" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <select
                      id="materialType"
                      value={materialType}
                      onChange={(e) => setMaterialType(e.target.value as "pdf" | "link")}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="pdf">Arquivo PDF</option>
                      <option value="link">Link Externo</option>
                    </select>
                  </div>

                  <div>
                    {materialType === "link" ? (
                      <>
                        <label htmlFor="materialLink" className="block text-sm font-medium text-gray-700 mb-1">
                          Link
                        </label>
                        <input
                          type="url"
                          id="materialLink"
                          value={typeof materialContent === "string" ? materialContent : ""}
                          onChange={(e) => setMaterialContent(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="https://exemplo.com/material"
                        />
                      </>
                    ) : (
                      <>
                        <label htmlFor="materialFile" className="block text-sm font-medium text-gray-700 mb-1">
                          Arquivo PDF
                        </label>
                        <div className="flex items-center">
                          <label
                            htmlFor="materialFile"
                            className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Escolher arquivo
                          </label>
                          <input
                            type="file"
                            id="materialFile"
                            accept="application/pdf"
                            onChange={handleMaterialFileChange}
                            className="sr-only"
                          />
                          <span className="ml-2 text-sm text-gray-500 truncate max-w-xs">
                            {materialFileName || "Nenhum arquivo selecionado"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="inline-flex items-center text-sm font-medium text-blue-900 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Material
                </button>
              </div>

              {materials.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {materials.map((material) => (
                      <li key={material.id} className="p-4 flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{material.title}</h4>
                          <p className="text-xs text-gray-500">
                            {material.type === "pdf"
                              ? `PDF: ${material.content instanceof File ? material.content.name : "Arquivo"}`
                              : `Link: ${material.content}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(material.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                href={`/dashboard/teacher/journeys/${journeyId}`}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors mr-2"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? "Criando..." : "Criar Aula"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
