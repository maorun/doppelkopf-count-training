// src/lib/highscore.test.ts
import { describe, it, expect } from 'vitest'
import {
  calculateScore,
  createHighscoreEntry,
  sortHighscores,
  getTopHighscores,
  type GameResult,
  type HighscoreEntry,
} from './highscore'

describe('calculateScore', () => {
  it('returns 0 for incorrect answer', () => {
    const result: GameResult = {
      isCorrect: false,
      cardsCount: 20,
      elapsedTime: 5000,
      timeWasMeasured: true,
    }
    expect(calculateScore(result)).toBe(0)
  })

  it('calculates base score for correct answer without time measurement', () => {
    const result: GameResult = {
      isCorrect: true,
      cardsCount: 20,
      elapsedTime: 5000,
      timeWasMeasured: false,
    }
    // Base: 100 + Difficulty: 20 * 10 = 300
    expect(calculateScore(result)).toBe(300)
  })

  it('adds fast time bonus for < 1s per card', () => {
    const result: GameResult = {
      isCorrect: true,
      cardsCount: 20,
      elapsedTime: 15000, // 0.75s per card
      timeWasMeasured: true,
    }
    // Base: 100 + Difficulty: 200 + Time: 50 = 350
    expect(calculateScore(result)).toBe(350)
  })

  it('adds normal time bonus for 1-2s per card', () => {
    const result: GameResult = {
      isCorrect: true,
      cardsCount: 20,
      elapsedTime: 30000, // 1.5s per card
      timeWasMeasured: true,
    }
    // Base: 100 + Difficulty: 200 + Time: 25 = 325
    expect(calculateScore(result)).toBe(325)
  })

  it('adds no time bonus for > 2s per card', () => {
    const result: GameResult = {
      isCorrect: true,
      cardsCount: 20,
      elapsedTime: 50000, // 2.5s per card
      timeWasMeasured: true,
    }
    // Base: 100 + Difficulty: 200 + Time: 0 = 300
    expect(calculateScore(result)).toBe(300)
  })

  it('scales difficulty bonus with card count', () => {
    const result10: GameResult = {
      isCorrect: true,
      cardsCount: 10,
      elapsedTime: 5000,
      timeWasMeasured: false,
    }
    const result30: GameResult = {
      isCorrect: true,
      cardsCount: 30,
      elapsedTime: 5000,
      timeWasMeasured: false,
    }
    expect(calculateScore(result10)).toBe(200) // 100 + 100
    expect(calculateScore(result30)).toBe(400) // 100 + 300
  })

  it('handles edge case with 0 elapsed time when time was measured', () => {
    const result: GameResult = {
      isCorrect: true,
      cardsCount: 20,
      elapsedTime: 0,
      timeWasMeasured: true,
    }
    // Should not crash, no time bonus
    expect(calculateScore(result)).toBe(300)
  })
})

describe('createHighscoreEntry', () => {
  it('creates entry with calculated score and result data', () => {
    const result: GameResult = {
      isCorrect: true,
      cardsCount: 20,
      elapsedTime: 15000,
      timeWasMeasured: true,
    }
    const entry = createHighscoreEntry(result)

    expect(entry.score).toBe(350)
    expect(entry.isCorrect).toBe(true)
    expect(entry.cardsCount).toBe(20)
    expect(entry.elapsedTime).toBe(15000)
    expect(entry.timeWasMeasured).toBe(true)
    expect(entry.timestamp).toBeGreaterThan(0)
  })

  it('creates entry with 0 score for incorrect result', () => {
    const result: GameResult = {
      isCorrect: false,
      cardsCount: 20,
      elapsedTime: 15000,
      timeWasMeasured: true,
    }
    const entry = createHighscoreEntry(result)

    expect(entry.score).toBe(0)
    expect(entry.isCorrect).toBe(false)
  })
})

describe('sortHighscores', () => {
  it('sorts entries by score in descending order', () => {
    const entries: HighscoreEntry[] = [
      { score: 200, isCorrect: true, cardsCount: 10, elapsedTime: 5000, timeWasMeasured: true, timestamp: 1 },
      { score: 350, isCorrect: true, cardsCount: 20, elapsedTime: 10000, timeWasMeasured: true, timestamp: 2 },
      { score: 150, isCorrect: true, cardsCount: 5, elapsedTime: 3000, timeWasMeasured: true, timestamp: 3 },
    ]

    const sorted = sortHighscores(entries)

    expect(sorted[0].score).toBe(350)
    expect(sorted[1].score).toBe(200)
    expect(sorted[2].score).toBe(150)
  })

  it('does not modify original array', () => {
    const entries: HighscoreEntry[] = [
      { score: 200, isCorrect: true, cardsCount: 10, elapsedTime: 5000, timeWasMeasured: true, timestamp: 1 },
      { score: 350, isCorrect: true, cardsCount: 20, elapsedTime: 10000, timeWasMeasured: true, timestamp: 2 },
    ]

    const originalFirst = entries[0].score
    sortHighscores(entries)

    expect(entries[0].score).toBe(originalFirst)
  })

  it('handles empty array', () => {
    const sorted = sortHighscores([])
    expect(sorted).toEqual([])
  })

  it('handles single entry', () => {
    const entries: HighscoreEntry[] = [
      { score: 200, isCorrect: true, cardsCount: 10, elapsedTime: 5000, timeWasMeasured: true, timestamp: 1 },
    ]
    const sorted = sortHighscores(entries)
    expect(sorted).toHaveLength(1)
    expect(sorted[0].score).toBe(200)
  })
})

describe('getTopHighscores', () => {
  it('returns top N entries', () => {
    const entries: HighscoreEntry[] = [
      { score: 200, isCorrect: true, cardsCount: 10, elapsedTime: 5000, timeWasMeasured: true, timestamp: 1 },
      { score: 350, isCorrect: true, cardsCount: 20, elapsedTime: 10000, timeWasMeasured: true, timestamp: 2 },
      { score: 150, isCorrect: true, cardsCount: 5, elapsedTime: 3000, timeWasMeasured: true, timestamp: 3 },
      { score: 400, isCorrect: true, cardsCount: 25, elapsedTime: 12000, timeWasMeasured: true, timestamp: 4 },
    ]

    const top2 = getTopHighscores(entries, 2)

    expect(top2).toHaveLength(2)
    expect(top2[0].score).toBe(400)
    expect(top2[1].score).toBe(350)
  })

  it('returns all entries if count is greater than array length', () => {
    const entries: HighscoreEntry[] = [
      { score: 200, isCorrect: true, cardsCount: 10, elapsedTime: 5000, timeWasMeasured: true, timestamp: 1 },
      { score: 350, isCorrect: true, cardsCount: 20, elapsedTime: 10000, timeWasMeasured: true, timestamp: 2 },
    ]

    const top10 = getTopHighscores(entries, 10)

    expect(top10).toHaveLength(2)
  })

  it('handles empty array', () => {
    const top5 = getTopHighscores([], 5)
    expect(top5).toEqual([])
  })

  it('returns entries sorted by score', () => {
    const entries: HighscoreEntry[] = [
      { score: 100, isCorrect: true, cardsCount: 10, elapsedTime: 5000, timeWasMeasured: true, timestamp: 1 },
      { score: 300, isCorrect: true, cardsCount: 20, elapsedTime: 10000, timeWasMeasured: true, timestamp: 2 },
      { score: 200, isCorrect: true, cardsCount: 15, elapsedTime: 7000, timeWasMeasured: true, timestamp: 3 },
    ]

    const top3 = getTopHighscores(entries, 3)

    expect(top3[0].score).toBe(300)
    expect(top3[1].score).toBe(200)
    expect(top3[2].score).toBe(100)
  })
})
