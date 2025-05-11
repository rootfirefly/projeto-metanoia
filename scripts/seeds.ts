import { Pool } from "pg"
import bcrypt from "bcryptjs"
import fs from "fs"
import path from "path"
import { STORAGE_PATH } from "../lib/config"

// Configuração do banco de dados
const pool = new Pool({
  host: process.env.DB_HOST || "185.250.37.34",
  port: Number.parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "metanoia",
  user: process.env.DB_USER || "metanoia_user",
  password: process.env.DB_PASSWORD || "Ap@lo20060#Met@noi@",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// Função para executar queries
async function query(text: string, params?: any[]) {
  try {
    const res = await pool.query(text, params)
    return res
  } catch (error) {
    console.error("Erro ao executar query:", error)
    throw error
  }
}

// Função para criar hash de senha
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Função para garantir que os diretórios existam
function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// Função principal para popular o banco de dados
async function seed() {
  console.log("Iniciando seed do banco de dados...")

  try {
    // Verificar se o diretório de armazenamento existe
    ensureDirectoryExists(STORAGE_PATH)
    console.log(`Diretório de armazenamento verificado: ${STORAGE_PATH}`)

    // Limpar tabelas existentes (em ordem reversa para respeitar as chaves estrangeiras)
    console.log("Limpando tabelas existentes...")
    await query("DELETE FROM progress")
    await query("DELETE FROM enrollments")
    await query("DELETE FROM materials")
    await query("DELETE FROM lessons")
    await query("DELETE FROM journeys")
    await query("DELETE FROM users")

    // Criar usuários
    console.log("Criando usuários...")
    const adminPassword = await hashPassword("admin123")
    const teacherPassword = await hashPassword("teacher123")
    const studentPassword = await hashPassword("student123")

    // Inserir admin
    const adminResult = await query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
      ["Administrador", "admin@metanoia.com", adminPassword, "admin"],
    )
    const adminId = adminResult.rows[0].id
    console.log(`Admin criado com ID: ${adminId}`)

    // Inserir professor
    const teacherResult = await query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
      ["Professor Exemplo", "professor@metanoia.com", teacherPassword, "teacher"],
    )
    const teacherId = teacherResult.rows[0].id
    console.log(`Professor criado com ID: ${teacherId}`)

    // Inserir alunos
    const student1Result = await query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
      ["Aluno Um", "aluno1@metanoia.com", studentPassword, "student"],
    )
    const student1Id = student1Result.rows[0].id

    const student2Result = await query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
      ["Aluno Dois", "aluno2@metanoia.com", studentPassword, "student"],
    )
    const student2Id = student2Result.rows[0].id
    console.log(`Alunos criados com IDs: ${student1Id}, ${student2Id}`)

    // Criar jornadas
    console.log("Criando jornadas...")
    const journey1Result = await query(
      `INSERT INTO journeys (title, description, teacher_id, is_published) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        "Introdução à Meditação",
        "Uma jornada para iniciantes que desejam aprender técnicas básicas de meditação e mindfulness.",
        teacherId,
        true,
      ],
    )
    const journey1Id = journey1Result.rows[0].id

    const journey2Result = await query(
      `INSERT INTO journeys (title, description, teacher_id, is_published) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        "Desenvolvimento Pessoal",
        "Aprenda técnicas e práticas para o autoconhecimento e crescimento pessoal.",
        teacherId,
        true,
      ],
    )
    const journey2Id = journey2Result.rows[0].id

    const journey3Result = await query(
      `INSERT INTO journeys (title, description, teacher_id, is_published) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        "Curso Avançado de Metanoia",
        "Um curso aprofundado sobre transformação pessoal e mudança de mentalidade.",
        teacherId,
        false, // Não publicado ainda
      ],
    )
    const journey3Id = journey3Result.rows[0].id
    console.log(`Jornadas criadas com IDs: ${journey1Id}, ${journey2Id}, ${journey3Id}`)

    // Criar diretórios para as jornadas
    ensureDirectoryExists(path.join(STORAGE_PATH, `jornada${journey1Id}`))
    ensureDirectoryExists(path.join(STORAGE_PATH, `jornada${journey2Id}`))
    ensureDirectoryExists(path.join(STORAGE_PATH, `jornada${journey3Id}`))

    // Criar aulas para a primeira jornada
    console.log("Criando aulas para a primeira jornada...")
    const lesson1_1Result = await query(
      `INSERT INTO lessons (journey_id, title, description, order_number) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [journey1Id, "O que é Meditação?", "Uma introdução aos conceitos básicos de meditação e seus benefícios.", 1],
    )
    const lesson1_1Id = lesson1_1Result.rows[0].id

    const lesson1_2Result = await query(
      `INSERT INTO lessons (journey_id, title, description, order_number) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        journey1Id,
        "Técnicas de Respiração",
        "Aprenda diferentes técnicas de respiração para acalmar a mente e relaxar o corpo.",
        2,
      ],
    )
    const lesson1_2Id = lesson1_2Result.rows[0].id

    const lesson1_3Result = await query(
      `INSERT INTO lessons (journey_id, title, description, order_number) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [journey1Id, "Meditação Guiada", "Experimente uma meditação guiada para iniciantes.", 3],
    )
    const lesson1_3Id = lesson1_3Result.rows[0].id
    console.log(`Aulas criadas para a primeira jornada: ${lesson1_1Id}, ${lesson1_2Id}, ${lesson1_3Id}`)

    // Criar aulas para a segunda jornada
    console.log("Criando aulas para a segunda jornada...")
    const lesson2_1Result = await query(
      `INSERT INTO lessons (journey_id, title, description, order_number) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [journey2Id, "Autoconhecimento", "Ferramentas e práticas para desenvolver o autoconhecimento.", 1],
    )
    const lesson2_1Id = lesson2_1Result.rows[0].id

    const lesson2_2Result = await query(
      `INSERT INTO lessons (journey_id, title, description, order_number) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        journey2Id,
        "Definindo Metas e Objetivos",
        "Como estabelecer metas claras e alcançáveis para seu desenvolvimento pessoal.",
        2,
      ],
    )
    const lesson2_2Id = lesson2_2Result.rows[0].id
    console.log(`Aulas criadas para a segunda jornada: ${lesson2_1Id}, ${lesson2_2Id}`)

    // Criar diretórios para as aulas
    ensureDirectoryExists(path.join(STORAGE_PATH, `jornada${journey1Id}`, `aula${lesson1_1Id}`))
    ensureDirectoryExists(path.join(STORAGE_PATH, `jornada${journey1Id}`, `aula${lesson1_2Id}`))
    ensureDirectoryExists(path.join(STORAGE_PATH, `jornada${journey1Id}`, `aula${lesson1_3Id}`))
    ensureDirectoryExists(path.join(STORAGE_PATH, `jornada${journey2Id}`, `aula${lesson2_1Id}`))
    ensureDirectoryExists(path.join(STORAGE_PATH, `jornada${journey2Id}`, `aula${lesson2_2Id}`))

    // Adicionar materiais de apoio
    console.log("Adicionando materiais de apoio...")
    await query(
      `INSERT INTO materials (lesson_id, title, type, content) 
       VALUES ($1, $2, $3, $4)`,
      [lesson1_1Id, "Guia de Meditação para Iniciantes", "link", "https://www.exemplo.com/guia-meditacao"],
    )

    await query(
      `INSERT INTO materials (lesson_id, title, type, content) 
       VALUES ($1, $2, $3, $4)`,
      [lesson1_2Id, "Técnicas de Respiração - PDF", "link", "https://www.exemplo.com/tecnicas-respiracao"],
    )

    await query(
      `INSERT INTO materials (lesson_id, title, type, content) 
       VALUES ($1, $2, $3, $4)`,
      [lesson2_1Id, "Questionário de Autoconhecimento", "link", "https://www.exemplo.com/questionario"],
    )
    console.log("Materiais de apoio adicionados")

    // Criar inscrições
    console.log("Criando inscrições...")
    await query("INSERT INTO enrollments (user_id, journey_id) VALUES ($1, $2)", [student1Id, journey1Id])

    await query("INSERT INTO enrollments (user_id, journey_id) VALUES ($1, $2)", [student1Id, journey2Id])

    await query("INSERT INTO enrollments (user_id, journey_id) VALUES ($1, $2)", [student2Id, journey1Id])
    console.log("Inscrições criadas")

    // Adicionar progresso
    console.log("Adicionando progresso...")
    await query("INSERT INTO progress (user_id, lesson_id, completed, last_watched_position) VALUES ($1, $2, $3, $4)", [
      student1Id,
      lesson1_1Id,
      true,
      300,
    ])

    await query("INSERT INTO progress (user_id, lesson_id, completed, last_watched_position) VALUES ($1, $2, $3, $4)", [
      student1Id,
      lesson1_2Id,
      false,
      120,
    ])

    await query("INSERT INTO progress (user_id, lesson_id, completed, last_watched_position) VALUES ($1, $2, $3, $4)", [
      student2Id,
      lesson1_1Id,
      true,
      300,
    ])
    console.log("Progresso adicionado")

    console.log("Seed concluído com sucesso!")
  } catch (error) {
    console.error("Erro durante o seed:", error)
  } finally {
    // Fechar a conexão com o banco de dados
    await pool.end()
  }
}

// Executar o seed
seed()
  .then(() => {
    console.log("Script de seed finalizado.")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Erro fatal durante o seed:", error)
    process.exit(1)
  })
