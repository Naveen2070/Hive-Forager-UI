import { api } from './axios'
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterUserRequest,
  ResetPasswordRequest,
  UserDTO,
} from '@/types/auth.type.ts'

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  logout: async () => {
    return await api.post('/auth/logout')
  },

  register: async (data: RegisterUserRequest): Promise<UserDTO> => {
    const response = await api.post<UserDTO>('/auth/register', data)
    return response.data
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    const res = await api.post('/auth/forgot-password', data)
    return res.data
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const res = await api.post('/auth/reset-password', data)
    return res.data
  },
}
