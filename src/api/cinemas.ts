import type {
  CinemaResponse,
  CreateCinemaRequest,
  UpdateCinemaRequest,
} from '@/types/cinema.type'
import { CinemaApprovalStatus } from '@/types/enum'
import { api } from '@/api/axios.ts'

const isMock = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true'

export const cinemasApi = {
  getAllCinemas: async (): Promise<CinemaResponse[]> => {
    if (isMock) {
      const { MOCK_CINEMAS } = await import('@/api/mocks/cinemas.mock')
      return MOCK_CINEMAS
    }
    const { data } = await api.get<CinemaResponse[]>('/cinemas')
    return data
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
