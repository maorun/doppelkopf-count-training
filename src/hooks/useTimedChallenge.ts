// src/hooks/useTimedChallenge.ts
import { useCallback, useEffect, useRef, useState } from 'react'

export interface TimedChallengeState {
  isActive: boolean
  timeRemaining: number // in seconds
  timeLimitSeconds: number
  isTimeUp: boolean
}

const getDefaultState = (timeLimitSeconds: number): TimedChallengeState => ({
  isActive: false,
  timeRemaining: timeLimitSeconds,
  timeLimitSeconds,
  isTimeUp: false,
})

const advanceCountdown = (state: TimedChallengeState): TimedChallengeState => {
  const timeRemaining = state.timeRemaining - 1
  if (timeRemaining <= 0) {
    return { ...state, timeRemaining: 0, isTimeUp: true, isActive: false }
  }
  return { ...state, timeRemaining }
}

export const useTimedChallenge = (timeLimitSeconds: number) => {
  const [timedChallengeState, setTimedChallengeState] = useState<TimedChallengeState>(
    () => getDefaultState(timeLimitSeconds),
  )

  // Keep the latest updater reference so the interval callback never closes over a stale one.
  const setTimedChallengeStateRef = useRef(setTimedChallengeState)
  setTimedChallengeStateRef.current = setTimedChallengeState

  // Sync the stored time limit when the prop changes (e.g. settings re-render).
  useEffect(() => {
    setTimedChallengeState(prev => ({
      ...prev,
      timeLimitSeconds,
      timeRemaining: prev.isActive ? prev.timeRemaining : timeLimitSeconds,
    }))
  }, [timeLimitSeconds])

  // Single interval that runs only while the challenge is active; it reads/writes
  // timeRemaining through refs/state updater, so it does not depend on the value itself.
  useEffect(() => {
    if (!timedChallengeState.isActive) return

    const interval = setInterval(() => {
      setTimedChallengeStateRef.current(advanceCountdown)
    }, 1000)

    return () => clearInterval(interval)
  }, [timedChallengeState.isActive])

  const startChallenge = useCallback(() => {
    setTimedChallengeState(prev => ({
      isActive: true,
      timeRemaining: prev.timeLimitSeconds,
      timeLimitSeconds: prev.timeLimitSeconds,
      isTimeUp: false,
    }))
  }, [])

  const endChallenge = useCallback(() => {
    setTimedChallengeState(prev => ({ ...prev, isActive: false }))
  }, [])

  const resetChallenge = useCallback(() => {
    setTimedChallengeState(prev => ({
      isActive: false,
      timeRemaining: prev.timeLimitSeconds,
      timeLimitSeconds: prev.timeLimitSeconds,
      isTimeUp: false,
    }))
  }, [])

  return {
    timedChallengeState,
    startChallenge,
    endChallenge,
    resetChallenge,
  }
}
