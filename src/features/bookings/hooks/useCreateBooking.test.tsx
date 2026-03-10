import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCreateBooking } from './useCreateBooking'
import { bookingsApi } from '@/api/booking'
import { createWrapper } from '@/test/utils'
import { toast } from 'sonner'

const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@/api/booking', () => ({
  bookingsApi: {
    create: vi.fn(),
  },
}))

describe('useCreateBooking', () => {
  it('successfully creates a booking and navigates', async () => {
    const mockData = { eventTitle: 'Test Event' }
    vi.mocked(bookingsApi.create).mockResolvedValue(mockData as any)

    const { result } = renderHook(() => useCreateBooking(123), {
      wrapper: createWrapper(),
    })

    result.current.mutate({} as any)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).toHaveBeenCalledWith(
      'Booking created successfully for Test Event',
    )
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/bookings' })
  })

  it('handles error during booking creation', async () => {
    const mockError = {
      response: { data: { message: 'Failed to create booking' } },
    }
    vi.mocked(bookingsApi.create).mockRejectedValue(mockError)

    const { result } = renderHook(() => useCreateBooking(123), {
      wrapper: createWrapper(),
    })

    result.current.mutate({} as any)

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(toast.error).toHaveBeenCalledWith('Failed to create booking')
  })

  it('handles generic error during booking creation', async () => {
    vi.mocked(bookingsApi.create).mockRejectedValue(new Error('Generic error'))

    const { result } = renderHook(() => useCreateBooking(123), {
      wrapper: createWrapper(),
    })

    result.current.mutate({} as any)

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(toast.error).toHaveBeenCalledWith('Could not complete purchase.')
  })
})
