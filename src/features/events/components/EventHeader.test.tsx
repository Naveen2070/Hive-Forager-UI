import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EventHeader } from './EventHeader'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

describe('EventHeader', () => {
  it('renders correctly for customer', () => {
    render(<EventHeader isOrganizer={false} />)

    expect(screen.getByText('Discover Events')).toBeInTheDocument()
    expect(
      screen.getByText(/Browse the latest conferences/i),
    ).toBeInTheDocument()
    expect(screen.queryByText('Create Event')).not.toBeInTheDocument()
  })

  it('renders correctly for organizer', () => {
    render(<EventHeader isOrganizer={true} />)

    expect(screen.getByText('Event Management')).toBeInTheDocument()
    expect(screen.getByText(/Manage your drafts/i)).toBeInTheDocument()
    expect(screen.getByText('Create Event')).toBeInTheDocument()
  })
})
