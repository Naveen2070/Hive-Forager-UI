import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types/enum'
import { DataFallback } from '@/components/shared/DataFallback'
import type { CinemaResponse } from '@/types/cinema.type'
import type { createCinemaValues } from '@/features/cinemas/cinema.schema'

import {
  useCinemas,
  useCreateCinema,
  useDeleteCinema,
  useMyCinemas,
  useUpdateCinema,
} from '@/features/cinemas/hooks/useCinemas'
import { CinemaGrid } from '@/features/cinemas/components/CinemaGrid'
import { CinemaModal } from '@/features/cinemas/components/CinemaModal'

export const Route = createFileRoute('/_app/cinemas/')({
  component: CinemasPage,
})

function CinemasPage() {
  const { user } = useAuthStore()
  const isOrganizer =
    user?.role === UserRole.ORGANIZER || user?.role === UserRole.SUPER_ADMIN

  const [section, setSection] = useState<'mine' | 'browse'>(
    isOrganizer ? 'mine' : 'browse',
  )

  // -- Modal State --
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCinema, setEditingCinema] = useState<CinemaResponse | null>(
    null,
  )

  // -- API Hooks --
  const {
    data: publicCinemas,
    isLoading: isLoadingPublic,
    isError: isErrorPublic,
    refetch: refetchPublic,
  } = useCinemas()

  const {
    data: myCinemas,
    isLoading: isLoadingMine,
    isError: isErrorMine,
    refetch: refetchMine,
  } = useMyCinemas(isOrganizer)

  const createMutation = useCreateCinema()
  const updateMutation = useUpdateCinema()
  const deleteMutation = useDeleteCinema()

  // -- Handlers --
  const handleOpenCreate = () => {
    setEditingCinema(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (cinema: CinemaResponse) => {
    setEditingCinema(cinema)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleFormSubmit = (formData: createCinemaValues) => {
    if (editingCinema) {
      const updatePayload = {
        name: formData.name,
        location: formData.location,
      }
      updateMutation.mutate(
        { id: editingCinema.id, data: updatePayload },
        { onSuccess: () => setIsModalOpen(false) },
      )
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setIsModalOpen(false),
      })
    }
  }

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Cinemas
          </h1>
          <p className="text-slate-400 mt-2">
            {isOrganizer
              ? 'Manage your theater locations.'
              : 'Discover partner theaters.'}
          </p>
        </div>

        {isOrganizer && section === 'mine' && (
          <Button
            onClick={handleOpenCreate}
            className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold"
          >
            <Plus className="mr-2 h-4 w-4" /> Register Cinema
          </Button>
        )}
      </div>

      {isOrganizer ? (
        <Tabs
          value={section}
          onValueChange={(v) => setSection(v as 'mine' | 'browse')}
          className="w-full"
        >
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger
              value="mine"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"
            >
              My Cinemas
            </TabsTrigger>
            <TabsTrigger
              value="browse"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"
            >
              Directory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mine" className="mt-6">
            {isErrorMine ? (
              <DataFallback
                title="Failed to load your cinemas"
                message="Please try again."
                onRetry={() => refetchMine()}
              />
            ) : (
              <CinemaGrid
                cinemas={myCinemas || []}
                isLoading={isLoadingMine}
                isOwner={true}
                emptyMessage="You haven't registered any cinemas yet."
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            )}
          </TabsContent>

          <TabsContent value="browse" className="mt-6">
            {isErrorPublic ? (
              <DataFallback
                title="Failed to load directory"
                message="Please try again."
                onRetry={() => refetchPublic()}
              />
            ) : (
              <CinemaGrid
                cinemas={publicCinemas || []}
                isLoading={isLoadingPublic}
                isOwner={false}
                emptyMessage="No cinemas found."
              />
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="mt-6">
          {isErrorPublic ? (
            <DataFallback
              title="Failed to load directory"
              message="Please try again."
              onRetry={() => refetchPublic()}
            />
          ) : (
            <CinemaGrid
              cinemas={publicCinemas || []}
              isLoading={isLoadingPublic}
              isOwner={false}
              emptyMessage="No cinemas found."
            />
          )}
        </div>
      )}

      <CinemaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCinema}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
