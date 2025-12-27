// src/lib/statistics.ts

import { HighscoreEntry } from './highscore'

export interface Statistics {
  totalGames: number
  correctAnswers: number
  incorrectAnswers: number
  winRate: number // percentage
  averageTimePerCard: number // in seconds
  bestStreak: number
  currentStreak: number
  totalCardsPlayed: number
  averageScore: number
  bestScore: number
  performanceByDifficulty: Record<string, DifficultyStats>
  totalHintsUsed: number
  averageHintsPerGame: number
  gamesWithHints: number
  gamesWithoutHints: number
}

export interface DifficultyStats {
  gamesPlayed: number
  correctAnswers: number
  averageTime: number
}

interface StreakResult {
  currentStreak: number
  bestStreak: number
}

/**
 * Calculate streaks from sorted entries
 */
const calculateStreaks = (sortedEntries: HighscoreEntry[]): StreakResult => {
  let currentStreak = 0
  let bestStreak = 0
  let tempStreak = 0
  let foundIncorrect = false

  for (let i = sortedEntries.length - 1; i >= 0; i--) {
    if (sortedEntries[i].isCorrect) {
      tempStreak++
      if (!foundIncorrect) {
        currentStreak = tempStreak
      }
      bestStreak = Math.max(bestStreak, tempStreak)
    }
    else {
      foundIncorrect = true
      tempStreak = 0
    }
  }

  return { currentStreak, bestStreak }
}

/**
 * Calculate performance by difficulty ranges
 */
const calculateDifficultyStats = (
  sortedEntries: HighscoreEntry[],
): Record<string, DifficultyStats> => {
  const performanceByDifficulty: Record<string, DifficultyStats> = {}
  const difficultyRanges = [
    { label: '1-10 cards', min: 1, max: 10 },
    { label: '11-20 cards', min: 11, max: 20 },
    { label: '21-30 cards', min: 21, max: 30 },
    { label: '31+ cards', min: 31, max: Infinity },
  ]

  for (const range of difficultyRanges) {
    const rangeEntries = sortedEntries.filter(
      e => e.cardsCount >= range.min && e.cardsCount <= range.max,
    )

    if (rangeEntries.length > 0) {
      const timedRangeGames = rangeEntries.filter(e => e.timeWasMeasured && e.elapsedTime > 0)
      performanceByDifficulty[range.label] = {
        gamesPlayed: rangeEntries.length,
        correctAnswers: rangeEntries.filter(e => e.isCorrect).length,
        averageTime: timedRangeGames.length > 0
          ? timedRangeGames.reduce((sum, e) => sum + (e.elapsedTime / 1000 / e.cardsCount), 0) / timedRangeGames.length
          : 0,
      }
    }
  }

  return performanceByDifficulty
}

const EMPTY_STATISTICS: Statistics = {
  totalGames: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  winRate: 0,
  averageTimePerCard: 0,
  bestStreak: 0,
  currentStreak: 0,
  totalCardsPlayed: 0,
  averageScore: 0,
  bestScore: 0,
  performanceByDifficulty: {},
  totalHintsUsed: 0,
  averageHintsPerGame: 0,
  gamesWithHints: 0,
  gamesWithoutHints: 0,
}

/**
 * Calculate comprehensive statistics from highscore entries
 */
export const calculateStatistics = (entries: HighscoreEntry[]): Statistics => {
  if (entries.length === 0) return EMPTY_STATISTICS

  const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp)

  const totalGames = sortedEntries.length
  const correctAnswers = sortedEntries.filter(e => e.isCorrect).length
  const incorrectAnswers = totalGames - correctAnswers
  const winRate = (correctAnswers / totalGames) * 100

  const timedGames = sortedEntries.filter(e => e.timeWasMeasured && e.elapsedTime > 0)
  const averageTimePerCard = timedGames.length > 0
    ? timedGames.reduce((sum, e) => sum + (e.elapsedTime / 1000 / e.cardsCount), 0) / timedGames.length
    : 0

  const { currentStreak, bestStreak } = calculateStreaks(sortedEntries)
  const totalCardsPlayed = sortedEntries.reduce((sum, e) => sum + e.cardsCount, 0)
  const averageScore = sortedEntries.reduce((sum, e) => sum + e.score, 0) / totalGames
  const bestScore = Math.max(...sortedEntries.map(e => e.score))
  const performanceByDifficulty = calculateDifficultyStats(sortedEntries)

  const totalHintsUsed = sortedEntries.reduce((sum, e) => sum + (e.hintsUsed || 0), 0)
  const gamesWithHints = sortedEntries.filter(e => (e.hintsUsed || 0) > 0).length

  return {
    totalGames,
    correctAnswers,
    incorrectAnswers,
    winRate,
    averageTimePerCard,
    bestStreak,
    currentStreak,
    totalCardsPlayed,
    averageScore,
    bestScore,
    performanceByDifficulty,
    totalHintsUsed,
    averageHintsPerGame: totalHintsUsed / totalGames,
    gamesWithHints,
    gamesWithoutHints: totalGames - gamesWithHints,
  }
}

/**
 * Get recent performance trend (last N games)
 */
export const getRecentTrend = (entries: HighscoreEntry[], count: number): number => {
  if (entries.length === 0) return 0

  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp)
  const recentGames = sortedEntries.slice(0, count)
  const correctInRecent = recentGames.filter(e => e.isCorrect).length

  return (correctInRecent / recentGames.length) * 100
}
