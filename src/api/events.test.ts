import { beforeEach, describe, expect, it, vi } from 'vitest'
import { eventsApi } from './events'
import { api } from './axios'

vi.mock('./axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('Events API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getAll', async () => {
    ;(api.get as any).mockResolvedValueOnce({ data: { content: [] } })
    await eventsApi.getAll(0, 10, { title: 'MUSIC' })
    expect(api.get).toHaveBeenCalledWith('/events', { params: { page: 0, size: 10, sort: 'startDate,asc', title: 'MUSIC' } })
  })

  it('getMyEvents', async () => {
    ;(api.get as any).mockResolvedValueOnce({ data: { content: [] } })
    await eventsApi.getMyEvents(0, 10)
    expect(api.get).toHaveBeenCalledWith('/events/organizer', { params: { page: 0, size: 10 } })
  })

  it('getById', async () => {
    ;(api.get as any).mockResolvedValueOnce({ data: { id: 1 } })
    await eventsApi.getById(1)
    expect(api.get).toHaveBeenCalledWith('/events/1')
  })

  it('create', async () => {
    const payload = { title: 'Test' }
    ;(api.post as any).mockResolvedValueOnce({ data: payload })
    await eventsApi.create(payload as any)
    expect(api.post).toHaveBeenCalledWith('/events', payload)
  })

  it('addTier', async () => {
    const payload = { name: 'VIP' }
    ;(api.post as any).mockResolvedValueOnce({ data: payload })
    await eventsApi.addTier(1, payload as any)
    expect(api.post).toHaveBeenCalledWith('/tiers/events/1', payload)
  })

  it('update', async () => {
    const payload = { title: 'Updated' }
    ;(api.put as any).mockResolvedValueOnce({ data: payload })
    await eventsApi.update(1, payload as any)
    expect(api.put).toHaveBeenCalledWith('/events/1', payload)
  })

  it('updateStatus', async () => {
    ;(api.patch as any).mockResolvedValueOnce({ data: {} })
    await eventsApi.updateStatus(1, 'PUBLISHED')
    expect(api.patch).toHaveBeenCalledWith('/events/status/1', { status: 'PUBLISHED' })
  })

  it('updateTier', async () => {
    const payload = { price: 100 }
    ;(api.put as any).mockResolvedValueOnce({ data: payload })
    await eventsApi.updateTier(1, payload as any)
    expect(api.put).toHaveBeenCalledWith('/tiers/1', payload)
  })

  it('deleteTier', async () => {
    ;(api.delete as any).mockResolvedValueOnce({})
    await eventsApi.deleteTier(1)
    expect(api.delete).toHaveBeenCalledWith('/tiers/1')
  })

  it('delete', async () => {
    ;(api.delete as any).mockResolvedValueOnce({})
    await eventsApi.delete(1)
    expect(api.delete).toHaveBeenCalledWith('/events/1')
  })
})
