// src/components/SurvivalInfo.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SurvivalInfo } from './SurvivalInfo'

describe('SurvivalInfo', () => {
  it('renders current streak, longest streak, and current difficulty correctly', () => {
    render(
      <SurvivalInfo
        currentStreak={3}
        longestStreak={7}
        currentDifficulty={20}
      />,
    )

    expect(screen.getByText('Current Streak')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()

    expect(screen.getByText('Best Streak')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()

    expect(screen.getByText('Difficulty')).toBeInTheDocument()
    expect(screen.getByText('20 cards')).toBeInTheDocument()
  })

  it('renders with correct accessibility attributes and roles', () => {
    render(
      <SurvivalInfo
        currentStreak={2}
        longestStreak={5}
        currentDifficulty={15}
      />,
    )

    expect(screen.getByRole('region', { name: /Survival Mode Information/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /Current Streak: 2/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /Best Streak: 5/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /Difficulty: 15 cards/i })).toBeInTheDocument()

    const currentStreakVal = screen.getByText('2')
    expect(currentStreakVal).toHaveAttribute('aria-live', 'polite')

    const bestStreakVal = screen.getByText('5')
    expect(bestStreakVal).toHaveAttribute('aria-live', 'polite')

    const difficultyVal = screen.getByText('15 cards')
    expect(difficultyVal).toHaveAttribute('aria-live', 'polite')
  })

  it('handles zero values and edge cases robustly', () => {
    render(
      <SurvivalInfo
        currentStreak={0}
        longestStreak={0}
        currentDifficulty={10}
      />,
    )

    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBe(2)
    expect(screen.getByText('10 cards')).toBeInTheDocument()
  })
})
