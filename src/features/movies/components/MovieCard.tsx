import { Link } from '@tanstack/react-router'
import { CalendarDays, Clock, Edit, Film, Trash2 } from 'lucide-react'
import type { MovieResponse } from '@/types/movie.type'
import { Button } from '@/components/ui/button'

interface MovieCardProps {
  movie: MovieResponse
  isOrganizer?: boolean
  onEdit?: (movie: MovieResponse) => void
  onDelete?: (id: string, title: string) => void
}

export const MovieCard = ({
  movie,
  isOrganizer,
  onEdit,
  onDelete,
}: MovieCardProps) => {
  const releaseDate = new Date(movie.releaseDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link
      to="/movies/$movieId"
      params={{ movieId: movie.id }}
      className="group relative flex flex-col rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 h-full"
    >
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
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-80" />
      </div>

      <div className="flex flex-col flex-1 p-4 space-y-3">
        <h3 className="text-lg font-bold text-slate-100 line-clamp-1 group-hover:text-yellow-400 transition-colors">
          {movie.title}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-2 flex-1">
          {movie.description}
        </p>
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

      {/* Admin Action Bar (Appears on Hover) */}
      {isOrganizer && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 backdrop-blur-md"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onEdit?.(movie)
            }}
          >
            <Edit className="h-4 w-4 text-slate-300" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8 backdrop-blur-md"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete?.(movie.id, movie.title)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Link>
  )
}
