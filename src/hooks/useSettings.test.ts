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
      measureTime: true,
      cardCountRange: [20, 20],
      gameMode: 'single',
      cardDesign: defaultCardDesign,
    })
  })

  it('should return settings from localStorage when available', () => {
    const storedSettings: GameSettings = {
      includeNines: true,
      measureTime: false,
      cardCountRange: [15, 25],
      gameMode: 'single',
      cardDesign: {
        style: 'modern',
        colorScheme: 'vibrant',
        accessibility: {
          highContrast: true,
          largerText: false,
        },
      },
    }
    window.localStorage.setItem('gameSettings', JSON.stringify(storedSettings))
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings).toEqual(storedSettings)
  })

  it('should update settings and localStorage', () => {
    const { result } = renderHook(() => useSettings())
    const newSettings: GameSettings = {
      includeNines: true,
      measureTime: false,
      cardCountRange: [18, 22],
      gameMode: 'survival',
      cardDesign: {
        style: 'minimalist',
        colorScheme: 'monochrome',
        accessibility: {
          highContrast: false,
          largerText: true,
        },
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
      cardDesign: defaultCardDesign,
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
})
