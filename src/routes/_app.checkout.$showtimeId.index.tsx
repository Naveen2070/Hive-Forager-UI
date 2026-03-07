import { useMemo, useState } from 'react'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft, Minus, Plus, Users } from 'lucide-react'

import { useReserveTickets } from '@/features/tickets/hooks/useTickets'
import { DataFallback } from '@/components/shared/DataFallback'
import { Skeleton } from '@/components/ui/skeleton'

import { SeatSelectionBoard } from '@/features/showtimes/components/seatmap/SeatSelectionBoard'
import { CheckoutSidebar } from '@/features/showtimes/components/seatmap/CheckoutSidebar'
import { useSeatMap } from '@/features/showtimes/hooks/useShowTimes'
import type { SeatCoordinateDTO } from '@/types/seating.types'
import { SeatStatus } from '@/types/enum'

export const Route = createFileRoute('/_app/checkout/$showtimeId/')({
  component: CheckoutPage,
})

export function CheckoutPage() {
  const { showtimeId } = useParams({ from: '/_app/checkout/$showtimeId/' })
  const navigate = useNavigate()

  // -- State --
  const [selectedSeats, setSelectedSeats] = useState<SeatCoordinateDTO[]>([])
  const [ticketCount, setTicketCount] = useState<number>(2) // Default to 2 tickets

  // -- API Hooks --
  const {
    data: seatMapData,
    isLoading,
    isError,
    refetch,
  } = useSeatMap(showtimeId)
  const reserveMutation = useReserveTickets()

  // Fast lookup for the smart auto-selector
  const seatLookup = useMemo(() => {
    if (!seatMapData) return new Map()
    const map = new Map()
    seatMapData.seatMap.forEach((seat) =>
      map.set(`${seat.row}-${seat.col}`, seat),
    )
    return map
  }, [seatMapData])

  // -- Handlers --
  const handleSeatClick = (row: number, col: number) => {
    setSelectedSeats((prev) => {
      // 1. If clicking an already selected seat, deselect it (Manual removal)
      const isSelected = prev.some((s) => s.row === row && s.col === col)
      if (isSelected) {
        return prev.filter((s) => !(s.row === row && s.col === col))
      }

      // 2. If they already have the desired number of tickets, clear and start a new group
      let currentSelection = prev
      if (prev.length >= ticketCount) {
        currentSelection = []
      }

      const needed = ticketCount - currentSelection.length

      // 3. Smart Auto-Select Logic
      const newSeats: SeatCoordinateDTO[] = []
      let seatsFound = 0

      const isSeatAvailable = (r: number, c: number) => {
        const seat = seatLookup.get(`${r}-${c}`)
        return seat && seat.status === SeatStatus.AVAILABLE
      }

      // Attempt A: Try to fill seats to the right in the CURRENT row
      let c = col
      while (seatsFound < needed && c < seatMapData!.maxColumns) {
        if (
          isSeatAvailable(row, c) &&
          !currentSelection.some((s) => s.row === row && s.col === c)
        ) {
          newSeats.push({ row, col: c })
          seatsFound++
          c++
        } else {
          break // Hit an aisle or a taken seat
        }
      }

      // Attempt B: If still need seats, wrap to the row IN FRONT (row - 1)
      if (seatsFound < needed) {
        let frontRow = row - 1
        let frontCol = col
        while (
          frontRow >= 0 &&
          seatsFound < needed &&
          frontCol < seatMapData!.maxColumns
        ) {
          if (
            isSeatAvailable(frontRow, frontCol) &&
            !currentSelection.some(
              (s) => s.row === frontRow && s.col === frontCol,
            )
          ) {
            newSeats.push({ row: frontRow, col: frontCol })
            seatsFound++
            frontCol++
          } else {
            break // Hit an obstacle in the front row too
          }
        }
      }

      // If it still didn't find enough, it just returns what it found,
      // allowing the user to "manually map the remaining" by clicking them.
      return [...currentSelection, ...newSeats]
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

        {/* Ticket Quantity Selector UI */}
        <div className="flex items-center justify-between bg-slate-900/50 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
              <Users className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-slate-200 font-semibold">Party Size</h3>
              <p className="text-xs text-slate-500">
                How many tickets do you need?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 rounded-xl border border-slate-800 p-1">
            <button
              onClick={() => {
                setTicketCount(Math.max(1, ticketCount - 1))
                setSelectedSeats([])
              }}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-4 text-center font-bold text-lg text-slate-200">
              {ticketCount}
            </span>
            <button
              onClick={() => {
                setTicketCount(Math.min(10, ticketCount + 1))
                setSelectedSeats([])
              }}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <SeatSelectionBoard
          maxRows={seatMapData.maxRows}
          maxColumns={seatMapData.maxColumns}
          seatMap={seatMapData.seatMap}
          tiers={seatMapData.tiers}
          selectedSeats={selectedSeats}
          onToggleSeat={handleSeatClick}
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
          basePrice={seatMapData.basePrice}
          tiers={seatMapData.tiers}
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
        <Skeleton className="h-20 w-full rounded-2xl bg-slate-900" />
        <Skeleton className="h-150 w-full rounded-3xl bg-slate-900" />
      </div>
      <div className="w-full lg:w-96">
        <Skeleton className="h-100 w-full rounded-3xl bg-slate-900" />
      </div>
    </div>
  )
}
