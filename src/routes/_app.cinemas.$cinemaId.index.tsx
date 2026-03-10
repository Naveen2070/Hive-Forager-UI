import { useState } from 'react'
import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  Edit,
  LayoutGrid,
  Mail,
  MapPin,
  Plus,
  Trash2,
} from 'lucide-react'

import { useAuthStore } from '@/store/auth.store'
import { CinemaApprovalStatus, UserRole } from '@/types/enum'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DataFallback } from '@/components/shared/DataFallback'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { useCinemaDetail } from '@/features/cinemas/hooks/useCinemas'
import {
  useAuditoriumsByCinema,
  useCreateAuditorium,
  useDeleteAuditorium,
  useUpdateAuditorium,
} from '@/features/auditoriums/hooks/useAuditoriums'
import { AuditoriumModal } from '@/features/auditoriums/components/AuditoriumModal'
import type {
  AuditoriumResponse,
  CreateAuditoriumRequest,
} from '@/types/auditorium.type'

export const Route = createFileRoute('/_app/cinemas/$cinemaId/')({
  component: CinemaDetailPage,
})

export function CinemaDetailPage() {
  const { cinemaId } = useParams({ from: '/_app/cinemas/$cinemaId/' })
  const { user } = useAuthStore()
  const isOrganizer =
    user?.role === UserRole.ORGANIZER || user?.role === UserRole.SUPER_ADMIN

  // -- State --
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAuditorium, setEditingAuditorium] =
    useState<AuditoriumResponse | null>(null)

  // 👉 NEW: State to track which auditorium we want to delete
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    name: string
  } | null>(null)

  // -- API Hooks --
  const {
    data: cinema,
    isLoading: cinemaLoading,
    isError: cinemaError,
    refetch: refetchCinema,
  } = useCinemaDetail(cinemaId)

  const {
    data: auditoriums,
    isLoading: audsLoading,
    isError: audsError,
    refetch: refetchAuds,
  } = useAuditoriumsByCinema(cinemaId)

  const createMutation = useCreateAuditorium()
  const updateMutation = useUpdateAuditorium()
  const deleteMutation = useDeleteAuditorium()

  // -- Handlers --
  const handleOpenCreate = () => {
    setEditingAuditorium(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (auditorium: AuditoriumResponse) => {
    setEditingAuditorium(auditorium)
    setIsModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => setDeleteTarget(null),
      })
    }
  }

  const handleFormSubmit = (formData: CreateAuditoriumRequest) => {
    if (editingAuditorium) {
      updateMutation.mutate(
        { id: editingAuditorium.id, data: formData },
        { onSuccess: () => setIsModalOpen(false) },
      )
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setIsModalOpen(false),
      })
    }
  }

  // -- Render States --
  if (cinemaLoading) return <CinemaDetailSkeleton />

  if (cinemaError || !cinema) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4">
        <DataFallback
          title="Cinema Not Found"
          message="We couldn't load the details for this location."
          onRetry={() => refetchCinema()}
        />
      </div>
    )
  }

  const statusStyles = new Map<CinemaApprovalStatus | string, string>([
    [
      CinemaApprovalStatus.APPROVED,
      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ],
    [
      CinemaApprovalStatus.PENDING,
      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    ],
    [
      CinemaApprovalStatus.REJECTED,
      'bg-red-500/10 text-red-400 border-red-500/20',
    ],
  ])

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* 1. Header & Cinema Info */}
      <div className="space-y-6">
        <Link
          to="/cinemas"
          className="inline-flex items-center text-sm text-slate-400 hover:text-yellow-400 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to Cinemas
        </Link>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {cinema.name}
              </h1>
              <span
                className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border ${statusStyles.get(cinema.approvalStatus) || statusStyles.get(CinemaApprovalStatus.PENDING)}`}
              >
                {cinema.approvalStatus}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-slate-400 mt-4">
              <span className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 shrink-0 text-slate-500" />
                {cinema.location}
              </span>
              <span className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 shrink-0 text-slate-500" />
                {cinema.contactEmail || 'No email provided'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Auditoriums Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Auditoriums</h2>
            <p className="text-sm text-slate-400">
              Manage the screens and seating layouts for this location.
            </p>
          </div>
          {isOrganizer && (
            <Button
              onClick={handleOpenCreate}
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold"
            >
              <Plus className="mr-2 h-4 w-4" /> Build Auditorium
            </Button>
          )}
        </div>

        {/* Auditoriums Grid */}
        {audsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-2xl bg-slate-900" />
            ))}
          </div>
        ) : audsError ? (
          <DataFallback
            title="Failed to load screens"
            message="Could not fetch auditoriums."
            onRetry={() => refetchAuds()}
          />
        ) : auditoriums?.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/30 border border-slate-800 border-dashed rounded-2xl">
            <LayoutGrid className="mx-auto h-12 w-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-200 mb-1">
              No Auditoriums Built
            </h3>
            <p className="text-slate-400 mb-6">
              You haven't designed any screens for this cinema yet.
            </p>
            {isOrganizer && (
              <Button
                onClick={handleOpenCreate}
                variant="outline"
                className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
              >
                Start Building
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auditoriums?.map((aud) => {
              const totalCapacity = aud.maxRows * aud.maxColumns
              const disabledCount = aud.layout?.disabledSeats?.length || 0
              const usableCapacity = totalCapacity - disabledCount

              return (
                <div
                  key={aud.id}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                        <LayoutGrid className="h-6 w-6 text-slate-400 group-hover:text-yellow-400 transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-200">
                          {aud.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {usableCapacity} Usable Seats
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400 mb-6 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                      <div className="flex flex-col">
                        <span className="text-slate-500 uppercase text-[10px]">
                          Grid
                        </span>
                        <span className="text-slate-200">
                          {aud.maxRows} × {aud.maxColumns}
                        </span>
                      </div>
                      <div className="w-px h-6 bg-slate-800 mx-1" />
                      <div className="flex flex-col">
                        <span className="text-slate-500 uppercase text-[10px]">
                          Wheelchair
                        </span>
                        <span className="text-blue-400">
                          {aud.layout?.wheelchairSpots?.length || 0}
                        </span>
                      </div>
                      {aud.layout?.tiers && aud.layout.tiers.length > 0 && (
                        <>
                          <div className="w-px h-6 bg-slate-800 mx-1" />
                          <div className="flex flex-col">
                            <span className="text-slate-500 uppercase text-[10px]">
                              VIP Zones
                            </span>
                            <span className="text-fuchsia-400">
                              {aud.layout.tiers.length}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {isOrganizer && (
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 hover:bg-slate-800 text-slate-300"
                        onClick={() => handleOpenEdit(aud)}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Design
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          setDeleteTarget({ id: aud.id, name: aud.name })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 3. The Grid Builder Modal */}
      <AuditoriumModal
        isOpen={isModalOpen}
        cinemaId={cinemaId}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingAuditorium}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      {/* 4. The Delete Confirmation Modal */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <Trash2 className="h-5 w-5" />
              Delete Auditorium
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to demolish{' '}
              <span className="font-semibold text-slate-200">
                {deleteTarget?.name} ?
              </span>
              <br /> This action cannot be undone.
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
              {deleteMutation.isPending ? 'Deleting...' : 'Yes, demolish it'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CinemaDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      <Skeleton className="h-6 w-32 bg-slate-900" />
      <Skeleton className="h-32 w-full rounded-3xl bg-slate-900" />
      <div className="space-y-6 pt-6">
        <Skeleton className="h-8 w-48 bg-slate-900" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl bg-slate-900" />
          ))}
        </div>
      </div>
    </div>
  )
}
