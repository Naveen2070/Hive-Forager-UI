import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  useCreateEvent,
  useDeleteEvent,
  useEventDetail,
  useEventQueries,
  useUpdateEvent,
  useUpdateEventStatus,
} from './useEvents'
import { eventsApi } from '@/api/events'
import { createWrapper } from '@/test/utils'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types/enum'

vi.mock('@/api/events', () => ({
  eventsApi: {
    getById: vi.fn(),
    getAll: vi.fn(),
    getMyEvents: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('@/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}))

describe('Events Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuthStore as any).mockReturnValue({ user: { role: UserRole.USER } })
  })

  it('useEventDetail fetches event details', async () => {
    const mockEvent = { id: 1, title: 'Test Event' }
    vi.mocked(eventsApi.getById).mockResolvedValue(mockEvent as any)

    const { result } = renderHook(() => useEventDetail(1), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.event).toEqual(mockEvent))
  })

  it('useEventQueries handles filters and pagination', async () => {
    vi.mocked(eventsApi.getAll).mockResolvedValue({
      content: [],
      totalElements: 0,
    } as any)

    const { result } = renderHook(() => useEventQueries(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.updateFilter('title', 'concert')
    })

    expect(result.current.filters.title).toBe('concert')
    expect(result.current.page).toBe(0)

    act(() => {
      result.current.setPage(1)
    })
    expect(result.current.page).toBe(1)
  })

  it('useCreateEvent successfully creates an event', async () => {
    vi.mocked(eventsApi.create).mockResolvedValue({} as any)

    const { result } = renderHook(() => useCreateEvent(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({ title: 'New Event' } as any)

    expect(toast.success).toHaveBeenCalledWith('Event created successfully')
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/events' })
  })

  it('useUpdateEvent successfully updates an event', async () => {
    vi.mocked(eventsApi.update).mockResolvedValue({} as any)

    const { result } = renderHook(() => useUpdateEvent(1), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({
      title: 'Updated',
      startDate: '2025-01-01T10:00',
      endDate: '2025-01-01T12:00',
    } as any)

    expect(toast.success).toHaveBeenCalledWith('Event updated successfully')
  })

  it('useUpdateEventStatus successfully updates status', async () => {
    const mockEvent = { title: 'Test', status: 'PUBLISHED' }
    vi.mocked(eventsApi.updateStatus).mockResolvedValue(mockEvent as any)

    const { result } = renderHook(() => useUpdateEventStatus(1), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync('PUBLISHED')

    expect(toast.success).toHaveBeenCalledWith(
      'Test Event status updated successfully to PUBLISHED',
    )
  })

  it('useDeleteEvent successfully deletes an event', async () => {
    vi.mocked(eventsApi.delete).mockResolvedValue({} as any)

    const { result } = renderHook(() => useDeleteEvent(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync(1)

    expect(toast.success).toHaveBeenCalledWith('Event deleted successfully')
  })
})
