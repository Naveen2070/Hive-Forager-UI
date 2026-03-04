import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Feature Components
import { EventHeader } from '@/features/events/components/EventHeader'
import { EventFiltersBar } from '@/features/events/components/EventFiltersBar'
import { EventGrid } from '@/features/events/components/EventGrid'

// API & Store & Fallbacks
import { eventsApi } from '@/api/events'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types/enum'
import { eventKeys } from '@/features/events/events.keys.ts'
import { PaginationBar } from '@/components/shared/pagination-bar.tsx'
import { DataFallback } from '@/components/shared/DataFallback'
import { useEventQueries } from '@/features/events/hooks/useEvents.ts'

export const Route = createFileRoute('/_app/events/')({
  component: EventsPage,

  loader: async ({ context }) => {
    const { queryClient } = context
    const { user } = useAuthStore.getState()
    const isOrganizer = user?.role === UserRole.ORGANIZER

    const defaultFilters = {
      status: 'PUBLISHED',
    }

    const fetchPublicEvents = async () => {
      if (import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true') {
        const { FEATURED_EVENTS_MOCK } = await import('@/api/mocks/events.mock')
        return FEATURED_EVENTS_MOCK
      }
      return eventsApi.getAll(0, 12, defaultFilters)
    }

    const fetchMyEvents = async () => {
      if (import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true') {
        const { FEATURED_EVENTS_MOCK } = await import('@/api/mocks/events.mock')
        return FEATURED_EVENTS_MOCK
      }
      return eventsApi.getMyEvents(0, 12)
    }

    const promises = []

    // Public Events
    promises.push(
      queryClient.ensureQueryData({
        queryKey: eventKeys.public(defaultFilters, 0),
        queryFn: fetchPublicEvents,
        staleTime: 1000 * 60,
      }),
    )

    // My Events (Only if Organizer)
    if (isOrganizer) {
      promises.push(
        queryClient.ensureQueryData({
          queryKey: eventKeys.mine(0),
          queryFn: fetchMyEvents,
          staleTime: 1000 * 60 * 5,
        }),
      )
    }

    await Promise.allSettled(promises)
  },
})

function EventsPage() {
  const {
    isOrganizer,
    filters,
    updateFilter,
    clearFilters,
    publicEvents,
    myEvents,
    page,
    setPage,
  } = useEventQueries()
  const [section, setSection] = useState<'mine' | 'browse'>(
    isOrganizer ? 'mine' : 'browse',
  )

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header & Filters stay visible even if data fails */}
      <EventHeader isOrganizer={isOrganizer} />

      <EventFiltersBar
        filters={filters}
        onUpdate={updateFilter}
        onClear={clearFilters}
      />

      {isOrganizer ? (
        <Tabs
          value={section}
          onValueChange={(v) => setSection(v as 'mine' | 'browse')}
          className="w-full"
        >
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger
              value="mine"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"
            >
              My Events
            </TabsTrigger>
            <TabsTrigger
              value="browse"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"
            >
              Browse All
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mine" className="mt-6">
            {/* 👉 2. Graceful Error Handling for "My Events" */}
            {myEvents.isError ? (
              <DataFallback
                title="Failed to load your events"
                message="Our worker bees hit a snag communicating with the hive. Please try again."
                onRetry={() => myEvents.refetch()}
              />
            ) : (
              <>
                <EventGrid
                  isLoading={myEvents.isLoading}
                  data={myEvents.data?.content}
                  emptyMessage="You haven't hosted any events yet. Time to create some buzz!"
                  isOwner={true}
                />
                {myEvents.data && myEvents.data.content.length > 0 && (
                  <PaginationBar
                    page={page}
                    totalPages={myEvents.data.totalPages}
                    onPageChange={setPage}
                    isPlaceholderData={myEvents.isPlaceholderData}
                  />
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="browse" className="mt-6">
            {publicEvents.isError ? (
              <DataFallback
                title="Failed to load events"
                message="Our worker bees couldn't fetch the public events right now."
                onRetry={() => publicEvents.refetch()}
              />
            ) : (
              <>
                <EventGrid
                  isLoading={publicEvents.isLoading}
                  data={publicEvents.data?.content}
                  emptyMessage="No events found matching your search criteria."
                  isOwner={false}
                />
                {publicEvents.data && publicEvents.data.content.length > 0 && (
                  <PaginationBar
                    page={page}
                    totalPages={publicEvents.data.totalPages}
                    onPageChange={setPage}
                    isPlaceholderData={publicEvents.isPlaceholderData}
                  />
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        /* Attendee View (Browse All) */
        <div className="mt-6">
          {publicEvents.isError ? (
            <DataFallback
              title="Failed to load events"
              message="Our worker bees couldn't fetch the events right now."
              onRetry={() => publicEvents.refetch()}
            />
          ) : (
            <>
              <EventGrid
                isLoading={publicEvents.isLoading}
                data={publicEvents.data?.content}
                emptyMessage="No events found matching your search criteria."
                isOwner={false}
              />
              {publicEvents.data && publicEvents.data.content.length > 0 && (
                <PaginationBar
                  page={page}
                  totalPages={publicEvents.data.totalPages}
                  onPageChange={setPage}
                  isPlaceholderData={publicEvents.isPlaceholderData}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
