export const STORAGE_PATH = "/var/www/metanoia/storage"
export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
export const ALLOWED_FILE_TYPES = {
  video: ["video/mp4", "video/webm", "video/ogg"],
  document: ["application/pdf"],
}
export const JWT_SECRET = process.env.JWT_SECRET || "metanoia-secret-key-change-in-production"
export const JWT_EXPIRES_IN = "7d"
