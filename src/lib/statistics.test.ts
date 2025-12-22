// src/lib/statistics.test.ts

import { describe, it, expect } from 'vitest'
import { calculateStatistics, getRecentTrend } from './statistics'
import { HighscoreEntry } from './highscore'

describe('calculateStatistics', () => {
  it('should return empty statistics for empty entries', () => {
    const stats = calculateStatistics([])

    expect(stats.totalGames).toBe(0)
    expect(stats.correctAnswers).toBe(0)
    expect(stats.incorrectAnswers).toBe(0)
    expect(stats.winRate).toBe(0)
    expect(stats.bestStreak).toBe(0)
    expect(stats.currentStreak).toBe(0)
  })

  it('should calculate basic statistics correctly', () => {
    const entries: HighscoreEntry[] = [
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 3000,
      },
      {
        score: 0,
        isCorrect: false,
        cardsCount: 20,
        elapsedTime: 30000,
        timeWasMeasured: true,
        timestamp: Date.now() - 2000,
      },
      {
        score: 325,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 25000,
        timeWasMeasured: true,
        timestamp: Date.now() - 1000,
      },
    ]

    const stats = calculateStatistics(entries)

    expect(stats.totalGames).toBe(3)
    expect(stats.correctAnswers).toBe(2)
    expect(stats.incorrectAnswers).toBe(1)
    expect(stats.winRate).toBeCloseTo(66.67, 1)
    expect(stats.totalCardsPlayed).toBe(60)
  })

  it('should calculate win rate correctly', () => {
    const entries: HighscoreEntry[] = [
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 4000,
      },
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 3000,
      },
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 2000,
      },
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 1000,
      },
    ]

    const stats = calculateStatistics(entries)

    expect(stats.winRate).toBe(100)
  })

  it('should calculate average time per card correctly', () => {
    const entries: HighscoreEntry[] = [
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 20000, // 1s per card
        timeWasMeasured: true,
        timestamp: Date.now() - 2000,
      },
      {
        score: 300,
        isCorrect: true,
        cardsCount: 10,
        elapsedTime: 20000, // 2s per card
        timeWasMeasured: true,
        timestamp: Date.now() - 1000,
      },
    ]

    const stats = calculateStatistics(entries)

    expect(stats.averageTimePerCard).toBeCloseTo(1.5, 1)
  })

  it('should calculate current streak correctly', () => {
    const entries: HighscoreEntry[] = [
      {
        score: 0,
        isCorrect: false,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 5000,
      },
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 4000,
      },
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 3000,
      },
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 2000,
      },
    ]

    const stats = calculateStatistics(entries)

    expect(stats.currentStreak).toBe(3)
    expect(stats.bestStreak).toBe(3)
  })

  it('should reset current streak after incorrect answer', () => {
    const entries: HighscoreEntry[] = [
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 4000,
      },
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 3000,
      },
      {
        score: 0,
        isCorrect: false,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 2000,
      },
    ]

    const stats = calculateStatistics(entries)

    expect(stats.currentStreak).toBe(0)
    expect(stats.bestStreak).toBe(2)
  })

  it('should calculate best score correctly', () => {
    const entries: HighscoreEntry[] = [
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 3000,
      },
      {
        score: 350,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 10000,
        timeWasMeasured: true,
        timestamp: Date.now() - 2000,
      },
      {
        score: 325,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 25000,
        timeWasMeasured: true,
        timestamp: Date.now() - 1000,
      },
    ]

    const stats = calculateStatistics(entries)

    expect(stats.bestScore).toBe(350)
    expect(stats.averageScore).toBeCloseTo(325, 0)
  })

  it('should group performance by difficulty ranges', () => {
    const entries: HighscoreEntry[] = [
      {
        score: 300,
        isCorrect: true,
        cardsCount: 5,
        elapsedTime: 5000,
        timeWasMeasured: true,
        timestamp: Date.now() - 4000,
      },
      {
        score: 0,
        isCorrect: false,
        cardsCount: 8,
        elapsedTime: 10000,
        timeWasMeasured: true,
        timestamp: Date.now() - 3000,
      },
      {
        score: 300,
        isCorrect: true,
        cardsCount: 15,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 2000,
      },
      {
        score: 300,
        isCorrect: true,
        cardsCount: 25,
        elapsedTime: 25000,
        timeWasMeasured: true,
        timestamp: Date.now() - 1000,
      },
    ]

    const stats = calculateStatistics(entries)

    expect(stats.performanceByDifficulty['1-10 cards']).toEqual({
      gamesPlayed: 2,
      correctAnswers: 1,
      averageTime: expect.any(Number),
    })
    expect(stats.performanceByDifficulty['11-20 cards']).toEqual({
      gamesPlayed: 1,
      correctAnswers: 1,
      averageTime: expect.any(Number),
    })
    expect(stats.performanceByDifficulty['21-30 cards']).toEqual({
      gamesPlayed: 1,
      correctAnswers: 1,
      averageTime: expect.any(Number),
    })
  })

  it('should handle games without time measurement', () => {
    const entries: HighscoreEntry[] = [
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 0,
        timeWasMeasured: false,
        timestamp: Date.now() - 2000,
      },
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 0,
        timeWasMeasured: false,
        timestamp: Date.now() - 1000,
      },
    ]

    const stats = calculateStatistics(entries)

    expect(stats.averageTimePerCard).toBe(0)
  })
})

describe('getRecentTrend', () => {
  it('should return 0 for empty entries', () => {
    const trend = getRecentTrend([], 5)
    expect(trend).toBe(0)
  })

  it('should calculate recent win rate correctly', () => {
    const entries: HighscoreEntry[] = [
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 5000,
      },
      {
        score: 0,
        isCorrect: false,
        cardsCount: 20,
        elapsedTime: 30000,
        timeWasMeasured: true,
        timestamp: Date.now() - 4000,
      },
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 3000,
      },
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 2000,
      },
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 1000,
      },
    ]

    const trend = getRecentTrend(entries, 3)

    expect(trend).toBe(100) // Last 3 games all correct
  })

  it('should only consider the most recent N games', () => {
    const entries: HighscoreEntry[] = [
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 5000,
      },
      {
        score: 300,
        isCorrect: true,
        cardsCount: 20,
        elapsedTime: 15000,
        timeWasMeasured: true,
        timestamp: Date.now() - 4000,
      },
      {
        score: 0,
        isCorrect: false,
        cardsCount: 20,
        elapsedTime: 30000,
        timeWasMeasured: true,
        timestamp: Date.now() - 3000,
      },
      {
        score: 0,
        isCorrect: false,
        cardsCount: 20,
        elapsedTime: 30000,
        timeWasMeasured: true,
        timestamp: Date.now() - 2000,
      },
      {
        score: 0,
        isCorrect: false,
        cardsCount: 20,
        elapsedTime: 30000,
        timeWasMeasured: true,
        timestamp: Date.now() - 1000,
      },
    ]

    const trend = getRecentTrend(entries, 3)

    expect(trend).toBe(0) // Last 3 games all incorrect
  })
})
