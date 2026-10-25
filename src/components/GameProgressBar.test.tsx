import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { GameProgressBar } from './GameProgressBar'

describe('GameProgressBar', () => {
  it('renders card count text and progress percentage', () => {
    render(<GameProgressBar currentCount={5} totalCount={20} />)

    expect(screen.getByText('Card')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByText('25%')).toBeInTheDocument()
  })

  it('renders progressbar with correct accessibility attributes', () => {
    render(<GameProgressBar currentCount={10} totalCount={20} />)

    const progressbar = screen.getByRole('progressbar', { name: 'Kartenfortschritt' })
    expect(progressbar).toBeInTheDocument()
    expect(progressbar).toHaveAttribute('aria-valuenow', '10')
    expect(progressbar).toHaveAttribute('aria-valuemin', '0')
    expect(progressbar).toHaveAttribute('aria-valuemax', '20')
    expect(progressbar).toHaveAttribute('aria-valuetext', '50% (10 von 20 Karten)')
  })

  it('handles zero totalCount gracefully without NaN', () => {
    render(<GameProgressBar currentCount={0} totalCount={0} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
    const progressbar = screen.getByRole('progressbar', { name: 'Kartenfortschritt' })
    expect(progressbar).toHaveAttribute('aria-valuenow', '0')
    expect(progressbar).toHaveAttribute('aria-valuemax', '0')
  })

  it('handles boundary card count 0 correctly', () => {
    render(<GameProgressBar currentCount={0} totalCount={20} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
    const progressbar = screen.getByRole('progressbar', { name: 'Kartenfortschritt' })
    expect(progressbar).toHaveAttribute('aria-valuenow', '0')
    expect(progressbar).toHaveAttribute('aria-valuemax', '20')
  })

  it('handles boundary card count max correctly', () => {
    render(<GameProgressBar currentCount={20} totalCount={20} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
    const progressbar = screen.getByRole('progressbar', { name: 'Kartenfortschritt' })
    expect(progressbar).toHaveAttribute('aria-valuenow', '20')
    expect(progressbar).toHaveAttribute('aria-valuemax', '20')
  })

  it('handles negative or overflow counts gracefully without NaN or invalid ARIA values', () => {
    const { rerender } = render(<GameProgressBar currentCount={-5} totalCount={20} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
    let progressbar = screen.getByRole('progressbar', { name: 'Kartenfortschritt' })
    expect(progressbar).toHaveAttribute('aria-valuenow', '0')

    rerender(<GameProgressBar currentCount={25} totalCount={20} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
    progressbar = screen.getByRole('progressbar', { name: 'Kartenfortschritt' })
    expect(progressbar).toHaveAttribute('aria-valuenow', '20')
    expect(progressbar).toHaveAttribute('aria-valuemax', '20')
  })
})
