// src/components/HighscoreList.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { HighscoreEntry } from '../lib/highscore'
import { Button } from './ui/button'

const STORAGE_KEY = 'doppelkopf-highscore-list'
const MAX_ENTRIES = 100 // Keep up to 100 entries

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

const getDefaultState = (): HighscoreEntry[] => []

const loadHighscores = (): HighscoreEntry[] => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : getDefaultState()
  }
  catch (error) {
    console.error('Error reading highscores from localStorage', error)
    return getDefaultState()
  }
}

const saveHighscores = (highscores: HighscoreEntry[]) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(highscores))
  }
  catch (error) {
    console.error('Error writing highscores to localStorage', error)
  }
}

const clearLocalStorage = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  }
  catch (error) {
    console.error('Error clearing highscores from localStorage', error)
  }
}

/* eslint-disable max-lines-per-function */
export const HighscoreList: React.FC<HighscoreListProps> = ({ highscores: externalHighscores, onClear }) => {
  const [highscores, setHighscores] = useState<HighscoreEntry[]>([])
  const shouldSave = useRef(true)

  // When onClear is provided, manage internal state synced with localStorage
  // Load from localStorage on mount, merge with external highscores, save to localStorage on change
  useEffect(() => {
    if (!onClear) return

    // Initial load from localStorage
    const stored = loadHighscores()

    // Merge external highscores with persisted data
    const merged = [...stored, ...externalHighscores]
    const sorted = merged.sort((a, b) => b.score - a.score)
    const limited = sorted.slice(0, MAX_ENTRIES)

    setHighscores(limited)
    saveHighscores(limited)
  }, [onClear, externalHighscores])

  // Save to localStorage when highscores change (only when onClear is provided and not clearing)
  useEffect(() => {
    if (!onClear || !shouldSave.current) return
    saveHighscores(highscores)
  }, [highscores, onClear, shouldSave])

  // Clear localStorage and internal state when onClear callback is called
  // Only called when the user clicks the Clear button, not on mount
  const handleClear = useCallback(() => {
    if (onClear && typeof onClear === 'function') {
      clearLocalStorage()
      setHighscores([])
      onClear()
      shouldSave.current = false // Prevent save effect from running
    }
  }, [onClear])

  // Reset shouldSave when onClear changes
  useEffect(() => {
    if (onClear && typeof onClear === 'function') {
      shouldSave.current = true
    }
  }, [onClear])

  // When onClear is provided, use internal state (which syncs with localStorage)
  // Otherwise, use external highscores directly
  const highscoresToDisplay = onClear ? highscores : externalHighscores

  if (highscoresToDisplay.length === 0) {
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
          <Button variant="outline" size="sm" onClick={handleClear}>
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
            {highscoresToDisplay.map((entry, index) => (
              <tr
                key={entry.timestamp}
                className={`border-b ${
                  entry.isCorrect
                    ? 'border-gray-100 dark:border-gray-700'
                    : 'border-red-100 bg-red-50/60 dark:border-red-900/40 dark:bg-red-950/20'
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

export interface HighscoreListProps {
  highscores: HighscoreEntry[]
  onClear?: () => void
}
