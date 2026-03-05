import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { eventsApi } from '@/api/events'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { env } from '@/env.ts'

const fetchFeaturedEvents = async () => {
  if (env.VITE_ENABLE_MOCK_AUTH === 'true') {
    const { FEATURED_EVENTS_MOCK } = await import('@/api/mocks/events.mock')
    return FEATURED_EVENTS_MOCK
  }
  return eventsApi.getAll(0, 10, { status: 'PUBLISHED' })
}

export const FeaturedEvents = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['events', 'featured'],
    queryFn: fetchFeaturedEvents,
  })

  // State & Refs for hybrid manual/auto scrolling
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isInteracting, setIsInteracting] = useState(false)

  // Quadruple the data to ensure the infinite loop has enough runway on 4K screens
  const displayData = data?.content
    ? [...data.content, ...data.content, ...data.content, ...data.content]
    : []

  // Auto-Scroll Logic (Moves Right-to-Left)
  useEffect(() => {
    const container = scrollRef.current
    if (!container || isInteracting || displayData.length === 0) return

    let animationId: number
    const scrollSpeed = 0.5 // Adjust for faster/slower scrolling

    const scroll = () => {
      container.scrollLeft += scrollSpeed

      // Seamless Loop: If we scroll past exactly half the container, jump back to 0
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0
      }
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationId)
  }, [isInteracting, displayData.length])

  if (isLoading)
    return (
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto flex gap-6 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              className="h-72 w-80 shrink-0 bg-slate-800/50 rounded-2xl"
            />
          ))}
        </div>
      </section>
    )

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6 relative z-10 px-6">
        <div className="flex justify-between items-end border-b border-slate-800 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Trending Events
          </h2>
          <Link to="/events">
            <Button
              variant="ghost"
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 group h-8 px-3 text-sm"
            >
              See all{' '}
              <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 flex overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* Native Scroll Container with hidden scrollbars */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
          onTouchStart={() => setIsInteracting(true)}
          onTouchEnd={() => setIsInteracting(false)}
          className="flex gap-6 overflow-x-auto py-4 px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full cursor-grab active:cursor-grabbing"
        >
          {displayData.map((event, index) => (
            <motion.div
              key={`${event.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="w-80 shrink-0"
            >
              <Link
                to="/events/$eventId"
                params={{ eventId: event.id.toString() }}
              >
                <Card className="h-full bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/20 group overflow-hidden rounded-xl">
                  <div className="h-40 relative bg-slate-800 overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=600&h=300&sig=${event.id}`}
                      alt={event.title}
                      className="object-cover w-full h-full opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />
                    <Badge className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-white border-slate-700 py-0.5 px-2 text-xs">
                      {event.priceRange}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                      {format(new Date(event.startDate), 'MMM d, yyyy')}
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 shrink-0" /> {event.location}
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Calendar className="h-3 w-3 shrink-0" />
                        {format(new Date(event.startDate), 'h:mm a')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
