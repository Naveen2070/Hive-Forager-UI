import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Ticket,
  TicketStamp,
  TicketDateBlock,
  TicketContent,
  TicketActions,
} from './TicketLayout'

describe('TicketLayout Components', () => {
  describe('Ticket', () => {
    it('renders children with default styles', () => {
      render(
        <Ticket>
          <div data-testid="child">Content</div>
        </Ticket>
      )
      const ticket = screen.getByTestId('child').parentElement
      expect(ticket).toHaveClass('hover:border-blue-500/50', 'hover:shadow-blue-900/20')
    })

    it('applies past styles when isPast is true', () => {
      render(
        <Ticket isPast>
          <div data-testid="child">Content</div>
        </Ticket>
      )
      const ticket = screen.getByTestId('child').parentElement
      expect(ticket).toHaveClass('opacity-90', 'hover:border-slate-700')
      expect(ticket).not.toHaveClass('hover:border-blue-500/50')
    })

    it('applies yellow accent styles', () => {
      render(
        <Ticket accent="yellow">
          <div data-testid="child">Content</div>
        </Ticket>
      )
      const ticket = screen.getByTestId('child').parentElement
      expect(ticket).toHaveClass('hover:border-yellow-500/50', 'hover:shadow-yellow-900/20')
    })
  })

  describe('TicketStamp', () => {
    it('renders the stamp with text and color class', () => {
      render(<TicketStamp text="SCANNED" colorClass="text-green-500" />)
      const textElement = screen.getByText('SCANNED')
      expect(textElement).toBeInTheDocument()
      expect(textElement).toHaveClass('text-green-500')
    })
  })

  describe('TicketDateBlock', () => {
    it('renders children inside the block', () => {
      render(
        <TicketDateBlock>
          <span>12 DEC</span>
        </TicketDateBlock>
      )
      expect(screen.getByText('12 DEC')).toBeInTheDocument()
    })
  })

  describe('TicketContent', () => {
    it('renders children with additional className', () => {
      render(
        <TicketContent className="custom-class">
          <span>Main Content</span>
        </TicketContent>
      )
      const content = screen.getByText('Main Content').parentElement
      expect(content).toHaveClass('custom-class', 'p-4')
    })
  })

  describe('TicketActions', () => {
    it('renders children', () => {
      render(
        <TicketActions>
          <button>Action</button>
        </TicketActions>
      )
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })
})
