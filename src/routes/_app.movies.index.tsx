import { createFileRoute } from '@tanstack/react-router'
import { MovieCatalog } from '@/features/movies/components/MovieCatalog.tsx'
import { movieKeys } from '@/features/movies/movies.keys.ts'
import { fetchMovies } from '@/features/movies/hooks/useMovies.ts'

export const Route = createFileRoute('/_app/movies/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    try {
      await queryClient.ensureQueryData({
        queryKey: movieKeys.lists(),
        queryFn: fetchMovies,
      })
    } catch (error) {
      console.error('Failed to load movies:', error)
    }
  },
})

function RouteComponent() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Now Showing
        </h1>
        <p className="text-slate-400 mt-2">
          Discover the latest movies playing across the hive.
        </p>
      </div>
      <MovieCatalog />
    </div>
  )
}
