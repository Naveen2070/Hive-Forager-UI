import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCheckIn } from './useCheckIn'
import { bookingsApi } from '@/api/booking'
import { createWrapper } from '@/test/utils'

vi.mock('@/api/booking', () => ({
  bookingsApi: {
    checkIn: vi.fn(),
  },
}))

describe('useCheckIn', () => {
  it('successfully checks in with a reference', async () => {
    const mockResponse = { id: 1, status: 'CHECKED_IN' }
    vi.mocked(bookingsApi.checkIn).mockResolvedValue(mockResponse as any)

    const { result } = renderHook(() => useCheckIn(), {
      wrapper: createWrapper(),
    })

    result.current.mutate('REF-123')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockResponse)
    expect(bookingsApi.checkIn).toHaveBeenCalledWith('REF-123')
  })

  it('handles error during check-in', async () => {
    const error = new Error('Invalid reference')
    vi.mocked(bookingsApi.checkIn).mockRejectedValue(error)

    const { result } = renderHook(() => useCheckIn(), {
      wrapper: createWrapper(),
    })

    result.current.mutate('INVALID-REF')

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toEqual(error)
  })
})
