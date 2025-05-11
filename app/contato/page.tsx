import ContactForm from "@/components/contact-form"
import { MapPin, Phone, Mail } from "lucide-react"

export default function ContatoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Contato</h1>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/2">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Entre em Contato</h2>
          <p className="text-gray-700 mb-6">
            Quer saber mais sobre o Projeto Metanoia? Tem interesse em ser parceiro ou voluntário? Preencha o formulário
            e entraremos em contato com você.
          </p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Onde Estamos</h3>
            <div className="flex items-start mb-3">
              <MapPin className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
              <div>
                <p className="text-gray-700">Rua Exemplo, 123 - Bairro</p>
                <p className="text-gray-700">São Paulo - SP</p>
              </div>
            </div>
            <div className="flex items-center mb-3">
              <Phone className="h-5 w-5 text-orange-500 mr-2" />
              <p className="text-gray-700">(11) 98765-4321</p>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-orange-500 mr-2" />
              <p className="text-gray-700">contato@projetometanoia.com.br</p>
            </div>
          </div>
        </div>

        <div className="md:w-1/2">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
