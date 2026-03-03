import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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
  const form = useForm<createCinemaValues>({
    resolver: zodResolver(createCinemaSchema),
    defaultValues: {
      name: '',
      location: '',
      contactEmail: '',
    },
  })

  // Populate form if we are editing
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          location: initialData.location,
          contactEmail: initialData.contactEmail || '',
        })
      } else {
        form.reset({ name: '', location: '', contactEmail: '' })
      }
    }
  }, [isOpen, initialData, form])

  const isEditing = !!initialData

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="Cinema Modal"
        className="bg-slate-950 border-slate-800 text-slate-200"
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Cinema' : 'Register New Cinema'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the details of your cinema'
              : 'Add a new cinema to the directory'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-400 uppercase">
                    Cinema Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-slate-900 border-slate-800 focus-visible:ring-yellow-500"
                      placeholder="e.g. Hive Multiplex Downtown"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-400 uppercase">
                    Physical Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-slate-900 border-slate-800 focus-visible:ring-yellow-500"
                      placeholder="123 Main St, City, ST 12345"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-400 uppercase">
                    Contact Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      disabled={isEditing}
                      className="bg-slate-900 border-slate-800 focus-visible:ring-yellow-500 disabled:opacity-50"
                      placeholder="manager@hivecinema.com"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                  {isEditing && (
                    <p className="text-[10px] text-slate-500 mt-1">
                      Contact email cannot be changed after registration.
                    </p>
                  )}
                </FormItem>
              )}
            />

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
        </Form>
      </DialogContent>
    </Dialog>
  )
}
