// src/hooks/useStatistics.ts

import { useMemo } from 'react'
import { HighscoreEntry } from '../lib/highscore'
import { calculateStatistics, getRecentTrend, Statistics } from '../lib/statistics'

/**
 * Hook for calculating statistics from highscore entries
 */
export const useStatistics = (highscores: HighscoreEntry[]): {
  statistics: Statistics
  recentTrend: number
} => {
  const statistics = useMemo(
    () => calculateStatistics(highscores),
    [highscores],
  )

  const recentTrend = useMemo(
    () => getRecentTrend(highscores, 10),
    [highscores],
  )

  return {
    statistics,
    recentTrend,
  }
}
