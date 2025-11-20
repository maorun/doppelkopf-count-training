// src/lib/highscore.ts

export interface GameResult {
  isCorrect: boolean
  cardsCount: number
  elapsedTime: number // in milliseconds
  timeWasMeasured: boolean
}

export interface HighscoreEntry {
  score: number
  isCorrect: boolean
  cardsCount: number
  elapsedTime: number
  timeWasMeasured: boolean
  timestamp: number
}

/**
 * Calculate score for a game result
 *
 * Scoring system:
 * - Base score: 100 points for correct answer, 0 for incorrect
 * - Difficulty bonus: cardsCount * 10 points (more cards = higher difficulty)
 * - Time bonus (if time measurement enabled):
 *   - Fast (< 1s per card): +50 points
 *   - Normal (1-2s per card): +25 points
 *   - Slow (> 2s per card): +0 points
 */
export const calculateScore = (result: GameResult): number => {
  if (!result.isCorrect) {
    return 0 // No points for incorrect answers
  }

  let score = 100 // Base score for correct answer

  // Difficulty bonus based on card count
  score += result.cardsCount * 10

  // Time bonus (only if time was measured)
  if (result.timeWasMeasured && result.elapsedTime > 0) {
    const secondsPerCard = result.elapsedTime / 1000 / result.cardsCount

    if (secondsPerCard < 1) {
      score += 50 // Fast
    }
    else if (secondsPerCard < 2) {
      score += 25 // Normal
    }
    // Slow: no bonus
  }

  return score
}

/**
 * Create a highscore entry from a game result
 */
export const createHighscoreEntry = (result: GameResult): HighscoreEntry => {
  return {
    score: calculateScore(result),
    isCorrect: result.isCorrect,
    cardsCount: result.cardsCount,
    elapsedTime: result.elapsedTime,
    timeWasMeasured: result.timeWasMeasured,
    timestamp: Date.now(),
  }
}

/**
 * Sort highscores by score (descending)
 */
export const sortHighscores = (entries: HighscoreEntry[]): HighscoreEntry[] => {
  return [...entries].sort((a, b) => b.score - a.score)
}

/**
 * Get top N highscore entries
 */
export const getTopHighscores = (entries: HighscoreEntry[], count: number): HighscoreEntry[] => {
  return sortHighscores(entries).slice(0, count)
}
