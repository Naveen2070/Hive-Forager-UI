import { Link, createFileRoute, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { eventsApi } from '@/api/events'
import { eventKeys } from '@/features/events/events.keys'
import { Separator } from '@/components/ui/separator'

// Feature Components
import { EventHero } from '@/features/events/components/detail/EventHero'
import { EventDescription } from '@/features/events/components/detail/EventDescription'
import { EventDetailSkeleton } from '@/features/events/components/detail/EventDetailSkeleton'
import { useEventDetail } from '@/features/events/hooks/UseEventDetail.ts'
import { BookingCard } from '@/features/bookings/components/BookingCard.tsx'

export const Route = createFileRoute('/_app/events/$eventId/')({
  component: EventDetailsPage,
  loader: ({ context: { queryClient }, params }) => {
    const eventId = Number(params.eventId)
    return queryClient.ensureQueryData({
      queryKey: eventKeys.detail(eventId),
      queryFn: () => eventsApi.getById(eventId),
    })
  },
})

function EventDetailsPage() {
  const { eventId } = useParams({ from: '/_app/events/$eventId/' })
  const { event, isLoading } = useEventDetail(Number(eventId))

  if (isLoading || !event) return <EventDetailSkeleton />

  return (
    <div className="max-w-5xl mx-auto space-y-8">
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
