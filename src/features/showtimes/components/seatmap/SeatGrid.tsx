import React, { useMemo } from 'react'
import { SeatStatus } from '@/types/enum'
import type {
  SeatCoordinateDTO,
  SeatStatusDTO,
  SeatTierDTO,
} from '@/types/seating.types.ts'

interface SeatGridProps {
  maxRows: number
  maxColumns: number
  seatMap: SeatStatusDTO[]
  selectedSeats: SeatCoordinateDTO[]
  tiers?: SeatTierDTO[]
  onToggleSeat: (row: number, col: number) => void
}

export const SeatGrid = ({
  maxRows,
  maxColumns,
  seatMap,
  selectedSeats,
  tiers = [],
  onToggleSeat,
}: SeatGridProps) => {
  const seatLookup = useMemo(() => {
    const map = new Map<string, SeatStatusDTO>()
    seatMap.forEach((seat) => map.set(`${seat.row}-${seat.col}`, seat))
    return map
  }, [seatMap])

  const getRowLetter = (rowIndex: number) => String.fromCharCode(65 + rowIndex)

  // Helper to check if a seat is in a premium tier
  const getSeatTier = (r: number, c: number) => {
    return tiers.find((tier) =>
      tier.seats.some((s: any) => s.row === r && s.col === c),
    )
  }

  return (
    <div className="w-full overflow-x-auto pb-4 custom-scrollbar flex justify-center">
      <div
        className="inline-grid gap-1 sm:gap-1.5 md:gap-2 items-center"
        style={{
          gridTemplateColumns: `auto repeat(${maxColumns}, max-content) auto`,
        }}
      >
        {Array.from({ length: maxRows }).map((_, r) => (
          <React.Fragment key={`row-${r}`}>
            <div className="flex items-center justify-end pr-2 sm:pr-4 text-[10px] sm:text-xs font-bold text-slate-500 w-6">
              {getRowLetter(r)}
            </div>

            {Array.from({ length: maxColumns }).map((_, c) => {
              const seat = seatLookup.get(`${r}-${c}`)

              if (!seat) {
                return (
                  <div
                    key={`empty-${r}-${c}`}
                    className="w-6 h-7 sm:w-7 sm:h-8 md:w-8 md:h-8 pointer-events-none"
                  />
                )
              }

              const isSelected = selectedSeats.some(
                (s) => s.row === r && s.col === c,
              )
              const isAvailable = seat.status === SeatStatus.AVAILABLE
              const tier = getSeatTier(r, c)
              const isVip = !!tier

              return (
                <button
                  key={`seat-${r}-${c}`}
                  disabled={!isAvailable}
                  onClick={() => onToggleSeat(r, c)}
                  // Show the surcharge in the tooltip!
                  title={`Row ${getRowLetter(r)}, Seat ${c + 1} ${isVip ? `(${tier.tierName} +$${tier.priceSurcharge})` : ''}`}
                  className={`
                    relative flex items-center justify-center transition-all duration-200
                    w-6 h-7 sm:w-7 sm:h-8 md:w-8 md:h-8 
                    text-[9px] sm:text-[10px] md:text-xs font-semibold
                    rounded-t-md rounded-b-[3px] border-b-2 sm:border-b-[3px]
                    
                    /* Standard Available State */
                    ${isAvailable && !isSelected && !isVip ? 'bg-slate-800 border-slate-950 text-slate-400 hover:bg-slate-700 hover:border-slate-800 hover:text-white cursor-pointer hover:-translate-y-0.5' : ''}
                    
                    /* VIP Available State (Premium Purple/Pink) */
                    ${isAvailable && !isSelected && isVip ? 'bg-fuchsia-900 border-fuchsia-950 text-fuchsia-300 hover:bg-fuchsia-800 hover:border-fuchsia-900 hover:text-white cursor-pointer hover:-translate-y-0.5 shadow-[0_0_8px_rgba(192,38,211,0.2)]' : ''}

                    /* Selected State (Yellow overrides VIP color when clicked) */
                    ${isSelected ? 'bg-yellow-500 text-slate-950 border-yellow-600 font-bold shadow-md shadow-yellow-500/20 scale-105 z-10' : ''}
                      
                    /* 👉 Taken State (Fixed back to visible styling) */
                    ${!isAvailable ? 'bg-slate-900 border-slate-950 text-slate-700 cursor-not-allowed shadow-inner' : ''}
                  `}
                >
                  {isAvailable || isSelected ? (
                    c + 1
                  ) : (
                    <span className="opacity-50 font-bold text-[8px] sm:text-[10px]">
                      X
                    </span>
                  )}
                </button>
              )
            })}

            <div className="flex items-center justify-start pl-2 sm:pl-4 text-[10px] sm:text-xs font-bold text-slate-500 w-6">
              {getRowLetter(r)}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
