import type { SeatCoordinateDTO, SeatTierDTO } from '@/types/seating.types.ts'

export interface AuditoriumLayoutDTO {
  disabledSeats: SeatCoordinateDTO[]
  wheelchairSpots: SeatCoordinateDTO[]
  tiers: SeatTierDTO[]
}

export interface CreateAuditoriumRequest {
  cinemaId: string
  name: string
  maxRows: number
  maxColumns: number
  layout: AuditoriumLayoutDTO
}

export interface UpdateAuditoriumRequest {
  name: string
  maxRows: number
  maxColumns: number
  layout: AuditoriumLayoutDTO
}

export interface AuditoriumResponse {
  id: string
  cinemaId: string
  name: string
  maxRows: number
  maxColumns: number
  layout: AuditoriumLayoutDTO
}
