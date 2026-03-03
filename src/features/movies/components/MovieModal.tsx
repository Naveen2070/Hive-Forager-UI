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
import { Textarea } from '@/components/ui/textarea'

import type { MovieResponse } from '@/types/movie.type'
import { type MovieFormValues, movieSchema } from '../movie.schema'

interface MovieModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: MovieFormValues) => void
  initialData?: MovieResponse | null
  isPending?: boolean
}

export const MovieModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isPending,
}: MovieModalProps) => {
  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieSchema as any),
    defaultValues: {
      title: '',
      description: '',
      durationMinutes: 120,
      releaseDate: '',
      posterUrl: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          title: initialData.title,
          description: initialData.description,
          durationMinutes: initialData.durationMinutes,
          // Extract YYYY-MM-DD for the HTML date input
          releaseDate: initialData.releaseDate.split('T')[0],
          posterUrl: initialData.posterUrl || '',
        })
      } else {
        form.reset({
          title: '',
          description: '',
          durationMinutes: 120,
          releaseDate: '',
          posterUrl: '',
        })
      }
    }
  }, [isOpen, initialData, form])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Movie' : 'Add New Movie'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Enter the details for this film. It will become available for
            showtime scheduling.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-400 uppercase">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-slate-900 border-slate-800 focus-visible:ring-yellow-500"
                      placeholder="e.g. Dune: Part Three"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-400 uppercase">
                      Release Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="bg-slate-900 border-slate-800 focus-visible:ring-yellow-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-400 uppercase">
                      Runtime (Minutes)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="bg-slate-900 border-slate-800 focus-visible:ring-yellow-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="posterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-400 uppercase">
                    Poster URL (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-slate-900 border-slate-800 focus-visible:ring-yellow-500"
                      placeholder="https://..."
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-400 uppercase">
                    Synopsis
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="bg-slate-900 border-slate-800 focus-visible:ring-yellow-500 resize-none h-24"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
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
                  : initialData
                    ? 'Update Movie'
                    : 'Add Movie'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
