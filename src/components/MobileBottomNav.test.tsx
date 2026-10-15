import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MobileBottomNav } from './MobileBottomNav'

describe('MobileBottomNav', () => {
  it('renders all navigation tabs', () => {
    render(<MobileBottomNav activeTab="game" onTabChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Spiel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Statistik' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Highscores' })).toBeInTheDocument()
  })

  it('marks active tab with aria-current="page"', () => {
    render(<MobileBottomNav activeTab="statistics" onTabChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Statistik' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Spiel' })).not.toHaveAttribute('aria-current')
  })

  it('triggers onTabChange when tab is clicked', () => {
    const handleTabChange = vi.fn()
    render(<MobileBottomNav activeTab="game" onTabChange={handleTabChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Highscores' }))
    expect(handleTabChange).toHaveBeenCalledWith('highscores')
  })
})
