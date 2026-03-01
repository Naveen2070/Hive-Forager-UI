import { motion } from 'framer-motion'
import { Film } from 'lucide-react'
import type { MovieResponse } from '@/types/movie.type'
import { MovieCard } from './MovieCard'

interface MovieGridProps {
  movies: MovieResponse[]
}

export const MovieGrid = ({ movies }: MovieGridProps) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
        <Film className="h-12 w-12 text-slate-600 mb-4" />
        <h3 className="text-xl font-semibold text-slate-300">
          No movies found
        </h3>
        <p className="text-slate-500 max-w-sm mt-2">
          It looks like there aren't any movies scheduled right now. Check back
          later!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie, index) => (
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <MovieCard movie={movie} />
        </motion.div>
      ))}
    </div>
  )
}
