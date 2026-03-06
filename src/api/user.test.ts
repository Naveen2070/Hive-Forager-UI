import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userApi } from './user'
import { api } from './axios'

vi.mock('./axios', () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
  },
}))

describe('User API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getSelf', async () => {
    ;(api.get as any).mockResolvedValueOnce({ data: { id: '1' } })
    await userApi.getSelf()
    expect(api.get).toHaveBeenCalledWith('/users/me')
  })

  it('updateProfile', async () => {
    const payload = { fullName: 'Test', email: 'test@example.com' }
    ;(api.patch as any).mockResolvedValueOnce({ data: payload })
    await userApi.updateProfile(payload)
    expect(api.patch).toHaveBeenCalledWith('/users/me', payload)
  })

  it('changePassword', async () => {
    const payload = { currentPassword: '1', newPassword: '2' }
    ;(api.post as any).mockResolvedValueOnce({ data: 'success' })
    await userApi.changePassword(payload)
    expect(api.post).toHaveBeenCalledWith('/users/change-password', payload)
  })

  it('deactivate', async () => {
    const payload = { email: 'test@example.com' }
    ;(api.post as any).mockResolvedValueOnce({ data: 'success' })
    await userApi.deactivate(payload)
    expect(api.post).toHaveBeenCalledWith('/user/deactivate/me', payload)
  })

  it('delete', async () => {
    const payload = { token: 'token', newPassword: '1' }
    ;(api.post as any).mockResolvedValueOnce({ data: 'success' })
    await userApi.delete(payload)
    expect(api.post).toHaveBeenCalledWith('/user/delete/me', payload)
  })
})
