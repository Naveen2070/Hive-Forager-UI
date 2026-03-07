import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSettings } from './useSettings'
import { userApi } from '@/api/user'
import { createWrapper } from '@/test/utils'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth.store'

vi.mock('@/api/user', () => ({
  userApi: {
    getSelf: vi.fn(),
    updateProfile: vi.fn(),
    changePassword: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}))

describe('useSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuthStore as any).mockReturnValue({ user: { id: '1' } })
  })

  it('fetches profile data', async () => {
    const mockProfile = { id: '1', fullName: 'John' }
    vi.mocked(userApi.getSelf).mockResolvedValue(mockProfile as any)

    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.profile).toEqual(mockProfile))
  })

  it('updates profile successfully', async () => {
    vi.mocked(userApi.updateProfile).mockResolvedValue({
      id: '1',
      fullName: 'New',
    } as any)
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    })

    await result.current.updateProfile.mutateAsync({ fullName: 'New' } as any)

    expect(toast.success).toHaveBeenCalledWith('Profile updated successfully')
  })

  it('changes password successfully', async () => {
    vi.mocked(userApi.changePassword).mockResolvedValue({} as any)
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(),
    })

    await result.current.changePassword.mutateAsync({
      oldPassword: 'o',
      newPassword: 'n',
    } as any)

    expect(toast.success).toHaveBeenCalledWith('Password changed successfully')
  })
})
