import { format } from 'date-fns'
import { Calendar, MapPin } from 'lucide-react'
import type { EventDTO } from '@/types/event.type'
import { Badge } from '@/components/ui/badge'

export const EventHero = ({ event }: { event: EventDTO }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className="text-blue-400 border-blue-500/20 bg-blue-500/10"
        >
          {event.status}
        </Badge>
        <span className="text-sm text-slate-500">
          Posted by {event.organizerName}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
        {event.title}
      </h1>

      <div className="flex flex-wrap gap-4 text-sm text-slate-300">
        <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-md border border-slate-800">
          <Calendar className="h-4 w-4 text-blue-400" />
          {format(new Date(event.startDate), 'PPP p')}
        </div>
        <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-md border border-slate-800">
          <MapPin className="h-4 w-4 text-blue-400" />
          {event.location}
        </div>
      </div>
    </div>
  )
}
