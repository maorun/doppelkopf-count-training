// src/hooks/useSurvivalMode.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSurvivalMode } from './useSurvivalMode'

describe('useSurvivalMode', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSurvivalMode())

    expect(result.current.survivalState).toEqual({
      currentStreak: 0,
      longestStreak: 0,
      isActive: false,
      currentDifficulty: 15,
    })
  })

  it('should start survival mode', () => {
    const { result } = renderHook(() => useSurvivalMode())

    act(() => {
      result.current.startSurvival()
    })

    expect(result.current.survivalState.isActive).toBe(true)
    expect(result.current.survivalState.currentStreak).toBe(0)
    expect(result.current.survivalState.currentDifficulty).toBe(15)
  })

  it('should end survival mode', () => {
    const { result } = renderHook(() => useSurvivalMode())

    act(() => {
      result.current.startSurvival()
    })

    expect(result.current.survivalState.isActive).toBe(true)

    act(() => {
      result.current.endSurvival()
    })

    expect(result.current.survivalState.isActive).toBe(false)
  })

  it('should record correct answer and increase streak', () => {
    const { result } = renderHook(() => useSurvivalMode())

    act(() => {
      result.current.startSurvival()
    })

    act(() => {
      result.current.recordCorrectAnswer()
    })

    expect(result.current.survivalState.currentStreak).toBe(1)
    expect(result.current.survivalState.longestStreak).toBe(1)
  })

  it('should increase difficulty with each correct answer', () => {
    const { result } = renderHook(() => useSurvivalMode())

    act(() => {
      result.current.startSurvival()
    })

    expect(result.current.survivalState.currentDifficulty).toBe(15)

    act(() => {
      result.current.recordCorrectAnswer()
    })

    expect(result.current.survivalState.currentDifficulty).toBe(17)

    act(() => {
      result.current.recordCorrectAnswer()
    })

    expect(result.current.survivalState.currentDifficulty).toBe(19)
  })

  it('should cap difficulty at maximum', () => {
    const { result } = renderHook(() => useSurvivalMode())

    act(() => {
      result.current.startSurvival()
    })

    // Simulate many correct answers to reach max difficulty
    for (let i = 0; i < 20; i++) {
      act(() => {
        result.current.recordCorrectAnswer()
      })
    }

    expect(result.current.survivalState.currentDifficulty).toBe(40) // Max cap
  })

  it('should update longest streak correctly', () => {
    const { result } = renderHook(() => useSurvivalMode())

    act(() => {
      result.current.startSurvival()
    })

    // First streak of 3
    act(() => {
      result.current.recordCorrectAnswer()
      result.current.recordCorrectAnswer()
      result.current.recordCorrectAnswer()
    })

    expect(result.current.survivalState.currentStreak).toBe(3)
    expect(result.current.survivalState.longestStreak).toBe(3)

    // Fail and reset current streak
    act(() => {
      result.current.recordIncorrectAnswer()
    })

    expect(result.current.survivalState.currentStreak).toBe(0)
    expect(result.current.survivalState.longestStreak).toBe(3)

    // Start again with streak of 5
    act(() => {
      result.current.startSurvival()
    })

    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.recordCorrectAnswer()
      })
    }

    expect(result.current.survivalState.currentStreak).toBe(5)
    expect(result.current.survivalState.longestStreak).toBe(5)
  })

  it('should record incorrect answer and reset current streak', () => {
    const { result } = renderHook(() => useSurvivalMode())

    act(() => {
      result.current.startSurvival()
    })

    act(() => {
      result.current.recordCorrectAnswer()
      result.current.recordCorrectAnswer()
    })

    expect(result.current.survivalState.currentStreak).toBe(2)

    act(() => {
      result.current.recordIncorrectAnswer()
    })

    expect(result.current.survivalState.currentStreak).toBe(0)
    expect(result.current.survivalState.isActive).toBe(false)
  })

  it('should reset longest streak', () => {
    const { result } = renderHook(() => useSurvivalMode())

    act(() => {
      result.current.startSurvival()
    })

    act(() => {
      result.current.recordCorrectAnswer()
      result.current.recordCorrectAnswer()
    })

    expect(result.current.survivalState.longestStreak).toBe(2)

    act(() => {
      result.current.resetLongestStreak()
    })

    expect(result.current.survivalState.longestStreak).toBe(0)
  })

  it('should persist state to localStorage', () => {
    const { result } = renderHook(() => useSurvivalMode())

    act(() => {
      result.current.startSurvival()
      result.current.recordCorrectAnswer()
    })

    const stored = localStorage.getItem('survivalState')
    expect(stored).not.toBeNull()

    const parsed = JSON.parse(stored!)
    expect(parsed.currentStreak).toBe(1)
    expect(parsed.isActive).toBe(true)
  })

  it('should load state from localStorage', () => {
    const initialState = {
      currentStreak: 5,
      longestStreak: 10,
      isActive: true,
      currentDifficulty: 25,
    }

    localStorage.setItem('survivalState', JSON.stringify(initialState))

    const { result } = renderHook(() => useSurvivalMode())

    expect(result.current.survivalState).toEqual(initialState)
  })

  it('should handle localStorage errors gracefully', () => {
    localStorage.setItem('survivalState', 'invalid json')

    const { result } = renderHook(() => useSurvivalMode())

    expect(result.current.survivalState).toEqual({
      currentStreak: 0,
      longestStreak: 0,
      isActive: false,
      currentDifficulty: 15,
    })
  })

  it('should preserve longest streak when starting new survival session', () => {
    const { result } = renderHook(() => useSurvivalMode())

    // First session
    act(() => {
      result.current.startSurvival()
      result.current.recordCorrectAnswer()
      result.current.recordCorrectAnswer()
      result.current.recordCorrectAnswer()
    })

    expect(result.current.survivalState.longestStreak).toBe(3)

    // End session
    act(() => {
      result.current.recordIncorrectAnswer()
    })

    // Start new session
    act(() => {
      result.current.startSurvival()
    })

    expect(result.current.survivalState.longestStreak).toBe(3)
    expect(result.current.survivalState.currentStreak).toBe(0)
  })
})
