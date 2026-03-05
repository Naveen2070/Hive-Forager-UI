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