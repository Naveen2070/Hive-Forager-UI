export interface CreateMovieRequest {
  title: string
  description: string
  durationMinutes: number
  releaseDate: string
  posterUrl?: string | null
}

export interface UpdateMovieRequest {
  title: string
  description: string
  durationMinutes: number
  releaseDate: string
  posterUrl?: string | null
}

export interface MovieResponse {
  id: string
  title: string
  description: string
  durationMinutes: number
  releaseDate: string
  posterUrl?: string | null
}
