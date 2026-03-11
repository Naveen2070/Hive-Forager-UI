import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authApi } from './auth'
import { api } from './axios'
import { UserRole } from '@/types/enum'

// Mock the core Axios instance
vi.mock('./axios', () => ({
  api: {
    post: vi.fn(),
  },
}))

describe('Auth API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('successfully sends credentials and returns token', async () => {
      const mockResponse = { data: { token: 'mock-jwt-token' } }
      ;(api.post as any).mockResolvedValueOnce(mockResponse)

      const credentials = { email: 'test@example.com', password: 'password123' }
      const result = await authApi.login(credentials)

      expect(api.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual(mockResponse.data)
    })

    it('propagates errors when login fails', async () => {
      const mockError = new Error('Network Error')
      ;(api.post as any).mockRejectedValueOnce(mockError)

      await expect(
        authApi.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow('Network Error')
    })

    it('handles server errors without a message payload', async () => {
      const mockError = {
        response: {
          status: 500,
          data: null,
        },
      }
      ;(api.post as any).mockRejectedValueOnce(mockError)

      try {
        await authApi.login({ email: 'test@example.com', password: 'password' })
      } catch (error: any) {
        expect(error.response.status).toBe(500)
        expect(error.response.data).toBeNull()
      }
    })
  })

  describe('register', () => {
    it('successfully sends user data and returns user object', async () => {
      const mockUser = {
        id: '1',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        role: UserRole.USER,
      }
      ;(api.post as any).mockResolvedValueOnce({ data: mockUser })

      const requestData = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        password: 'securepassword',
        domainRoles: { events: 'USER' },
      }

      const result = await authApi.register(requestData)

      expect(api.post).toHaveBeenCalledWith('/auth/register', requestData)
      expect(result).toEqual(mockUser)
    })
  })

  describe('logout', () => {
    it('sends logout request', async () => {
      ;(api.post as any).mockResolvedValueOnce({ data: null })

      await authApi.logout()

      expect(api.post).toHaveBeenCalledWith('/auth/logout')
    })
  })

  describe('forgotPassword', () => {
    it('sends email to request password reset', async () => {
      const mockResponse = { message: 'Email sent' }
      ;(api.post as any).mockResolvedValueOnce({ data: mockResponse })

      const requestData = { email: 'test@example.com' }
      const result = await authApi.forgotPassword(requestData)

      expect(api.post).toHaveBeenCalledWith(
        '/auth/forgot-password',
        requestData,
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('resetPassword', () => {
    it('sends token and new password to reset endpoint', async () => {
      const mockResponse = { message: 'Password reset successful' }
      ;(api.post as any).mockResolvedValueOnce({ data: mockResponse })

      const requestData = {
        token: 'reset-token',
        newPassword: 'new-secure-password',
      }
      const result = await authApi.resetPassword(requestData)

      expect(api.post).toHaveBeenCalledWith('/auth/reset-password', requestData)
      expect(result).toEqual(mockResponse)
    })
  })
})
