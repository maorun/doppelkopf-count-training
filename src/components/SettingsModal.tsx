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
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}> = ({ id, label, checked, onCheckedChange }) => (
  <div className="flex items-center justify-between">
    <Label htmlFor={id}>{label}</Label>
    <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
  </div>
)

const SettingSlider: React.FC<{
  label: string
  value: [number, number]
  onValueChange: (value: [number, number]) => void
}> = ({ label, value, onValueChange }) => (
  <div>
    <Label>{label}</Label>
    <Slider
      min={15}
      max={35}
      step={1}
      value={value}
      onValueChange={onValueChange}
    />
    <div className="flex justify-between text-sm text-gray-500">
      <span>{value[0]}</span>
      <span>{value[1]}</span>
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Change the settings for the game.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <SettingSwitch
            id="include-nines"
            label="Include 9s"
            checked={settings.includeNines}
            onCheckedChange={checked =>
              setSettings({ ...settings, includeNines: checked })}
          />
          <SettingSwitch
            id="measure-time"
            label="Measure time"
            checked={settings.measureTime}
            onCheckedChange={checked =>
              setSettings({ ...settings, measureTime: checked })}
          />
          <SettingSlider
            label="Number of cards"
            value={settings.cardCountRange}
            onValueChange={value =>
              setSettings({ ...settings, cardCountRange: [value[0], value[1]] })}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
