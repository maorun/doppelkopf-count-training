// src/hooks/useTheme.ts
import { useState, useEffect } from 'react'

export type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'doppelkopf-theme'

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }
    // Default to light theme
    return 'light'
  })

  useEffect(() => {
    // Apply theme class to document root
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    }
    else {
      root.classList.remove('dark')
    }

    // Save theme preference to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return { theme, toggleTheme, setTheme: setThemeState }
}
