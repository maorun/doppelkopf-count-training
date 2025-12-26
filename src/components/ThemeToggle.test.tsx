// src/components/ThemeToggle.test.tsx
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('should render moon icon in light mode', () => {
    render(<ThemeToggle />)
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument()
  })

  it('should render sun icon in dark mode', () => {
    localStorage.setItem('doppelkopf-theme', 'dark')
    render(<ThemeToggle />)
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument()
  })

  it('should toggle theme when clicked', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    // Initially light mode
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    // Click to toggle to dark mode
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Click to toggle back to light mode
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('should have appropriate aria-label for accessibility', () => {
    render(<ThemeToggle />)
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument()
  })

  it('should update aria-label after theme change', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument()

    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument()
  })

  it('should persist theme change to localStorage', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByTestId('theme-toggle'))
    expect(localStorage.getItem('doppelkopf-theme')).toBe('dark')

    await user.click(screen.getByTestId('theme-toggle'))
    expect(localStorage.getItem('doppelkopf-theme')).toBe('light')
  })
})
