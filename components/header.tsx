"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navigation = [
  { name: "Início", href: "/" },
  { name: "Sobre o Projeto", href: "/sobre" },
  { name: "Palestras", href: "/palestras" },
  { name: "Cursos Técnicos", href: "/cursos-tecnicos" },
  { name: "Área para Jovens", href: "/area-jovens" },
  { name: "Área para Famílias", href: "/area-familias" },
  { name: "Contato", href: "/contato" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 flex items-center justify-between py-4">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Projeto Metanoia</span>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <span className="ml-2 text-xl font-bold text-blue-900">Metanoia</span>
            </div>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Abrir menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-semibold leading-6 ${
                pathname === item.href
                  ? "text-blue-900 border-b-2 border-blue-900"
                  : "text-gray-700 hover:text-blue-900"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link href="/login">Área do Aluno</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setMobileMenuOpen(false)} />

          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">Projeto Metanoia</span>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center text-white font-bold text-xl">
                    M
                  </div>
                  <span className="ml-2 text-xl font-bold text-blue-900">Metanoia</span>
                </div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Fechar menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                        pathname === item.href ? "text-blue-900 bg-blue-50" : "text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="py-6">
                  <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Área do Aluno
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
