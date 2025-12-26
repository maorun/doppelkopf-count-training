// src/hooks/useTheme.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Remove dark class from document
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    // Clean up after each test
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('should default to light theme', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('should load saved theme from localStorage', () => {
    localStorage.setItem('doppelkopf-theme', 'dark')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should toggle theme from light to dark', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('doppelkopf-theme')).toBe('dark')
  })

  it('should toggle theme from dark to light', () => {
    localStorage.setItem('doppelkopf-theme', 'dark')
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('doppelkopf-theme')).toBe('light')
  })

  it('should set theme directly', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.setTheme('dark')
    })

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('doppelkopf-theme')).toBe('dark')
  })

  it('should handle invalid localStorage value', () => {
    localStorage.setItem('doppelkopf-theme', 'invalid')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('should persist theme across multiple toggles', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme() // light -> dark
    })
    expect(result.current.theme).toBe('dark')

    act(() => {
      result.current.toggleTheme() // dark -> light
    })
    expect(result.current.theme).toBe('light')

    act(() => {
      result.current.toggleTheme() // light -> dark
    })
    expect(result.current.theme).toBe('dark')
    expect(localStorage.getItem('doppelkopf-theme')).toBe('dark')
  })
})
