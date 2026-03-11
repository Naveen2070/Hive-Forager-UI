import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react'
import type { CinemaResponse } from '@/types/cinema.type'
import type { createCinemaValues } from '@/features/cinemas/cinema.schema'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types/enum'
import { DataFallback } from '@/components/shared/DataFallback'

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

export function CinemasPage() {
  const { user } = useAuthStore()
  const isOrganizer =
    user?.role === UserRole.ORGANIZER || user?.role === UserRole.SUPER_ADMIN

  const [section, setSection] = useState<'mine' | 'browse'>(
    isOrganizer ? 'mine' : 'browse',
  )

  // -- Pagination & Search State --
  const [page, setPage] = useState(0)
  const pageSize = 12
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Reset pagination/search when switching tabs
  useEffect(() => {
    setPage(0)
    setSearchInput('')
    setDebouncedSearch('')
  }, [section])

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
      setPage(0)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

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
  } = useCinemas(page, pageSize, debouncedSearch)

  const {
    data: myCinemas,
    isLoading: isLoadingMine,
    isError: isErrorMine,
    refetch: refetchMine,
  } = useMyCinemas(isOrganizer, page, pageSize, debouncedSearch)

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
      const updatePayload = { name: formData.name, location: formData.location }
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

  // Determine which data object is currently active
  const activeData = section === 'mine' ? myCinemas : publicCinemas

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

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* 👉 Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Search cinemas..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-10 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg"
            />
          </div>

          {isOrganizer && section === 'mine' && (
            <Button
              onClick={handleOpenCreate}
              className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold h-10"
            >
              <Plus className="mr-2 h-4 w-4" /> Register Cinema
            </Button>
          )}
        </div>
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
                cinemas={myCinemas?.content || []}
                isLoading={isLoadingMine}
                isOwner={true}
                emptyMessage={
                  debouncedSearch
                    ? `No cinemas found matching "${debouncedSearch}".`
                    : "You haven't registered any cinemas yet."
                }
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
                cinemas={publicCinemas?.content || []}
                isLoading={isLoadingPublic}
                isOwner={false}
                emptyMessage={
                  debouncedSearch
                    ? `No cinemas found matching "${debouncedSearch}".`
                    : 'No cinemas found.'
                }
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
              cinemas={publicCinemas?.content || []}
              isLoading={isLoadingPublic}
              isOwner={false}
              emptyMessage={
                debouncedSearch
                  ? `No cinemas found matching "${debouncedSearch}".`
                  : 'No cinemas found.'
              }
            />
          )}
        </div>
      )}

      {/* 👉 Global Pagination Controls */}
      {activeData && activeData.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={activeData.pageNumber === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <span className="text-slate-400 text-sm font-medium">
            Page {activeData.pageNumber + 1} of {activeData.totalPages}
          </span>
          <Button
            variant="outline"
            className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300"
            onClick={() => setPage((p) => p + 1)}
            disabled={activeData.isLast}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
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
