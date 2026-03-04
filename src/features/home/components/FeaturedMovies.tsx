import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Clock, Film } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { env } from '@/env.ts'

const fetchFeaturedMovies = async () => {
  if (env.VITE_ENABLE_MOCK_AUTH === 'true') {
    const { MOVIES_MOCK } = await import('@/api/mocks/movies.mock')
    return MOVIES_MOCK
  }
  return []
}

export const FeaturedMovies = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['movies', 'featured'],
    queryFn: fetchFeaturedMovies,
  })

  // State & Refs for hybrid manual/auto scrolling
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isInteracting, setIsInteracting] = useState(false)

  // Quadruple the data
  const displayData = data ? [...data, ...data, ...data, ...data] : []

  // Initialize scroll position so we have space to scroll backwards!
  useEffect(() => {
    if (scrollRef.current && displayData.length > 0) {
      if (scrollRef.current.scrollLeft === 0) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 2
      }
    }
  }, [displayData.length])

  // Auto-Scroll Logic (Moves Left-to-Right / Reverse)
  useEffect(() => {
    const container = scrollRef.current
    if (!container || isInteracting || displayData.length === 0) return

    let animationId: number
    const scrollSpeed = 0.5 // Adjust for faster/slower scrolling

    const scroll = () => {
      container.scrollLeft -= scrollSpeed // Subtracting moves it the opposite way

      // Seamless Loop: If we hit 0, jump forward to exactly half the container
      if (container.scrollLeft <= 0) {
        container.scrollLeft = container.scrollWidth / 2
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
    <section className="py-12 bg-slate-900/30 border-y border-slate-800/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6 px-6 relative z-10">
        <div className="flex justify-between items-end border-b border-slate-800 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Now Showing
          </h2>
          <Link to="/movies">
            <Button
              variant="ghost"
              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20 group h-8 px-3 text-sm"
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
          {displayData.map((movie, index) => (
            <motion.div
              key={`${movie.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="w-80 shrink-0"
            >
              <Link to="/movies/$movieId" params={{ movieId: movie.id }}>
                <Card className="h-full bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-900/20 group overflow-hidden rounded-xl">
                  <div className="h-48 relative bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400&h=300&sig=${movie.id}`}
                      alt={movie.title}
                      className="absolute inset-0 object-cover w-full h-full opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    <Film className="h-10 w-10 text-emerald-500/50 relative z-10 group-hover:scale-125 transition-transform duration-500" />
                    {movie.durationMinutes > 150 && (
                      <Badge className="absolute top-3 right-3 z-10 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur-md py-0.5 px-2 text-xs">
                        Epic Length
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                      Releases {format(new Date(movie.releaseDate), 'MMM d')}
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>{movie.durationMinutes} mins</span>
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
