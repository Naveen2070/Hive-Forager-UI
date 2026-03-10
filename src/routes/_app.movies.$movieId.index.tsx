import { useState } from 'react'
import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'

import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types/enum'
import { Button } from '@/components/ui/button'

import {
  fetchMovieDetail,
  useMovieDetail,
} from '@/features/movies/hooks/useMovies'
import { movieKeys } from '@/features/movies/movies.keys'

import { MovieHero } from '@/features/movies/components/detail/MovieHero'
import { ShowtimeSelector } from '@/features/movies/components/detail/ShowtimeSelector'
import { DataFallback } from '@/components/shared/DataFallback'
import { Skeleton } from '@/components/ui/skeleton'

import {
  useCreateShowtime,
  useDeleteShowtime,
  useUpdateShowtime,
} from '@/features/showtimes/hooks/useShowTimes'
import {
  type EditableShowtime,
  ShowtimeModal,
} from '@/features/showtimes/components/ShowtimeModal'
import type { ShowtimeFormValues } from '@/features/showtimes/showtime.schema'

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

export function MovieDetailsPage() {
  const { movieId } = useParams({ from: '/_app/movies/$movieId/' })

  // -- Auth --
  const { user } = useAuthStore()
  const isOrganizer =
    user?.role === UserRole.ORGANIZER || user?.role === UserRole.SUPER_ADMIN

  // -- State --
  const [isShowtimeModalOpen, setIsShowtimeModalOpen] = useState(false)
  const [editingShowtime, setEditingShowtime] =
    useState<EditableShowtime | null>(null)

  // -- API Hooks --
  const { data: movie, isLoading, isError, refetch } = useMovieDetail(movieId)

  const createMutation = useCreateShowtime()
  const updateMutation = useUpdateShowtime()
  const deleteMutation = useDeleteShowtime()

  // -- Handlers --
  const handleOpenCreate = () => {
    setEditingShowtime(null)
    setIsShowtimeModalOpen(true)
  }

  const handleOpenEdit = (showtime: EditableShowtime) => {
    setEditingShowtime(showtime)
    setIsShowtimeModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        'Are you sure you want to cancel this showtime? Existing tickets may be affected.',
      )
    ) {
      deleteMutation.mutate(id)
    }
  }

  const handleShowtimeSubmit = (data: ShowtimeFormValues) => {
    // Convert local HTML datetime-local string to proper UTC ISO
    const payload = {
      movieId: movieId,
      cinemaId: data.cinemaId,
      auditoriumId: data.auditoriumId,
      startTimeUtc: new Date(data.startTimeUtc).toISOString(),
      basePrice: data.basePrice,
    }

    if (editingShowtime) {
      updateMutation.mutate(
        { id: editingShowtime.id, data: payload },
        { onSuccess: () => setIsShowtimeModalOpen(false) },
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setIsShowtimeModalOpen(false),
      })
    }
  }

  // -- Render States --
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
        <Skeleton className="h-4 w-24 bg-slate-900" />
        <Skeleton className="h-100 w-full bg-slate-900 rounded-3xl" />
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
        {/* Header with Organizer Action */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-100">
            Available Showtimes
          </h2>

          {isOrganizer && (
            <Button
              onClick={handleOpenCreate}
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold"
            >
              <Plus className="mr-2 h-4 w-4" /> Schedule Showtime
            </Button>
          )}
        </div>

        <ShowtimeSelector
          movieId={movieId}
          isOrganizer={isOrganizer}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Organizer Modals */}
      {isOrganizer && (
        <ShowtimeModal
          isOpen={isShowtimeModalOpen}
          movieTitle={movie.title}
          onClose={() => setIsShowtimeModalOpen(false)}
          onSubmit={handleShowtimeSubmit}
          initialData={editingShowtime}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  )
}
