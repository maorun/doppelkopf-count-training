// src/hooks/useTimedChallenge.test.ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useTimedChallenge } from './useTimedChallenge'

describe('useTimedChallenge', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useTimedChallenge(60))

    expect(result.current.timedChallengeState.isActive).toBe(false)
    expect(result.current.timedChallengeState.timeRemaining).toBe(60)
    expect(result.current.timedChallengeState.timeLimitSeconds).toBe(60)
    expect(result.current.timedChallengeState.isTimeUp).toBe(false)
  })

  it('should start challenge with correct initial time', () => {
    const { result } = renderHook(() => useTimedChallenge(90))

    act(() => {
      result.current.startChallenge()
    })

    expect(result.current.timedChallengeState.isActive).toBe(true)
    expect(result.current.timedChallengeState.timeRemaining).toBe(90)
    expect(result.current.timedChallengeState.isTimeUp).toBe(false)
  })

  it('should countdown when challenge is active', async () => {
    const { result } = renderHook(() => useTimedChallenge(60))

    act(() => {
      result.current.startChallenge()
    })

    // Fast-forward 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.timedChallengeState.timeRemaining).toBe(55)
  })

  it('should mark time as up when countdown reaches zero', async () => {
    const { result } = renderHook(() => useTimedChallenge(3))

    act(() => {
      result.current.startChallenge()
    })

    // Fast-forward 3 seconds to reach time up
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.timedChallengeState.timeRemaining).toBe(0)
    expect(result.current.timedChallengeState.isTimeUp).toBe(true)
    expect(result.current.timedChallengeState.isActive).toBe(false)
  })

  it('should end challenge when endChallenge is called', () => {
    const { result } = renderHook(() => useTimedChallenge(60))

    act(() => {
      result.current.startChallenge()
    })

    expect(result.current.timedChallengeState.isActive).toBe(true)

    act(() => {
      result.current.endChallenge()
    })

    expect(result.current.timedChallengeState.isActive).toBe(false)
  })

  it('should reset challenge to initial state', async () => {
    const { result } = renderHook(() => useTimedChallenge(60))

    act(() => {
      result.current.startChallenge()
    })

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(10000)
    })

    expect(result.current.timedChallengeState.timeRemaining).toBe(50)

    act(() => {
      result.current.resetChallenge()
    })

    expect(result.current.timedChallengeState.isActive).toBe(false)
    expect(result.current.timedChallengeState.timeRemaining).toBe(60)
    expect(result.current.timedChallengeState.isTimeUp).toBe(false)
  })

  it('should not countdown when challenge is not active', async () => {
    const { result } = renderHook(() => useTimedChallenge(60))

    const initialTimeRemaining = result.current.timedChallengeState.timeRemaining

    // Fast-forward time without starting challenge
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.timedChallengeState.timeRemaining).toBe(initialTimeRemaining)
  })

  it('should update time limit when prop changes', () => {
    const { result, rerender } = renderHook(
      ({ timeLimitSeconds }) => useTimedChallenge(timeLimitSeconds),
      { initialProps: { timeLimitSeconds: 60 } },
    )

    expect(result.current.timedChallengeState.timeLimitSeconds).toBe(60)
    expect(result.current.timedChallengeState.timeRemaining).toBe(60)

    rerender({ timeLimitSeconds: 90 })

    expect(result.current.timedChallengeState.timeLimitSeconds).toBe(90)
    expect(result.current.timedChallengeState.timeRemaining).toBe(90)
  })

  it('should preserve time remaining when active and time limit changes', async () => {
    const { result, rerender } = renderHook(
      ({ timeLimitSeconds }) => useTimedChallenge(timeLimitSeconds),
      { initialProps: { timeLimitSeconds: 60 } },
    )

    act(() => {
      result.current.startChallenge()
    })

    // Fast-forward 10 seconds
    act(() => {
      vi.advanceTimersByTime(10000)
    })

    expect(result.current.timedChallengeState.timeRemaining).toBe(50)

    // Change time limit while active
    rerender({ timeLimitSeconds: 90 })

    // Time remaining should not reset when active
    expect(result.current.timedChallengeState.timeRemaining).toBe(50)
    expect(result.current.timedChallengeState.timeLimitSeconds).toBe(90)
  })

  it('should handle multiple start/stop cycles correctly', async () => {
    const { result } = renderHook(() => useTimedChallenge(30))

    // First cycle
    act(() => {
      result.current.startChallenge()
    })

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.timedChallengeState.timeRemaining).toBe(25)

    act(() => {
      result.current.endChallenge()
    })

    // Second cycle - reset first
    act(() => {
      result.current.resetChallenge()
    })

    expect(result.current.timedChallengeState.timeRemaining).toBe(30)

    act(() => {
      result.current.startChallenge()
    })

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.timedChallengeState.timeRemaining).toBe(27)
  })

  it('should stop countdown after time is up', async () => {
    const { result } = renderHook(() => useTimedChallenge(2))

    act(() => {
      result.current.startChallenge()
    })

    // Wait for time to run out
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current.timedChallengeState.isTimeUp).toBe(true)

    const timeRemaining = result.current.timedChallengeState.timeRemaining

    // Advance more time - should not go negative
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.timedChallengeState.timeRemaining).toBe(timeRemaining)
  })
})
