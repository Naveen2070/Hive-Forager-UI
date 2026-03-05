import type { SeatStatus } from '@/types/enum.ts'

export interface SeatCoordinateDTO {
  row: number
  col: number
}

export interface SeatTierDTO {
  tierName: string
  priceSurcharge: number
  seats: SeatCoordinateDTO[]
}

export interface ShowtimeSeatMapResponse {
  movieTitle: string
  cinemaName: string
  auditoriumName: string
  maxRows: number
  maxColumns: number
  basePrice: number
  tiers: SeatTierDTO[]
  seatMap: SeatStatusDTO[]
}

export interface SeatStatusDTO {
  row: number
  col: number
  status: SeatStatus | string
}
