import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

// 👉 Import the keys and fetcher
import {
  fetchMovieDetail,
  useMovieDetail,
} from '@/features/movies/hooks/useMovies'
import { movieKeys } from '@/features/movies/movies.keys'

import { MovieHero } from '@/features/movies/components/detail/MovieHero'
import { ShowtimeSelector } from '@/features/movies/components/detail/ShowtimeSelector'
import { DataFallback } from '@/components/shared/DataFallback'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_app/movies/$movieId/')({
  component: MovieDetailsPage,
  loader: async ({ params: { movieId }, context: { queryClient } }) => {
    try {
      await queryClient.ensureQueryData({
        queryKey: movieKeys.detail(movieId),
        queryFn: () => fetchMovieDetail(movieId),
      })
    } catch (error) {
      console.error('Failed to load movie details:', error)
    }
  },
})

function MovieDetailsPage() {
  const { movieId } = useParams({ from: '/_app/movies/$movieId/' })

  const { data: movie, isLoading, isError, refetch } = useMovieDetail(movieId)

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
        <Skeleton className="h-4 w-24 bg-slate-900" />
        <Skeleton className="h-125 w-full bg-slate-900 rounded-3xl" />
      </div>
    )
  }

  if (isError || !movie) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
        <Link
          to="/movies"
          className="inline-flex items-center text-sm text-slate-400 hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Movies
        </Link>
        <DataFallback
          title="Movie not found"
          message="Our worker bees couldn't locate this film. It may have been pulled from theaters."
          onRetry={refetch}
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <Link
        to="/movies"
        className="inline-flex items-center text-sm text-slate-400 hover:text-yellow-400 transition-colors group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
        Back to Movies
      </Link>

      <MovieHero movie={movie} />

      <div className="pt-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-6">
          Available Showtimes
        </h2>

        <ShowtimeSelector movieId={movieId} />
      </div>
    </div>
  )
}
