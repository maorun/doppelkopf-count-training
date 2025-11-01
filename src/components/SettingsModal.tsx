// src/components/SettingsModal.tsx
import React from 'react'
import { GameSettings } from '../hooks/useSettings'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Slider } from './ui/slider'

interface SettingsModalProps {
  children: React.ReactNode
  settings: GameSettings
  setSettings: (settings: GameSettings) => void
}

const SettingSwitch: React.FC<{
  id: string
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}> = ({ id, label, description, checked, onCheckedChange }) => (
  <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
    <div className="flex-1 space-y-0.5">
      <Label htmlFor={id} className="text-base font-medium leading-none">
        {label}
      </Label>
      {description && (
        <p className="text-sm text-slate-500">
          {description}
        </p>
      )}
    </div>
    <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
  </div>
)

const SettingSlider: React.FC<{
  label: string
  description?: string
  value: [number, number]
  onValueChange: (value: [number, number]) => void
}> = ({ label, description, value, onValueChange }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
    <div className="space-y-0.5">
      <Label className="text-base font-medium">
        {label}
      </Label>
      {description && (
        <p className="text-sm text-slate-500">
          {description}
        </p>
      )}
    </div>
    <div className="pt-2">
      <Slider
        min={15}
        max={35}
        step={1}
        value={value}
        onValueChange={onValueChange}
      />
      <div className="flex justify-between mt-3 text-sm font-medium text-slate-700">
        <span className="px-2 py-1 rounded bg-slate-200" aria-label="Minimum value">{value[0]}</span>
        <span className="px-2 py-1 rounded bg-slate-200" aria-label="Maximum value">{value[1]}</span>
      </div>
    </div>
  </div>
)

export const SettingsModal: React.FC<SettingsModalProps> = ({
  children,
  settings,
  setSettings,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
          <DialogDescription className="text-base">
            Customize your game settings below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <SettingSwitch
            id="include-nines"
            label="Include 9s"
            description="Add 9s to the card deck"
            checked={settings.includeNines}
            onCheckedChange={checked =>
              setSettings({ ...settings, includeNines: checked })}
          />
          <SettingSwitch
            id="measure-time"
            label="Measure time"
            description="Track how long it takes to complete the game"
            checked={settings.measureTime}
            onCheckedChange={checked =>
              setSettings({ ...settings, measureTime: checked })}
          />
          <SettingSlider
            label="Number of cards"
            description="Set the range of cards to reveal during the game"
            value={settings.cardCountRange}
            onValueChange={value =>
              setSettings({ ...settings, cardCountRange: [value[0], value[1]] })}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
