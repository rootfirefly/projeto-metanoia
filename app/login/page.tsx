import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-900">Área do Aluno</h1>
          <p className="text-gray-600 mt-2">Faça login para acessar sua conta</p>
        </div>

        <form className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu.email@exemplo.com" required />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="••••••••" required />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-900 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Lembrar-me
              </label>
            </div>

            <div className="text-sm">
              <Link href="#" className="font-medium text-blue-900 hover:text-blue-800">
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">
            Entrar
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Ainda não tem uma conta?{" "}
            <Link href="/register" className="font-medium text-blue-900 hover:text-blue-800">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
