import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EventHero } from './EventHero'

const mockEvent: any = {
  title: 'Music Festival',
  status: 'PUBLISHED',
  organizerName: 'Organizer X',
  startDate: new Date('2025-01-01T10:00:00Z').toISOString(),
  location: 'Grand Arena',
}

describe('EventHero', () => {
  it('renders event hero details correctly', () => {
    render(<EventHero event={mockEvent} />)

    expect(screen.getByText('Music Festival')).toBeInTheDocument()
    expect(screen.getByText('PUBLISHED')).toBeInTheDocument()
    expect(screen.getByText('Posted by Organizer X')).toBeInTheDocument()
    expect(screen.getByText(/January 1st, 2025/i)).toBeInTheDocument()
    expect(screen.getByText('Grand Arena')).toBeInTheDocument()
  })
})
