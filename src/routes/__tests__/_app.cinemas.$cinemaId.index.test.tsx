import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CinemaDetailPage } from '../_app.cinemas.$cinemaId.index'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types/enum'
import { createWrapper } from '@/test/utils'
import { useCinemaDetail } from '@/features/cinemas/hooks/useCinemas'
import {
  useAuditoriumsByCinema,
  useCreateAuditorium,
  useDeleteAuditorium,
  useUpdateAuditorium,
} from '@/features/auditoriums/hooks/useAuditoriums'

vi.mock('@/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('@/features/cinemas/hooks/useCinemas', () => ({
  useCinemaDetail: vi.fn(),
}))

vi.mock('@/features/auditoriums/hooks/useAuditoriums', () => ({
  useAuditoriumsByCinema: vi.fn(),
  useCreateAuditorium: vi.fn(),
  useDeleteAuditorium: vi.fn(),
  useUpdateAuditorium: vi.fn(),
}))

vi.mock('@/features/auditoriums/components/AuditoriumModal', () => ({
  AuditoriumModal: () => <div data-testid="aud-modal" />,
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
  useParams: () => ({ cinemaId: '123' }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

describe('CinemaDetailPage Route', () => {
  const mockCinema = {
    id: '123',
    name: 'Grand Cinema',
    location: 'City',
    approvalStatus: 'APPROVED',
  }
  const mockAuds = [{ id: 'aud-1', name: 'Hall 1', maxRows: 5, maxColumns: 5 }]

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuthStore as any).mockReturnValue({
      user: { role: UserRole.ORGANIZER },
    })
    ;(useCinemaDetail as any).mockReturnValue({
      data: mockCinema,
      isLoading: false,
    })
    ;(useAuditoriumsByCinema as any).mockReturnValue({
      data: mockAuds,
      isLoading: false,
    })
    ;(useCreateAuditorium as any).mockReturnValue({ isPending: false })
    ;(useUpdateAuditorium as any).mockReturnValue({ isPending: false })
    ;(useDeleteAuditorium as any).mockReturnValue({ mutate: vi.fn() })
  })

  it('renders cinema info and list of auditoriums', async () => {
    await act(async () => {
      render(<CinemaDetailPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText('Grand Cinema')).toBeInTheDocument()
    expect(screen.getByText('Hall 1')).toBeInTheDocument()
    expect(screen.getByText(/25 Usable Seats/i)).toBeInTheDocument()
  })

  it('shows build button for organizer', async () => {
    await act(async () => {
      render(<CinemaDetailPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText(/Build Auditorium/i)).toBeInTheDocument()
  })

  it('opens auditorium modal when build is clicked', async () => {
    await act(async () => {
      render(<CinemaDetailPage />, { wrapper: createWrapper() })
    })

    fireEvent.click(screen.getByText(/Build Auditorium/i))
    expect(screen.getByTestId('aud-modal')).toBeInTheDocument()
  })
})
