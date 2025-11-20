// src/components/GameOverScreen.tsx
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

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
        className="max-w-xs mx-auto"
      />
    </div>
    <Button onClick={handleSubmit}>
      Check Result
    </Button>
  </div>
)

const ResultDisplay: React.FC<{
  isCorrect: boolean
  userInput: string
  totalScore: number
  resetGame: () => void
}> = ({ isCorrect, userInput, totalScore, resetGame }) => (
  <div className="space-y-4">
    <div className={`text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
      {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
    </div>
    <p className="text-xl">
      Your answer:
      {' '}
      {userInput}
    </p>
    <p className="text-xl">
      Actual total:
      {' '}
      {totalScore}
    </p>
    <Button onClick={resetGame}>
      Play Again
    </Button>
  </div>
)

export const GameOverScreen: React.FC<{
  totalScore: number
  elapsedTime: number
  resetGame: () => void
}> = ({ totalScore, elapsedTime, resetGame }) => {
  const [userInput, setUserInput] = useState('')
  const [showResult, setShowResult] = useState(false)

  const handleSubmit = () => {
    setShowResult(true)
  }

  const isCorrect = showResult && parseInt(userInput) === totalScore

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold">Game Over</h2>
      <p className="text-lg">
        Time:
        {' '}
        {(elapsedTime / 1000).toFixed(2)}
        s
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
          resetGame={resetGame}
        />
      )}
    </div>
  )
}
