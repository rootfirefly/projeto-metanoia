import Link from "next/link"
import { ArrowRight, Calendar, MapPin, BookOpen, Users, Heart, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import TestimonialCard from "@/components/testimonial-card"
import UpcomingEvent from "@/components/upcoming-event"
import CourseCard from "@/components/course-card"
import ContactForm from "@/components/contact-form"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('/diverse-youth-urban-smile.png')",
            backgroundBlendMode: "overlay",
          }}
        ></div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Transformando Mentalidades, Construindo Futuros</h1>
            <p className="text-xl md:text-2xl mb-8">
              O Projeto Metanoia ajuda jovens de periferia a redescobrirem seus sonhos e construírem um futuro melhor
              através de educação, apoio emocional e oportunidades.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Link href="/area-jovens">Área para Jovens</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20"
              >
                <Link href="/sobre">Conheça o Projeto</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre o Projeto - Resumo */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">O que é o Projeto Metanoia?</h2>
              <p className="text-gray-700 mb-4">
                <strong>Metanoia</strong> significa "mudança de mentalidade". Nosso projeto nasceu da necessidade de
                oferecer novas perspectivas para jovens de comunidades periféricas, ajudando-os a transformar sua visão
                de mundo e futuro.
              </p>
              <p className="text-gray-700 mb-6">
                Através de cursos técnicos, palestras motivacionais, apoio emocional e orientação profissional, criamos
                um ambiente onde sonhos podem florescer e se tornar realidade.
              </p>
              <Button asChild className="bg-blue-900 hover:bg-blue-800">
                <Link href="/sobre" className="inline-flex items-center">
                  Saiba mais sobre nós
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="md:w-1/2">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img
                  src="/diverse-youth-workshop.png"
                  alt="Jovens participando de atividades do Projeto Metanoia"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Números e Impacto */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Nosso Impacto</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-none shadow-lg">
              <CardContent className="pt-10">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-4xl font-bold text-blue-900 mb-2">500+</h3>
                <p className="text-gray-600">Jovens impactados</p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardContent className="pt-10">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-4xl font-bold text-blue-900 mb-2">15</h3>
                <p className="text-gray-600">Cursos técnicos</p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardContent className="pt-10">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-4xl font-bold text-blue-900 mb-2">30+</h3>
                <p className="text-gray-600">Palestras realizadas</p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardContent className="pt-10">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-4xl font-bold text-blue-900 mb-2">12</h3>
                <p className="text-gray-600">Comunidades atendidas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Próximas Palestras */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-blue-900">Próximas Palestras</h2>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link href="/palestras">Ver todas as palestras</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UpcomingEvent
              title="Como Construir seu Futuro Profissional"
              date="15 de Maio, 2025"
              time="14:00 - 16:00"
              location="Centro Comunitário Vila Esperança"
              speaker="Dra. Ana Silva"
              image="/professional-woman-podium.png"
            />

            <UpcomingEvent
              title="Empreendedorismo na Comunidade"
              date="22 de Maio, 2025"
              time="18:30 - 20:30"
              location="Escola Municipal Paulo Freire"
              speaker="Carlos Oliveira"
              image="/entrepreneur-teaching-youth.png"
            />

            <UpcomingEvent
              title="Saúde Mental e Autoconhecimento"
              date="29 de Maio, 2025"
              time="15:00 - 17:00"
              location="Centro Cultural Novo Horizonte"
              speaker="Psic. Mariana Costa"
              image="/mental-health-workshop-diverse-group.png"
            />
          </div>
        </div>
      </section>

      {/* Cursos Técnicos */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-blue-900">Cursos Técnicos</h2>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link href="/cursos-tecnicos">Ver todos os cursos</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CourseCard
              title="Desenvolvimento Web"
              description="Aprenda a criar sites e aplicativos web com HTML, CSS e JavaScript."
              duration="3 meses"
              startDate="Junho 2025"
              image="/placeholder.svg?height=200&width=300&query=young%20person%20coding%20on%20computer"
              color="blue"
            />

            <CourseCard
              title="Design Gráfico"
              description="Domine ferramentas de design e crie peças visuais profissionais."
              duration="2 meses"
              startDate="Julho 2025"
              image="/placeholder.svg?height=200&width=300&query=graphic%20design%20student%20working"
              color="orange"
            />

            <CourseCard
              title="Administração e Empreendedorismo"
              description="Aprenda a gerir negócios e desenvolver seu próprio empreendimento."
              duration="4 meses"
              startDate="Maio 2025"
              image="/placeholder.svg?height=200&width=300&query=young%20entrepreneurs%20planning%20business"
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Histórias de Transformação</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="O Projeto Metanoia mudou minha vida. Hoje tenho meu próprio negócio de design e consigo ajudar minha família."
              name="Juliana Santos"
              role="Ex-aluna do curso de Design Gráfico"
              image="/placeholder.svg?height=100&width=100&query=young%20brazilian%20woman%20smiling%20headshot"
            />

            <TestimonialCard
              quote="Eu não tinha perspectiva de futuro até conhecer o projeto. As palestras me motivaram a voltar a estudar e hoje faço faculdade."
              name="Lucas Oliveira"
              role="Participante das palestras motivacionais"
              image="/placeholder.svg?height=100&width=100&query=young%20brazilian%20man%20smiling%20headshot"
            />

            <TestimonialCard
              quote="Como mãe, vi meu filho transformar sua atitude e encontrar um propósito. O apoio emocional que recebemos foi fundamental."
              name="Maria Aparecida"
              role="Mãe de participante"
              image="/placeholder.svg?height=100&width=100&query=middle%20aged%20brazilian%20woman%20headshot"
            />
          </div>
        </div>
      </section>

      {/* Áreas de Atuação */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como Podemos Ajudar</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Users className="mr-3 h-6 w-6" />
                Área para Jovens
              </h3>
              <p className="mb-4">
                Oferecemos conteúdo motivacional, orientação profissional e atividades que ajudam jovens a descobrirem
                seus talentos e potencial.
              </p>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white/20">
                <Link href="/area-jovens">Acessar área para jovens</Link>
              </Button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Heart className="mr-3 h-6 w-6" />
                Área para Famílias
              </h3>
              <p className="mb-4">
                Apoio emocional, orientações sobre como lidar com desafios da adolescência e recursos para fortalecer os
                laços familiares.
              </p>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white/20">
                <Link href="/area-familias">Acessar área para famílias</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Entre em Contato</h2>
              <p className="text-gray-700 mb-6">
                Quer saber mais sobre o Projeto Metanoia? Tem interesse em ser parceiro ou voluntário? Preencha o
                formulário e entraremos em contato com você.
              </p>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Onde Estamos</h3>
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
                  <svg className="h-5 w-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <p className="text-gray-700">contato@projetometanoia.com.br</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Siga-nos</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-blue-900">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-900">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-900">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-900">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Parceiros */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-blue-900 mb-8">Nossos Parceiros</h2>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="w-32 h-16 bg-white rounded-lg shadow-md flex items-center justify-center">
              <img
                src="/placeholder.svg?height=40&width=100&query=company%20logo%201"
                alt="Logo Parceiro 1"
                className="max-h-10"
              />
            </div>
            <div className="w-32 h-16 bg-white rounded-lg shadow-md flex items-center justify-center">
              <img
                src="/placeholder.svg?height=40&width=100&query=company%20logo%202"
                alt="Logo Parceiro 2"
                className="max-h-10"
              />
            </div>
            <div className="w-32 h-16 bg-white rounded-lg shadow-md flex items-center justify-center">
              <img
                src="/placeholder.svg?height=40&width=100&query=company%20logo%203"
                alt="Logo Parceiro 3"
                className="max-h-10"
              />
            </div>
            <div className="w-32 h-16 bg-white rounded-lg shadow-md flex items-center justify-center">
              <img
                src="/placeholder.svg?height=40&width=100&query=company%20logo%204"
                alt="Logo Parceiro 4"
                className="max-h-10"
              />
            </div>
            <div className="w-32 h-16 bg-white rounded-lg shadow-md flex items-center justify-center">
              <img
                src="/placeholder.svg?height=40&width=100&query=company%20logo%205"
                alt="Logo Parceiro 5"
                className="max-h-10"
              />
            </div>
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" className="mt-4">
              <Link href="/contato">Seja um parceiro</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
