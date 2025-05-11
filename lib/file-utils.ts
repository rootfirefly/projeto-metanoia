import fs from "fs"
import path from "path"
import { STORAGE_PATH, ALLOWED_FILE_TYPES } from "./config"

// Garantir que os diretórios existam
export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// Gerar um nome de arquivo único
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = path.extname(originalFilename)
  const sanitizedName = path
    .basename(originalFilename, extension)
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()

  return `${sanitizedName}-${timestamp}-${randomString}${extension}`
}

// Verificar se o tipo de arquivo é permitido
export function isAllowedFileType(mimetype: string, fileType: "video" | "document"): boolean {
  return ALLOWED_FILE_TYPES[fileType].includes(mimetype)
}

// Salvar arquivo no armazenamento
export async function saveFile(
  file: File,
  journeyId: number,
  lessonId: number,
  fileType: "video" | "document",
): Promise<string> {
  // Verificar tipo de arquivo
  if (!isAllowedFileType(file.type, fileType)) {
    throw new Error(`Tipo de arquivo não permitido: ${file.type}`)
  }

  // Criar diretório para a jornada e aula
  const dirPath = path.join(STORAGE_PATH, `jornada${journeyId}`, `aula${lessonId}`)
  ensureDirectoryExists(dirPath)

  // Gerar nome de arquivo único
  const filename = generateUniqueFilename(file.name)
  const filePath = path.join(dirPath, filename)

  // Ler o arquivo como buffer
  const buffer = Buffer.from(await file.arrayBuffer())

  // Salvar o arquivo
  fs.writeFileSync(filePath, buffer)

  // Retornar o caminho relativo do arquivo
  return path.join(`jornada${journeyId}`, `aula${lessonId}`, filename)
}

// Excluir arquivo do armazenamento
export function deleteFile(filePath: string): void {
  const fullPath = path.join(STORAGE_PATH, filePath)

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
  }
}

// Obter URL para acessar o arquivo
export function getFileUrl(filePath: string): string {
  return `/api/files/${encodeURIComponent(filePath)}`
}
