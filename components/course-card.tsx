import { Clock, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CourseCardProps {
  title: string
  description: string
  duration: string
  startDate: string
  image: string
  color: "blue" | "green" | "orange" | "purple"
}

export default function CourseCard({
  title,
  description,
  duration,
  startDate,
  image,
  color = "blue",
}: CourseCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-700",
    green: "from-green-500 to-green-700",
    orange: "from-orange-500 to-orange-700",
    purple: "from-purple-500 to-purple-700",
  }

  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
      <div className={`h-2 bg-gradient-to-r ${colorClasses[color]}`}></div>
      <div className="h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardContent className="p-5">
        <h3 className="font-bold text-xl text-blue-900 mb-3">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>

        <div className="flex justify-between mb-4">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-gray-600">{duration}</span>
          </div>

          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-gray-600">{startDate}</span>
          </div>
        </div>

        <Button
          asChild
          className={`w-full bg-gradient-to-r ${colorClasses[color]} hover:opacity-90 transition-opacity`}
        >
          <Link href="/cursos-tecnicos">Saiba mais</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
