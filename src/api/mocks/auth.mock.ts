import type { UserDTO } from '@/types/auth.type.ts'
import { UserRole } from '@/types/enum.ts'

export const MOCK_USER: UserDTO = {
  id: 'dev-user-777',
  email: 'developer@hive.local',
  fullName: 'Dev Forager',
  domainRoles: {
    system: ['ROLE_ADMIN'],
    movies: ['ROLE_ORGANIZER'],
    events: ['ROLE_ORGANIZER'],
  },
  role: UserRole.ORGANIZER,
  createdAt: '2024-01-01T00:00:00.000Z',
  isActive: true,
}

export const MOCK_TOKEN = 'mock.jwt.token.hive.forager'
