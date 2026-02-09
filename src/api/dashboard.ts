import { api } from './axios'
import type { DashboardStatsDTO } from '@/types/dashboard.type'

export const dashboardApi = {
  getStats: async () => {
    const response = await api.get<DashboardStatsDTO>('/dashboard/stats')
    return response.data
  },
}
