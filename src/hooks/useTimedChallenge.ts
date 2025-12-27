// src/hooks/useTimedChallenge.ts
import { useState, useCallback, useEffect } from 'react'

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

const useCountdownTimer = (
  isActive: boolean,
  timeRemaining: number,
  setTimedChallengeState: (value: TimedChallengeState | ((prev: TimedChallengeState) => TimedChallengeState)) => void,
) => {
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) {
      return
    }

    const interval = setInterval(() => {
      setTimedChallengeState((prev) => {
        const newTimeRemaining = prev.timeRemaining - 1

        if (newTimeRemaining <= 0) {
          return {
            ...prev,
            timeRemaining: 0,
            isTimeUp: true,
            isActive: false,
          }
        }

        return {
          ...prev,
          timeRemaining: newTimeRemaining,
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, timeRemaining, setTimedChallengeState])
}

export const useTimedChallenge = (timeLimitSeconds: number) => {
  const [timedChallengeState, setTimedChallengeState] = useState<TimedChallengeState>(
    () => getDefaultState(timeLimitSeconds),
  )

  // Update state when time limit changes
  useEffect(() => {
    setTimedChallengeState(prev => ({
      ...prev,
      timeLimitSeconds,
      timeRemaining: prev.isActive ? prev.timeRemaining : timeLimitSeconds,
    }))
  }, [timeLimitSeconds])

  useCountdownTimer(
    timedChallengeState.isActive,
    timedChallengeState.timeRemaining,
    setTimedChallengeState,
  )

  const startChallenge = useCallback(() => {
    setTimedChallengeState(prev => ({
      isActive: true,
      timeRemaining: prev.timeLimitSeconds,
      timeLimitSeconds: prev.timeLimitSeconds,
      isTimeUp: false,
    }))
  }, [])

  const endChallenge = useCallback(() => {
    setTimedChallengeState(prev => ({
      ...prev,
      isActive: false,
    }))
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
