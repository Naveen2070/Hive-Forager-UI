import type { UserRole } from '@/types/enum.ts'

export interface UserDTO {
  id: string
  fullName: string
  email: string
  domainRoles: Record<string, string[]>
  role: UserRole // Convenience primary role for UI branching
  createdAt: string
  isActive: boolean
}

export interface RegisterUserRequest {
  fullName: string
  email: string
  password: string
  domainRoles: Record<string, string>
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