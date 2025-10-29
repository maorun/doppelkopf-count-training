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
          <div className="flex items-center justify-between">
            <Label htmlFor="include-nines">Include 9s</Label>
            <Switch
              id="include-nines"
              checked={settings.includeNines}
              onCheckedChange={checked =>
                setSettings({ ...settings, includeNines: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="measure-time">Measure time</Label>
            <Switch
              id="measure-time"
              checked={settings.measureTime}
              onCheckedChange={checked =>
                setSettings({ ...settings, measureTime: checked })}
            />
          </div>
          <div>
            <Label>Number of cards</Label>
            <Slider
              min={15}
              max={35}
              step={1}
              value={settings.cardCountRange}
              onValueChange={value =>
                setSettings({ ...settings, cardCountRange: [value[0], value[1]] })}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{settings.cardCountRange[0]}</span>
              <span>{settings.cardCountRange[1]}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
