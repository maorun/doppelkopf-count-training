import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { GameSettings } from './useSettings'
import { useDoppelkopfGame } from './useDoppelkopfGame'

const settings: GameSettings = {
  includeNines: false,
  measureTime: true,
  cardCountRange: [1, 1],
  gameMode: 'single',
  cardDesign: {
    style: 'classic',
    colorScheme: 'traditional',
    accessibility: { highContrast: false, largerText: false },
  },
  timedChallenge: { timeLimitSeconds: 60, difficultyLevel: 'medium' },
}

describe('useDoppelkopfGame', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('reveals and scores the final requested card before completing the game', () => {
    const { result } = renderHook(() => useDoppelkopfGame(settings))

    act(() => result.current.handleCardClick())

    expect(result.current.revealedCards).toHaveLength(1)
    expect(result.current.totalScore).toBe(result.current.revealedCards[0].value)
    expect(result.current.isFinished).toBe(true)
  })

  it('does not reveal further cards after the game has completed', () => {
    const { result } = renderHook(() => useDoppelkopfGame(settings))

    act(() => result.current.handleCardClick())
    const scoreAfterCompletion = result.current.totalScore
    act(() => result.current.handleCardClick())

    expect(result.current.revealedCards).toHaveLength(1)
    expect(result.current.totalScore).toBe(scoreAfterCompletion)
  })

  it('can finish an in-progress game externally, such as when a timer expires', () => {
    const multiCardSettings: GameSettings = { ...settings, cardCountRange: [3, 3] }
    const { result } = renderHook(() => useDoppelkopfGame(multiCardSettings))

    act(() => result.current.handleCardClick())
    act(() => result.current.finishGame())

    expect(result.current.revealedCards).toHaveLength(1)
    expect(result.current.isFinished).toBe(true)
  })

  it('limits malformed persisted card counts to the available deck', () => {
    const invalidRangeSettings: GameSettings = { ...settings, cardCountRange: [999, 999] }
    const { result } = renderHook(() => useDoppelkopfGame(invalidRangeSettings))

    expect(result.current.cardsToReveal).toBe(40)
  })
})
