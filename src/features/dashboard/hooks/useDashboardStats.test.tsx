import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDashboardStats } from './useDashboardStats'
import { dashboardApi } from '@/api/dashboard'
import { createWrapper } from '@/test/utils'

vi.mock('@/api/dashboard', () => ({
  dashboardApi: {
    getStats: vi.fn(),
  },
}))

describe('useDashboardStats', () => {
  it('fetches stats for different modes', async () => {
    const mockData = { totalRevenue: 1000 }
    vi.mocked(dashboardApi.getStats).mockResolvedValue(mockData as any)

    const { result, rerender } = renderHook(
      ({ mode }: { mode: 'combined' | 'events' | 'movies' }) =>
        useDashboardStats(mode),
      {
        wrapper: createWrapper(),
        initialProps: { mode: 'combined' as const },
      },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockData)
    expect(dashboardApi.getStats).toHaveBeenCalledWith('combined')

    // @ts-ignore
    rerender({ mode: 'events' })
    await waitFor(() =>
      expect(dashboardApi.getStats).toHaveBeenCalledWith('events'),
    )
  })
})
