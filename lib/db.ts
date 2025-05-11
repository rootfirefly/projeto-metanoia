import { Pool } from "pg"

// Configuração para evitar o uso de módulos específicos do Cloudflare
// @ts-ignore
import pg from "pg"
// Desabilitar o uso de módulos nativos do Cloudflare
if (pg.native) {
  delete pg.native
}

const pool = new Pool({
  host: process.env.DB_HOST || "185.250.37.34",
  port: Number.parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "metanoia",
  user: process.env.DB_USER || "metanoia_user",
  password: process.env.DB_PASSWORD || "Ap@lo20060#Met@noi@",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("Executed query", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Error executing query", error)
    throw error
  }
}

export default pool
