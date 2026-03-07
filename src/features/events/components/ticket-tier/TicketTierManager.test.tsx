import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TicketTierManager } from './TicketTierManager'
import { useTicketTierMutations } from '@/features/events/hooks/useTicketTiers'
import { createWrapper } from '@/test/utils'

vi.mock('@/features/events/hooks/useTicketTiers', () => ({
  useTicketTierMutations: vi.fn(),
}))

vi.mock('@/store/auth.store', () => ({
  useAuthStore: {
    getState: () => ({ user: { id: '1' } }),
  },
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children }: any) => <div>{children}</div>,
  AlertDialogTrigger: ({ children }: any) => <div>{children}</div>,
  AlertDialogContent: ({ children }: any) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: any) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: any) => <h2>{children}</h2>,
  AlertDialogDescription: ({ children }: any) => <p>{children}</p>,
  AlertDialogFooter: ({ children }: any) => <div>{children}</div>,
  AlertDialogAction: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  AlertDialogCancel: ({ children }: any) => <button>{children}</button>,
}))

const mockEvent: any = {
  id: 1,
  startDate: '2025-01-01T10:00:00Z',
  endDate: '2025-01-01T20:00:00Z',
  ticketTiers: [
    {
      id: 101,
      name: 'General',
      price: 10,
      totalAllocation: 100,
      availableAllocation: 100,
      validUntil: '2025-01-01T20:00:00Z',
    },
  ],
}

describe('TicketTierManager', () => {
  const mockAddTier = { mutate: vi.fn(), isPending: false }
  const mockUpdateTier = { mutate: vi.fn(), isPending: false }
  const mockDeleteTier = { mutate: vi.fn(), isPending: false }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useTicketTierMutations as any).mockReturnValue({
      addTier: mockAddTier,
      updateTier: mockUpdateTier,
      deleteTier: mockDeleteTier,
    })
  })

  it('renders correctly with existing tiers', () => {
    render(<TicketTierManager event={mockEvent} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('Ticket Tiers')).toBeInTheDocument()
    expect(screen.getByText('General')).toBeInTheDocument()
  })

  it('opens add tier dialog', () => {
    render(<TicketTierManager event={mockEvent} />, {
      wrapper: createWrapper(),
    })

    fireEvent.click(screen.getByText('Add Tier'))
    expect(screen.getByText('Add Ticket Tier')).toBeInTheDocument()
  })

  it('opens edit tier dialog with initial values', async () => {
    render(<TicketTierManager event={mockEvent} />, {
      wrapper: createWrapper(),
    })

    // The Add Tier button has text. The card buttons (Edit/Delete) are icon-only.
    // Let's find buttons that don't have "Add Tier" text.
    const buttons = screen.getAllByRole('button')
    const iconOnlyButtons = buttons.filter(
      (b) => b.querySelector('svg') && !b.textContent?.includes('Add Tier'),
    )

    const editButton = iconOnlyButtons[0]
    fireEvent.click(editButton!)

    expect(await screen.findByText(/Edit Ticket Tier/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue('General')).toBeInTheDocument()
  })

  it('calls deleteTier mutation', async () => {
    render(<TicketTierManager event={mockEvent} />, {
      wrapper: createWrapper(),
    })

    const buttons = screen.getAllByRole('button')
    const iconOnlyButtons = buttons.filter(
      (b) => b.querySelector('svg') && !b.textContent?.includes('Add Tier'),
    )

    const deleteButton = iconOnlyButtons[1]
    fireEvent.click(deleteButton!)

    const confirmButton = await screen.findByRole('button', { name: /Delete/i })
    fireEvent.click(confirmButton)

    expect(mockDeleteTier.mutate).toHaveBeenCalledWith(101)
  })
})
