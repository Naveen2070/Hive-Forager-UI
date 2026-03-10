import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScannerOverlay } from './ScannerOverlay'

describe('ScannerOverlay Component', () => {
  it('renders corner markers with default color', () => {
    const { container } = render(<ScannerOverlay isScanning={false} />)
    const borders = container.querySelectorAll('.border-blue-500')
    expect(borders.length).toBeGreaterThan(0)
  })

  it('renders scanning line when isScanning is true', () => {
    const { container } = render(<ScannerOverlay isScanning={true} />)
    const scanLine = container.querySelector(
      '.animate-\\[scan_2s_ease-in-out_infinite\\]',
    )
    expect(scanLine).toBeInTheDocument()
  })

  it('uses yellow colors for MOVIES mode', () => {
    const { container } = render(
      <ScannerOverlay isScanning={true} colorMode="MOVIES" />,
    )
    const yellowBorders = container.querySelectorAll('.border-yellow-500')
    expect(yellowBorders.length).toBeGreaterThan(0)
    const yellowScanLine = container.querySelector('.bg-yellow-500')
    expect(yellowScanLine).toBeInTheDocument()
  })
})
