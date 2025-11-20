// src/hooks/useHighscores.test.ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useHighscores } from './useHighscores'
import { GameResult } from '../lib/highscore'

describe('useHighscores', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear()
  })

  it('initializes with empty array when no data in localStorage', () => {
    const { result } = renderHook(() => useHighscores())
    expect(result.current.highscores).toEqual([])
  })

  it('loads highscores from localStorage on init', () => {
    const existingScores = [
      { score: 300, isCorrect: true, cardsCount: 20, elapsedTime: 10000, timeWasMeasured: true, timestamp: 1 },
    ]
    window.localStorage.setItem('doppelkopf-highscores', JSON.stringify(existingScores))

    const { result } = renderHook(() => useHighscores())
    expect(result.current.highscores).toEqual(existingScores)
  })

  it('adds new highscore from game result', () => {
    const { result } = renderHook(() => useHighscores())

    const gameResult: GameResult = {
      isCorrect: true,
      cardsCount: 20,
      elapsedTime: 15000,
      timeWasMeasured: true,
    }

    act(() => {
      result.current.addHighscore(gameResult)
    })

    expect(result.current.highscores).toHaveLength(1)
    expect(result.current.highscores[0].score).toBe(350) // 100 + 200 + 50
    expect(result.current.highscores[0].isCorrect).toBe(true)
    expect(result.current.highscores[0].cardsCount).toBe(20)
  })

  it('persists highscores to localStorage', () => {
    const { result } = renderHook(() => useHighscores())

    const gameResult: GameResult = {
      isCorrect: true,
      cardsCount: 20,
      elapsedTime: 15000,
      timeWasMeasured: true,
    }

    act(() => {
      result.current.addHighscore(gameResult)
    })

    const stored = window.localStorage.getItem('doppelkopf-highscores')
    expect(stored).toBeTruthy()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].score).toBe(350)
  })

  it('keeps only top 100 entries', () => {
    const { result } = renderHook(() => useHighscores())

    // Add 150 entries
    act(() => {
      for (let i = 0; i < 150; i++) {
        const gameResult: GameResult = {
          isCorrect: true,
          cardsCount: 10 + i,
          elapsedTime: 10000,
          timeWasMeasured: false,
        }
        result.current.addHighscore(gameResult)
      }
    })

    expect(result.current.highscores).toHaveLength(100)
  })

  it('keeps highest scoring entries when trimming', () => {
    const { result } = renderHook(() => useHighscores())

    act(() => {
      // Add low score
      result.current.addHighscore({
        isCorrect: true,
        cardsCount: 5,
        elapsedTime: 10000,
        timeWasMeasured: false,
      })

      // Add many medium scores
      for (let i = 0; i < 110; i++) {
        result.current.addHighscore({
          isCorrect: true,
          cardsCount: 20,
          elapsedTime: 10000,
          timeWasMeasured: false,
        })
      }
    })

    expect(result.current.highscores).toHaveLength(100)
    // All remaining entries should be score 300 (the medium scores)
    expect(result.current.highscores.every(h => h.score === 300)).toBe(true)
  })

  it('clears all highscores', () => {
    const { result } = renderHook(() => useHighscores())

    act(() => {
      result.current.addHighscore({
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
      })
    })

    expect(result.current.highscores).toHaveLength(1)

    act(() => {
      result.current.clearHighscores()
    })

    expect(result.current.highscores).toEqual([])

    // Verify localStorage is also cleared
    const stored = window.localStorage.getItem('doppelkopf-highscores')
    expect(stored).toBe('[]')
  })

  it('returns top N entries with getTop', () => {
    const { result } = renderHook(() => useHighscores())

    act(() => {
      result.current.addHighscore({
        isCorrect: true,
        cardsCount: 10,
        elapsedTime: 10000,
        timeWasMeasured: false,
      }) // Score: 200

      result.current.addHighscore({
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
      }) // Score: 350

      result.current.addHighscore({
        isCorrect: true,
        cardsCount: 15,
        elapsedTime: 10000,
        timeWasMeasured: false,
      }) // Score: 250
    })

    const top2 = result.current.getTop(2)
    expect(top2).toHaveLength(2)
    expect(top2[0].score).toBe(350)
    expect(top2[1].score).toBe(250)
  })

  it('handles localStorage errors gracefully on init', () => {
    // Mock localStorage to throw error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage error')
    })

    const { result } = renderHook(() => useHighscores())

    expect(result.current.highscores).toEqual([])
    expect(consoleErrorSpy).toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
    vi.restoreAllMocks()
  })

  it('handles localStorage errors gracefully on save', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage error')
    })

    const { result } = renderHook(() => useHighscores())

    act(() => {
      result.current.addHighscore({
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
      })
    })

    expect(consoleErrorSpy).toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
    vi.restoreAllMocks()
  })

  it('handles invalid JSON in localStorage', () => {
    window.localStorage.setItem('doppelkopf-highscores', 'invalid json')

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() => useHighscores())

    expect(result.current.highscores).toEqual([])
    expect(consoleErrorSpy).toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })
})
