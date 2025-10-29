import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DoppelkopfGame from './DoppelkopfGame'

describe('DoppelkopfGame', () => {
  it('renders the game title', () => {
    render(<DoppelkopfGame />)
    expect(screen.getByText('Doppelkopf Game')).toBeInTheDocument()
  })

  it('shows the card back initially', () => {
    render(<DoppelkopfGame />)
    const cardBack = screen.getByTestId('card-back')
    expect(cardBack).toBeInTheDocument()
    expect(cardBack).toHaveClass('bg-blue-500')
  })

  it('reveals a card on the first click', () => {
    render(<DoppelkopfGame />)
    const cardElement = screen.getByRole('button')
    fireEvent.click(cardElement)
    // After the first click, the card back should not be visible
    expect(screen.queryByTestId('card-back')).not.toBeInTheDocument()
  })

  it('shows the final score after 21 clicks', () => {
    render(<DoppelkopfGame />)
    const cardElement = screen.getByRole('button')
    for (let i = 0; i < 21; i++) {
      fireEvent.click(cardElement)
    }
    expect(screen.getByText('Game Over')).toBeInTheDocument()
    expect(screen.getByText(/Total Score:/)).toBeInTheDocument()
  })

  it('displays the elapsed time when the game is over', () => {
    render(<DoppelkopfGame />)
    const cardElement = screen.getByRole('button')
    for (let i = 0; i < 21; i++) {
      fireEvent.click(cardElement)
    }
    expect(screen.getByText(/Time:/)).toBeInTheDocument()
  })

  it('resets the game when the "Repeat" button is clicked', () => {
    render(<DoppelkopfGame />)
    const cardElement = screen.getByRole('button')
    for (let i = 0; i < 21; i++) {
      fireEvent.click(cardElement)
    }
    const repeatButton = screen.getByText('Repeat')
    fireEvent.click(repeatButton)
    expect(screen.getByTestId('card-back')).toBeInTheDocument()
  })
})
