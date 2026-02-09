import { api } from './axios'

import type {
  CreateEventRequest,
  CreateTicketTierRequest,
  EventDTO,
  EventFilters,
  TicketTierDTO,
  UpdateEventRequest,
  UpdateTicketTierRequest,
} from '@/types/event.type.ts'
import type { PageResponse } from '@/types/common.type.ts'

export const eventsApi = {
  // Public Feed with Full Filtering
  getAll: async (page = 0, size = 10, filters?: EventFilters) => {
    const params = {
      page,
      size,
      sort: 'startDate,asc',
      ...filters,
    }

    const response = await api.get<PageResponse<EventDTO>>('/events', {
      params,
    })
    return response.data
  },

  // Organizer/Admin Feed
  getMyEvents: async (page = 0, size = 10) => {
    const response = await api.get<PageResponse<EventDTO>>(
      '/events/organizer',
      {
        params: { page, size },
      },
    )
    return response.data
  },

  getById: async (id: number) => {
    const response = await api.get<EventDTO>(`/events/${id}`)
    return response.data
  },

  create: async (data: CreateEventRequest) => {
    const response = await api.post<EventDTO>('/events', data)
    return response.data
  },

  addTier: async (eventId: number, data: CreateTicketTierRequest) => {
    const res = await api.post<TicketTierDTO>(`/tiers/events/${eventId}`, data)
    return res.data
  },

  update: async (id: number, data: UpdateEventRequest) => {
    const response = await api.put<EventDTO>(`/events/${id}`, data)
    return response.data
  },

  updateStatus: async (id: number, status: string) => {
    const response = await api.patch<EventDTO>(`/events/status/${id}`, {
      status,
    })
    return response.data
  },

  updateTier: async (tierId: number, data: UpdateTicketTierRequest) => {
    const res = await api.put<TicketTierDTO>(`/tiers/${tierId}`, data)
    return res.data
  },

  deleteTier: async (tierId: number) => {
    await api.delete(`/tiers/${tierId}`)
  },

  delete: async (id: number) => {
    await api.delete(`/events/${id}`)
  },
}
