import type {
  ChangePasswordPayload,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateProfilePayload,
  UserDTO,
} from '@/types/auth.type'
import { api } from '@/api/axios'

export const userApi = {
  getById: async (userId: number) => {
    const res = await api.get<UserDTO>(`/user/users/${userId}`)
    return res.data
  },

  updateProfile: async (userId: number, data: UpdateProfilePayload) => {
    const res = await api.put<UserDTO>(`/user/${userId}`, data)
    return res.data
  },

  changePassword: async (userId: number, data: ChangePasswordPayload) => {
    const res = await api.post<string>(`/user/change-password/${userId}`, data)
    return res.data
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    const res = await api.post('/user/forgot-password', data)
    return res.data
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const res = await api.post('/user/reset-password', data)
    return res.data
  },
}
