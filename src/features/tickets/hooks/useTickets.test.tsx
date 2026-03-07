import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCheckInTicket, useMyTickets, useReserveTickets } from './useTickets'
import { ticketsApi } from '@/api/tickets'
import { createWrapper } from '@/test/utils'
import { toast } from 'sonner'

vi.mock('@/api/tickets', () => ({
  ticketsApi: {
    getMyTickets: vi.fn(),
    reserveTickets: vi.fn(),
    checkIn: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Tickets Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('useMyTickets fetches my tickets', async () => {
    const mockTickets = [{ id: '1', movieTitle: 'Interstellar' }]
    vi.mocked(ticketsApi.getMyTickets).mockResolvedValue(mockTickets as any)

    const { result } = renderHook(() => useMyTickets(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockTickets)
  })

  it('useReserveTickets handles 409 conflict error', async () => {
    const error = { response: { status: 409 } }
    vi.mocked(ticketsApi.reserveTickets).mockRejectedValue(error)

    const { result } = renderHook(() => useReserveTickets(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ showtimeId: '123' } as any)

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(toast.error).toHaveBeenCalledWith(
      'Oh no! Those seats were just taken. Please select different seats.',
    )
  })

  it('useCheckInTicket successfully checks in a ticket', async () => {
    vi.mocked(ticketsApi.checkIn).mockResolvedValue({} as any)

    const { result } = renderHook(() => useCheckInTicket(), {
      wrapper: createWrapper(),
    })

    result.current.mutate('REF-123')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).toHaveBeenCalledWith(
      'Ticket checked in successfully.',
    )
  })
})
