import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Feature Components
import { EventHeader } from '@/features/events/components/EventHeader'
import { EventFiltersBar } from '@/features/events/components/EventFiltersBar'
import { EventGrid } from '@/features/events/components/EventGrid'
import { useEventQueries } from '@/features/events/hooks/useEventQueries'

// API & Store
import { eventsApi } from '@/api/events'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types/enum'
import { eventKeys } from '@/features/events/events.keys.ts'
import { PaginationBar } from '@/components/common/pagination-bar.tsx'

export const Route = createFileRoute('/_app/events/')({
  component: EventsPage,

  loader: async ({ context }) => {
    const { queryClient } = context
    const { user } = useAuthStore.getState()
    const isOrganizer = user?.role === UserRole.ORGANIZER

    const promises = []

    const defaultFilters = {
      status: 'PUBLISHED',
    }

    // Public Events
    promises.push(
      queryClient.ensureQueryData({
        queryKey: eventKeys.public(defaultFilters, 0),
        queryFn: () => eventsApi.getAll(0, 12, defaultFilters),
        staleTime: 1000 * 60,
      }),
    )

    // My Events (Only if Organizer)
    if (isOrganizer) {
      promises.push(
        queryClient.ensureQueryData({
          queryKey: eventKeys.mine(0),
          queryFn: () => eventsApi.getMyEvents(0, 12),
          staleTime: 1000 * 60 * 5,
        }),
      )
    }

    // Wait for data to be ready
    await Promise.all(promises)
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
  const [section, setSection] = useState<'mine' | 'browse'>(isOrganizer ? 'mine' : 'browse')

  return (
    <div className="space-y-8">
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
            <EventGrid
              isLoading={myEvents.isLoading}
              data={myEvents.data?.content}
              emptyMessage="You haven't created any events yet."
              isOwner={true}
            />
            {myEvents.data && (
              <PaginationBar
                page={page}
                totalPages={myEvents.data.totalPages}
                onPageChange={setPage}
                isPlaceholderData={myEvents.isPlaceholderData}
              />
            )}
          </TabsContent>

          <TabsContent value="browse" className="mt-6">
            <EventGrid
              isLoading={publicEvents.isLoading}
              data={publicEvents.data?.content}
              emptyMessage="No events found matching your search."
              isOwner={false}
            />
            {publicEvents.data && (
              <PaginationBar
                page={page}
                totalPages={publicEvents.data.totalPages}
                onPageChange={setPage}
                isPlaceholderData={publicEvents.isPlaceholderData}
              />
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <EventGrid
            isLoading={publicEvents.isLoading}
            data={publicEvents.data?.content}
            emptyMessage="No events found matching your search."
            isOwner={false}
          />
          {publicEvents.data && (
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
  )
}
