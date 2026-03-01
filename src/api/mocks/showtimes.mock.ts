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
  seatMap: Array.from({ length: 150 }).map((_, i) => ({
    row: Math.floor(i / 15),
    col: i % 15,
    status: Math.random() > 0.8 ? SeatStatus.SOLD : SeatStatus.AVAILABLE,
  })),
}
