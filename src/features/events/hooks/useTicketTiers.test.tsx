import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTicketTierMutations } from './useTicketTiers'
import { eventsApi } from '@/api/events'
import { createWrapper } from '@/test/utils'
import { toast } from 'sonner'

vi.mock('@/api/events', () => ({
  eventsApi: {
    addTier: vi.fn(),
    updateTier: vi.fn(),
    deleteTier: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('useTicketTierMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('addTier successfully adds a tier', async () => {
    vi.mocked(eventsApi.addTier).mockResolvedValue({} as any)
    const { result } = renderHook(() => useTicketTierMutations(1), {
      wrapper: createWrapper(),
    })

    await result.current.addTier.mutateAsync({ name: 'New' } as any)

    expect(toast.success).toHaveBeenCalledWith('Ticket tier added')
  })

  it('updateTier successfully updates a tier', async () => {
    vi.mocked(eventsApi.updateTier).mockResolvedValue({} as any)
    const { result } = renderHook(() => useTicketTierMutations(1), {
      wrapper: createWrapper(),
    })

    await result.current.updateTier.mutateAsync({
      id: 101,
      data: { name: 'Updated' },
    } as any)

    expect(toast.success).toHaveBeenCalledWith('Ticket tier updated')
  })

  it('deleteTier successfully deletes a tier', async () => {
    vi.mocked(eventsApi.deleteTier).mockResolvedValue({} as any)
    const { result } = renderHook(() => useTicketTierMutations(1), {
      wrapper: createWrapper(),
    })

    await result.current.deleteTier.mutateAsync(101)

    expect(toast.success).toHaveBeenCalledWith('Ticket tier deleted')
  })

  it('handles error in deleteTier', async () => {
    const error = { response: { data: { message: 'Failed to delete' } } }
    vi.mocked(eventsApi.deleteTier).mockRejectedValue(error)
    const { result } = renderHook(() => useTicketTierMutations(1), {
      wrapper: createWrapper(),
    })

    try {
      await result.current.deleteTier.mutateAsync(101)
    } catch (e) {
      // ignore
    }

    expect(toast.error).toHaveBeenCalledWith('Failed to delete')
  })
})
