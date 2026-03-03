import { useMovies } from '@/features/movies/hooks/useMovies'
import { MovieGrid } from './MovieGrid'
import { DataFallback } from '@/components/shared/DataFallback'
import { Skeleton } from '@/components/ui/skeleton'
import type { MovieResponse } from '@/types/movie.type'

interface MovieCatalogProps {
  isOrganizer?: boolean
  onEdit?: (movie: MovieResponse) => void
  onDelete?: (id: string, title: string) => void
}

export const MovieCatalog = ({
  isOrganizer,
  onEdit,
  onDelete,
}: MovieCatalogProps) => {
  const { data: movies, isLoading, isError, refetch } = useMovies()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-2/3 w-full rounded-2xl bg-slate-900" />
            <Skeleton className="h-6 w-3/4 bg-slate-900" />
            <Skeleton className="h-4 w-1/2 bg-slate-900" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <DataFallback
        title="Unable to load catalog"
        message="Our worker bees couldn't fetch the latest movie listings."
        onRetry={refetch}
      />
    )
  }

  return (
    <MovieGrid
      movies={movies || []}
      isOrganizer={isOrganizer}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}
