import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { NotFound } from './NotFound'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

describe('NotFound', () => {
  it('renders 404 messaging', () => {
    render(<NotFound />)
    
    expect(screen.getByText("Honey, you're lost.")).toBeInTheDocument()
    expect(screen.getByText(/It looks like this show got canceled/)).toBeInTheDocument()
    expect(screen.getByAltText('404 Error - Show Canceled')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<NotFound />)
    
    expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /events/i })).toHaveAttribute('href', '/events')
    expect(screen.getByRole('link', { name: /movies/i })).toHaveAttribute('href', '/movies')
  })
})
