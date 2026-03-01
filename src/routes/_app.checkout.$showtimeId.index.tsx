import { useState } from 'react'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { useReserveTickets } from '@/features/tickets/hooks/useTickets'
import { DataFallback } from '@/components/shared/DataFallback'
import { Skeleton } from '@/components/ui/skeleton'

import { SeatSelectionBoard } from '@/features/showtimes/components/seatmap/SeatSelectionBoard'
import { CheckoutSidebar } from '@/features/showtimes/components/seatmap/CheckoutSidebar'
import { useSeatMap } from '@/features/showtimes/hooks/useShowTimes.ts'
import type { SeatCoordinateDTO } from '@/types/seating.types.ts'

export const Route = createFileRoute('/_app/checkout/$showtimeId/')({
  component: CheckoutPage,
})

function CheckoutPage() {
  const { showtimeId } = useParams({ from: '/_app/checkout/$showtimeId/' })
  const navigate = useNavigate()

  // -- State --
  const [selectedSeats, setSelectedSeats] = useState<SeatCoordinateDTO[]>([])

  // -- API Hooks --
  const {
    data: seatMapData,
    isLoading,
    isError,
    refetch,
  } = useSeatMap(showtimeId)
  const reserveMutation = useReserveTickets()

  // -- Handlers --
  const toggleSeat = (row: number, col: number) => {
    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.row === row && s.col === col)
      if (isSelected) {
        return prev.filter((s) => !(s.row === row && s.col === col))
      }
      if (prev.length >= 10) return prev
      return [...prev, { row, col }]
    })
  }

  const handleCheckout = () => {
    if (selectedSeats.length === 0) return

    reserveMutation.mutate(
      { showtimeId, seats: selectedSeats },
      { onSuccess: () => navigate({ to: '/bookings' }) },
    )
  }

  // -- Render States --
  if (isLoading) return <CheckoutSkeleton />

  if (isError || !seatMapData) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <DataFallback
          title="Seat Map Unavailable"
          message="Our worker bees couldn't load the auditorium layout right now."
          onRetry={refetch}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8">
      {/* LEFT COLUMN: The Interactive Seat Map */}
      <div className="flex-1 space-y-6">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-sm text-slate-400 hover:text-yellow-400 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to Showtimes
        </button>

        <SeatSelectionBoard
          maxRows={seatMapData.maxRows}
          maxColumns={seatMapData.maxColumns}
          seatMap={seatMapData.seatMap}
          selectedSeats={selectedSeats}
          onToggleSeat={toggleSeat}
        />
      </div>

      {/* RIGHT COLUMN: Checkout Sidebar */}
      <div className="w-full lg:w-96 shrink-0">
        <CheckoutSidebar
          movieTitle={seatMapData.movieTitle}
          cinemaName={seatMapData.cinemaName}
          auditoriumName={seatMapData.auditoriumName}
          selectedSeats={selectedSeats}
          onCheckout={handleCheckout}
          isPending={reserveMutation.isPending}
        />
      </div>
    </div>
  )
}

function CheckoutSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <Skeleton className="h-8 w-32 bg-slate-900" />
        <Skeleton className="h-150 w-full rounded-3xl bg-slate-900" />
      </div>
      <div className="w-full lg:w-96">
        <Skeleton className="h-100 w-full rounded-3xl bg-slate-900" />
      </div>
    </div>
  )
}
