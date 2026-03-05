import type {
  CinemaResponse,
  CreateCinemaRequest,
  UpdateCinemaRequest,
} from '@/types/cinema.type'
import { CinemaApprovalStatus } from '@/types/enum'
import { api } from '@/api/axios'
import type { PageResponse } from '@/types/common.type.ts'
import {
  type DotNetPagedResponse,
  mapToPageResponse,
} from '@/lib/pagination-mapper.ts'

const isMock = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true'

export const cinemasApi = {
  getAllCinemas: async (
    page: number = 0,
    size: number = 10,
    search?: string,
  ): Promise<PageResponse<CinemaResponse>> => {
    if (isMock) {
      const { MOCK_CINEMAS } = await import('@/api/mocks/cinemas.mock')

      let filtered = MOCK_CINEMAS
      if (search) {
        const lower = search.toLowerCase()
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(lower) ||
            c.location.toLowerCase().includes(lower),
        )
      }

      const totalElements = filtered.length
      const totalPages = Math.ceil(totalElements / size)

      return {
        content: filtered.slice(page * size, (page + 1) * size),
        pageable: { pageNumber: page, pageSize: size },
        totalElements,
        totalPages,
        first: page === 0,
        last: page >= totalPages - 1 || totalPages === 0,
      }
    }

    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('size', size.toString())
    if (search) params.append('search', search)

    const { data } = await api.get<DotNetPagedResponse<CinemaResponse>>(
      `/cinemas?${params.toString()}`,
    )
    return mapToPageResponse(data)
  },

  getMyCinemas: async (
    page: number = 0,
    size: number = 10,
    search?: string,
  ): Promise<PageResponse<CinemaResponse>> => {
    if (isMock) {
      return cinemasApi.getAllCinemas(page, size, search)
    }

    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('size', size.toString())
    if (search) params.append('search', search)

    const { data } = await api.get<DotNetPagedResponse<CinemaResponse>>(
      `/cinemas/my?${params.toString()}`,
    )
    return mapToPageResponse(data)
  },

  getCinemaById: async (id: string): Promise<CinemaResponse> => {
    if (isMock) {
      const { MOCK_CINEMAS } = await import('@/api/mocks/cinemas.mock')
      return MOCK_CINEMAS.find((c) => c.id === id) || MOCK_CINEMAS[0]
    }
    const { data } = await api.get<CinemaResponse>(`/cinemas/${id}`)
    return data
  },
  createCinema: async (
    payload: CreateCinemaRequest,
  ): Promise<CinemaResponse> => {
    const { data } = await api.post<CinemaResponse>('/cinemas', payload)
    return data
  },
  updateCinema: async (
    id: string,
    payload: UpdateCinemaRequest,
  ): Promise<void> => {
    await api.put(`/cinemas/${id}`, payload)
  },
  updateCinemaStatus: async (
    id: string,
    status: CinemaApprovalStatus,
  ): Promise<void> => {
    await api.patch(`/cinemas/${id}/status?status=${status}`)
  },
  deleteCinema: async (id: string): Promise<void> => {
    await api.delete(`/cinemas/${id}`)
  },
}
