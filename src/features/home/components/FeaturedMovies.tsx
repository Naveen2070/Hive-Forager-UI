// import { Link } from '@tanstack/react-router'
import { ArrowRight, Clock, Film } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
// import { moviesApi } from '@/features/movies/api/movies.api' // Uncomment when API is ready
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { env } from '@/env.ts'
import { Link } from '@tanstack/react-router'

const fetchFeaturedMovies = async () => {
  if (env.VITE_ENABLE_MOCK_AUTH === 'true') {
    const { FEATURED_MOVIES_MOCK } =
      await import('@/api/mocks/movies.mock')
    return FEATURED_MOVIES_MOCK
  }
  // return moviesApi.getAll(0, 3)
  return []
}

export const FeaturedMovies = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['movies', 'featured'],
    queryFn: fetchFeaturedMovies,
  })

  if (isLoading)
    return (
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 bg-slate-800" />
              <Skeleton className="h-4 w-96 bg-slate-800" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-80 w-full bg-slate-800 rounded-xl"
              />
            ))}
          </div>
        </div>
      </section>
    )

  return (
    <section className="py-20 px-6 bg-slate-900/30 border-y border-slate-800/50">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Now Showing</h2>
            <p className="text-slate-400">
              Catch the latest blockbusters and exclusive premieres in theaters.
            </p>
          </div>
          <Link to="/movies">
            <Button
              variant="ghost"
              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
            >
              View all movies <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {data?.map((movie) => (
            <Link
              key={movie.id}
              to="/movies/$movieId"
              params={{ movieId: movie.id }}
            >
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className="h-full bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1 group">
                  <div className="h-64 bg-slate-800 relative flex items-center justify-center overflow-hidden">
                    <Film className="h-16 w-16 text-slate-700 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                    {movie.durationMinutes > 150 && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur">
                          Epic Length
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <div className="text-xs text-emerald-400 font-semibold mb-2 uppercase tracking-wider">
                        Releases{' '}
                        {format(new Date(movie.releaseDate), 'MMM d, yyyy')}
                      </div>
                      <h3 className="text-xl font-bold text-slate-100 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                        {movie.title}
                      </h3>
                    </div>

                    <div className="flex items-center text-sm text-slate-500 gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{movie.durationMinutes} mins</span>
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
