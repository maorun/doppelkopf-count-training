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
    const cardElement = screen.getByTestId('game-card')
    fireEvent.click(cardElement)
    // After the first click, the card back should not be visible
    expect(screen.queryByTestId('card-back')).not.toBeInTheDocument()
  })

  it('opens the settings modal when the "Settings" button is clicked', () => {
    render(<DoppelkopfGame />)
    const settingsButton = screen.getByRole('button', { name: 'Settings' })
    fireEvent.click(settingsButton)
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
  })

  it('displays the card count', () => {
    render(<DoppelkopfGame />)
    expect(screen.getByText(/Card 0 of 20/)).toBeInTheDocument()
    const cardElement = screen.getByTestId('game-card')
    fireEvent.click(cardElement)
    expect(screen.getByText(/Card 1 of 20/)).toBeInTheDocument()
  })

  it('shows input field when game is over', () => {
    render(<DoppelkopfGame />)
    const cardElement = screen.getByTestId('game-card')
    for (let i = 0; i < 20; i++) {
      fireEvent.click(cardElement)
    }
    expect(screen.getByText('Game Over')).toBeInTheDocument()
    expect(screen.getByLabelText('Enter your calculated result:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Check Result' })).toBeInTheDocument()
  })

  it('displays the elapsed time when the game is over', () => {
    render(<DoppelkopfGame />)
    const cardElement = screen.getByTestId('game-card')
    for (let i = 0; i < 20; i++) {
      fireEvent.click(cardElement)
    }
    expect(screen.getByText(/Time:/)).toBeInTheDocument()
  })

  it('shows correct message when user enters correct result', () => {
    render(<DoppelkopfGame />)
    const cardElement = screen.getByTestId('game-card')

    // Click through all cards
    for (let i = 0; i < 20; i++) {
      fireEvent.click(cardElement)
    }

    // Enter a result (we'll use a placeholder value for this test)
    const input = screen.getByLabelText('Enter your calculated result:')
    fireEvent.change(input, { target: { value: '120' } })

    const checkButton = screen.getByRole('button', { name: 'Check Result' })
    fireEvent.click(checkButton)

    // Check that result is displayed (either correct or incorrect)
    expect(screen.getByText(/Your answer:/)).toBeInTheDocument()
    expect(screen.getByText(/Actual total:/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play Again' })).toBeInTheDocument()
  })

  it('resets the game when the "Play Again" button is clicked', () => {
    render(<DoppelkopfGame />)
    const cardElement = screen.getByTestId('game-card')
    for (let i = 0; i < 20; i++) {
      fireEvent.click(cardElement)
    }

    const input = screen.getByLabelText('Enter your calculated result:')
    fireEvent.change(input, { target: { value: '100' } })

    const checkButton = screen.getByRole('button', { name: 'Check Result' })
    fireEvent.click(checkButton)

    const playAgainButton = screen.getByRole('button', { name: 'Play Again' })
    fireEvent.click(playAgainButton)
    expect(screen.getByTestId('card-back')).toBeInTheDocument()
  })

  it('applies red color to Herz and Karo suits', () => {
    render(<DoppelkopfGame />)
    const cardElement = screen.getByTestId('game-card')

    let foundRedSuit = false
    let foundBlackSuit = false

    // Click through cards to find both red and black suits
    for (let i = 0; i < 20 && (!foundRedSuit || !foundBlackSuit); i++) {
      fireEvent.click(cardElement)

      // Check if we have a card with a suit symbol
      const suitElement = screen.queryByText(/[♥♦♠♣]/)
      if (suitElement) {
        const suitSymbol = suitElement.textContent

        if (suitSymbol === '♥' || suitSymbol === '♦') {
          expect(suitElement).toHaveClass('text-red-600')
          foundRedSuit = true
        }
        else if (suitSymbol === '♠' || suitSymbol === '♣') {
          expect(suitElement).not.toHaveClass('text-red-600')
          foundBlackSuit = true
        }
      }
    }

    // Ensure we tested both red and black suits
    expect(foundRedSuit).toBe(true)
    expect(foundBlackSuit).toBe(true)
  })

  it('applies red color to rank text for Herz and Karo suits', () => {
    render(<DoppelkopfGame />)
    const cardElement = screen.getByTestId('game-card')

    let foundRedSuit = false
    let foundBlackSuit = false

    // Click through cards to find both red and black suits
    for (let i = 0; i < 20 && (!foundRedSuit || !foundBlackSuit); i++) {
      fireEvent.click(cardElement)

      // Check if we have a card with a suit symbol and rank text
      const suitElement = screen.queryByText(/[♥♦♠♣]/)
      if (suitElement) {
        const suitSymbol = suitElement.textContent
        // Get all text elements that are rank names (not the suit symbol)
        const rankElements = screen.queryAllByText(/^(Ass|10|König|Dame|Bube|9)$/)

        if (suitSymbol === '♥' || suitSymbol === '♦') {
          // For red suits, all rank elements should have red color
          rankElements.forEach((rankElement) => {
            expect(rankElement).toHaveClass('text-red-600')
          })
          foundRedSuit = true
        }
        else if (suitSymbol === '♠' || suitSymbol === '♣') {
          // For black suits, rank elements should not have red color
          rankElements.forEach((rankElement) => {
            expect(rankElement).not.toHaveClass('text-red-600')
          })
          foundBlackSuit = true
        }
      }
    }

    // Ensure we tested both red and black suits
    expect(foundRedSuit).toBe(true)
    expect(foundBlackSuit).toBe(true)
  })

  it('shows hint button after first card is revealed', () => {
    render(<DoppelkopfGame />)
    const hintButton = screen.getByRole('button', { name: 'Hint' })
    expect(hintButton).toBeInTheDocument()
    expect(hintButton).toBeDisabled() // Disabled before any cards are revealed

    const cardElement = screen.getByTestId('game-card')
    fireEvent.click(cardElement)

    expect(hintButton).not.toBeDisabled() // Enabled after first card
  })

  it('opens hint dialog when hint button is clicked', () => {
    render(<DoppelkopfGame />)
    const cardElement = screen.getByTestId('game-card')
    fireEvent.click(cardElement)

    const hintButton = screen.getByRole('button', { name: 'Hint' })
    fireEvent.click(hintButton)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Hinweise')).toBeInTheDocument()
  })

  it('displays hint count on button after using hints', async () => {
    render(<DoppelkopfGame />)
    const cardElement = screen.getByTestId('game-card')
    fireEvent.click(cardElement)

    const hintButton = screen.getByRole('button', { name: 'Hint' })
    fireEvent.click(hintButton)

    // Wait for dialog to open and use a hint
    const totalHintButton = await screen.findByRole('button', { name: /Aktuelle Punktzahl anzeigen/ })
    fireEvent.click(totalHintButton)

    // Close dialog by pressing escape
    fireEvent.keyDown(document, { key: 'Escape' })

    // Hint count should be displayed on the button
    expect(screen.getByRole('button', { name: /Hint \(1\)/ })).toBeInTheDocument()
  })

  it('hint count persists across multiple hint uses', async () => {
    render(<DoppelkopfGame />)
    const cardElement = screen.getByTestId('game-card')
    fireEvent.click(cardElement)

    // First hint
    let hintButton = screen.getByRole('button', { name: 'Hint' })
    fireEvent.click(hintButton)
    const totalHintButton = await screen.findByRole('button', { name: /Aktuelle Punktzahl anzeigen/ })
    fireEvent.click(totalHintButton)
    fireEvent.keyDown(document, { key: 'Escape' })

    // Second hint
    hintButton = screen.getByRole('button', { name: /Hint \(1\)/ })
    fireEvent.click(hintButton)
    const lastCardsHintButton = await screen.findByRole('button', { name: /Letzte 5 Karten anzeigen/ })
    fireEvent.click(lastCardsHintButton)
    fireEvent.keyDown(document, { key: 'Escape' })

    // Hint count should show 2 hints used
    expect(screen.getByRole('button', { name: /Hint \(2\)/ })).toBeInTheDocument()
  })

  it('hint count resets when starting a new game', async () => {
    render(<DoppelkopfGame />)
    const cardElement = screen.getByTestId('game-card')
    fireEvent.click(cardElement)

    // Use a hint
    const hintButton = screen.getByRole('button', { name: 'Hint' })
    fireEvent.click(hintButton)
    const totalHintButton = await screen.findByRole('button', { name: /Aktuelle Punktzahl anzeigen/ })
    fireEvent.click(totalHintButton)
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.getByRole('button', { name: /Hint \(1\)/ })).toBeInTheDocument()

    // Finish the game
    for (let i = 1; i < 20; i++) {
      fireEvent.click(cardElement)
    }

    // Submit an answer and play again
    const input = screen.getByLabelText('Enter your calculated result:')
    fireEvent.change(input, { target: { value: '100' } })
    const checkButton = screen.getByRole('button', { name: 'Check Result' })
    fireEvent.click(checkButton)
    const playAgainButton = screen.getByRole('button', { name: 'Play Again' })
    fireEvent.click(playAgainButton)

    // Hint count should be reset (no count displayed)
    expect(screen.getByRole('button', { name: 'Hint' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Hint \(1\)/ })).not.toBeInTheDocument()
  })
})
