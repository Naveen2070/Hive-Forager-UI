import type {
  ChangePasswordPayload,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateProfilePayload,
  UserDTO,
} from '@/types/auth.type'
import { api } from '@/api/axios'

export const userApi = {
  getSelf: async () => {
    const res = await api.get<UserDTO>(`/users/me`)
    return res.data
  },

  updateProfile: async (data: UpdateProfilePayload) => {
    const res = await api.patch<UserDTO>(`/users/me`, data)
    return res.data
  },

  changePassword: async (data: ChangePasswordPayload) => {
    const res = await api.post<string>(`/users/change-password`, data)
    return res.data
  },

  deactivate: async (data: ForgotPasswordRequest) => {
    const res = await api.post('/user/deactivate/me', data)
    return res.data
  },

  delete: async (data: ResetPasswordRequest) => {
    const res = await api.post('/user/delete/me', data)
    return res.data
  },
}
