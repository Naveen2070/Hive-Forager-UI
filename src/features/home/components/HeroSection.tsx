import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CalendarDays, Film, Sparkles } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { env } from '@/env.ts'
import { eventsApi } from '@/api/events'
import { moviesApi } from '@/api/movies.ts'

// Fetchers for the Hero dynamic cards
const fetchFeaturedEvents = async () => {
  if (env.VITE_ENABLE_MOCK_AUTH === 'true') {
    const { FEATURED_EVENTS_MOCK } = await import('@/api/mocks/events.mock')
    return FEATURED_EVENTS_MOCK
  }
  return eventsApi.getAll(0, 1, { status: 'PUBLISHED' })
}

const fetchFeaturedMovies = async () => {
  if (env.VITE_ENABLE_MOCK_AUTH === 'true') {
    const { MOVIES_MOCK } = await import('@/api/mocks/movies.mock')
    return MOVIES_MOCK
  }
  return moviesApi.getAllMovies()
}

// Define smooth spring variants for staggered text entrance
const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      type: 'spring' as const,
      staggerChildren: 0.15, // Delay between each element appearing
      delayChildren: 0.1,
    },
  },
}

const textItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 80,
      damping: 20,
    },
  },
}
export const HeroSection = () => {
  const { data: eventsData } = useQuery({
    queryKey: ['events', 'hero'],
    queryFn: fetchFeaturedEvents,
  })

  const { data: moviesData } = useQuery({
    queryKey: ['movies', 'hero'],
    queryFn: fetchFeaturedMovies,
  })

  const topEvent = eventsData?.content?.[0]
  const topMovie = moviesData?.[0]

  return (
    <section className="relative pt-28 pb-24 md:pt-28 md:pb-32 px-6 overflow-hidden min-h-[85vh] flex items-center">
      {/* Animated Background Blob */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 md:w-200 h-150 md:h-200 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left Column: Text & CTA (Using Staggering) */}
        <motion.div
          className="space-y-8 text-center lg:text-left"
          variants={textContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={textItemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4"
          >
            <Sparkles className="h-4 w-4" />
            <span>Your city's premier entertainment hub</span>
          </motion.div>

          <motion.h1
            variants={textItemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight"
          >
            Unforgettable <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
              experiences await.
            </span>
          </motion.h1>

          <motion.p
            variants={textItemVariants}
            className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0"
          >
            Discover live concerts, blockbuster movie premieres, and exclusive
            workshops. Secure your spot in the hive today.
          </motion.p>

          <motion.div
            variants={textItemVariants}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
          >
            <Link to="/events" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full h-14 px-8 text-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 hover:scale-105 transition-all"
              >
                Browse Events
              </Button>
            </Link>
            <Link to="/movies" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full h-14 px-8 text-lg border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white hover:scale-105 transition-all backdrop-blur-sm"
              >
                View Movies
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column: Floating 3D Ticket Mockups using ACTUAL DATA */}
        <div className="hidden lg:block relative h-125 perspective-1000">
          {/* 👉 2. Split Entrance and Continuous animation into Parent/Child */}

          {/* Floating Movie Ticket */}
          {topMovie && (
            <motion.div
              initial={{ opacity: 0, x: 50, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 60,
                damping: 20,
                delay: 0.2,
              }}
              className="absolute top-10 right-10 z-20"
            >
              <motion.div
                animate={{ y: [-12, 12, -12], rotateZ: [-3, 0, -3] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                whileHover={{
                  scale: 1.05,
                  rotateZ: 0,
                  transition: { duration: 0.3 },
                }}
                className="w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-emerald-900/20 overflow-hidden cursor-pointer"
              >
                <div className="h-40 bg-linear-to-br from-emerald-900/50 to-slate-900 p-6 flex flex-col justify-end border-b border-slate-800 border-dashed relative overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400&h=200&sig=${topMovie.id}`}
                    alt="Movie"
                    className="absolute inset-0 opacity-20 object-cover w-full h-full pointer-events-none"
                  />
                  <Film className="h-8 w-8 text-emerald-500 mb-2 relative z-10" />
                  <div className="text-xl font-bold text-white relative z-10 line-clamp-1">
                    {topMovie.title}
                  </div>
                  <div className="text-emerald-400 text-sm relative z-10">
                    {topMovie.durationMinutes} mins
                  </div>
                </div>
                <div className="p-6 bg-slate-950 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-slate-500 uppercase">Seat</div>
                    <div className="font-mono text-lg text-white">F12</div>
                  </div>
                  <div className="w-12 h-12 border-2 border-slate-700 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-slate-800 rounded-sm" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Floating Event Ticket */}
          {topEvent && (
            <motion.div
              initial={{ opacity: 0, x: -50, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 60,
                damping: 20,
                delay: 0.4,
              }}
              className="absolute bottom-10 left-10 z-10"
            >
              <motion.div
                animate={{ y: [12, -12, 12], rotateZ: [3, 0, 3] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
                whileHover={{
                  scale: 1.05,
                  rotateZ: 0,
                  transition: { duration: 0.3 },
                }}
                className="w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-blue-900/20 overflow-hidden backdrop-blur-xl cursor-pointer"
              >
                <div className="h-48 bg-linear-to-br from-blue-900/40 to-slate-900 p-6 flex flex-col justify-end border-b border-slate-800 border-dashed relative overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=400&h=200&sig=${topEvent.id}`}
                    alt="Event"
                    className="absolute inset-0 opacity-20 object-cover w-full h-full pointer-events-none"
                  />
                  <CalendarDays className="h-8 w-8 text-blue-500 mb-2 relative z-10" />
                  <div className="text-2xl font-bold text-white relative z-10 line-clamp-1">
                    {topEvent.title}
                  </div>
                  <div className="text-blue-400 text-sm relative z-10 line-clamp-1">
                    {topEvent.location}
                  </div>
                </div>
                <div className="p-6 bg-slate-950 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-slate-500 uppercase">Date</div>
                    <div className="font-bold text-white">
                      {format(new Date(topEvent.startDate), 'MMM d')}
                    </div>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
                    Admit 1
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
