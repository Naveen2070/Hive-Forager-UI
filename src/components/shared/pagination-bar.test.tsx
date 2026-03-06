import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PaginationBar } from './pagination-bar'

describe('PaginationBar', () => {
  it('does not render if totalPages is 1 or less', () => {
    const { container } = render(
      <PaginationBar page={0} totalPages={1} onPageChange={vi.fn()} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders pagination controls and current page info', () => {
    render(
      <PaginationBar page={1} totalPages={5} onPageChange={vi.fn()} />
    )
    
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('disables Previous button on first page', () => {
    render(
      <PaginationBar page={0} totalPages={5} onPageChange={vi.fn()} />
    )
    
    const prevButton = screen.getByRole('button', { name: /previous/i })
    expect(prevButton).toBeDisabled()
  })

  it('disables Next button on last page', () => {
    render(
      <PaginationBar page={4} totalPages={5} onPageChange={vi.fn()} />
    )
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton).toBeDisabled()
  })

  it('disables all buttons when isPlaceholderData is true', () => {
    render(
      <PaginationBar page={1} totalPages={5} onPageChange={vi.fn()} isPlaceholderData={true} />
    )
    
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('calls onPageChange with correct values when buttons are clicked', () => {
    const onPageChange = vi.fn()
    render(
      <PaginationBar page={2} totalPages={5} onPageChange={onPageChange} />
    )
    
    fireEvent.click(screen.getByRole('button', { name: /previous/i }))
    expect(onPageChange).toHaveBeenCalledWith(1)

    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })
})
