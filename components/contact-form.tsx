"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle2 } from "lucide-react"

export default function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Simulação de envio de formulário
    try {
      // Aqui você adicionaria a lógica real de envio do formulário
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Limpar o formulário e mostrar mensagem de sucesso
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
      setIsSubmitted(true)

      // Resetar o estado após 5 segundos
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    } catch (err) {
      setError("Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <h3 className="text-xl font-bold text-blue-900 mb-6">Envie sua mensagem</h3>

      {isSubmitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-green-800 mb-2">Mensagem enviada com sucesso!</h4>
          <p className="text-green-700">Agradecemos seu contato. Retornaremos em breve.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" required />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Como podemos ajudar?"
                rows={4}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar mensagem"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
