import { CalendarDays, Clock, Film } from 'lucide-react'
import type { MovieResponse } from '@/types/movie.type'
import { Badge } from '@/components/ui/badge'

interface MovieHeroProps {
  movie: MovieResponse
}

export const MovieHero = ({ movie }: MovieHeroProps) => {
  const releaseDate = new Date(movie.releaseDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* 1. Blurred Background Image */}
      {movie.posterUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl saturate-150 transform scale-110"
            style={{ backgroundImage: `url(${movie.posterUrl})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/60 to-transparent" />
        </>
      )}

      {/* 2. Content Container */}
      <div className="relative z-10 flex flex-col md:flex-row gap-8 p-6 md:p-10 items-center md:items-start">
        {/* Poster Art */}
        <div className="shrink-0 w-64 md:w-80 rounded-2xl overflow-hidden shadow-2xl shadow-yellow-500/10 border border-slate-700/50 bg-slate-900">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={`${movie.title} Poster`}
              className="w-full h-auto object-cover"
            />
          ) : (
            <div className="flex h-96 w-full flex-col items-center justify-center text-slate-600">
              <Film className="mb-2 h-16 w-16 opacity-50" />
              <span className="text-lg font-medium">No Poster Available</span>
            </div>
          )}
        </div>

        {/* Movie Details */}
        <div className="flex-1 space-y-6 text-center md:text-left pt-4 md:pt-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
              {movie.title}
            </h1>

            {/* Badges/Metadata */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Badge
                variant="secondary"
                className="bg-slate-800 text-yellow-400 hover:bg-slate-700 border border-yellow-500/20 px-3 py-1"
              >
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                {movie.durationMinutes} min
              </Badge>
              <Badge
                variant="outline"
                className="border-slate-700 text-slate-300 px-3 py-1"
              >
                <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                {releaseDate}
              </Badge>
              {/* You can easily add more badges here later like PG-13, 4K, IMAX, etc. */}
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-200">Synopsis</h3>
            <p className="text-slate-400 leading-relaxed text-base md:text-lg max-w-3xl">
              {movie.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
