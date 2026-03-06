import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { UnderConstruction } from './UnderConstruction'

// Mock router
const mockHistoryBack = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  useRouter: () => ({
    history: { back: mockHistoryBack },
  }),
}))

describe('UnderConstruction', () => {
  it('renders the construction messaging and image', () => {
    render(<UnderConstruction />)
    
    expect(screen.getByText('Pardon our dust!')).toBeInTheDocument()
    expect(screen.getByText(/Our worker bees are buzzing away/)).toBeInTheDocument()
    expect(screen.getByAltText('Under Construction - Worker Bees')).toBeInTheDocument()
  })

  it('calls router.history.back() when "Go Back" is clicked', () => {
    render(<UnderConstruction />)
    
    const goBackButton = screen.getByRole('button', { name: /go back/i })
    fireEvent.click(goBackButton)
    
    expect(mockHistoryBack).toHaveBeenCalled()
  })

  it('renders "Back to Dashboard" link', () => {
    render(<UnderConstruction />)
    
    const link = screen.getByRole('link', { name: /back to dashboard/i })
    expect(link).toHaveAttribute('href', '/')
  })
})
