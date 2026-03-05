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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useMyCinemas } from '@/features/cinemas/hooks/useCinemas'
import { useAuditoriumsByCinema } from '@/features/auditoriums/hooks/useAuditoriums'
import { showtimeFormSchema, type ShowtimeFormValues } from '../showtime.schema'

export interface EditableShowtime extends ShowtimeFormValues {
  id: string
}

interface ShowtimeModalProps {
  isOpen: boolean
  movieTitle: string
  onClose: () => void
  onSubmit: (data: ShowtimeFormValues) => void
  initialData?: EditableShowtime | null
  isPending?: boolean
}

export const ShowtimeModal = ({
  isOpen,
  movieTitle,
  onClose,
  onSubmit,
  initialData,
  isPending,
}: ShowtimeModalProps) => {
  const form = useForm<ShowtimeFormValues>({
    resolver: zodResolver(showtimeFormSchema as any),
    defaultValues: {
      cinemaId: '',
      auditoriumId: '',
      startTimeUtc: '',
      basePrice: 15.0,
    },
  })

  const { data: myCinemas, isLoading: loadingCinemas } = useMyCinemas(isOpen)

  const selectedCinemaId = form.watch('cinemaId')
  const { data: auditoriums, isLoading: loadingAuds } =
    useAuditoriumsByCinema(selectedCinemaId)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const formattedDate = initialData.startTimeUtc.substring(0, 16)
        form.reset({
          cinemaId: initialData.cinemaId,
          auditoriumId: initialData.auditoriumId,
          startTimeUtc: formattedDate,
          basePrice: initialData.basePrice,
        })
      } else {
        // Create Mode: Reset to blanks
        form.reset({
          cinemaId: '',
          auditoriumId: '',
          startTimeUtc: '',
          basePrice: 15.0,
        })
      }
    }
  }, [isOpen, initialData, form])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Showtime' : 'Schedule Showtime'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {initialData
              ? 'Update the time or price for this screening.'
              : `Booking a slot for ${movieTitle}.`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-2"
          >
            {/* 1. Cinema Selection */}
            <FormField
              control={form.control}
              name="cinemaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-400 uppercase">
                    Select Cinema
                  </FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val)
                      form.setValue('auditoriumId', '') // Clear auditorium since cinema changed
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-slate-900 border-slate-800 focus:ring-yellow-500">
                        <SelectValue
                          placeholder={
                            loadingCinemas ? 'Loading...' : 'Choose a location'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                      {myCinemas?.content?.map((cinema) => (
                        <SelectItem key={cinema.id} value={cinema.id}>
                          {cinema.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            {/* 2. Auditorium Selection (Dependent on Cinema) */}
            <FormField
              control={form.control}
              name="auditoriumId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-400 uppercase">
                    Select Screen
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedCinemaId}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-slate-900 border-slate-800 focus:ring-yellow-500 disabled:opacity-50">
                        <SelectValue
                          placeholder={
                            !selectedCinemaId
                              ? 'Select a cinema first'
                              : loadingAuds
                                ? 'Loading...'
                                : 'Choose a screen'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                      {auditoriums?.map((aud) => (
                        <SelectItem key={aud.id} value={aud.id}>
                          {aud.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            {/* 3. Date/Time & Price */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTimeUtc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-400 uppercase">
                      Start Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
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
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-400 uppercase">
                      Base Ticket Price ($)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.50"
                        {...field}
                        className="bg-slate-900 border-slate-800 focus-visible:ring-yellow-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

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
                    ? 'Update Showtime'
                    : 'Publish Showtime'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
