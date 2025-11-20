// src/components/HighscoreList.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
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

  it('renders empty state when no highscores', () => {
    render(<HighscoreList highscores={[]} />)

    expect(screen.getByText('Highscores')).toBeInTheDocument()
    expect(screen.getByText(/No highscores yet/)).toBeInTheDocument()
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

  it('applies reduced opacity to incorrect entries', () => {
    render(<HighscoreList highscores={sampleHighscores} />)

    const rows = screen.getAllByRole('row')
    // Last row is incorrect entry
    const incorrectRow = rows[rows.length - 1]

    expect(incorrectRow.className).toContain('opacity-60')
  })
})
