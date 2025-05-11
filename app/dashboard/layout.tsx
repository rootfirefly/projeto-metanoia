"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { User, LogOut, BookOpen, Users, Settings, Menu, X } from "lucide-react"

interface DashboardUser {
  id: number
  name: string
  email: string
  role: string
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me")

        if (!response.ok) {
          throw new Error("Não autenticado")
        }

        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        console.error("Erro ao obter usuário:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [router])

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  const isTeacher = user?.role === "teacher" || user?.role === "admin"
  const isAdmin = user?.role === "admin"

  const navigation = [
    { name: "Meu Painel", href: "/dashboard", icon: BookOpen },
    ...(isTeacher ? [{ name: "Minhas Jornadas", href: "/dashboard/teacher/journeys", icon: BookOpen }] : []),
    ...(isAdmin ? [{ name: "Usuários", href: "/dashboard/admin/users", icon: Users }] : []),
    { name: "Configurações", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md p-4 flex items-center justify-between">
        <span className="text-xl font-bold text-blue-900">Metanoia</span>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-blue-900 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <span className="text-xl font-bold text-white">Projeto Metanoia</span>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href ? "bg-blue-800 text-white" : "text-blue-100 hover:bg-blue-800"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="px-2 space-y-1">
            <div className="flex items-center px-2 py-2 text-sm font-medium text-blue-100">
              <User className="mr-3 h-5 w-5" aria-hidden="true" />
              <span className="truncate">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-blue-100 hover:bg-blue-800 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-blue-900">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Fechar menu</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <span className="text-xl font-bold text-white">Projeto Metanoia</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      pathname === item.href ? "bg-blue-800 text-white" : "text-blue-100 hover:bg-blue-800"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-base font-medium text-white">{user?.name}</p>
                  <p className="text-sm font-medium text-blue-200">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="px-2 space-y-1 pb-4">
              <button
                onClick={handleLogout}
                className="w-full text-blue-100 hover:bg-blue-800 group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <LogOut className="mr-3 h-6 w-6" aria-hidden="true" />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-8 pt-16 lg:pt-0">
          <div className="mt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
