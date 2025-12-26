// src/components/HintDialog.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { HintDialog } from './HintDialog'
import { Card } from '../lib/doppelkopf'

describe('HintDialog', () => {
  const mockCards: Card[] = [
    { suit: 'Herz', rank: 'Ass', value: 11 },
    { suit: 'Pik', rank: '10', value: 10 },
    { suit: 'Kreuz', rank: 'König', value: 4 },
    { suit: 'Karo', rank: 'Dame', value: 3 },
    { suit: 'Herz', rank: 'Bube', value: 2 },
    { suit: 'Pik', rank: '9', value: 0 },
  ]

  const mockOnHintUsed = vi.fn()

  const defaultProps = {
    revealedCards: mockCards,
    totalScore: 30,
    onHintUsed: mockOnHintUsed,
    children: <button type="button">Open Hints</button>,
  }

  beforeEach(() => {
    mockOnHintUsed.mockClear()
  })

  it('renders the trigger button', () => {
    render(<HintDialog {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Open Hints' })).toBeInTheDocument()
  })

  it('opens dialog when trigger is clicked', async () => {
    render(<HintDialog {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: 'Open Hints' })
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Hinweise')).toBeInTheDocument()
    })
  })

  it('displays hint description with penalty information', async () => {
    render(<HintDialog {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: 'Open Hints' })
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText(/Jeder Hinweis kostet 20 Punkte/)).toBeInTheDocument()
    })
  })

  it('shows running total when hint is clicked', async () => {
    render(<HintDialog {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: 'Open Hints' })
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Aktuelle Punktzahl anzeigen')).toBeInTheDocument()
    })

    const totalButton = screen.getByRole('button', { name: /Aktuelle Punktzahl anzeigen/ })
    fireEvent.click(totalButton)

    await waitFor(() => {
      expect(screen.getByText(/Aktueller Punktestand: 30/)).toBeInTheDocument()
      expect(screen.getByText(/6 Karten aufgedeckt/)).toBeInTheDocument()
    })

    expect(mockOnHintUsed).toHaveBeenCalledTimes(1)
  })

  it('shows last 5 cards when hint is clicked', async () => {
    render(<HintDialog {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: 'Open Hints' })
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Letzte 5 Karten anzeigen')).toBeInTheDocument()
    })

    const lastCardsButton = screen.getByRole('button', { name: /Letzte 5 Karten anzeigen/ })
    fireEvent.click(lastCardsButton)

    await waitFor(() => {
      expect(screen.getByText(/Letzte 5 Karten:/)).toBeInTheDocument()
      expect(screen.getByText(/10 \(10 Punkte\)/)).toBeInTheDocument()
      expect(screen.getByText(/König \(4 Punkte\)/)).toBeInTheDocument()
      expect(screen.getByText(/Dame \(3 Punkte\)/)).toBeInTheDocument()
      expect(screen.getByText(/Bube \(2 Punkte\)/)).toBeInTheDocument()
      expect(screen.getByText(/9 \(0 Punkte\)/)).toBeInTheDocument()
    })

    expect(mockOnHintUsed).toHaveBeenCalledTimes(1)
  })

  it('shows card values when hint is clicked', async () => {
    render(<HintDialog {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: 'Open Hints' })
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Kartenwerte anzeigen')).toBeInTheDocument()
    })

    const valuesButton = screen.getByRole('button', { name: /Kartenwerte anzeigen/ })
    fireEvent.click(valuesButton)

    await waitFor(() => {
      expect(screen.getByText(/Kartenwerte:/)).toBeInTheDocument()
      expect(screen.getByText('Ass: 11 Punkte')).toBeInTheDocument()
      expect(screen.getByText('10: 10 Punkte')).toBeInTheDocument()
      expect(screen.getByText('König: 4 Punkte')).toBeInTheDocument()
      expect(screen.getByText('Dame: 3 Punkte')).toBeInTheDocument()
      expect(screen.getByText('Bube: 2 Punkte')).toBeInTheDocument()
      expect(screen.getByText('9: 0 Punkte')).toBeInTheDocument()
    })

    expect(mockOnHintUsed).toHaveBeenCalledTimes(1)
  })

  it('disables hint button after it is used', async () => {
    render(<HintDialog {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: 'Open Hints' })
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Aktuelle Punktzahl anzeigen')).toBeInTheDocument()
    })

    const totalButton = screen.getByRole('button', { name: /Aktuelle Punktzahl anzeigen/ })
    fireEvent.click(totalButton)

    await waitFor(() => {
      expect(totalButton).toBeDisabled()
    })
  })

  it('shows check mark on used hint button', async () => {
    render(<HintDialog {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: 'Open Hints' })
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Aktuelle Punktzahl anzeigen')).toBeInTheDocument()
    })

    const totalButton = screen.getByRole('button', { name: /Aktuelle Punktzahl anzeigen/ })
    fireEvent.click(totalButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /✓ Aktuelle Punktzahl anzeigen/ })).toBeInTheDocument()
    })
  })

  it('calls onHintUsed for each hint used', async () => {
    render(<HintDialog {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: 'Open Hints' })
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Hinweise')).toBeInTheDocument()
    })

    // Use first hint
    const totalButton = screen.getByRole('button', { name: /Aktuelle Punktzahl anzeigen/ })
    fireEvent.click(totalButton)

    await waitFor(() => {
      expect(mockOnHintUsed).toHaveBeenCalledTimes(1)
    })

    // Use second hint
    const lastCardsButton = screen.getByRole('button', { name: /Letzte 5 Karten anzeigen/ })
    fireEvent.click(lastCardsButton)

    await waitFor(() => {
      expect(mockOnHintUsed).toHaveBeenCalledTimes(2)
    })

    // Use third hint
    const valuesButton = screen.getByRole('button', { name: /Kartenwerte anzeigen/ })
    fireEvent.click(valuesButton)

    await waitFor(() => {
      expect(mockOnHintUsed).toHaveBeenCalledTimes(3)
    })
  })

  it('disables last cards hint when no cards revealed', async () => {
    render(<HintDialog {...defaultProps} revealedCards={[]} />)
    const trigger = screen.getByRole('button', { name: 'Open Hints' })
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Letzte 5 Karten anzeigen')).toBeInTheDocument()
    })

    const lastCardsButton = screen.getByRole('button', { name: /Letzte 5 Karten anzeigen/ })
    expect(lastCardsButton).toBeDisabled()
  })

  it('shows less than 5 cards when fewer are revealed', async () => {
    const twoCards = mockCards.slice(0, 2)
    render(<HintDialog {...defaultProps} revealedCards={twoCards} totalScore={21} />)
    const trigger = screen.getByRole('button', { name: 'Open Hints' })
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Letzte 5 Karten anzeigen')).toBeInTheDocument()
    })

    const lastCardsButton = screen.getByRole('button', { name: /Letzte 5 Karten anzeigen/ })
    fireEvent.click(lastCardsButton)

    await waitFor(() => {
      expect(screen.getByText(/Letzte 2 Karten:/)).toBeInTheDocument()
    })
  })

  it('resets hints when dialog closes and reopens', async () => {
    render(<HintDialog {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: 'Open Hints' })

    // Open and use a hint
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Aktuelle Punktzahl anzeigen')).toBeInTheDocument()
    })

    const totalButton = screen.getByRole('button', { name: /Aktuelle Punktzahl anzeigen/ })
    fireEvent.click(totalButton)

    await waitFor(() => {
      expect(screen.getByText(/Aktueller Punktestand: 30/)).toBeInTheDocument()
    })

    // Close dialog by pressing escape
    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByText('Hinweise')).not.toBeInTheDocument()
    })

    // Reopen dialog
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Aktuelle Punktzahl anzeigen')).toBeInTheDocument()
    })

    // Hint should be available again (not showing check mark or disabled)
    const totalButtonAgain = screen.getByRole('button', { name: 'Aktuelle Punktzahl anzeigen' })
    expect(totalButtonAgain).not.toBeDisabled()
    expect(screen.queryByText(/Aktueller Punktestand: 30/)).not.toBeInTheDocument()
  })
})
