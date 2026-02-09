import { Link, createFileRoute, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Loader2 } from 'lucide-react'

import type { CreateEventValues } from '@/features/events/event.schemas'
import { eventsApi } from '@/api/events'
import { eventKeys } from '@/features/events/events.keys'
import { CreateEventForm } from '@/features/events/components/CreateEventForm'
import { useUpdateEvent } from '@/features/events/hooks/useUpdateEvent'
import { EventStatusCard } from '@/features/events/components/EventStatusCard'
import { TicketTierManager } from '@/features/events/components/ticket-tier/TicketTierManager.tsx'

export const Route = createFileRoute('/_app/events/$eventId/edit')({
  component: EditEventPage,
  loader: ({ context: { queryClient }, params }) => {
    const eventId = Number(params.eventId)
    return queryClient.ensureQueryData({
      queryKey: eventKeys.detail(eventId),
      queryFn: () => eventsApi.getById(eventId),
    })
  },
})

function EditEventPage() {
  const { eventId } = useParams({ from: '/_app/events/$eventId/edit' })
  const id = Number(eventId)

  // Fetch Existing Data
  const { data: event, isLoading } = useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.getById(id),
  })

  // Mutation Hook
  const { mutate: updateEvent, isPending: isSaving } = useUpdateEvent(id)

  if (isLoading || !event) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  // Initial Data
  const initialData: CreateEventValues = {
    title: event.title,
    description: event.description,
    location: event.location,
    startDate: event.startDate.slice(0, 16),
    endDate: event.endDate.slice(0, 16),
    organizerEmail: event.organizerName,
    createdBy: String(event.organizerId),
    // We pass tiers so the form validation passes,
    // but remember useUpdateEvent ignores changes to this field.
    ticketTiers: event.ticketTiers,
  }

  // Handle Submit (Basic Info Only)
  const handleSubmit = (data: CreateEventValues) => {
    const payload = {
      ...data,
      startDate:
        data.startDate.length === 16 ? `${data.startDate}:00` : data.startDate,
      endDate: data.endDate.length === 16 ? `${data.endDate}:00` : data.endDate,
    }
    updateEvent(payload)
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Link
          to="/events"
          className="text-sm text-slate-400 hover:text-blue-400 flex items-center gap-1 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Events
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Edit Event
        </h1>
        <p className="text-slate-400">Update the details of your event.</p>
      </div>

      <EventStatusCard eventId={event.id} currentStatus={event.status} />

      {/* Section 1: Basic Event Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <h2 className="text-xl font-bold text-slate-100">Event Details</h2>
        </div>

        <CreateEventForm
          onSubmit={handleSubmit}
          isPending={isSaving}
          organizerEmail={event.organizerName}
          createdBy={String(event.organizerId)}
          initialData={initialData}
        />
      </div>

      {/* Section 2: Ticket Management */}
      {/* We separate this visually so the user knows it's distinct from the form above */}
      <div className="pt-8 space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <h2 className="text-xl font-bold text-slate-100">
            Ticket Management
          </h2>
        </div>

        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6">
          <TicketTierManager event={event} />
        </div>
      </div>
    </div>
  )
}
