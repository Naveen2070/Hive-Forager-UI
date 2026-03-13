import React, { useState } from 'react'
import { Accessibility, Check, Edit3, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SeatCoordinateDTO } from '@/types/seating.types'
import type { AuditoriumLayoutDTO } from '@/types/auditorium.type.ts'

type PaintTool = 'AVAILABLE' | 'DISABLED' | 'WHEELCHAIR' | 'VIP'

interface AuditoriumGridEditorProps {
  maxRows: number
  maxColumns: number
  layout: AuditoriumLayoutDTO
  onChange: (newLayout: AuditoriumLayoutDTO) => void
}

export const AuditoriumGridEditor = ({
  maxRows,
  maxColumns,
  layout,
  onChange,
}: AuditoriumGridEditorProps) => {
  const [activeTool, setActiveTool] = useState<PaintTool>('AVAILABLE')

  // Helper to safely check if a seat is in an array
  const hasSeat = (arr: any[], r: number, c: number) =>
    arr.some(
      (s) => (s.row ?? s.Row) === r && (s.col ?? s.Col) === c,
    )

  // Determine the current state of a seat
  const getSeatState = (r: number, c: number): PaintTool => {
    if (hasSeat(layout.disabledSeats, r, c)) return 'DISABLED'
    if (hasSeat(layout.wheelchairSpots, r, c)) return 'WHEELCHAIR'

    // Check VIP tiers (assuming index 0 is our main VIP tier for the builder)
    const vipTier = layout.tiers[0]
    if (vipTier && hasSeat(vipTier.seats, r, c)) return 'VIP'

    return 'AVAILABLE'
  }

  // Handle clicking a seat on the grid
  const handleSeatClick = (r: number, c: number) => {
    // 1. Remove the seat from ALL arrays first to clean its state
    const newLayout: AuditoriumLayoutDTO = {
      disabledSeats: layout.disabledSeats.filter(
        (s: any) => !((s.row ?? s.Row) === r && (s.col ?? s.Col) === c),
      ),
      wheelchairSpots: layout.wheelchairSpots.filter(
        (s: any) => !((s.row ?? s.Row) === r && (s.col ?? s.Col) === c),
      ),
      tiers: layout.tiers.map((tier) => ({
        ...tier,
        seats: tier.seats.filter(
          (s: any) => !((s.row ?? s.Row) === r && (s.col ?? s.Col) === c),
        ),
      })),
    }

    // 2. Add it to the correct array based on the active tool
    if (activeTool === 'DISABLED') {
      newLayout.disabledSeats.push({ row: r, col: c })
    } else if (activeTool === 'WHEELCHAIR') {
      newLayout.wheelchairSpots.push({ row: r, col: c })
    } else if (activeTool === 'VIP') {
      // Ensure we have a default VIP tier setup if they click VIP
      if (newLayout.tiers.length === 0) {
        newLayout.tiers.push({
          tierName: 'VIP Recliners',
          priceSurcharge: 5.0,
          seats: [],
        })
      }
      newLayout.tiers[0].seats.push({ row: r, col: c })
    }

    onChange(newLayout)
  }

  const tools = [
    {
      id: 'AVAILABLE',
      label: 'Standard Seat',
      icon: Check,
      color: 'text-slate-400 bg-slate-800 hover:bg-slate-700',
    },
    {
      id: 'VIP',
      label: 'VIP Seat',
      icon: Edit3,
      color:
        'text-fuchsia-300 bg-fuchsia-900 border-fuchsia-700 hover:bg-fuchsia-800',
    },
    {
      id: 'WHEELCHAIR',
      label: 'Wheelchair',
      icon: Accessibility,
      color: 'text-blue-300 bg-blue-900 border-blue-700 hover:bg-blue-800',
    },
    {
      id: 'DISABLED',
      label: 'Remove (Aisle)',
      icon: Trash2,
      color:
        'text-slate-600 bg-slate-950 border border-dashed border-slate-800 hover:bg-slate-900',
    },
  ] as const

  return (
    <div className="space-y-6">
      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl">
        {tools.map((tool) => {
          const Icon = tool.icon
          const isActive = activeTool === tool.id
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActiveTool(tool.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-slate-950'
                  : 'opacity-70',
                tool.color,
              )}
            >
              <Icon className="h-4 w-4" />
              {tool.label}
            </button>
          )
        })}
      </div>

      {/* THE GRID */}
      <div className="overflow-x-auto pb-4 custom-scrollbar bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex justify-center">
        <div
          className="inline-grid gap-1.5 items-center"
          style={{
            gridTemplateColumns: `auto repeat(${maxColumns}, max-content)`,
          }}
        >
          {Array.from({ length: maxRows }).map((_, r) => (
            <React.Fragment key={`row-${r}`}>
              {/* Row Label */}
              <div className="flex items-center justify-end pr-4 text-xs font-bold text-slate-500 w-8">
                {String.fromCharCode(65 + r)}
              </div>

              {/* Seats */}
              {Array.from({ length: maxColumns }).map((_, c) => {
                const state = getSeatState(r, c)
                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => handleSeatClick(r, c)}
                    className={cn(
                      'w-7 h-8 text-[10px] font-semibold rounded-t-md rounded-b-[3px] border-b-[3px] transition-transform hover:-translate-y-0.5 flex items-center justify-center',
                      state === 'AVAILABLE' &&
                        'bg-slate-800 border-slate-950 text-slate-400',
                      state === 'VIP' &&
                        'bg-fuchsia-900 border-fuchsia-950 text-fuchsia-300 shadow-[0_0_8px_rgba(192,38,211,0.3)]',
                      state === 'WHEELCHAIR' &&
                        'bg-blue-900 border-blue-950 text-blue-300',
                      state === 'DISABLED' &&
                        'bg-transparent border-none text-transparent hover:bg-slate-800/50',
                    )}
                  >
                    {state === 'WHEELCHAIR' ? (
                      <Accessibility className="h-3 w-3" />
                    ) : (
                      state !== 'DISABLED' && c + 1
                    )}
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
