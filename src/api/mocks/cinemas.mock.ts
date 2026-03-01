import { CinemaApprovalStatus } from '@/types/enum'
import type { CinemaResponse } from '@/types/cinema.type'

export const MOCK_CINEMAS: CinemaResponse[] = [
  {
    id: 'cinema-111',
    name: 'Hive Multiplex Downtown',
    location: '123 Entertainment Blvd, Tech City, CA 90210',
    approvalStatus: CinemaApprovalStatus.APPROVED,
  },
  {
    id: 'cinema-222',
    name: 'Alamo Drafthouse Austin',
    location: 'South Lamar Blvd, Austin, TX',
    approvalStatus: CinemaApprovalStatus.APPROVED,
  },
]
