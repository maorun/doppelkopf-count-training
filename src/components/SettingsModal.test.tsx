// src/components/SettingsModal.test.tsx
import { render, fireEvent, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SettingsModal } from './SettingsModal'
import { GameSettings } from '../hooks/useSettings'
import { defaultCardDesign } from '../lib/card-design'

describe('SettingsModal', () => {
  const mockSetSettings = vi.fn()
  const initialSettings: GameSettings = {
    includeNines: false,
    measureTime: true,
    cardCountRange: [20, 20],
    gameMode: 'single',
    cardDesign: defaultCardDesign,
    timedChallenge: {
      timeLimitSeconds: 60,
      difficultyLevel: 'medium',
    },
  }

  it('should render the modal with the correct settings', () => {
    const { getByLabelText, getAllByText } = render(
      <SettingsModal settings={initialSettings} setSettings={mockSetSettings}>
        <button>Open</button>
      </SettingsModal>,
    )
    fireEvent.click(getAllByText('Open')[0])
    expect(getByLabelText('Include 9s')).not.toBeChecked()
    expect(getByLabelText('Measure time')).toBeChecked()
    expect(getAllByText('20').length).toBe(2)
  })

  it('should render card design options', () => {
    render(
      <SettingsModal settings={initialSettings} setSettings={mockSetSettings}>
        <button>Open</button>
      </SettingsModal>,
    )
    fireEvent.click(screen.getByText('Open'))

    expect(screen.getByText('Card Design')).toBeInTheDocument()
    expect(screen.getByText('Card Style')).toBeInTheDocument()
    expect(screen.getByText('Color Scheme')).toBeInTheDocument()
    expect(screen.getByText('Accessibility')).toBeInTheDocument()
  })

  it('should render card style options', () => {
    render(
      <SettingsModal settings={initialSettings} setSettings={mockSetSettings}>
        <button>Open</button>
      </SettingsModal>,
    )
    fireEvent.click(screen.getByText('Open'))

    expect(screen.getByText(/Classic - Traditional card design/)).toBeInTheDocument()
    expect(screen.getByText(/Modern - Stylish gradient cards/)).toBeInTheDocument()
    expect(screen.getByText(/Minimalist - Simple clean design/)).toBeInTheDocument()
  })

  it('should render color scheme options', () => {
    render(
      <SettingsModal settings={initialSettings} setSettings={mockSetSettings}>
        <button>Open</button>
      </SettingsModal>,
    )
    fireEvent.click(screen.getByText('Open'))

    expect(screen.getByText(/Traditional - Red and black suits/)).toBeInTheDocument()
    expect(screen.getByText(/Monochrome - All suits in same color/)).toBeInTheDocument()
    expect(screen.getByText(/Vibrant - Colorful suit colors/)).toBeInTheDocument()
  })

  it('should render accessibility options', () => {
    render(
      <SettingsModal settings={initialSettings} setSettings={mockSetSettings}>
        <button>Open</button>
      </SettingsModal>,
    )
    fireEvent.click(screen.getByText('Open'))

    expect(screen.getByLabelText('High Contrast')).not.toBeChecked()
    expect(screen.getByLabelText('Larger Text')).not.toBeChecked()
  })

  it('should call setSettings when card style changes', () => {
    render(
      <SettingsModal settings={initialSettings} setSettings={mockSetSettings}>
        <button>Open</button>
      </SettingsModal>,
    )
    fireEvent.click(screen.getByText('Open'))

    const modernOption = screen.getByText(/Modern - Stylish gradient cards/).closest('label')
    if (modernOption) {
      fireEvent.click(modernOption)
      expect(mockSetSettings).toHaveBeenCalledWith({
        ...initialSettings,
        cardDesign: {
          ...initialSettings.cardDesign,
          style: 'modern',
        },
      })
    }
  })

  it('should call setSettings when color scheme changes', () => {
    render(
      <SettingsModal settings={initialSettings} setSettings={mockSetSettings}>
        <button>Open</button>
      </SettingsModal>,
    )
    fireEvent.click(screen.getByText('Open'))

    const vibrantOption = screen.getByText(/Vibrant - Colorful suit colors/).closest('label')
    if (vibrantOption) {
      fireEvent.click(vibrantOption)
      expect(mockSetSettings).toHaveBeenCalledWith({
        ...initialSettings,
        cardDesign: {
          ...initialSettings.cardDesign,
          colorScheme: 'vibrant',
        },
      })
    }
  })

  it('should call setSettings when high contrast is toggled', () => {
    render(
      <SettingsModal settings={initialSettings} setSettings={mockSetSettings}>
        <button>Open</button>
      </SettingsModal>,
    )
    fireEvent.click(screen.getByText('Open'))

    const highContrastSwitch = screen.getByLabelText('High Contrast')
    fireEvent.click(highContrastSwitch)

    expect(mockSetSettings).toHaveBeenCalledWith({
      ...initialSettings,
      cardDesign: {
        ...initialSettings.cardDesign,
        accessibility: {
          ...initialSettings.cardDesign.accessibility,
          highContrast: true,
        },
      },
    })
  })

  it('should call setSettings when larger text is toggled', () => {
    render(
      <SettingsModal settings={initialSettings} setSettings={mockSetSettings}>
        <button>Open</button>
      </SettingsModal>,
    )
    fireEvent.click(screen.getByText('Open'))

    const largerTextSwitch = screen.getByLabelText('Larger Text')
    fireEvent.click(largerTextSwitch)

    expect(mockSetSettings).toHaveBeenCalledWith({
      ...initialSettings,
      cardDesign: {
        ...initialSettings.cardDesign,
        accessibility: {
          ...initialSettings.cardDesign.accessibility,
          largerText: true,
        },
      },
    })
  })

  it('should render timed challenge mode option', () => {
    render(
      <SettingsModal settings={initialSettings} setSettings={mockSetSettings}>
        <button>Open</button>
      </SettingsModal>,
    )
    fireEvent.click(screen.getByText('Open'))

    expect(screen.getByText(/Timed Challenge - Race against the clock/)).toBeInTheDocument()
  })

  it('should show timed challenge settings when timed challenge mode is selected', () => {
    const timedChallengeSettings: GameSettings = {
      ...initialSettings,
      gameMode: 'timed-challenge',
    }

    render(
      <SettingsModal settings={timedChallengeSettings} setSettings={mockSetSettings}>
        <button>Open</button>
      </SettingsModal>,
    )
    fireEvent.click(screen.getByText('Open'))

    expect(screen.getByText('Timed Challenge Settings')).toBeInTheDocument()
    expect(screen.getByText(/Time Limit \(seconds\)/)).toBeInTheDocument()
    expect(screen.getByText('Difficulty Level')).toBeInTheDocument()
  })

  it('should display time limit value', () => {
    const timedChallengeSettings: GameSettings = {
      ...initialSettings,
      gameMode: 'timed-challenge',
      timedChallenge: {
        timeLimitSeconds: 90,
        difficultyLevel: 'hard',
      },
    }

    render(
      <SettingsModal settings={timedChallengeSettings} setSettings={mockSetSettings}>
        <button>Open</button>
      </SettingsModal>,
    )
    fireEvent.click(screen.getByText('Open'))

    expect(screen.getByText('90s')).toBeInTheDocument()
  })

  it('should display difficulty level options', () => {
    const timedChallengeSettings: GameSettings = {
      ...initialSettings,
      gameMode: 'timed-challenge',
    }

    render(
      <SettingsModal settings={timedChallengeSettings} setSettings={mockSetSettings}>
        <button>Open</button>
      </SettingsModal>,
    )
    fireEvent.click(screen.getByText('Open'))

    expect(screen.getByText(/Easy - 15 cards/)).toBeInTheDocument()
    expect(screen.getByText(/Medium - 25 cards/)).toBeInTheDocument()
    expect(screen.getByText(/Hard - 35 cards/)).toBeInTheDocument()
  })
})
