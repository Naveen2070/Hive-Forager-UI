import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard.ts'
import { dashboardKeys } from '@/features/dashboard/dashboard.keys.ts'

export const useDashboardStats = (mode: 'combined' | 'events' | 'movies') => {
  return useQuery({
    queryKey: dashboardKeys.stats(mode),
    queryFn: () => dashboardApi.getStats(mode),
    refetchInterval: 1000 * 60,
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData,
  })
}
