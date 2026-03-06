import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GlobalError } from './GlobalError'

const mockInvalidate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  useRouter: () => ({
    invalidate: mockInvalidate,
  }),
}))

describe('GlobalError', () => {
  it('renders the error message', () => {
    const error = new Error('Test fatal error')
    render(<GlobalError error={error} reset={vi.fn()} />)
    
    expect(screen.getByText('The projector broke.')).toBeInTheDocument()
    expect(screen.getByText('Test fatal error')).toBeInTheDocument()
  })

  it('renders default message if error has no message', () => {
    const error = new Error()
    error.message = ''
    render(<GlobalError error={error} reset={vi.fn()} />)
    
    expect(screen.getByText('Unknown Fatal Server Error')).toBeInTheDocument()
  })

  it('calls reset and router.invalidate on Try Again click', () => {
    const reset = vi.fn()
    const error = new Error('Test')
    
    render(<GlobalError error={error} reset={reset} />)
    
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    
    expect(reset).toHaveBeenCalled()
    expect(mockInvalidate).toHaveBeenCalled()
  })

  it('renders link to dashboard', () => {
    const error = new Error('Test')
    render(<GlobalError error={error} reset={vi.fn()} />)
    
    const link = screen.getByRole('link', { name: /back to dashboard/i })
    expect(link).toHaveAttribute('href', '/dashboard')
  })
})
