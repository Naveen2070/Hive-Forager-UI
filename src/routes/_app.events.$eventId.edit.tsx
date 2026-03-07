import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Loader2 } from 'lucide-react'

import type { CreateEventValues } from '@/features/events/event.schemas'
import { eventsApi } from '@/api/events'
import { eventKeys } from '@/features/events/events.keys'
import { CreateEventForm } from '@/features/events/components/CreateEventForm'
import { EventStatusCard } from '@/features/events/components/EventStatusCard'
import { TicketTierManager } from '@/features/events/components/ticket-tier/TicketTierManager.tsx'
import { DataFallback } from '@/components/shared/DataFallback'
import { useUpdateEvent } from '@/features/events/hooks/useEvents.ts' // 👉 New Fallback

// Shared fetcher so both loader and hooks can use it
const fetchEventDetail = async (id: number) => {
  if (import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true') {
    const { FEATURED_EVENTS_MOCK } = await import('@/api/mocks/events.mock')
    return (
      FEATURED_EVENTS_MOCK.content.find((e: any) => e.id === id) ||
      FEATURED_EVENTS_MOCK.content[0]
    )
  }
  return eventsApi.getById(id)
}

export const Route = createFileRoute('/_app/events/$eventId/edit')({
  component: EditEventPage,
  loader: async ({ context: { queryClient }, params }) => {
    const eventId = Number(params.eventId)
    try {
      await queryClient.ensureQueryData({
        queryKey: eventKeys.detail(eventId),
        queryFn: () => fetchEventDetail(eventId),
      })
    } catch (error) {
      console.error('Failed to load event details:', error)
    }
  },
})

export function EditEventPage() {
  const { eventId } = useParams({ from: '/_app/events/$eventId/edit' })
  const id = Number(eventId)

  // Fetch Existing Data
  const {
    data: event,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => fetchEventDetail(id), // 👉 Pointed to the mock-aware fetcher
  })

  // Mutation Hook
  const { mutate: updateEvent, isPending: isSaving } = useUpdateEvent(id)

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (isError || !event) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        <Link
          to="/events"
          className="text-sm text-slate-400 hover:text-blue-400 flex items-center gap-1 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Events
        </Link>
        <DataFallback
          title="Failed to Load Event"
          message="Our worker bees couldn't fetch the details for this event to edit."
          onRetry={refetch}
        />
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
