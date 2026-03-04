import { UserRole } from '@/types/enum.ts'
import type { UserDTO } from '@/types/auth.type.ts'

export const MOCK_USER: UserDTO = {
  id: 'dev-user-777',
  email: 'developer@hive.local',
  fullName: 'Dev Forager',
  role: UserRole.ORGANIZER,
  createdAt: '2024-01-01T00:00:00.000Z',
  isActive: true,
}

export const MOCK_TOKEN = 'mock.jwt.token.hive.forager'
