import { Link } from '@tanstack/react-router'
import { CalendarDays, Clock, Film } from 'lucide-react'
import type { MovieResponse } from '@/types/movie.type'

interface MovieCardProps {
  movie: MovieResponse
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const releaseDate = new Date(movie.releaseDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link
      to="/movies/$movieId"
      params={{ movieId: movie.id }}
      className="group relative flex flex-col rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10"
    >
      {/* Poster Image Area */}
      <div className="aspect-2/3 w-full bg-slate-800 relative overflow-hidden">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={`${movie.title} Poster`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-slate-600">
            <Film className="mb-2 h-12 w-12 opacity-50" />
            <span className="text-sm font-medium">No Poster</span>
          </div>
        )}

        {/* Subtle gradient overlay for text readability if we add tags later */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-80" />
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
        <h3 className="text-lg font-bold text-slate-100 line-clamp-1 group-hover:text-yellow-400 transition-colors">
          {movie.title}
        </h3>

        <p className="text-sm text-slate-400 line-clamp-2 flex-1">
          {movie.description}
        </p>

        {/* Metadata Footer */}
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-2 border-t border-slate-800/50">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{movie.durationMinutes} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{releaseDate}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
