import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Building2, Edit, MapPin, Trash2 } from 'lucide-react'
import { CinemaApprovalStatus } from '@/types/enum'
import type { CinemaResponse } from '@/types/cinema.type'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface CinemaCardProps {
  cinema: CinemaResponse
  isOwner: boolean
  onEdit?: (cinema: CinemaResponse) => void
  onDelete?: (id: string) => void
}

export const CinemaCard = ({
  cinema,
  isOwner,
  onEdit,
  onDelete,
}: CinemaCardProps) => {
  const navigate = useNavigate()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const statusStyles = new Map<CinemaApprovalStatus, string>([
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

  // Handle navigating to the Cinema Detail/Auditorium builder page
  const handleCardClick = async () => {
    await navigate({
      to: '/cinemas/$cinemaId',
      params: { cinemaId: cinema.id },
    })
  }

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 hover:bg-slate-800/30 transition-all group cursor-pointer"
      >
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
              <Building2 className="h-6 w-6 text-slate-400 group-hover:text-yellow-400 transition-colors" />
            </div>
            {isOwner && (
              <span
                className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border ${statusStyles.get(cinema.approvalStatus as CinemaApprovalStatus)}`}
              >
                {cinema.approvalStatus}
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-yellow-400 transition-colors">
            {cinema.name}
          </h3>
          <p className="text-sm text-slate-400 flex items-start">
            <MapPin className="mr-2 h-4 w-4 shrink-0 mt-0.5" />
            {cinema.location}
          </p>
        </div>

        {isOwner && (
          <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 hover:bg-slate-800 text-slate-300 z-10"
              onClick={(e) => {
                e.stopPropagation() // 👉 Prevents the card click from firing
                onEdit?.(cinema)
              }}
            >
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="z-10"
              onClick={(e) => {
                e.stopPropagation()
                setIsDeleteDialogOpen(true)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Sleek Delete Confirmation Modal */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          aria-describedby="Cinema Delete Modal"
          className="bg-slate-950 border-slate-800 text-slate-200 sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <Trash2 className="h-5 w-5" />
              Delete Cinema
            </DialogTitle>
            <DialogDescription className="py-4 text-sm text-slate-400">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-200">
                {cinema.name}
              </span>
              ? <br /> This action will permanently remove it from the
              directory.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                onDelete?.(cinema.id)
                setIsDeleteDialogOpen(false)
              }}
            >
              Yes, delete cinema
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
