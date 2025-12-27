// src/hooks/useSurvivalMode.ts
import { useState, useCallback, useEffect } from 'react'

export interface SurvivalState {
  currentStreak: number
  longestStreak: number
  isActive: boolean
  currentDifficulty: number // Starting card count for current round
}

const DIFFICULTY_INCREMENT = 2 // Add 2 more cards after each correct answer
const STARTING_DIFFICULTY = 15 // Start with 15 cards in survival mode
const MAX_DIFFICULTY = 40 // Cap at 40 cards

const getDefaultState = (): SurvivalState => ({
  currentStreak: 0,
  longestStreak: 0,
  isActive: false,
  currentDifficulty: STARTING_DIFFICULTY,
})

const loadSurvivalState = (): SurvivalState => {
  try {
    const stored = window.localStorage.getItem('survivalState')
    return stored ? JSON.parse(stored) : getDefaultState()
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
      currentStreak: 0,
      longestStreak: prev.longestStreak,
      isActive: true,
      currentDifficulty: STARTING_DIFFICULTY,
    }))
  }, [])

  const endSurvival = useCallback(() => {
    setSurvivalState(prev => ({
      ...prev,
      isActive: false,
    }))
  }, [])

  const recordCorrectAnswer = useCallback(() => {
    setSurvivalState((prev) => {
      const newStreak = prev.currentStreak + 1
      const newDifficulty = Math.min(
        prev.currentDifficulty + DIFFICULTY_INCREMENT,
        MAX_DIFFICULTY,
      )
      return {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, prev.longestStreak),
        isActive: true,
        currentDifficulty: newDifficulty,
      }
    })
  }, [])

  const recordIncorrectAnswer = useCallback(() => {
    setSurvivalState(prev => ({
      ...prev,
      currentStreak: 0,
      isActive: false,
    }))
  }, [])

  const resetLongestStreak = useCallback(() => {
    setSurvivalState(prev => ({
      ...prev,
      longestStreak: 0,
    }))
  }, [])

  return {
    survivalState,
    startSurvival,
    endSurvival,
    recordCorrectAnswer,
    recordIncorrectAnswer,
    resetLongestStreak,
  }
}
