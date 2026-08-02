// src/components/GameOverScreen.tsx
import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { calculateScore, GameResult } from '../lib/highscore'

const InputForm: React.FC<{
  userInput: string
  setUserInput: (value: string) => void
  handleSubmit: () => void
}> = ({ userInput, setUserInput, handleSubmit }) => (
  <div className="space-y-4 mt-4">
    <div className="space-y-2">
      <Label htmlFor="score-input">Enter your calculated result:</Label>
      <Input
        id="score-input"
        type="number"
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        placeholder="Enter your result"
        className="w-full max-w-xs mx-auto block"
        onKeyDown={e => e.key === 'Enter' && userInput && handleSubmit()}
      />
    </div>
    <Button onClick={handleSubmit} className="w-full max-w-xs">
      Check Result
    </Button>
  </div>
)

const getResultMessage = (
  isCorrect: boolean,
  isSurvivalMode: boolean,
  isTimedChallenge: boolean,
  timeRanOut: boolean,
): string => {
  if (timeRanOut) {
    return 'Time\'s up! Try again with more speed!'
  }
  if (isCorrect) {
    if (isSurvivalMode) {
      return 'Keep going! Next round is harder!'
    }
    if (isTimedChallenge) {
      return 'Great job! You beat the clock!'
    }
    return 'Great job!'
  }
  return isSurvivalMode ? 'Survival mode ended. Try again!' : 'Better luck next time!'
}

const getButtonText = (
  isCorrect: boolean,
  isSurvivalMode: boolean,
  isTimedChallenge: boolean,
): string => {
  if (isSurvivalMode && isCorrect) {
    return 'Next Round'
  }
  if (isTimedChallenge) {
    return 'Try Again'
  }
  return 'Play Again'
}

const ResultDisplay: React.FC<{
  isCorrect: boolean
  userInput: string
  totalScore: number
  gameScore: number
  resetGame: () => void
  isSurvivalMode?: boolean
  isTimedChallenge?: boolean
  timeRanOut?: boolean
}> = ({
  isCorrect,
  userInput,
  totalScore,
  gameScore,
  resetGame,
  isSurvivalMode = false,
  isTimedChallenge = false,
  timeRanOut = false,
}) => (
  <div className="space-y-4">
    <div className={`text-xl font-bold ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
      {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
    </div>
    <div className="bg-blue-100 dark:bg-blue-900 border-2 border-blue-400 dark:border-blue-600 rounded-lg p-4 space-y-2 transition-colors">
      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
        Score:
        {' '}
        {gameScore}
      </p>
      <p className="text-sm text-blue-700 dark:text-blue-300">
        {getResultMessage(isCorrect, isSurvivalMode, isTimedChallenge, timeRanOut)}
      </p>
    </div>
    <p className="text-xl text-gray-900 dark:text-gray-100">
      Your answer:
      {' '}
      {userInput}
    </p>
    <p className="text-xl text-gray-900 dark:text-gray-100">
      Actual total:
      {' '}
      {totalScore}
    </p>
    <Button onClick={resetGame}>
      {getButtonText(isCorrect, isSurvivalMode, isTimedChallenge)}
    </Button>
  </div>
)

/* eslint-disable max-lines-per-function */
export const GameOverScreen: React.FC<{
  totalScore: number
  elapsedTime: number
  cardsCount: number
  timeWasMeasured: boolean
  resetGame: () => void
  onHighscoreSubmit?: (result: GameResult) => void
  hintsUsed?: number
  onSurvivalResult?: (isCorrect: boolean) => void
  isSurvivalMode?: boolean
  isTimedChallenge?: boolean
  timeRanOut?: boolean
}> = ({
  totalScore,
  elapsedTime,
  cardsCount,
  timeWasMeasured,
  resetGame,
  onHighscoreSubmit,
  hintsUsed = 0,
  onSurvivalResult,
  isSurvivalMode = false,
  isTimedChallenge = false,
  timeRanOut = false,
}) => {
  const [userInput, setUserInput] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [gameScore, setGameScore] = useState(0)

  const handleSubmit = () => {
    setShowResult(true)
    const isCorrect = parseInt(userInput) === totalScore

    const result: GameResult = {
      isCorrect,
      cardsCount,
      elapsedTime,
      timeWasMeasured,
      hintsUsed,
    }

    const score = calculateScore(result)
    setGameScore(score)

    // Notify parent component about highscore
    if (onHighscoreSubmit) {
      onHighscoreSubmit(result)
    }

    // Notify parent component about survival result
    if (onSurvivalResult) {
      onSurvivalResult(isCorrect)
    }
  }

  // Reset state when game is reset
  useEffect(() => {
    setUserInput('')
    setShowResult(false)
    setGameScore(0)
  }, [totalScore, cardsCount]) // Reset when new game starts

  const isCorrect = showResult && parseInt(userInput) === totalScore

  return (
    <div className="text-center space-y-4 w-full">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Game Over</h2>
      <p className="text-base text-gray-600 dark:text-gray-400">
        Time:
        {' '}
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {(elapsedTime / 1000).toFixed(2)}
          s
        </span>
      </p>

      {!showResult ? (
        <InputForm
          userInput={userInput}
          setUserInput={setUserInput}
          handleSubmit={handleSubmit}
        />
      ) : (
        <ResultDisplay
          isCorrect={isCorrect}
          userInput={userInput}
          totalScore={totalScore}
          gameScore={gameScore}
          resetGame={resetGame}
          isSurvivalMode={isSurvivalMode}
          isTimedChallenge={isTimedChallenge}
          timeRanOut={timeRanOut}
        />
      )}
    </div>
  )
}
