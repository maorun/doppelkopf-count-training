// src/components/SettingsModal.test.tsx
import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SettingsModal } from './SettingsModal'
import { GameSettings } from '../hooks/useSettings'

describe('SettingsModal', () => {
  const mockSetSettings = vi.fn()
  const initialSettings: GameSettings = {
    includeNines: false,
    measureTime: true,
    cardCountRange: [20, 20],
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
})
