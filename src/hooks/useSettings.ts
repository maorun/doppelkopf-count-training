// src/hooks/useSettings.ts
import { useState, useEffect } from 'react'

export interface GameSettings {
  includeNines: boolean
  measureTime: boolean
  cardCountRange: [number, number]
}

const defaultSettings: GameSettings = {
  includeNines: false,
  measureTime: true,
  cardCountRange: [20, 20],
}

export const useSettings = () => {
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const storedSettings = window.localStorage.getItem('gameSettings')
      return storedSettings ? JSON.parse(storedSettings) : defaultSettings
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
