// src/hooks/useSettings.test.ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useSettings, GameSettings } from './useSettings'

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
    })
  })

  it('should return settings from localStorage when available', () => {
    const storedSettings: GameSettings = {
      includeNines: true,
      measureTime: false,
      cardCountRange: [15, 25],
      gameMode: 'single',
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
    }
    act(() => {
      result.current.setSettings(newSettings)
    })
    expect(result.current.settings).toEqual(newSettings)
    expect(JSON.parse(window.localStorage.getItem('gameSettings')!)).toEqual(newSettings)
  })
})
