export interface SeatCoordinateDTO {
  row: number
  col: number
}

export interface SeatTierDTO {
  tierName: string
  priceSurcharge: number
  seats: SeatCoordinateDTO[]
}
