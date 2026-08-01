// src/components/TimedChallengeInfo.tsx
import React from 'react'
import { Clock, AlertTriangle } from 'lucide-react'

interface TimedChallengeInfoProps {
  timeRemaining: number
  difficultyLevel: 'easy' | 'medium' | 'hard'
  cardsToReveal: number
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const getDifficultyLabel = (level: 'easy' | 'medium' | 'hard'): string => {
  switch (level) {
    case 'easy':
      return 'Easy'
    case 'medium':
      return 'Medium'
    case 'hard':
      return 'Hard'
  }
}

export const TimedChallengeInfo: React.FC<TimedChallengeInfoProps> = ({
  timeRemaining,
  difficultyLevel,
  cardsToReveal,
}) => {
  const isLowTime = timeRemaining <= 10
  const timeColor = isLowTime
    ? 'text-red-600 dark:text-red-400'
    : 'text-gray-900 dark:text-gray-100'

  return (
    <div className="w-full mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${timeColor}`} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Time Remaining
          </span>
        </div>
        {isLowTime && (
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 animate-pulse" />
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className={`text-3xl font-bold ${timeColor}`}>
          {formatTime(timeRemaining)}
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 dark:text-gray-400">Difficulty</div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {getDifficultyLabel(difficultyLevel)}
            {' '}
            (
            {cardsToReveal}
            {' '}
            cards)
          </div>
        </div>
      </div>
    </div>
  )
}
