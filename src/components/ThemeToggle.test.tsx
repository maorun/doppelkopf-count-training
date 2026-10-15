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

  it('should render moon icon in light mode and have correct accessibility attributes', () => {
    render(<ThemeToggle />)
    const button = screen.getByTestId('theme-toggle')
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode (Light theme active)')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByTestId('moon-icon')).toHaveAttribute('aria-hidden', 'true')
  })

  it('should render sun icon in dark mode and have correct accessibility attributes', () => {
    localStorage.setItem('doppelkopf-theme', 'dark')
    render(<ThemeToggle />)
    const button = screen.getByTestId('theme-toggle')
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode (Dark theme active)')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('sun-icon')).toHaveAttribute('aria-hidden', 'true')
  })

  it('should toggle theme when clicked', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    const button = screen.getByTestId('theme-toggle')

    // Initially light mode
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    // Click to toggle to dark mode
    await user.click(button)
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode (Dark theme active)')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Click to toggle back to light mode
    await user.click(button)
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode (Light theme active)')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('should support keyboard interaction (Enter and Space keys)', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    const button = screen.getByTestId('theme-toggle')

    button.focus()
    expect(button).toHaveFocus()

    // Press Enter to toggle
    await user.keyboard('{Enter}')
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Press Space to toggle back
    await user.keyboard(' ')
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('should persist theme change to localStorage', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    const button = screen.getByTestId('theme-toggle')

    await user.click(button)
    expect(localStorage.getItem('doppelkopf-theme')).toBe('dark')

    await user.click(button)
    expect(localStorage.getItem('doppelkopf-theme')).toBe('light')
  })
})
