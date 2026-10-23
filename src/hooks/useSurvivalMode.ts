// src/hooks/useSurvivalMode.ts
import { useState, useCallback, useEffect } from 'react'

export interface SurvivalState {
  currentStreak: number
  longestStreak: number
  isActive: boolean
  currentDifficulty: number // Starting card count for current round
  totalCorrectAnswers: number
  totalIncorrectAnswers: number
  gamesPlayed: number
}

const DIFFICULTY_INCREMENT = 2 // Add 2 more cards after each correct answer
const STARTING_DIFFICULTY = 15 // Start with 15 cards in survival mode
const MAX_DIFFICULTY = 40 // Cap at 40 cards

const getDefaultState = (): SurvivalState => ({
  currentStreak: 0,
  longestStreak: 0,
  isActive: false,
  currentDifficulty: STARTING_DIFFICULTY,
  totalCorrectAnswers: 0,
  totalIncorrectAnswers: 0,
  gamesPlayed: 0,
})

const validateStreak = (val: unknown): number =>
  typeof val === 'number' && Number.isFinite(val) && val >= 0 ? Math.floor(val) : 0

const validateDifficulty = (val: unknown): number =>
  typeof val === 'number' && Number.isFinite(val)
    ? Math.min(Math.max(Math.floor(val), STARTING_DIFFICULTY), MAX_DIFFICULTY)
    : STARTING_DIFFICULTY

const validateSurvivalState = (parsed: unknown): SurvivalState => {
  if (!parsed || typeof parsed !== 'object') {
    return getDefaultState()
  }

  const p = parsed as Record<string, unknown>
  const currentStreak = validateStreak(p.currentStreak)
  const longestStreak = Math.max(validateStreak(p.longestStreak), currentStreak)
  const isActive = typeof p.isActive === 'boolean' ? p.isActive : false
  const currentDifficulty = validateDifficulty(p.currentDifficulty)
  const totalCorrectAnswers = validateStreak(p.totalCorrectAnswers)
  const totalIncorrectAnswers = validateStreak(p.totalIncorrectAnswers)
  const gamesPlayed = validateStreak(p.gamesPlayed)

  return {
    currentStreak,
    longestStreak,
    isActive,
    currentDifficulty,
    totalCorrectAnswers,
    totalIncorrectAnswers,
    gamesPlayed,
  }
}

const loadSurvivalState = (): SurvivalState => {
  try {
    const stored = window.localStorage.getItem('survivalState')
    return stored ? validateSurvivalState(JSON.parse(stored)) : getDefaultState()
  }
  catch (error) {
    console.error('Error reading survival state from localStorage', error)
    return getDefaultState()
  }
}

const saveSurvivalState = (state: SurvivalState) => {
  try {
    window.localStorage.setItem('survivalState', JSON.stringify(state))
  }
  catch (error) {
    console.error('Error writing survival state to localStorage', error)
  }
}

/* eslint-disable max-lines-per-function */
export const useSurvivalMode = () => {
  const [survivalState, setSurvivalState] = useState<SurvivalState>(loadSurvivalState)

  // Persist to localStorage
  useEffect(() => {
    saveSurvivalState(survivalState)
  }, [survivalState])

  const startSurvival = useCallback(() => {
    setSurvivalState(prev => ({
      ...validateSurvivalState(prev),
      currentStreak: 0,
      isActive: true,
      currentDifficulty: STARTING_DIFFICULTY,
      gamesPlayed: validateSurvivalState(prev).gamesPlayed + 1,
    }))
  }, [])

  const endSurvival = useCallback(() => {
    setSurvivalState(prev => ({
      ...validateSurvivalState(prev),
      isActive: false,
    }))
  }, [])

  const recordCorrectAnswer = useCallback(() => {
    setSurvivalState((prev) => {
      const validatedPrev = validateSurvivalState(prev)
      const newStreak = validatedPrev.currentStreak + 1
      const newDifficulty = Math.min(
        validatedPrev.currentDifficulty + DIFFICULTY_INCREMENT,
        MAX_DIFFICULTY,
      )
      return {
        ...validatedPrev,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, validatedPrev.longestStreak),
        isActive: true,
        currentDifficulty: newDifficulty,
        totalCorrectAnswers: validatedPrev.totalCorrectAnswers + 1,
      }
    })
  }, [])

  const recordIncorrectAnswer = useCallback(() => {
    setSurvivalState((prev) => {
      const validatedPrev = validateSurvivalState(prev)
      return {
        ...validatedPrev,
        currentStreak: 0,
        isActive: false,
        totalIncorrectAnswers: validatedPrev.totalIncorrectAnswers + 1,
      }
    })
  }, [])

  const resetLongestStreak = useCallback(() => {
    setSurvivalState(prev => ({
      ...validateSurvivalState(prev),
      longestStreak: 0,
    }))
  }, [])

  const resetAllStats = useCallback(() => {
    setSurvivalState(getDefaultState())
  }, [])

  return {
    survivalState,
    startSurvival,
    endSurvival,
    recordCorrectAnswer,
    recordIncorrectAnswer,
    resetLongestStreak,
    resetAllStats,
  }
}
