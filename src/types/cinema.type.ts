import type { CinemaApprovalStatus } from '@/types/enum.ts'

export interface CreateCinemaRequest {
  name: string
  location: string
  contactEmail: string
}

export interface UpdateCinemaRequest {
  name: string
  location: string
}

export interface CinemaResponse {
  id: string
  name: string
  location: string
  approvalStatus: CinemaApprovalStatus | string
}
