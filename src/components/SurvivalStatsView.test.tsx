// src/components/SurvivalStatsView.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SurvivalStatsView } from './SurvivalStatsView'

// Mock useSurvivalMode and useHighscores hooks
const mockResetLongestStreak = vi.fn()
const mockResetAllStats = vi.fn()

let mockSurvivalState = {
  currentStreak: 0,
  longestStreak: 0,
  isActive: false,
  currentDifficulty: 15,
}

let mockHighscores: Array<{
  score: number
  isCorrect: boolean
  cardsCount: number
  elapsedTime: number
  timeWasMeasured: boolean
  timestamp: number
  gameMode?: string
}> = []

vi.mock('../hooks/useSurvivalMode', () => ({
  useSurvivalMode: () => ({
    survivalState: mockSurvivalState,
    resetLongestStreak: mockResetLongestStreak,
    resetAllStats: mockResetAllStats,
  }),
}))

vi.mock('../hooks/useHighscores', () => ({
  useHighscores: () => ({
    highscores: mockHighscores,
  }),
}))

describe('SurvivalStatsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSurvivalState = {
      currentStreak: 0,
      longestStreak: 0,
      isActive: false,
      currentDifficulty: 15,
    }
    mockHighscores = []
  })

  it('renders survival mode statistics view and empty states correctly', () => {
    render(<SurvivalStatsView />)

    expect(screen.getByText('Survival Mode Statistics')).toBeInTheDocument()
    expect(screen.getByText('Current Streak')).toBeInTheDocument()
    expect(screen.getByText('Longest Streak')).toBeInTheDocument()
    expect(screen.getByText('Current Difficulty')).toBeInTheDocument()
    expect(screen.getByText('How Survival Mode Works')).toBeInTheDocument()

    // Reset buttons should not be visible when longestStreak is 0
    expect(screen.queryByRole('button', { name: /Reset Longest Streak/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Clear All Stats/i })).not.toBeInTheDocument()

    // Highscores section and empty state announcement
    expect(screen.getByText('Survival Highscores')).toBeInTheDocument()
    const emptyStateAnnouncement = screen.getByRole('status', { name: /No survival highscores recorded yet/i })
    expect(emptyStateAnnouncement).toBeInTheDocument()
    expect(emptyStateAnnouncement).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByText(/No survival highscores recorded yet\. Play survival mode to set your first highscore!/i)).toBeInTheDocument()
  })

  it('renders streak and difficulty values when active or recorded', () => {
    mockSurvivalState = {
      currentStreak: 3,
      longestStreak: 5,
      isActive: true,
      currentDifficulty: 21,
    }

    render(<SurvivalStatsView />)

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('21')).toBeInTheDocument()

    // Reset buttons should be visible when longestStreak > 0
    expect(screen.getByRole('button', { name: /Reset Longest Streak/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Clear All Stats/i })).toBeInTheDocument()
  })

  it('calls resetLongestStreak when Reset Longest Streak button is clicked', () => {
    mockSurvivalState = {
      currentStreak: 2,
      longestStreak: 4,
      isActive: true,
      currentDifficulty: 19,
    }

    render(<SurvivalStatsView />)

    const resetButton = screen.getByRole('button', { name: /Reset Longest Streak/i })
    fireEvent.click(resetButton)

    expect(mockResetLongestStreak).toHaveBeenCalledTimes(1)
  })

  it('calls resetAllStats when Clear All Stats button is clicked', () => {
    mockSurvivalState = {
      currentStreak: 2,
      longestStreak: 4,
      isActive: true,
      currentDifficulty: 19,
    }

    render(<SurvivalStatsView />)

    const clearButton = screen.getByRole('button', { name: /Clear All Stats/i })
    fireEvent.click(clearButton)

    expect(mockResetAllStats).toHaveBeenCalledTimes(1)
  })

  it('renders survival highscores when present', () => {
    mockSurvivalState = {
      currentStreak: 0,
      longestStreak: 5,
      isActive: false,
      currentDifficulty: 15,
    }

    mockHighscores = [
      {
        score: 350,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 12000,
        timeWasMeasured: true,
        timestamp: Date.now(),
        gameMode: 'survival',
      },
      {
        score: 200,
        isCorrect: true,
        cardsCount: 15,
        elapsedTime: 10000,
        timeWasMeasured: true,
        timestamp: Date.now(),
        gameMode: 'classic',
      },
    ]

    render(<SurvivalStatsView />)

    expect(screen.getByText('Survival Highscores')).toBeInTheDocument()
    // Should render table or highscore list items for survival gameMode entries
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('has correct accessibility attributes (ARIA roles and live regions)', () => {
    mockSurvivalState = {
      currentStreak: 2,
      longestStreak: 5,
      isActive: true,
      currentDifficulty: 19,
    }

    render(<SurvivalStatsView />)

    expect(screen.getByRole('region', { name: /Survival Mode Statistics View/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /How Survival Mode Works/i })).toBeInTheDocument()

    // Check that stat cards have region roles and live regions
    const currentStreakCard = screen.getByRole('region', { name: /Current Streak: 2/i })
    expect(currentStreakCard).toBeInTheDocument()
  })

  it('handles robust rendering when survivalState properties are undefined/missing', () => {
    // @ts-expect-error testing incomplete state object
    mockSurvivalState = {}

    render(<SurvivalStatsView />)

    expect(screen.getByRole('region', { name: /Survival Mode Statistics View/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Reset Longest Streak/i })).not.toBeInTheDocument()
  })
})
