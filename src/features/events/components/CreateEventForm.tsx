import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Loader2, MapPin } from 'lucide-react'

import type { CreateEventValues } from '../event.schemas'
import { createEventSchema } from '../event.schemas'
import { TicketTiersField } from './TicketTiersField'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface CreateEventFormProps {
  onSubmit: (data: CreateEventValues) => void
  isPending: boolean
  organizerEmail: string
  createdBy: string
  initialData?: CreateEventValues
}

export const CreateEventForm = ({
  onSubmit,
  isPending,
  organizerEmail,
  createdBy,
  initialData,
}: CreateEventFormProps) => {
  const isEditMode = !!initialData

  const form = useForm<CreateEventValues>({
    resolver: zodResolver(createEventSchema as any),
    defaultValues: initialData || {
      title: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      organizerEmail,
      createdBy,
      // Default to one tier so the UI isn't empty on creation
      ticketTiers: [
        { name: 'General Admission', price: 0, totalAllocation: 100 },
      ],
    },
  })

  const inputStyles =
    'bg-slate-900 border-slate-800 focus-visible:ring-blue-500/50 text-slate-100 placeholder:text-slate-500'

  return (
    <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 md:p-8 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* --- Section 1: Event Details --- */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Event Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Tech Conference 2026"
                      {...field}
                      className={inputStyles}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell people what this event is about..."
                      className={`${inputStyles} min-h-30 resize-none`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Start Date</FormLabel>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input
                        type="datetime-local"
                        className={`${inputStyles} pl-9 pr-4`}
                        {...field}
                      />
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">End Date</FormLabel>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input
                        type="datetime-local"
                        className={`${inputStyles} pl-9 pr-4`}
                        {...field}
                      />
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Location</FormLabel>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                      className={`${inputStyles} pl-9`}
                      placeholder="e.g. Javits Center, New York, NY"
                      {...field}
                    />
                  </div>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <div className="h-px bg-slate-800 my-8" />

          {/* --- Section 2: Ticket Tiers --- */}
          {/* Note: In Edit Mode, we typically disable adding/removing tiers
              unless the backend specifically supports syncing the list.
              For now, we render it, but logic in useUpdateEvent ignores it. */}
          {!isEditMode && <TicketTiersField />}

          {/* --- Actions --- */}
          <div
            className={`pt-6 flex items-center justify-end gap-4 mt-6 ${!isEditMode && 'border-t border-slate-800'}`}
          >
            <Link to="/events">
              <Button
                type="button"
                variant="ghost"
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-500 text-white min-w-35 shadow-lg shadow-blue-900/20"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : isEditMode ? (
                'Update Event'
              ) : (
                'Create Event'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
