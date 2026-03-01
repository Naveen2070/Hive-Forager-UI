import { Monitor } from 'lucide-react'
import { SeatGrid } from './SeatGrid'
import type { SeatCoordinateDTO, SeatStatusDTO } from '@/types/seating.types.ts'

interface SeatSelectionBoardProps {
  maxRows: number
  maxColumns: number
  seatMap: SeatStatusDTO[]
  selectedSeats: SeatCoordinateDTO[]
  onToggleSeat: (row: number, col: number) => void
}

export const SeatSelectionBoard = ({
  maxRows,
  maxColumns,
  seatMap,
  selectedSeats,
  onToggleSeat,
}: SeatSelectionBoardProps) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-10 flex flex-col items-center overflow-x-auto">
      {/* The Screen Indicator */}
      <div className="w-full max-w-2xl mb-12 flex flex-col items-center">
        <div className="w-full h-2 bg-linear-to-r from-slate-800 via-slate-400 to-slate-800 rounded-[100%] shadow-[0_20px_50px_rgba(255,255,255,0.1)] opacity-70" />
        <div className="mt-4 flex items-center text-slate-500 text-sm tracking-widest uppercase font-semibold">
          <Monitor className="mr-2 h-4 w-4" /> Screen
        </div>
      </div>

      {/* The Actual Grid */}
      <SeatGrid
        maxRows={maxRows}
        maxColumns={maxColumns}
        seatMap={seatMap}
        selectedSeats={selectedSeats}
        onToggleSeat={onToggleSeat}
      />

      {/* Legend */}
      <div className="mt-12 flex items-center gap-6 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-slate-800 border border-slate-700" />{' '}
          Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-yellow-500 shadow-lg shadow-yellow-500/20" />{' '}
          Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-slate-950 border border-slate-800 opacity-50 cursor-not-allowed flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
          </div>
          Taken
        </div>
      </div>
    </div>
  )
}
