// src/hooks/useSettings.ts
import { useState, useEffect } from 'react'
import { CardDesignOptions, defaultCardDesign } from '../lib/card-design'

export type GameMode = 'single' | 'survival' | 'timed-challenge'

export interface TimedChallengeSettings {
  timeLimitSeconds: number
  difficultyLevel: 'easy' | 'medium' | 'hard'
}

export interface GameSettings {
  includeNines: boolean
  measureTime: boolean
  cardCountRange: [number, number]
  gameMode: GameMode
  cardDesign: CardDesignOptions
  timedChallenge: TimedChallengeSettings
}

const defaultTimedChallengeSettings: TimedChallengeSettings = {
  timeLimitSeconds: 60,
  difficultyLevel: 'medium',
}

const defaultSettings: GameSettings = {
  includeNines: false,
  measureTime: true,
  cardCountRange: [20, 20],
  gameMode: 'single',
  cardDesign: defaultCardDesign,
  timedChallenge: defaultTimedChallengeSettings,
}

export const useSettings = () => {
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const storedSettings = window.localStorage.getItem('gameSettings')
      if (!storedSettings) {
        return defaultSettings
      }

      const parsed = JSON.parse(storedSettings)

      // Migrate old settings format to include cardDesign and timedChallenge
      if (!parsed.cardDesign) {
        parsed.cardDesign = defaultCardDesign
      }
      if (!parsed.timedChallenge) {
        parsed.timedChallenge = defaultTimedChallengeSettings
      }

      return parsed
    }
    catch (error) {
      console.error('Error reading from localStorage', error)
      return defaultSettings
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem('gameSettings', JSON.stringify(settings))
    }
    catch (error) {
      console.error('Error writing to localStorage', error)
    }
  }, [settings])

  return {
    settings,
    setSettings,
  }
}
