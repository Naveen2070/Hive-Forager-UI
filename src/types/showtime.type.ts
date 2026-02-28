import type { SeatStatus } from '@/types/enum.ts'

export interface CreateShowtimeRequest {
  movieId: string
  auditoriumId: string
  startTimeUtc: string
  basePrice: number
}

export interface UpdateShowtimeRequest {
  startTimeUtc: string
  basePrice: number
}

export interface ShowtimeResponse {
  id: string
  movieId: string
  auditoriumId: string
  startTimeUtc: string
  basePrice: number
}

export interface SeatStatusDTO {
  row: number
  col: number
  status: SeatStatus | string
}

export interface ShowtimeSeatMapResponse {
  movieTitle: string
  cinemaName: string
  auditoriumName: string
  maxRows: number
  maxColumns: number
  seatMap: SeatStatusDTO[]
}
