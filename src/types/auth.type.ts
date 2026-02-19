import type { UserRole } from '@/types/enum.ts'

export interface UserDTO {
  id: string
  fullName: string
  email: string
  role: UserRole
  createdAt: string
  isActive: boolean
}

export interface RegisterUserRequest {
  fullName: string
  email: string
  password: string
  domainAccess:Array<string>
  role: UserRole
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  email: string
}

export interface UpdateProfilePayload {
  fullName: string
  email: string
}

export interface ChangePasswordPayload {
  oldPassword?: string
  newPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}