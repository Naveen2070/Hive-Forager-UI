import { useEffect, useState } from 'react'
import { MovieGrid } from './MovieGrid'
import { DataFallback } from '@/components/shared/DataFallback'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import type { MovieResponse } from '@/types/movie.type'
import { useMovies } from '@/features/movies/hooks/useMovies.ts'

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
  // 1. State for Pagination and Search
  const [page, setPage] = useState(0)
  const pageSize = 12
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // 2. Debounce Logic: Wait 500ms after user stops typing to trigger the search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
      setPage(0)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  // 3. Pass state to the hook (React Query auto-fetches when these change!)
  const { data, isLoading, isError, refetch } = useMovies(
    page,
    pageSize,
    debouncedSearch,
  )

  // 4. Render Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full max-w-md bg-slate-900 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-2xl bg-slate-900" />
              <Skeleton className="h-6 w-3/4 bg-slate-900" />
              <Skeleton className="h-4 w-1/2 bg-slate-900" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 5. Render Error State
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
    <div className="space-y-8">
      {/* The Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
        <Input
          type="text"
          placeholder="Search movies by title or description..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10 h-12 bg-slate-900 border-slate-800 focus-visible:ring-emerald-500 text-slate-100 placeholder:text-slate-500 rounded-xl"
        />
      </div>

      {/* Empty State for Search */}
      {data?.content.length === 0 ? (
        <div className="py-20 text-center border border-slate-800 rounded-2xl bg-slate-900/30">
          <p className="text-slate-400 text-lg">
            No movies found matching "{debouncedSearch}".
          </p>
          <Button
            variant="link"
            onClick={() => setSearchInput('')}
            className="text-emerald-400 hover:text-emerald-300 mt-2"
          >
            Clear search
          </Button>
        </div>
      ) : (
        /* The Grid */
        <MovieGrid
          movies={data?.content || []}
          isOrganizer={isOrganizer}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

      {/* Pagination Controls */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8 border-t border-slate-800">
          <Button
            variant="outline"
            className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-300"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={data.first}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <span className="text-slate-400 text-sm font-medium">
            Page {data.pageable.pageNumber + 1} of {data.totalPages}
          </span>

          <Button
            variant="outline"
            className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-300"
            onClick={() => setPage((p) => p + 1)}
            disabled={data.last}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
