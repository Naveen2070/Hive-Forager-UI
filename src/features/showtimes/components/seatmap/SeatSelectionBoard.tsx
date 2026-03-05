import { Monitor } from 'lucide-react'
import { SeatGrid } from './SeatGrid'
import type {
  SeatCoordinateDTO,
  SeatStatusDTO,
  SeatTierDTO,
} from '@/types/seating.types.ts'

interface SeatSelectionBoardProps {
  maxRows: number
  maxColumns: number
  seatMap: SeatStatusDTO[]
  tiers?: SeatTierDTO[]
  selectedSeats: SeatCoordinateDTO[]
  onToggleSeat: (row: number, col: number) => void
}

export const SeatSelectionBoard = ({
  maxRows,
  maxColumns,
  seatMap,
  tiers,
  selectedSeats,
  onToggleSeat,
}: SeatSelectionBoardProps) => {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col items-center min-w-0 w-full">
      {/* Sleek Curved Screen Indicator */}
      <div className="w-full max-w-xl mb-8 sm:mb-12 flex flex-col items-center relative">
        {/* A thinner, cleaner physical curve */}
        <div className="w-full h-8 border-t-2 border-slate-700 rounded-t-[100%] opacity-60 shadow-[0_-5px_15px_rgba(255,255,255,0.03)]" />

        <div className="absolute top-1 flex items-center text-slate-500 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-bold">
          <Monitor className="mr-2 h-3.5 w-3.5" /> Screen
        </div>
      </div>

      {/* The Actual Grid */}
      <SeatGrid
        maxRows={maxRows}
        maxColumns={maxColumns}
        seatMap={seatMap}
        tiers={tiers}
        selectedSeats={selectedSeats}
        onToggleSeat={onToggleSeat}
      />

      {/* Clean Minimalist Legend */}
      <div className="mt-4 sm:mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400 bg-slate-950/60 py-2.5 px-6 rounded-full border border-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-slate-800 border border-slate-950" />{' '}
          Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-yellow-500 shadow-sm shadow-yellow-500/20" />{' '}
          Selected
        </div>
        <div className="flex items-center gap-2">
          {/* Updated Taken Legend Item */}
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-slate-900 border border-slate-950 flex items-center justify-center">
            <span className="text-slate-700 opacity-50 font-bold text-[6px] sm:text-[8px]">
              X
            </span>
          </div>
          Taken
        </div>
      </div>
    </div>
  )
}
