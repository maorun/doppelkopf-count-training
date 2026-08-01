// src/components/HighscoreList.tsx
import React from 'react'
import { HighscoreEntry } from '../lib/highscore'
import { Button } from './ui/button'

interface HighscoreListProps {
  highscores: HighscoreEntry[]
  onClear?: () => void
}

const formatTime = (ms: number): string => {
  return `${(ms / 1000).toFixed(1)}s`
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/* eslint-disable max-lines-per-function */
export const HighscoreList: React.FC<HighscoreListProps> = ({ highscores, onClear }) => {
  if (highscores.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Highscores</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No highscores yet. Play a game to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Highscores</h2>
        {onClear && (
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear All
          </Button>
        )}
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-sm sm:text-base">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-600">
              <th className="text-left py-2 px-2 text-gray-700 dark:text-gray-300">#</th>
              <th className="text-left py-2 px-2 text-gray-700 dark:text-gray-300">Score</th>
              <th className="text-left py-2 px-2 text-gray-700 dark:text-gray-300">Cards</th>
              <th className="text-left py-2 px-2 text-gray-700 dark:text-gray-300">Time</th>
              <th className="text-left py-2 px-2 text-gray-700 dark:text-gray-300">Result</th>
              <th className="text-left py-2 px-2 text-gray-700 dark:text-gray-300 hidden sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {highscores.map((entry, index) => (
              <tr
                key={entry.timestamp}
                className={`border-b border-gray-100 dark:border-gray-700 ${
                  entry.isCorrect ? '' : 'opacity-60'
                }`}
              >
                <td className="py-2 px-2 font-semibold text-gray-600 dark:text-gray-400">
                  {index + 1}
                </td>
                <td className="py-2 px-2 font-bold text-blue-600 dark:text-blue-400">
                  {entry.score}
                </td>
                <td className="py-2 px-2 text-gray-900 dark:text-gray-100">
                  {entry.cardsCount}
                </td>
                <td className="py-2 px-2 text-gray-900 dark:text-gray-100">
                  {entry.timeWasMeasured ? formatTime(entry.elapsedTime) : '-'}
                </td>
                <td className="py-2 px-2">
                  <span className={entry.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {entry.isCorrect ? '✓' : '✗'}
                  </span>
                </td>
                <td className="py-2 px-2 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                  {formatDate(entry.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
