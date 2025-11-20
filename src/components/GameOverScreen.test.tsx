// src/components/GameOverScreen.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GameOverScreen } from './GameOverScreen'

describe('GameOverScreen', () => {
  const mockResetGame = vi.fn()

  it('renders game over message and elapsed time', () => {
    render(<GameOverScreen totalScore={120} elapsedTime={5000} resetGame={mockResetGame} />)
    expect(screen.getByText('Game Over')).toBeInTheDocument()
    expect(screen.getByText(/Time:/)).toBeInTheDocument()
    expect(screen.getByText(/5.00/)).toBeInTheDocument()
  })

  it('displays input field and check button initially', () => {
    render(<GameOverScreen totalScore={120} elapsedTime={5000} resetGame={mockResetGame} />)
    expect(screen.getByLabelText('Enter your calculated result:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Check Result' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Play Again' })).not.toBeInTheDocument()
  })

  it('shows correct message when user enters correct answer', () => {
    render(<GameOverScreen totalScore={120} elapsedTime={5000} resetGame={mockResetGame} />)

    const input = screen.getByLabelText('Enter your calculated result:')
    fireEvent.change(input, { target: { value: '120' } })

    const checkButton = screen.getByRole('button', { name: 'Check Result' })
    fireEvent.click(checkButton)

    expect(screen.getByText('✓ Correct!')).toBeInTheDocument()
    expect(screen.getByText(/Your answer:/)).toBeInTheDocument()
    expect(screen.getAllByText(/120/)).toHaveLength(2)
    expect(screen.getByText(/Actual total:/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play Again' })).toBeInTheDocument()
  })

  it('shows incorrect message when user enters wrong answer', () => {
    render(<GameOverScreen totalScore={120} elapsedTime={5000} resetGame={mockResetGame} />)

    const input = screen.getByLabelText('Enter your calculated result:')
    fireEvent.change(input, { target: { value: '100' } })

    const checkButton = screen.getByRole('button', { name: 'Check Result' })
    fireEvent.click(checkButton)

    expect(screen.getByText('✗ Incorrect')).toBeInTheDocument()
    expect(screen.getByText(/Your answer:/)).toBeInTheDocument()
    expect(screen.getByText(/100/)).toBeInTheDocument()
    expect(screen.getByText(/Actual total:/)).toBeInTheDocument()
    expect(screen.getAllByText(/120/)).toHaveLength(1)
  })

  it('calls resetGame when Play Again button is clicked', () => {
    render(<GameOverScreen totalScore={120} elapsedTime={5000} resetGame={mockResetGame} />)

    const input = screen.getByLabelText('Enter your calculated result:')
    fireEvent.change(input, { target: { value: '120' } })

    const checkButton = screen.getByRole('button', { name: 'Check Result' })
    fireEvent.click(checkButton)

    const playAgainButton = screen.getByRole('button', { name: 'Play Again' })
    fireEvent.click(playAgainButton)

    expect(mockResetGame).toHaveBeenCalledTimes(1)
  })

  it('handles empty input correctly', () => {
    render(<GameOverScreen totalScore={120} elapsedTime={5000} resetGame={mockResetGame} />)

    const checkButton = screen.getByRole('button', { name: 'Check Result' })
    fireEvent.click(checkButton)

    // Empty input parsed as NaN, should show incorrect
    expect(screen.getByText('✗ Incorrect')).toBeInTheDocument()
  })

  it('handles decimal input by parsing as integer', () => {
    render(<GameOverScreen totalScore={120} elapsedTime={5000} resetGame={mockResetGame} />)

    const input = screen.getByLabelText('Enter your calculated result:')
    fireEvent.change(input, { target: { value: '120.5' } })

    const checkButton = screen.getByRole('button', { name: 'Check Result' })
    fireEvent.click(checkButton)

    // parseInt('120.5') === 120, should be correct
    expect(screen.getByText('✓ Correct!')).toBeInTheDocument()
  })

  it('displays user input in result screen', () => {
    render(<GameOverScreen totalScore={120} elapsedTime={5000} resetGame={mockResetGame} />)

    const input = screen.getByLabelText('Enter your calculated result:')
    fireEvent.change(input, { target: { value: '150' } })

    const checkButton = screen.getByRole('button', { name: 'Check Result' })
    fireEvent.click(checkButton)

    expect(screen.getByText(/Your answer:/)).toBeInTheDocument()
    expect(screen.getByText(/150/)).toBeInTheDocument()
  })

  it('displays actual total score in result screen', () => {
    render(<GameOverScreen totalScore={95} elapsedTime={5000} resetGame={mockResetGame} />)

    const input = screen.getByLabelText('Enter your calculated result:')
    fireEvent.change(input, { target: { value: '100' } })

    const checkButton = screen.getByRole('button', { name: 'Check Result' })
    fireEvent.click(checkButton)

    expect(screen.getByText(/Actual total:/)).toBeInTheDocument()
    expect(screen.getByText(/95/)).toBeInTheDocument()
  })
})
