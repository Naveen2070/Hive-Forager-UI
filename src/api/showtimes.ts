import type {
  CreateShowtimeRequest,
  ShowtimeResponse,
  UpdateShowtimeRequest,
} from '@/types/showtime.type'
import type { ShowtimeSeatMapResponse } from '@/types/seating.types'
import type { PageResponse } from '@/types/common.type.ts'
import type { DotNetPagedResponse } from '@/lib/pagination-mapper.ts'
import { api } from '@/api/axios.ts'
import { mapToPageResponse } from '@/lib/pagination-mapper.ts'

const isMock = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true'

export const showtimesApi = {
  getSeatMap: async (showtimeId: string): Promise<ShowtimeSeatMapResponse> => {
    if (isMock) {
      const { generateSeatMap, MOCK_SHOWTIMES } =
        await import('@/api/mocks/showtimes.mock')
      const showtime = MOCK_SHOWTIMES.find((s) => s.id === showtimeId)
      if (!showtime)
        throw new Error(`No mock showtime found for id: ${showtimeId}`)
      return generateSeatMap(showtimeId, showtime.basePrice)
    }
    const { data } = await api.get<ShowtimeSeatMapResponse>(
      `/showtimes/${showtimeId}/seatmap`,
    )
    return data
  },
  getShowtimesByMovieId: async (
    movieId: string,
    page: number = 0,
    size: number = 50,
    fromDate?: string,
    toDate?: string,
  ): Promise<PageResponse<ShowtimeResponse>> => {
    if (isMock) {
      const { MOCK_SHOWTIMES } = await import('@/api/mocks/showtimes.mock')
      let filtered = MOCK_SHOWTIMES.filter((s) => s.movieId === movieId)

      // Basic mock date filtering if provided
      if (fromDate)
        filtered = filtered.filter(
          (s) => new Date(s.startTimeUtc) >= new Date(fromDate),
        )
      if (toDate)
        filtered = filtered.filter(
          (s) => new Date(s.startTimeUtc) <= new Date(toDate),
        )

      const totalElements = filtered.length
      const totalPages = Math.ceil(totalElements / size)

      return {
        content: filtered.slice(page * size, (page + 1) * size),
        pageNumber: page,
        pageSize: size,
        totalElements,
        totalPages,
        isLast: page >= totalPages - 1 || totalPages === 0,
      }
    }

    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('size', size.toString())
    if (fromDate) params.append('fromDate', fromDate)
    if (toDate) params.append('toDate', toDate)

    const { data } = await api.get<DotNetPagedResponse<ShowtimeResponse>>(
      `/showtimes/movie/${movieId}?${params.toString()}`,
    )
    return mapToPageResponse(data)
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
