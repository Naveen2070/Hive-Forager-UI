import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Plus, Trash2 } from 'lucide-react'

import type { MovieResponse } from '@/types/movie.type'
import type { MovieFormValues } from '@/features/movies/movie.schema'
import { MovieCatalog } from '@/features/movies/components/MovieCatalog'
import { movieKeys } from '@/features/movies/movies.keys'
import {
  fetchMovies,
  useCreateMovie,
  useDeleteMovie,
  useUpdateMovie,
} from '@/features/movies/hooks/useMovies'
import { MovieModal } from '@/features/movies/components/MovieModal'

import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types/enum'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'


export const Route = createFileRoute('/_app/movies/')({
  beforeLoad: () => {
    const { hasDomainAccess } = useAuthStore.getState()
    if (!hasDomainAccess('movies')) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: MoviesPage,
  loader: async ({ context: { queryClient } }) => {
    try {
      await queryClient.ensureQueryData({
        queryKey: movieKeys.lists(),
        queryFn: () => fetchMovies(0, 10),
      })
    } catch (error) {
      console.error('Failed to load movies:', error)
    }
  },
})

export function MoviesPage() {
  const { user } = useAuthStore()
  const isOrganizer =
    user?.role === UserRole.ORGANIZER || user?.role === UserRole.SUPER_ADMIN

  // -- State --
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState<MovieResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    title: string
  } | null>(null)

  // -- Mutations --
  const createMutation = useCreateMovie()
  const updateMutation = useUpdateMovie()
  const deleteMutation = useDeleteMovie()

  // -- Handlers --
  const handleOpenCreate = () => {
    setEditingMovie(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (movie: MovieResponse) => {
    setEditingMovie(movie)
    setIsModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => setDeleteTarget(null),
      })
    }
  }

  const handleFormSubmit = (formData: MovieFormValues) => {
    // Ensure the date is valid ISO before sending to API
    const payload = {
      ...formData,
      releaseDate: new Date(formData.releaseDate).toISOString(),
    }

    if (editingMovie) {
      updateMutation.mutate(
        { id: editingMovie.id, data: payload },
        { onSuccess: () => setIsModalOpen(false) },
      )
    } else {
      createMutation.mutate(payload, { onSuccess: () => setIsModalOpen(false) })
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Now Showing
          </h1>
          <p className="text-slate-400 mt-2">
            {isOrganizer
              ? 'Manage the master catalog of films.'
              : 'Discover the latest movies playing across the hive.'}
          </p>
        </div>

        {isOrganizer && (
          <Button
            onClick={handleOpenCreate}
            className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Movie
          </Button>
        )}
      </div>

      {/* The Catalog */}
      <MovieCatalog
        isOrganizer={isOrganizer}
        onEdit={handleOpenEdit}
        onDelete={(id, title) => setDeleteTarget({ id, title })}
      />

      {/* Modals */}
      <MovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingMovie}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <Trash2 className="h-5 w-5" />
              Delete Movie
            </DialogTitle>
            <DialogDescription className="py-4 text-sm text-slate-400">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-200">
                {deleteTarget?.title}
              </span>{' '}
              ? <br /> This will remove it from the catalog permanently.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Yes, delete movie'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
