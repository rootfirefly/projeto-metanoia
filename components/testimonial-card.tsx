import { Card, CardContent } from "@/components/ui/card"

interface TestimonialCardProps {
  quote: string
  name: string
  role: string
  image: string
}

export default function TestimonialCard({ quote, name, role, image }: TestimonialCardProps) {
  return (
    <Card className="border-none shadow-lg">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="absolute -top-2 -left-2 text-5xl text-orange-500 opacity-50">"</div>
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>
          <p className="text-gray-700 italic mb-4">{quote}</p>
          <div>
            <h4 className="font-semibold text-blue-900">{name}</h4>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
