import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MobileNumPad } from './MobileNumPad'

describe('MobileNumPad', () => {
  it('renders all digit buttons, clear, backspace and submit', () => {
    render(
      <MobileNumPad
        value=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    )

    for (let i = 0; i <= 9; i++) {
      expect(screen.getByRole('button', { name: `Digit ${i}` })).toBeInTheDocument()
    }
    expect(screen.getByRole('button', { name: 'Clear input' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Backspace' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ergebnis prüfen' })).toBeInTheDocument()
  })

  it('calls onChange with clicked digit appended', () => {
    const handleChange = vi.fn()
    render(
      <MobileNumPad
        value="12"
        onChange={handleChange}
        onSubmit={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Digit 5' }))
    expect(handleChange).toHaveBeenCalledWith('125')
  })

  it('calls onChange with truncated value on backspace', () => {
    const handleChange = vi.fn()
    render(
      <MobileNumPad
        value="120"
        onChange={handleChange}
        onSubmit={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Backspace' }))
    expect(handleChange).toHaveBeenCalledWith('12')
  })

  it('calls onChange with empty string on clear', () => {
    const handleChange = vi.fn()
    render(
      <MobileNumPad
        value="120"
        onChange={handleChange}
        onSubmit={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Clear input' }))
    expect(handleChange).toHaveBeenCalledWith('')
  })

  it('calls onSubmit when submit button is clicked', () => {
    const handleSubmit = vi.fn()
    render(
      <MobileNumPad
        value="120"
        onChange={vi.fn()}
        onSubmit={handleSubmit}
        submitLabel="Check"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Check' }))
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it('disables submit button when submitDisabled is true', () => {
    render(
      <MobileNumPad
        value=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        submitDisabled={true}
      />,
    )

    expect(screen.getByRole('button', { name: 'Ergebnis prüfen' })).toBeDisabled()
  })
})
