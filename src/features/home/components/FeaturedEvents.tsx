import { Link } from '@tanstack/react-router'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { eventsApi } from '@/api/events'
import { eventKeys } from '@/features/events/events.keys'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton.tsx'

export const FeaturedEvents = () => {
  const { data, isLoading } = useQuery({
    queryKey: eventKeys.public({ status: 'PUBLISHED' }, 0),
    queryFn: () => eventsApi.getAll(0, 3, { status: 'PUBLISHED' }),
  })

  if (isLoading)
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header Skeleton */}
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 bg-slate-800" />
              <Skeleton className="h-4 w-96 bg-slate-800" />
            </div>
            <Skeleton className="h-10 w-24 bg-slate-800" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-full border border-slate-800 rounded-xl overflow-hidden"
              >
                <Skeleton className="h-48 w-full bg-slate-800" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-4 w-24 bg-slate-800" />
                  <Skeleton className="h-8 w-full bg-slate-800" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-24 bg-slate-800" />
                    <Skeleton className="h-4 w-24 bg-slate-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Trending Events
            </h2>
            <p className="text-slate-400">
              Book your spot at the hottest upcoming experiences.
            </p>
          </div>
          <Link to="/events">
            <Button
              variant="ghost"
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
            >
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {data?.content.map((event) => (
            <Link
              key={event.id}
              to="/events/$eventId"
              params={{ eventId: event.id.toString() }}
            >
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className="h-full bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1 group">
                  <div className="h-48 bg-slate-800 relative">
                    {/* Placeholder for Event Image */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-slate-950/80 backdrop-blur text-white border-slate-700">
                        {`${event.priceRange}`}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <div className="text-xs text-blue-400 font-semibold mb-2 uppercase tracking-wider">
                        {format(new Date(event.startDate), 'MMM d, yyyy')}
                      </div>
                      <h3 className="text-xl font-bold text-slate-100 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {event.title}
                      </h3>
                    </div>

                    <div className="flex items-center text-sm text-slate-500 gap-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate max-w-25">
                          {event.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(event.startDate), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
