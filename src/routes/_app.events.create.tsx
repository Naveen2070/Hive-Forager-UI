import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import type { CreateEventValues } from '@/features/events/event.schemas'
import type { CreateEventRequest } from '@/types/event.type.ts'
import { useCreateEvent } from '@/features/events/hooks/useCreateEvent'
import { CreateEventForm } from '@/features/events/components/CreateEventForm'
import { useAuthStore } from '@/store/auth.store.ts'

export const Route = createFileRoute('/_app/events/create')({
  component: CreateEventPage,
})

function CreateEventPage() {
  const { mutate: createEvent, isPending } = useCreateEvent()
  const { user } = useAuthStore()

  const handleSubmit = (data: CreateEventValues) => {
    // 1. Format Main Event Dates
    const eventStart =
      data.startDate.length === 16 ? `${data.startDate}:00` : data.startDate
    const eventEnd =
      data.endDate.length === 16 ? `${data.endDate}:00` : data.endDate

    // 2. Map Ticket Tiers with Logic
    const formattedTiers = data.ticketTiers.map((tier) => {
      let validFrom = eventStart
      let validUntil = eventEnd

      // Check logic: If Opt-in AND user actually selected dates
      if (tier.enableCustomDates && tier.validFrom && tier.validUntil) {
        validFrom =
          tier.validFrom.length === 16 ? `${tier.validFrom}:00` : tier.validFrom
        validUntil =
          tier.validUntil.length === 16
            ? `${tier.validUntil}:00`
            : tier.validUntil
      }

      // Return clean object without the helper boolean
      return {
        name: tier.name,
        price: tier.price,
        totalAllocation: tier.totalAllocation,
        validFrom,
        validUntil,
        createdBy: Number(data.createdBy),
      }
    })

    const payload = {
      ...data,
      startDate: eventStart,
      endDate: eventEnd,
      ticketTiers: formattedTiers,
      title: data.title,
      description: data.description,
      location: data.location,
      organizerEmail: data.organizerEmail,
      createdBy: Number(data.createdBy),
    } satisfies CreateEventRequest

    createEvent(payload)
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="mb-8 space-y-2">
        <Link
          to="/events"
          className="text-sm text-slate-400 hover:text-blue-400 flex items-center gap-1 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Create New Event
        </h1>
        <p className="text-slate-400">
          Fill in the details to publish your event to the hive.
        </p>
      </div>

      <CreateEventForm
        onSubmit={handleSubmit}
        isPending={isPending}
        organizerEmail={user?.email || ''}
        createdBy={String(user?.id || '')}
      />
    </div>
  )
}
