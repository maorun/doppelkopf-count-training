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
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Highscores</h2>
        <p className="text-gray-500 text-center py-8">
          No highscores yet. Play a game to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Highscores</h2>
        {onClear && (
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear All
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 px-2">#</th>
              <th className="text-left py-2 px-2">Score</th>
              <th className="text-left py-2 px-2">Cards</th>
              <th className="text-left py-2 px-2">Time</th>
              <th className="text-left py-2 px-2">Result</th>
              <th className="text-left py-2 px-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {highscores.map((entry, index) => (
              <tr
                key={entry.timestamp}
                className={`border-b border-gray-100 ${
                  entry.isCorrect ? '' : 'opacity-60'
                }`}
              >
                <td className="py-2 px-2 font-semibold text-gray-600">
                  {index + 1}
                </td>
                <td className="py-2 px-2 font-bold text-blue-600">
                  {entry.score}
                </td>
                <td className="py-2 px-2">
                  {entry.cardsCount}
                </td>
                <td className="py-2 px-2">
                  {entry.timeWasMeasured ? formatTime(entry.elapsedTime) : '-'}
                </td>
                <td className="py-2 px-2">
                  <span className={entry.isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {entry.isCorrect ? '✓' : '✗'}
                  </span>
                </td>
                <td className="py-2 px-2 text-sm text-gray-500">
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
