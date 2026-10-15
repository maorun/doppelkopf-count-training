import React, { useCallback } from 'react'
import { Button } from './ui/button'
import { Delete, RotateCcw, Check } from 'lucide-react'

interface MobileNumPadProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  submitLabel?: string
  submitDisabled?: boolean
}

const triggerHaptic = () => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(8)
    }
    catch {
      // Ignore haptic failures
    }
  }
}

interface KeypadGridProps {
  onDigit: (digit: string) => void
  onClear: () => void
  onBackspace: () => void
}

const KeypadGrid: React.FC<KeypadGridProps> = ({ onDigit, onClear, onBackspace }) => (
  <div className="grid grid-cols-3 gap-2">
    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
      <Button
        key={digit}
        type="button"
        variant="outline"
        onClick={() => onDigit(digit)}
        className="h-12 text-xl font-semibold rounded-xl bg-white dark:bg-slate-800 shadow-sm active:scale-95"
        aria-label={`Digit ${digit}`}
      >
        {digit}
      </Button>
    ))}
    <Button
      type="button"
      variant="outline"
      onClick={onClear}
      className="h-12 text-slate-500 rounded-xl bg-slate-50 dark:bg-slate-900 active:scale-95"
      aria-label="Clear input"
    >
      <RotateCcw className="w-5 h-5" />
    </Button>
    <Button
      type="button"
      variant="outline"
      onClick={() => onDigit('0')}
      className="h-12 text-xl font-semibold rounded-xl bg-white dark:bg-slate-800 shadow-sm active:scale-95"
      aria-label="Digit 0"
    >
      0
    </Button>
    <Button
      type="button"
      variant="outline"
      onClick={onBackspace}
      className="h-12 text-slate-600 dark:text-slate-300 rounded-xl bg-slate-50 dark:bg-slate-900 active:scale-95"
      aria-label="Backspace"
    >
      <Delete className="w-5 h-5" />
    </Button>
  </div>
)

export const MobileNumPad: React.FC<MobileNumPadProps> = ({
  value,
  onChange,
  onSubmit,
  submitLabel = 'Ergebnis prüfen',
  submitDisabled = false,
}) => {
  const handleDigit = useCallback((digit: string) => {
    triggerHaptic()
    if (value.length >= 4) return
    onChange(value + digit)
  }, [value, onChange])

  const handleBackspace = useCallback(() => {
    triggerHaptic()
    onChange(value.slice(0, -1))
  }, [value, onChange])

  const handleClear = useCallback(() => {
    triggerHaptic()
    onChange('')
  }, [onChange])

  const handleSubmit = useCallback(() => {
    triggerHaptic()
    onSubmit()
  }, [onSubmit])

  return (
    <div className="w-full max-w-xs mx-auto select-none mt-2 space-y-2" data-testid="mobile-numpad">
      <KeypadGrid
        onDigit={handleDigit}
        onClear={handleClear}
        onBackspace={handleBackspace}
      />

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={submitDisabled}
        className="w-full h-12 text-base font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-98"
      >
        <Check className="w-5 h-5" />
        {submitLabel}
      </Button>
    </div>
  )
}
