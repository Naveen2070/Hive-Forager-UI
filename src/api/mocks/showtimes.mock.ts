import { SeatStatus } from '@/types/enum'
import type { ShowtimeResponse } from '@/types/showtime.type'
import type { ShowtimeSeatMapResponse } from '@/types/seating.types'

export const MOCK_SHOWTIMES: ShowtimeResponse[] = [
  {
    id: 'show-111',
    movieId: '123e4567-e89b-12d3-a456-426614174001',
    auditoriumId: 'aud-111',
    startTimeUtc: '2026-10-31T19:30:00Z',
    basePrice: 15.5,
  },
  {
    id: 'show-112',
    movieId: '123e4567-e89b-12d3-a456-426614174001',
    auditoriumId: 'aud-111',
    startTimeUtc: '2026-10-31T22:30:00Z',
    basePrice: 15.5,
  },
  {
    id: 'show-222',
    movieId: '123e4567-e89b-12d3-a456-426614174001',
    auditoriumId: 'aud-111',
    startTimeUtc: '2026-11-01T20:00:00Z',
    basePrice: 12.0,
  },
]

export const MOCK_SEAT_MAP: ShowtimeSeatMapResponse = {
  movieTitle: "Inception (Director's Cut)",
  cinemaName: 'Hive Multiplex Downtown',
  auditoriumName: 'IMAX Screen 1',
  maxRows: 10,
  maxColumns: 15,
  basePrice: 15.5,
  tiers: [
    {
      tierName: 'VIP Recliners',
      priceSurcharge: 5.0,
      seats: [
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 8 },
        { row: 5, col: 9 },
        { row: 5, col: 10 },
      ],
    },
  ],
  seatMap: (() => {
    const seats = []

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 15; c++) {
        // 1. Tapered Front Row (Curved Screen effect)
        // Remove 2 seats from both ends of the first row
        if (r === 0 && (c < 2 || c > 12)) continue
        // Remove 1 seat from both ends of the second row
        if (r === 1 && (c === 0 || c === 14)) continue

        // 2. Center Aisle
        // Remove column 7 entirely to create a walking path down the middle
        if (c === 7) continue

        // 3. Wheelchair Cutouts or Structural Pillars
        // Remove a couple of seats in row 5 for a "structural limitation"
        if (r === 5 && (c === 2 || c === 12)) continue

        // If it passes all the layout rules, add it to the map
        seats.push({
          row: r,
          col: c,
          status: Math.random() > 0.8 ? SeatStatus.SOLD : SeatStatus.AVAILABLE,
        })
      }
    }

    return seats
  })(),
}