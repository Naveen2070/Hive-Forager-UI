import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CinemasPage } from '../_app.cinemas.index'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types/enum'
import { createWrapper } from '@/test/utils'
import {
  useCinemas,
  useCreateCinema,
  useDeleteCinema,
  useMyCinemas,
  useUpdateCinema,
} from '@/features/cinemas/hooks/useCinemas'

vi.mock('@/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('@/features/cinemas/hooks/useCinemas', () => ({
  useCinemas: vi.fn(),
  useMyCinemas: vi.fn(),
  useCreateCinema: vi.fn(),
  useUpdateCinema: vi.fn(),
  useDeleteCinema: vi.fn(),
}))

vi.mock('@/features/cinemas/components/CinemaGrid', () => ({
  CinemaGrid: ({ cinemas, emptyMessage }: any) => (
    <div data-testid="cinema-grid">
      {cinemas.length === 0 ? emptyMessage : `Count: ${cinemas.length}`}
    </div>
  ),
}))

vi.mock('@/features/cinemas/components/CinemaModal', () => ({
  CinemaModal: () => <div data-testid="cinema-modal" />,
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
}))

vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, onValueChange }: any) => (
    <div
      onClick={(e: any) => {
        if (e.target.dataset.value) onValueChange(e.target.dataset.value)
      }}
    >
      {children}
    </div>
  ),
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children, value }: any) => (
    <button data-value={value}>{children}</button>
  ),
  TabsContent: ({ children, value }: any) => (
    <div data-testid={`tab-content-${value}`}>{children}</div>
  ),
}))

describe('CinemasPage Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuthStore as any).mockReturnValue({
      user: { role: UserRole.ORGANIZER },
    })
    ;(useCinemas as any).mockReturnValue({
      data: { content: [], totalPages: 0 },
      isLoading: false,
      isError: false,
    })
    ;(useMyCinemas as any).mockReturnValue({
      data: { content: [], totalPages: 0 },
      isLoading: false,
      isError: false,
    })
    ;(useCreateCinema as any).mockReturnValue({ isPending: false })
    ;(useUpdateCinema as any).mockReturnValue({ isPending: false })
    ;(useDeleteCinema as any).mockReturnValue({ mutate: vi.fn() })
  })

  it('renders "My Cinemas" by default for organizer', async () => {
    await act(async () => {
      render(<CinemasPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByText('My Cinemas')).toBeInTheDocument()
    expect(
      screen.getByText(/Manage your theater locations/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/You haven't registered any cinemas yet/i),
    ).toBeInTheDocument()
  })

  it('switches tabs and shows directory', async () => {
    await act(async () => {
      render(<CinemasPage />, { wrapper: createWrapper() })
    })

    const directoryTab = screen.getByText(/Directory/i)
    await act(async () => {
      fireEvent.click(directoryTab)
    })

    expect(await screen.findByText(/No cinemas found/i)).toBeInTheDocument()
  })

  it('opens create modal when Register button is clicked', async () => {
    await act(async () => {
      render(<CinemasPage />, { wrapper: createWrapper() })
    })

    const registerBtn = screen.getByText(/Register Cinema/i)
    await act(async () => {
      fireEvent.click(registerBtn)
    })

    expect(screen.getByTestId('cinema-modal')).toBeInTheDocument()
  })
})
