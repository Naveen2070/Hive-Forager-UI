import { Loader2, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SeatCoordinateDTO } from '@/types/seating.types.ts'

interface CheckoutSidebarProps {
  movieTitle: string
  cinemaName: string
  auditoriumName: string
  selectedSeats: SeatCoordinateDTO[]
  onCheckout: () => void
  isPending: boolean
}

export const CheckoutSidebar = ({
  movieTitle,
  cinemaName,
  auditoriumName,
  selectedSeats,
  onCheckout,
  isPending,
}: CheckoutSidebarProps) => {
  // Hardcoding base price for UI demonstration (In a real app, pass this from the API)
  const BASE_PRICE = 15.5
  const totalAmount = selectedSeats.length * BASE_PRICE

  const getRowLetter = (rowIndex: number) => String.fromCharCode(65 + rowIndex)

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sticky top-24 shadow-2xl backdrop-blur-xl">
      <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

      {/* Movie Details Info */}
      <div className="space-y-3 mb-8 border-b border-slate-800 pb-6">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Movie
          </p>
          <p className="text-base text-slate-200 font-medium">{movieTitle}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Cinema
          </p>
          <p className="text-base text-slate-200 font-medium">{cinemaName}</p>
          <p className="text-sm text-slate-400">{auditoriumName}</p>
        </div>
      </div>

      {/* Selected Seats List */}
      <div className="mb-8">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
          Selected Seats ({selectedSeats.length})
        </p>

        {selectedSeats.length === 0 ? (
          <div className="text-sm text-slate-600 italic">
            No seats selected yet.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seat) => (
              <div
                key={`${seat.row}-${seat.col}`}
                className="bg-slate-800 border border-slate-700 text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-md"
              >
                {getRowLetter(seat.row)}
                {seat.col + 1}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total & Checkout Button */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex items-end justify-between">
          <span className="text-slate-400 font-medium">Total</span>
          <span className="text-3xl font-extrabold text-white">
            ${totalAmount.toFixed(2)}
          </span>
        </div>

        <Button
          onClick={onCheckout}
          disabled={selectedSeats.length === 0 || isPending}
          className="w-full h-14 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg rounded-xl transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:shadow-none"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          ) : (
            <Ticket className="mr-2 h-6 w-6" />
          )}
          {isPending ? 'Reserving...' : 'Checkout'}
        </Button>
      </div>
    </div>
  )
}
