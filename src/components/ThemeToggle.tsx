// src/components/ThemeToggle.tsx
import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { useTheme } from '../hooks/useTheme'

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode (Dark theme active)' : 'Switch to dark mode (Light theme active)'}
      aria-pressed={isDark}
      data-testid="theme-toggle"
    >
      {isDark ? (
        <Sun className="h-5 w-5" data-testid="sun-icon" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" data-testid="moon-icon" aria-hidden="true" />
      )}
    </Button>
  )
}
