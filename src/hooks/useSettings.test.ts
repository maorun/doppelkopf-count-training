// src/hooks/useSettings.test.ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useSettings, GameSettings } from './useSettings'
import { defaultCardDesign } from '../lib/card-design'

describe('useSettings', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('should return default settings when localStorage is empty', () => {
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings).toEqual({
      includeNines: false,
      countedRanks: ['Ass', '10', 'König', 'Dame', 'Bube', '9'],
      countedSuits: ['Kreuz', 'Pik', 'Herz', 'Karo'],
      measureTime: true,
      cardCountRange: [20, 20],
      gameMode: 'single',
      countingMode: 'count-up',
      autoShowRunningTotal: false,
      cardDesign: defaultCardDesign,
      timedChallenge: {
        timeLimitSeconds: 60,
        difficultyLevel: 'medium',
      },
      teamPlay: { playerCount: 4 },
    })
  })

  it('should return settings from localStorage when available', () => {
    const storedSettings: GameSettings = {
      includeNines: true,
      countedRanks: ['Ass', '10', 'König', 'Dame', 'Bube', '9'],
      countedSuits: ['Kreuz', 'Pik', 'Herz', 'Karo'],
      measureTime: false,
      cardCountRange: [15, 25],
      gameMode: 'single',
      countingMode: 'count-down',
      autoShowRunningTotal: true,
      cardDesign: {
        style: 'modern',
        colorScheme: 'vibrant',
        accessibility: {
          highContrast: true,
          largerText: false,
        },
      },
      timedChallenge: {
        timeLimitSeconds: 90,
        difficultyLevel: 'hard',
      },
      teamPlay: { playerCount: 3 },
    }
    window.localStorage.setItem('gameSettings', JSON.stringify(storedSettings))
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings).toEqual(storedSettings)
  })

  it('should update settings and localStorage', () => {
    const { result } = renderHook(() => useSettings())
    const newSettings: GameSettings = {
      includeNines: true,
      countedRanks: ['Ass', '10', 'König', 'Dame', 'Bube', '9'],
      countedSuits: ['Kreuz', 'Pik', 'Herz', 'Karo'],
      measureTime: false,
      cardCountRange: [18, 22],
      gameMode: 'survival',
      countingMode: 'count-down',
      autoShowRunningTotal: true,
      cardDesign: {
        style: 'minimalist',
        colorScheme: 'monochrome',
        accessibility: {
          highContrast: false,
          largerText: true,
        },
      },
      timedChallenge: {
        timeLimitSeconds: 120,
        difficultyLevel: 'easy',
      },
    }
    act(() => {
      result.current.setSettings(newSettings)
    })
    expect(result.current.settings).toEqual(newSettings)
    expect(JSON.parse(window.localStorage.getItem('gameSettings')!)).toEqual(newSettings)
  })

  it('should migrate old settings format without cardDesign', () => {
    const oldSettings = {
      includeNines: true,
      measureTime: false,
      cardCountRange: [15, 25],
      gameMode: 'single',
    }
    window.localStorage.setItem('gameSettings', JSON.stringify(oldSettings))
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings).toEqual({
      ...oldSettings,
      countingMode: 'count-up',
      autoShowRunningTotal: false,
      countedRanks: ['Ass', '10', 'König', 'Dame', 'Bube', '9'],
      countedSuits: ['Kreuz', 'Pik', 'Herz', 'Karo'],
      cardDesign: defaultCardDesign,
      timedChallenge: {
        timeLimitSeconds: 60,
        difficultyLevel: 'medium',
      },
      teamPlay: { playerCount: 4 },
    })
  })

  it('should handle cardDesign updates independently', () => {
    const { result } = renderHook(() => useSettings())

    act(() => {
      result.current.setSettings({
        ...result.current.settings,
        cardDesign: {
          style: 'modern',
          colorScheme: 'vibrant',
          accessibility: {
            highContrast: true,
            largerText: true,
          },
        },
      })
    })

    expect(result.current.settings.cardDesign.style).toBe('modern')
    expect(result.current.settings.cardDesign.colorScheme).toBe('vibrant')
    expect(result.current.settings.cardDesign.accessibility.highContrast).toBe(true)
    expect(result.current.settings.cardDesign.accessibility.largerText).toBe(true)
  })

  it('should persist cardDesign accessibility options correctly', () => {
    const { result } = renderHook(() => useSettings())

    act(() => {
      result.current.setSettings({
        ...result.current.settings,
        cardDesign: {
          ...result.current.settings.cardDesign,
          accessibility: {
            highContrast: true,
            largerText: false,
          },
        },
      })
    })

    const stored = JSON.parse(window.localStorage.getItem('gameSettings')!)
    expect(stored.cardDesign.accessibility.highContrast).toBe(true)
    expect(stored.cardDesign.accessibility.largerText).toBe(false)
  })

  it('should handle timed challenge settings updates', () => {
    const { result } = renderHook(() => useSettings())

    act(() => {
      result.current.setSettings({
        ...result.current.settings,
        gameMode: 'timed-challenge',
        timedChallenge: {
          timeLimitSeconds: 90,
          difficultyLevel: 'hard',
        },
      })
    })

    expect(result.current.settings.gameMode).toBe('timed-challenge')
    expect(result.current.settings.timedChallenge.timeLimitSeconds).toBe(90)
    expect(result.current.settings.timedChallenge.difficultyLevel).toBe('hard')
  })

  it('should persist timed challenge settings to localStorage', () => {
    const { result } = renderHook(() => useSettings())

    act(() => {
      result.current.setSettings({
        ...result.current.settings,
        timedChallenge: {
          timeLimitSeconds: 120,
          difficultyLevel: 'easy',
        },
      })
    })

    const stored = JSON.parse(window.localStorage.getItem('gameSettings')!)
    expect(stored.timedChallenge.timeLimitSeconds).toBe(120)
    expect(stored.timedChallenge.difficultyLevel).toBe('easy')
  })

  it('should migrate old settings format without timedChallenge', () => {
    const oldSettings = {
      includeNines: true,
      measureTime: false,
      cardCountRange: [15, 25],
      gameMode: 'single',
      cardDesign: defaultCardDesign,
    }
    window.localStorage.setItem('gameSettings', JSON.stringify(oldSettings))
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings.timedChallenge).toEqual({
      timeLimitSeconds: 60,
      difficultyLevel: 'medium',
    })
    expect(result.current.settings.countedRanks).toEqual(['Ass', '10', 'König', 'Dame', 'Bube', '9'])
  })

  it('migrates old settings with the default team-player count', () => {
    window.localStorage.setItem('gameSettings', JSON.stringify({
      includeNines: true,
      measureTime: false,
      cardCountRange: [15, 25],
      gameMode: 'single',
      cardDesign: defaultCardDesign,
    }))

    const { result } = renderHook(() => useSettings())

    expect(result.current.settings.teamPlay).toEqual({ playerCount: 4 })
  })
})
