import type { NextRequest } from "next/server"
import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { query } from "./db"
import { JWT_SECRET, JWT_EXPIRES_IN } from "./config"

export type UserRole = "admin" | "teacher" | "student"

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createToken(user: User): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET)

  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret)

  return token
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as User
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  const token = request.cookies.get("token")?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const result = await query("SELECT id, name, email, role FROM users WHERE id = $1", [id])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as User
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin"
}

export function isTeacher(user: User | null): boolean {
  return user?.role === "admin" || user?.role === "teacher"
}
