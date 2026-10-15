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
  })

  it('handles zero totalCount gracefully without NaN', () => {
    render(<GameProgressBar currentCount={0} totalCount={0} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })
})
