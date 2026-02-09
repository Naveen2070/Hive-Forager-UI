import { dashboardKeys } from '@/features/dashboard/dashboard.keys.ts'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard.ts'

export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: dashboardApi.getStats,
    refetchInterval: 1000 * 60,
    staleTime: 1000 * 30,
  })
}
