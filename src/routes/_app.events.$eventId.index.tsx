import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { eventsApi } from '@/api/events'
import { eventKeys } from '@/features/events/events.keys'
import { Separator } from '@/components/ui/separator'

// Feature Components
import { EventHero } from '@/features/events/components/detail/EventHero'
import { EventDescription } from '@/features/events/components/detail/EventDescription'
import { EventDetailSkeleton } from '@/features/events/components/detail/EventDetailSkeleton'
import { BookingCard } from '@/features/bookings/components/BookingCard.tsx'
import { DataFallback } from '@/components/shared/DataFallback'
import { useEventDetail } from '@/features/events/hooks/useEvents.ts'

// Shared fetcher so both loader and hooks can use it if needed
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

export const Route = createFileRoute('/_app/events/$eventId/')({
  component: EventDetailsPage,
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

export function EventDetailsPage() {
  const { eventId } = useParams({ from: '/_app/events/$eventId/' })

  const { event, isLoading, isError, refetch } = useEventDetail(Number(eventId))

  if (isLoading) return <EventDetailSkeleton />

  if (isError || !event) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
        <Link
          to="/events"
          className="inline-flex items-center text-sm text-slate-400 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
        </Link>
        <DataFallback
          title="Event Not Found"
          message="Our worker bees couldn't locate this event. It might have been moved or canceled."
          onRetry={refetch}
        />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
      {/* Back Button */}
      <Link
        to="/events"
        className="inline-flex items-center text-sm text-slate-400 hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-8">
          <EventHero event={event} />
          <Separator className="bg-slate-800" />
          <EventDescription description={event.description} />
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <BookingCard event={event} />
          </div>
        </div>
      </div>
    </div>
  )
}
