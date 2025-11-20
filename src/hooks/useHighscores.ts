// src/hooks/useHighscores.ts
import { useState, useEffect, useCallback } from 'react'
import { HighscoreEntry, GameResult, createHighscoreEntry, getTopHighscores } from '../lib/highscore'

const STORAGE_KEY = 'doppelkopf-highscores'
const MAX_ENTRIES = 100 // Keep top 100 highscores

/**
 * Hook for managing highscore entries in local storage
 */
export const useHighscores = () => {
  const [highscores, setHighscores] = useState<HighscoreEntry[]>(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    }
    catch (error) {
      console.error('Error reading highscores from localStorage', error)
      return []
    }
  })

  // Persist to localStorage whenever highscores change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(highscores))
    }
    catch (error) {
      console.error('Error writing highscores to localStorage', error)
    }
  }, [highscores])

  /**
   * Add a new highscore entry from a game result
   */
  const addHighscore = useCallback((result: GameResult) => {
    const entry = createHighscoreEntry(result)
    setHighscores((prev) => {
      const updated = [...prev, entry]
      // Keep only top MAX_ENTRIES scores
      return getTopHighscores(updated, MAX_ENTRIES)
    })
  }, [])

  /**
   * Clear all highscores
   */
  const clearHighscores = useCallback(() => {
    setHighscores([])
  }, [])

  /**
   * Get top N highscore entries
   */
  const getTop = useCallback((count: number) => {
    return getTopHighscores(highscores, count)
  }, [highscores])

  return {
    highscores,
    addHighscore,
    clearHighscores,
    getTop,
  }
}
