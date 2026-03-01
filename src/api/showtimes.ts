import type {
  CreateShowtimeRequest,
  ShowtimeResponse,
  UpdateShowtimeRequest,
} from '@/types/showtime.type'
import type { ShowtimeSeatMapResponse } from '@/types/seating.types'
import { api } from '@/api/axios.ts'

const isMock = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true'

export const showtimesApi = {
  getSeatMap: async (showtimeId: string): Promise<ShowtimeSeatMapResponse> => {
    if (isMock) {
      const { MOCK_SEAT_MAP } = await import('@/api/mocks/showtimes.mock')
      return MOCK_SEAT_MAP
    }
    const { data } = await api.get<ShowtimeSeatMapResponse>(
      `/showtimes/${showtimeId}/seatmap`,
    )
    return data
  },
  getShowtimesByMovieId: async (
    movieId: string,
  ): Promise<ShowtimeResponse[]> => {
    if (isMock) {
      const { MOCK_SHOWTIMES } = await import('@/api/mocks/showtimes.mock')
      return MOCK_SHOWTIMES.filter((s) => s.movieId === movieId)
    }
    const { data } = await api.get<ShowtimeResponse[]>(
      `/showtimes/movie/${movieId}`,
    )
    return data
  },
  createShowtime: async (
    payload: CreateShowtimeRequest,
  ): Promise<ShowtimeResponse> => {
    const { data } = await api.post<ShowtimeResponse>('/showtimes', payload)
    return data
  },
  updateShowtime: async (
    id: string,
    payload: UpdateShowtimeRequest,
  ): Promise<void> => {
    await api.put(`/showtimes/${id}`, payload)
  },
  deleteShowtime: async (id: string): Promise<void> => {
    await api.delete(`/showtimes/${id}`)
  },
}
