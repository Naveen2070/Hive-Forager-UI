import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { CinemaResponse } from '@/types/cinema.type'
import {
  createCinemaSchema,
  type createCinemaValues,
} from '@/features/cinemas/cinema.schema'

interface CinemaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: createCinemaValues) => void
  initialData?: CinemaResponse | null
  isPending?: boolean
}

export const CinemaModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isPending,
}: CinemaModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createCinemaValues>({
    resolver: zodResolver(createCinemaSchema),
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          location: initialData.location,
          contactEmail: initialData.contactEmail || '',
        })
      } else {
        reset({ name: '', location: '', contactEmail: '' })
      }
    }
  }, [isOpen, initialData, reset])

  const isEditing = !!initialData

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950 border-slate-800 text-slate-200">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Cinema' : 'Register New Cinema'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Cinema Name
            </label>
            <Input
              {...register('name')}
              className="mt-1 bg-slate-900 border-slate-800 focus-visible:ring-yellow-500"
              placeholder="e.g. Hive Multiplex Downtown"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Physical Location
            </label>
            <Input
              {...register('location')}
              className="mt-1 bg-slate-900 border-slate-800 focus-visible:ring-yellow-500"
              placeholder="123 Main St, City, ST 12345"
            />
            {errors.location && (
              <p className="text-red-400 text-xs mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Contact Email
            </label>
            <Input
              {...register('contactEmail')}
              type="email"
              disabled={isEditing} // 👉 FIX: Disable when editing, since UpdateCinemaRequest doesn't support changing it
              className="mt-1 bg-slate-900 border-slate-800 focus-visible:ring-yellow-500 disabled:opacity-50"
              placeholder="manager@hivecinema.com"
            />
            {errors.contactEmail && (
              <p className="text-red-400 text-xs mt-1">
                {errors.contactEmail.message}
              </p>
            )}
            {isEditing && (
              <p className="text-[10px] text-slate-500 mt-1">
                Contact email cannot be changed after registration.
              </p>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold"
            >
              {isPending
                ? 'Saving...'
                : isEditing
                  ? 'Update Cinema'
                  : 'Register Cinema'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
