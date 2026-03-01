import { SeatStatus } from '@/types/enum'
import type { SeatCoordinateDTO, SeatStatusDTO } from '@/types/seating.types.ts'

interface SeatGridProps {
  maxRows: number
  maxColumns: number
  seatMap: SeatStatusDTO[]
  selectedSeats: SeatCoordinateDTO[]
  onToggleSeat: (row: number, col: number) => void
}

export const SeatGrid = ({
  maxRows,
  maxColumns,
  seatMap,
  selectedSeats,
  onToggleSeat,
}: SeatGridProps) => {
  // Helper to convert row index (0) to letter (A)
  const getRowLetter = (rowIndex: number) => String.fromCharCode(65 + rowIndex)

  return (
    <div className="flex items-start gap-4">
      {/* Row Labels (A, B, C...) */}
      <div className="flex flex-col gap-2 pt-1 pr-2">
        {Array.from({ length: maxRows }).map((_, r) => (
          <div
            key={`label-left-${r}`}
            className="h-8 w-6 flex items-center justify-center text-xs font-bold text-slate-600"
          >
            {getRowLetter(r)}
          </div>
        ))}
      </div>

      {/* The Grid */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${maxColumns}, minmax(0, 1fr))` }}
      >
        {seatMap.map((seat) => {
          const isSelected = selectedSeats.some(
            (s) => s.row === seat.row && s.col === seat.col,
          )
          const isAvailable = seat.status === SeatStatus.AVAILABLE

          return (
            <button
              key={`seat-${seat.row}-${seat.col}`}
              disabled={!isAvailable}
              onClick={() => onToggleSeat(seat.row, seat.col)}
              className={`
                h-8 w-8 sm:h-10 sm:w-10 rounded-t-lg rounded-b-sm transition-all duration-200 flex items-center justify-center text-[10px] sm:text-xs font-medium
                ${isAvailable && !isSelected ? 'bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-500 text-slate-400 hover:text-white cursor-pointer' : ''}
                ${isSelected ? 'bg-yellow-500 text-slate-950 border border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)] scale-110 z-10' : ''}
                ${!isAvailable ? 'bg-slate-950 border border-slate-800/50 cursor-not-allowed' : ''}
              `}
              title={`Row ${getRowLetter(seat.row)}, Seat ${seat.col + 1}`}
            >
              {/* Only show seat number if it's available or selected */}
              {isAvailable || isSelected ? (
                seat.col + 1
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              )}
            </button>
          )
        })}
      </div>

      {/* Row Labels (Right Side) */}
      <div className="flex flex-col gap-2 pt-1 pl-2">
        {Array.from({ length: maxRows }).map((_, r) => (
          <div
            key={`label-right-${r}`}
            className="h-8 w-6 flex items-center justify-center text-xs font-bold text-slate-600"
          >
            {getRowLetter(r)}
          </div>
        ))}
      </div>
    </div>
  )
}
