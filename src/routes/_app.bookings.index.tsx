import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Calendar, History, Search, Sparkles, Ticket } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { useMyBookings } from '@/features/bookings/hooks/useMyBookings'
import { TicketCard } from '@/features/bookings/components/TicketCard'
import { HistoryTicketRow } from '@/features/bookings/components/HistoryTicketRow' // Import new row
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { bookingsApi } from '@/api/booking.ts'
import { bookingKeys } from '@/features/bookings/bookings.keys.ts'
import { BookingStatus } from '@/types/enum'

export const Route = createFileRoute('/_app/bookings/')({
  component: MyBookingsPage,
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData({
      queryKey: bookingKeys.mine(),
      queryFn: bookingsApi.getMyBookings,
    })
  },
})

function MyBookingsPage() {
  const { data: bookingsData, isLoading } = useMyBookings()
  const bookings = bookingsData?.content
  const [viewMode, setViewMode] = useState<'upcoming' | 'history'>('upcoming')

  if (isLoading) return <BookingsSkeleton />
  if (!bookings || bookings.length === 0) return <EmptyState />

  const now = new Date()

  // Filter & Sort Logic
  const upcomingBookings = bookings.filter((b) => {
    return (
      new Date(b.eventEndDate) >= now &&
      (b.status === BookingStatus.CONFIRMED ||
        b.status === BookingStatus.CHECKED_IN ||
        b.status === BookingStatus.PENDING)
    )
  })
  upcomingBookings.sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
  )

  const pastBookings = bookings.filter((b) => {
    return (
      new Date(b.eventEndDate) < now ||
      b.status === BookingStatus.CANCELLED ||
      b.status === BookingStatus.EXPIRED ||
      b.status === BookingStatus.REFUNDED
    )
  })
  pastBookings.sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
  )

  const nextEvent = upcomingBookings.length > 0 ? upcomingBookings[0] : null
  const otherUpcoming =
    upcomingBookings.length > 0 ? upcomingBookings.slice(1) : []

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 min-h-screen flex flex-col gap-6">
      {/* 1. STABLE HEADER SECTION (Never Moves) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sticky top-0 z-30 bg-slate-950/95 backdrop-blur-xl py-4 -mx-4 px-4 sm:static sm:bg-transparent sm:p-0 border-b border-white/5 sm:border-none">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            My Wallet
          </h1>
          <p className="text-slate-400 text-sm hidden sm:block">
            Manage your tickets & receipts
          </p>
        </div>

        {/* Toggle Pill */}
        <div className="bg-slate-900 p-1 rounded-full flex relative w-full sm:w-auto shadow-inner border border-slate-800">
          <motion.div
            className="absolute top-1 bottom-1 bg-blue-600 rounded-full shadow-lg z-0"
            initial={false}
            animate={{
              x: viewMode === 'upcoming' ? 0 : '100%',
              width: '50%',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setViewMode('upcoming')}
            className={`relative z-10 flex-1 sm:w-32 py-2 text-sm font-medium transition-colors text-center rounded-full ${viewMode === 'upcoming' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Active ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`relative z-10 flex-1 sm:w-32 py-2 text-sm font-medium transition-colors text-center rounded-full ${viewMode === 'history' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
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
              {/* Next Up Hero */}
              {nextEvent ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-xs px-1">
                    <Sparkles className="h-4 w-4" /> Next Up
                  </div>
                  <TicketCard booking={nextEvent} />
                </div>
              ) : (
                <EmptyUpcomingState />
              )}

              {/* Other Upcoming */}
              {otherUpcoming.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-1">
                    Later
                  </h3>
                  <div className="grid gap-6">
                    {otherUpcoming.map((booking) => (
                      <TicketCard
                        key={booking.bookingReference}
                        booking={booking}
                      />
                    ))}
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
              {pastBookings.length > 0 ? (
                pastBookings.map((booking) => (
                  <HistoryTicketRow
                    key={booking.bookingReference}
                    booking={booking}
                  />
                ))
              ) : (
                <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                  <History className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500">No past events found.</p>
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
