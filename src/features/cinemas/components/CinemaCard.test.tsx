import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CinemaCard } from './CinemaCard'
import { CinemaApprovalStatus } from '@/types/enum'
import { createWrapper } from '@/test/utils'

const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

const mockCinema: any = {
  id: '1',
  name: 'Grand Cinema',
  location: '123 Main St',
  approvalStatus: CinemaApprovalStatus.APPROVED,
}

describe('CinemaCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders cinema details correctly', () => {
    render(<CinemaCard cinema={mockCinema} isOwner={false} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('Grand Cinema')).toBeInTheDocument()
    expect(screen.getByText('123 Main St')).toBeInTheDocument()
  })

  it('navigates to cinema detail on card click', () => {
    render(<CinemaCard cinema={mockCinema} isOwner={false} />, {
      wrapper: createWrapper(),
    })

    fireEvent.click(screen.getByText('Grand Cinema'))

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/cinemas/$cinemaId',
      params: { cinemaId: '1' },
    })
  })

  it('shows approval status only for owner', () => {
    const { rerender } = render(
      <CinemaCard cinema={mockCinema} isOwner={false} />,
      { wrapper: createWrapper() },
    )
    expect(
      screen.queryByText(CinemaApprovalStatus.APPROVED),
    ).not.toBeInTheDocument()

    rerender(<CinemaCard cinema={mockCinema} isOwner={true} />)
    expect(screen.getByText(CinemaApprovalStatus.APPROVED)).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn()
    render(<CinemaCard cinema={mockCinema} isOwner={true} onEdit={onEdit} />, {
      wrapper: createWrapper(),
    })

    fireEvent.click(screen.getByText('Edit'))

    expect(onEdit).toHaveBeenCalledWith(mockCinema)
    expect(mockNavigate).not.toHaveBeenCalled() // Stop propagation check
  })

  it('opens delete dialog and calls onDelete', () => {
    const onDelete = vi.fn()
    render(
      <CinemaCard cinema={mockCinema} isOwner={true} onDelete={onDelete} />,
      { wrapper: createWrapper() },
    )

    // Click trash icon button (first button in owner actions after Edit)
    const deleteButton = screen.getAllByRole('button')[1]
    fireEvent.click(deleteButton)

    expect(screen.getByText('Delete Cinema')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Yes, delete cinema'))

    expect(onDelete).toHaveBeenCalledWith('1')
    expect(mockNavigate).not.toHaveBeenCalled() // Stop propagation check
  })
})
