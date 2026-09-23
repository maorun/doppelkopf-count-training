// src/hooks/useSettings.ts
import { useState, useEffect } from 'react'
import { CardDesignOptions, defaultCardDesign } from '../lib/card-design'
import { Rank, Suit } from '../lib/doppelkopf'

export type GameMode = 'single' | 'survival' | 'timed-challenge'

export interface TimedChallengeSettings {
  timeLimitSeconds: number
  difficultyLevel: 'easy' | 'medium' | 'hard'
}

export const countableRanks: Rank[] = ['Ass', '10', 'König', 'Dame', 'Bube', '9']
export const countableSuits: Suit[] = ['Kreuz', 'Pik', 'Herz', 'Karo']

export interface GameSettings {
  includeNines: boolean
  countedRanks: Rank[]
  countedSuits: Suit[]
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
  countedRanks: countableRanks,
  countedSuits: countableSuits,
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
      if (!parsed.countedRanks) {
        parsed.countedRanks = countableRanks
      }
      if (!parsed.countedSuits) {
        parsed.countedSuits = countableSuits
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
