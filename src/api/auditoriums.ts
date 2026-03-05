import type {
  AuditoriumResponse,
  CreateAuditoriumRequest,
  UpdateAuditoriumRequest,
} from '@/types/auditorium.type'
import { api } from '@/api/axios.ts'

const isMock = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true'

export const auditoriumsApi = {
  getAllAuditoriums: async (): Promise<AuditoriumResponse[]> => {
    if (isMock) {
      const { MOCK_AUDITORIUMS } = await import('@/api/mocks/auditoriums.mock')
      return MOCK_AUDITORIUMS
    }
    const { data } = await api.get<AuditoriumResponse[]>('/auditoriums')
    return data
  },
  getAuditoriumsByCinemaId: async (
    cinemaId: string,
  ): Promise<AuditoriumResponse[]> => {
    if (isMock) {
      const { MOCK_AUDITORIUMS } = await import('@/api/mocks/auditoriums.mock')
      return MOCK_AUDITORIUMS.filter((a) => a.cinemaId === cinemaId)
    }
    const { data } = await api.get<AuditoriumResponse[]>(
      `/auditoriums/cinema/${cinemaId}`,
    )
    return data
  },
  getAuditoriumById: async (id: string): Promise<AuditoriumResponse> => {
    if (isMock) {
      const { MOCK_AUDITORIUMS } = await import('@/api/mocks/auditoriums.mock')
      return MOCK_AUDITORIUMS.find((a) => a.id === id) || MOCK_AUDITORIUMS[0]
    }
    const { data } = await api.get<AuditoriumResponse>(`/auditoriums/${id}`)
    return data
  },
  createAuditorium: async (
    payload: CreateAuditoriumRequest,
  ): Promise<AuditoriumResponse> => {
    const { data } = await api.post<AuditoriumResponse>('/auditoriums', payload)
    return data
  },
  updateAuditorium: async (
    id: string,
    payload: UpdateAuditoriumRequest,
  ): Promise<void> => {
    await api.put(`/auditoriums/${id}`, payload)
  },
  deleteAuditorium: async (id: string): Promise<void> => {
    await api.delete(`/auditoriums/${id}`)
  },
}
