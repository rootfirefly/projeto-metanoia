import { Calendar, Clock, MapPin, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface UpcomingEventProps {
  title: string
  date: string
  time: string
  location: string
  speaker: string
  image: string
}

export default function UpcomingEvent({ title, date, time, location, speaker, image }: UpcomingEventProps) {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
      <div className="h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardContent className="p-5">
        <h3 className="font-bold text-xl text-blue-900 mb-3">{title}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 text-orange-500 mr-2" />
            <span className="text-gray-700">{date}</span>
          </div>

          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 text-orange-500 mr-2" />
            <span className="text-gray-700">{time}</span>
          </div>

          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 text-orange-500 mr-2" />
            <span className="text-gray-700">{location}</span>
          </div>

          <div className="flex items-center text-sm">
            <User className="h-4 w-4 text-orange-500 mr-2" />
            <span className="text-gray-700">{speaker}</span>
          </div>
        </div>

        <Link href="/palestras" className="text-blue-900 font-medium hover:text-orange-500 transition-colors text-sm">
          Ver detalhes →
        </Link>
      </CardContent>
    </Card>
  )
}
