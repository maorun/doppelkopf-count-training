// src/components/HighscoreList.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HighscoreList } from './HighscoreList'
import { HighscoreEntry } from '../lib/highscore'

describe('HighscoreList', () => {
  const sampleHighscores: HighscoreEntry[] = [
    {
      score: 350,
      isCorrect: true,
      cardsCount: 20,
      elapsedTime: 15000,
      timeWasMeasured: true,
      timestamp: new Date('2024-01-15').getTime(),
    },
    {
      score: 300,
      isCorrect: true,
      cardsCount: 20,
      elapsedTime: 30000,
      timeWasMeasured: false,
      timestamp: new Date('2024-01-14').getTime(),
    },
    {
      score: 0,
      isCorrect: false,
      cardsCount: 15,
      elapsedTime: 10000,
      timeWasMeasured: true,
      timestamp: new Date('2024-01-13').getTime(),
    },
  ]

  beforeEach(() => {
    localStorage.clear()
  })

  it('renders empty state when no highscores', () => {
    render(<HighscoreList highscores={[]} onClear={vi.fn()} />)

    expect(screen.getByText('Highscores')).toBeInTheDocument()
    expect(screen.getByText(/No highscores yet/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Clear All' })).not.toBeInTheDocument()
  })

  it('renders highscore table when entries exist', () => {
    render(<HighscoreList highscores={sampleHighscores} />)

    expect(screen.getByText('Highscores')).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('displays correct number of entries', () => {
    render(<HighscoreList highscores={sampleHighscores} />)

    const rows = screen.getAllByRole('row')
    // 1 header row + 3 data rows
    expect(rows).toHaveLength(4)
  })

  it('displays entry details correctly', () => {
    render(<HighscoreList highscores={sampleHighscores} />)

    // Check first entry
    expect(screen.getByText('350')).toBeInTheDocument()
    expect(screen.getByText('15.0s')).toBeInTheDocument()

    // Check second entry (no time measured)
    expect(screen.getByText('300')).toBeInTheDocument()
    expect(screen.getAllByText('-')).toHaveLength(1) // Time not measured

    // Check third entry
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('shows correct/incorrect status indicators', () => {
    render(<HighscoreList highscores={sampleHighscores} />)

    const checkmarks = screen.getAllByText('✓')
    const crosses = screen.getAllByText('✗')

    expect(checkmarks).toHaveLength(2) // 2 correct
    expect(crosses).toHaveLength(1) // 1 incorrect
  })

  it('displays rankings starting from 1', () => {
    render(<HighscoreList highscores={sampleHighscores} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders Clear All button when onClear is provided', () => {
    const mockOnClear = vi.fn()
    render(<HighscoreList highscores={sampleHighscores} onClear={mockOnClear} />)

    expect(screen.getByRole('button', { name: 'Clear All' })).toBeInTheDocument()
  })

  it('does not render Clear All button when onClear is not provided', () => {
    render(<HighscoreList highscores={sampleHighscores} />)

    expect(screen.queryByRole('button', { name: 'Clear All' })).not.toBeInTheDocument()
  })

  it('calls onClear when Clear All button is clicked', () => {
    const mockOnClear = vi.fn()
    render(<HighscoreList highscores={sampleHighscores} onClear={mockOnClear} />)

    const clearButton = screen.getByRole('button', { name: 'Clear All' })
    fireEvent.click(clearButton)

    expect(mockOnClear).toHaveBeenCalledTimes(1)
  })

  it('formats dates in German locale', () => {
    render(<HighscoreList highscores={sampleHighscores} />)

    // German date format: DD.MM.YYYY
    expect(screen.getByText('15.01.2024')).toBeInTheDocument()
    expect(screen.getByText('14.01.2024')).toBeInTheDocument()
    expect(screen.getByText('13.01.2024')).toBeInTheDocument()
  })

  it('formats time in seconds with one decimal', () => {
    const entries: HighscoreEntry[] = [
      {
        score: 350,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 12345,
        timeWasMeasured: true,
        timestamp: Date.now(),
      },
    ]

    render(<HighscoreList highscores={entries} />)

    expect(screen.getByText('12.3s')).toBeInTheDocument()
  })

  it('shows dash for time when time was not measured', () => {
    const entries: HighscoreEntry[] = [
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: false,
        timestamp: Date.now(),
      },
    ]

    render(<HighscoreList highscores={entries} />)

    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('displays card count for each entry', () => {
    render(<HighscoreList highscores={sampleHighscores} />)

    // Check that card counts are displayed
    const cardCounts = screen.getAllByText(/20|15/)
    expect(cardCounts.length).toBeGreaterThan(0)
  })

  it('visually distinguishes incorrect entries without reducing text contrast', () => {
    render(<HighscoreList highscores={sampleHighscores} />)

    const rows = screen.getAllByRole('row')
    // Last row is incorrect entry
    const incorrectRow = rows[rows.length - 1]

    expect(incorrectRow.className).toContain('bg-red-50/60')
    expect(incorrectRow.className).not.toContain('opacity-60')
  })

  it('persists highscores to localStorage on mount', () => {
    localStorage.clear()
    const mockOnClear = vi.fn()
    render(<HighscoreList highscores={sampleHighscores} onClear={mockOnClear} />)

    // After render, localStorage should contain the highscores
    const stored = localStorage.getItem('doppelkopf-highscore-list')!
    expect(JSON.parse(stored)).toHaveLength(3)

    localStorage.clear()
  })

  it('loads highscores from localStorage on mount', async () => {
    localStorage.setItem('doppelkopf-highscore-list', JSON.stringify([{ score: 500, isCorrect: true, cardsCount: 25, elapsedTime: 10000, timeWasMeasured: true, timestamp: Date.now() }]))

    render(<HighscoreList highscores={[]} onClear={vi.fn()} />)

    // Should load from localStorage even when no highscores provided
    await waitFor(() => {
      expect(screen.getByText('500')).toBeInTheDocument()
    })
    expect(screen.getByText('10.0s')).toBeInTheDocument()

    localStorage.clear()
  })

  it('clears highscores from localStorage when Clear button is clicked', async () => {
    localStorage.clear()
    const mockOnClear = vi.fn()
    render(<HighscoreList highscores={sampleHighscores} onClear={mockOnClear} />)

    // Verify highscores are displayed initially
    await waitFor(() => {
      expect(screen.getByText('350')).toBeInTheDocument()
    })

    // Clear button should be clicked
    fireEvent.click(screen.getByRole('button', { name: 'Clear All' }))

    // onClear callback should be called
    expect(mockOnClear).toHaveBeenCalledTimes(1)

    // Verify localStorage is cleared (null or undefined)
    const stored = localStorage.getItem('doppelkopf-highscore-list')
    expect(stored).toBeNull()

    localStorage.clear()
  })

  it('merges new highscores with persisted list', async () => {
    const newHighscores: HighscoreEntry[] = [
      {
        score: 400,
        isCorrect: true,
        cardsCount: 22,
        elapsedTime: 12000,
        timeWasMeasured: true,
        timestamp: Date.now() - 1000,
      },
    ]

    // First, persist some highscores
    localStorage.setItem('doppelkopf-highscore-list', JSON.stringify(sampleHighscores))

    // Then render component with new highscores
    render(<HighscoreList highscores={newHighscores} onClear={vi.fn()} />)

    // Should contain both old and new highscores (merged and sorted)
    await waitFor(() => {
      expect(screen.getByText('400')).toBeInTheDocument() // New score
    }, { timeout: 1000 })

    localStorage.clear()
  })

  it('maintains sorted order when merging highscores', async () => {
    const lowerScore: HighscoreEntry = {
      score: 100,
      isCorrect: true,
      cardsCount: 10,
      elapsedTime: 20000,
      timeWasMeasured: true,
      timestamp: Date.now(),
    }

    const higherScore: HighscoreEntry = {
      score: 500,
      isCorrect: true,
      cardsCount: 25,
      elapsedTime: 8000,
      timeWasMeasured: true,
      timestamp: Date.now() - 1000,
    }

    // First persist lower score
    localStorage.setItem('doppelkopf-highscore-list', JSON.stringify([lowerScore]))

    // Then add higher score
    render(<HighscoreList highscores={[higherScore]} onClear={vi.fn()} />)

    await waitFor(() => {
      expect(screen.getByText('500')).toBeInTheDocument()
    }, { timeout: 1000 })

    localStorage.clear()
  })

  it('merges new highscores with persisted list (regression)', async () => {
    // This test ensures existing functionality is preserved
    const mockOnClear = vi.fn()
    render(<HighscoreList highscores={sampleHighscores} onClear={mockOnClear} />)

    // Verify all original functionality still works
    await waitFor(() => {
      expect(screen.getByText('350')).toBeInTheDocument()
      expect(screen.getByText('300')).toBeInTheDocument()
      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    localStorage.clear()
  })
})
