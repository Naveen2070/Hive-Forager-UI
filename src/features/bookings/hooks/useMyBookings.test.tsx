import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useMyBookings } from './useMyBookings'
import { bookingsApi } from '@/api/booking'
import { createWrapper } from '@/test/utils'

vi.mock('@/api/booking', () => ({
  bookingsApi: {
    getMyBookings: vi.fn(),
  },
}))

describe('useMyBookings', () => {
  it('fetches my bookings successfully', async () => {
    const mockBookings = [
      { id: '1', eventName: 'Event 1' },
      { id: '2', eventName: 'Event 2' },
    ]
    vi.mocked(bookingsApi.getMyBookings).mockResolvedValue(mockBookings as any)

    const { result } = renderHook(() => useMyBookings(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockBookings)
  })

  it('handles error when fetching bookings', async () => {
    const error = new Error('Failed to fetch')
    vi.mocked(bookingsApi.getMyBookings).mockRejectedValue(error)

    const { result } = renderHook(() => useMyBookings(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toEqual(error)
  })
})
