import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Calendar, History, Search, Sparkles, Ticket } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { useMyBookings } from '@/features/bookings/hooks/useMyBookings'
import { TicketCard } from '@/features/bookings/components/TicketCard'

import { useMyTickets } from '@/features/tickets/hooks/useTickets'
import { MovieTicketCard } from '@/features/tickets/components/MovieTicketCard'
import { ticketsApi } from '@/api/tickets'
import { ticketKeys } from '@/features/tickets/tickets.keys'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { bookingsApi } from '@/api/booking.ts'
import { bookingKeys } from '@/features/bookings/bookings.keys.ts'
import { BookingStatus, TicketStatus } from '@/types/enum'
import { DataFallback } from '@/components/shared/DataFallback'

const fetchMyBookings = async () => {
  if (import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true') {
    const { MY_BOOKINGS_MOCK } = await import('@/api/mocks/bookings.mock')
    return MY_BOOKINGS_MOCK
  }
  return bookingsApi.getMyBookings()
}

const fetchMyTickets = async () => {
  if (import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true') {
    const { MOCK_MY_TICKETS } = await import('@/api/mocks/tickets.mock')
    return MOCK_MY_TICKETS
  }
  return ticketsApi.getMyTickets()
}

export const Route = createFileRoute('/_app/bookings/')({
  component: MyBookingsPage,
  loader: async ({ context: { queryClient } }) => {
    try {
      await Promise.allSettled([
        queryClient.ensureQueryData({
          queryKey: bookingKeys.mine(),
          queryFn: fetchMyBookings,
        }),
        queryClient.ensureQueryData({
          queryKey: ticketKeys.mine(),
          queryFn: fetchMyTickets,
        }),
      ])
    } catch (error) {
      console.error('Failed to load wallet data:', error)
    }
  },
})

function MyBookingsPage() {
  const [viewMode, setViewMode] = useState<'upcoming' | 'history'>('upcoming')

  // Fetch both sets of data
  const {
    data: bookingsData,
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
    refetch: refetchEvents,
  } = useMyBookings()
  const {
    data: ticketsData,
    isLoading: isLoadingTickets,
    isError: isErrorTickets,
    refetch: refetchTickets,
  } = useMyTickets()

  const isLoading = isLoadingEvents || isLoadingTickets
  const isError = isErrorEvents || isErrorTickets

  if (isLoading) return <BookingsSkeleton />

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 min-h-screen">
        <DataFallback
          title="Wallet Unavailable"
          message="We couldn't retrieve your tickets and receipts at this time."
          onRetry={async () => {
            await refetchEvents()
            await refetchTickets()
          }}
        />
      </div>
    )
  }

  const events = bookingsData?.content || []
  const movies = ticketsData || []

  if (events.length === 0 && movies.length === 0) return <EmptyState />

  const now = new Date()

  // UNIFICATION: Normalize both Arrays into a standard format so we can mix them
  const normalizedEvents = events.map((b) => ({
    id: b.bookingReference,
    type: 'EVENT' as const,
    sortDate: new Date(b.eventDate),
    isUpcoming:
      new Date(b.eventEndDate) >= now &&
      [
        BookingStatus.CONFIRMED,
        BookingStatus.CHECKED_IN,
        BookingStatus.PENDING,
      ].includes(b.status),
    data: b,
  }))

  const normalizedMovies = movies.map((t) => {
    const startTime = new Date(t.startTimeUtc)
    // Assume movies run ~3 hours for the sake of moving them to history
    const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000)
    return {
      id: t.ticketId,
      type: 'MOVIE' as const,
      sortDate: startTime,
      isUpcoming:
        endTime >= now &&
        [TicketStatus.PENDING, TicketStatus.PENDING].includes(
          t.status as TicketStatus,
        ),
      data: t,
    }
  })

  // Combine and Sort
  const allWalletItems = [...normalizedEvents, ...normalizedMovies]

  const upcomingItems = allWalletItems
    .filter((i) => i.isUpcoming)
    .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())

  const pastItems = allWalletItems
    .filter((i) => !i.isUpcoming)
    .sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())

  const nextItem = upcomingItems.length > 0 ? upcomingItems[0] : null
  const otherUpcoming = upcomingItems.length > 0 ? upcomingItems.slice(1) : []

  // Helper to render the correct card based on type
  const renderItemCard = (item: any) => {
    if (item.type === 'MOVIE') {
      return <MovieTicketCard key={item.id} ticket={item.data} />
    }
    return <TicketCard key={item.id} booking={item.data} />
  }

  // Helper to render history rows
  const renderHistoryRow = (item: any) => {
    if (item.type === 'MOVIE') {
      return <MovieTicketCard key={item.id} ticket={item.data} />
    }
    return <TicketCard key={item.id} booking={item.data} />
  }
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 min-h-screen flex flex-col gap-6">
      {/* 1. STABLE HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sticky top-0 z-30 bg-slate-950/95 backdrop-blur-xl py-4 -mx-4 px-4 sm:static sm:bg-transparent sm:p-0 border-b border-white/5 sm:border-none">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            My Wallet
          </h1>
          <p className="text-slate-400 text-sm hidden sm:block">
            Manage your tickets & receipts
          </p>
        </div>

        <div className="bg-slate-900 p-1 rounded-full flex relative w-full sm:w-auto shadow-inner border border-slate-800">
          <motion.div
            className="absolute top-1 bottom-1 bg-blue-600 rounded-full shadow-lg z-0"
            initial={false}
            animate={{ x: viewMode === 'upcoming' ? 0 : '100%', width: '50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setViewMode('upcoming')}
            className={`relative z-10 flex-1 sm:w-32 py-2 text-sm font-medium transition-colors text-center rounded-full ${viewMode === 'upcoming' ? 'text-white' : 'text-slate-400'}`}
          >
            Active ({upcomingItems.length})
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`relative z-10 flex-1 sm:w-32 py-2 text-sm font-medium transition-colors text-center rounded-full ${viewMode === 'history' ? 'text-white' : 'text-slate-400'}`}
          >
            History
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC CONTENT AREA */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {viewMode === 'upcoming' ? (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {nextItem ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-xs px-1">
                    <Sparkles className="h-4 w-4" /> Next Up
                  </div>
                  {renderItemCard(nextItem)}
                </div>
              ) : (
                <EmptyUpcomingState />
              )}

              {otherUpcoming.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-1">
                    Later
                  </h3>
                  <div className="grid gap-6">
                    {otherUpcoming.map(renderItemCard)}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {pastItems.length > 0 ? (
                pastItems.map(renderHistoryRow)
              ) : (
                <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                  <History className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500">No past bookings found.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-4">
      <div className="h-20 w-20 bg-slate-900 rounded-full flex items-center justify-center mb-2 animate-pulse">
        <Ticket className="h-10 w-10 text-slate-500" />
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white">Your wallet is empty</h3>
        <p className="text-slate-400 max-w-sm mx-auto">
          Tickets you purchase will appear here. Ready to find your next
          adventure?
        </p>
      </div>
      <Link to="/events">
        <Button className="mt-6 bg-blue-600 hover:bg-blue-500 h-11 px-8 rounded-full">
          <Search className="mr-2 h-4 w-4" /> Browse Events
        </Button>
      </Link>
    </div>
  )
}

function EmptyUpcomingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800 space-y-4">
      <Calendar className="h-10 w-10 text-slate-600" />
      <div className="text-center">
        <p className="text-slate-300 font-medium">No upcoming tickets</p>
        <p className="text-sm text-slate-500">
          Check your history for past events.
        </p>
      </div>
      <Link to="/events">
        <Button variant="outline" className="border-slate-700 text-slate-300">
          Browse Events
        </Button>
      </Link>
    </div>
  )
}

function BookingsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48 bg-slate-800 rounded-lg" />
        <Skeleton className="h-10 w-64 bg-slate-800 rounded-full" />
      </div>
      <Skeleton className="h-50 w-full rounded-2xl bg-slate-900" />
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-xl bg-slate-900" />
        <Skeleton className="h-24 w-full rounded-xl bg-slate-900" />
      </div>
    </div>
  )
}
