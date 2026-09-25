// src/hooks/useSettings.ts
import { useState, useEffect } from 'react'
import { CardDesignOptions, defaultCardDesign } from '../lib/card-design'
import { Rank, Suit } from '../lib/doppelkopf'

export type GameMode = 'single' | 'survival' | 'timed-challenge' | 'team-play'
export type CountingMode = 'count-up' | 'count-down'

export interface TeamPlaySettings {
  playerCount: number
}

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
  countingMode: CountingMode
  autoShowRunningTotal: boolean
  cardDesign: CardDesignOptions
  timedChallenge: TimedChallengeSettings
  teamPlay?: TeamPlaySettings
}

const defaultTimedChallengeSettings: TimedChallengeSettings = {
  timeLimitSeconds: 60,
  difficultyLevel: 'medium',
}

export const defaultTeamPlaySettings: TeamPlaySettings = {
  playerCount: 4,
}

const defaultSettings: GameSettings = {
  includeNines: false,
  countedRanks: countableRanks,
  countedSuits: countableSuits,
  measureTime: true,
  cardCountRange: [20, 20],
  gameMode: 'single',
  countingMode: 'count-up',
  autoShowRunningTotal: false,
  cardDesign: defaultCardDesign,
  timedChallenge: defaultTimedChallengeSettings,
  teamPlay: defaultTeamPlaySettings,
}

const migrateSettings = (parsed: Partial<GameSettings>): GameSettings => ({
  ...parsed,
  cardDesign: parsed.cardDesign ?? defaultCardDesign,
  timedChallenge: parsed.timedChallenge ?? defaultTimedChallengeSettings,
  teamPlay: parsed.teamPlay ?? defaultTeamPlaySettings,
  countedRanks: parsed.countedRanks ?? countableRanks,
  countedSuits: parsed.countedSuits ?? countableSuits,
  countingMode: parsed.countingMode === 'count-down' ? 'count-down' : 'count-up',
  autoShowRunningTotal: parsed.autoShowRunningTotal ?? false,
}) as GameSettings

const loadSettings = (): GameSettings => {
  try {
    const storedSettings = window.localStorage.getItem('gameSettings')
    return storedSettings ? migrateSettings(JSON.parse(storedSettings)) : defaultSettings
  }
  catch (error) {
    console.error('Error reading from localStorage', error)
    return defaultSettings
  }
}

export const useSettings = () => {
  const [settings, setSettings] = useState<GameSettings>(loadSettings)

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
