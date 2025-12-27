// src/components/SettingsModal.tsx
import React, { useId } from 'react'
import { GameSettings, GameMode, TimedChallengeSettings } from '../hooks/useSettings'
import { CardStyle, ColorScheme } from '../lib/card-design'
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
import { RadioGroup, RadioGroupItem } from './ui/radio-group'

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

const GameModeSelector: React.FC<{
  value: GameMode
  onValueChange: (value: GameMode) => void
}> = ({ value, onValueChange }) => {
  const singleId = useId()
  const survivalId = useId()
  const timedChallengeId = useId()

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
      <div className="space-y-0.5">
        <Label className="text-base font-medium">
          Game Mode
        </Label>
        <p className="text-sm text-slate-500">
          Choose between single game, survival mode, or timed challenge
        </p>
      </div>
      <RadioGroup value={value} onValueChange={onValueChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="single" id={singleId} />
          <Label htmlFor={singleId} className="cursor-pointer">
            Single Game - Play one round at a time
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="survival" id={survivalId} />
          <Label htmlFor={survivalId} className="cursor-pointer">
            Survival Mode - Keep playing until first mistake
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="timed-challenge" id={timedChallengeId} />
          <Label htmlFor={timedChallengeId} className="cursor-pointer">
            Timed Challenge - Race against the clock
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}

const CardStyleSelector: React.FC<{
  value: CardStyle
  onValueChange: (value: CardStyle) => void
}> = ({ value, onValueChange }) => {
  const classicId = useId()
  const modernId = useId()
  const minimalistId = useId()

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
      <div className="space-y-0.5">
        <Label className="text-base font-medium">
          Card Style
        </Label>
        <p className="text-sm text-slate-500">
          Choose the visual style of the cards
        </p>
      </div>
      <RadioGroup value={value} onValueChange={onValueChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="classic" id={classicId} />
          <Label htmlFor={classicId} className="cursor-pointer">
            Classic - Traditional card design
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="modern" id={modernId} />
          <Label htmlFor={modernId} className="cursor-pointer">
            Modern - Stylish gradient cards
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="minimalist" id={minimalistId} />
          <Label htmlFor={minimalistId} className="cursor-pointer">
            Minimalist - Simple clean design
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}

const ColorSchemeSelector: React.FC<{
  value: ColorScheme
  onValueChange: (value: ColorScheme) => void
}> = ({ value, onValueChange }) => {
  const traditionalId = useId()
  const monochromeId = useId()
  const vibrantId = useId()

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
      <div className="space-y-0.5">
        <Label className="text-base font-medium">
          Color Scheme
        </Label>
        <p className="text-sm text-slate-500">
          Choose the color scheme for card suits
        </p>
      </div>
      <RadioGroup value={value} onValueChange={onValueChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="traditional" id={traditionalId} />
          <Label htmlFor={traditionalId} className="cursor-pointer">
            Traditional - Red and black suits
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="monochrome" id={monochromeId} />
          <Label htmlFor={monochromeId} className="cursor-pointer">
            Monochrome - All suits in same color
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="vibrant" id={vibrantId} />
          <Label htmlFor={vibrantId} className="cursor-pointer">
            Vibrant - Colorful suit colors
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}

const DifficultyLevelSelector: React.FC<{
  value: 'easy' | 'medium' | 'hard'
  onValueChange: (value: 'easy' | 'medium' | 'hard') => void
}> = ({ value, onValueChange }) => {
  const easyId = useId()
  const mediumId = useId()
  const hardId = useId()

  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">Difficulty Level</Label>
      <RadioGroup
        value={value}
        onValueChange={value => onValueChange(value as 'easy' | 'medium' | 'hard')}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="easy" id={easyId} />
          <Label htmlFor={easyId} className="cursor-pointer">
            Easy - 15 cards
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="medium" id={mediumId} />
          <Label htmlFor={mediumId} className="cursor-pointer">
            Medium - 25 cards
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="hard" id={hardId} />
          <Label htmlFor={hardId} className="cursor-pointer">
            Hard - 35 cards
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}

const TimedChallengeSettingsSelector: React.FC<{
  settings: TimedChallengeSettings
  onSettingsChange: (settings: TimedChallengeSettings) => void
}> = ({ settings, onSettingsChange }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
      <div className="space-y-0.5">
        <Label className="text-base font-medium">
          Timed Challenge Settings
        </Label>
        <p className="text-sm text-slate-500">
          Configure time limit and difficulty level
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium mb-2 block">Time Limit (seconds)</Label>
          <Slider
            min={30}
            max={180}
            step={10}
            value={[settings.timeLimitSeconds]}
            onValueChange={([value]) =>
              onSettingsChange({ ...settings, timeLimitSeconds: value })}
          />
          <div className="flex justify-center mt-2">
            <span className="px-2 py-1 rounded bg-slate-200 text-sm font-medium" aria-label="Time limit in seconds">
              {settings.timeLimitSeconds}
              s
            </span>
          </div>
        </div>

        <DifficultyLevelSelector
          value={settings.difficultyLevel}
          onValueChange={difficultyLevel =>
            onSettingsChange({ ...settings, difficultyLevel })}
        />
      </div>
    </div>
  )
}

const AccessibilitySettings: React.FC<{
  settings: GameSettings
  setSettings: (settings: GameSettings) => void
}> = ({ settings, setSettings }) => {
  const highContrastId = useId()
  const largerTextId = useId()

  return (
    <div className="space-y-3">
      <h4 className="text-base font-medium text-slate-900">Accessibility</h4>
      <SettingSwitch
        id={highContrastId}
        label="High Contrast"
        description="Increase contrast for better visibility"
        checked={settings.cardDesign.accessibility.highContrast}
        onCheckedChange={checked =>
          setSettings({
            ...settings,
            cardDesign: {
              ...settings.cardDesign,
              accessibility: {
                ...settings.cardDesign.accessibility,
                highContrast: checked,
              },
            },
          })}
      />
      <SettingSwitch
        id={largerTextId}
        label="Larger Text"
        description="Increase text size on cards for better readability"
        checked={settings.cardDesign.accessibility.largerText}
        onCheckedChange={checked =>
          setSettings({
            ...settings,
            cardDesign: {
              ...settings.cardDesign,
              accessibility: {
                ...settings.cardDesign.accessibility,
                largerText: checked,
              },
            },
          })}
      />
    </div>
  )
}

const CardDesignSettings: React.FC<{
  settings: GameSettings
  setSettings: (settings: GameSettings) => void
}> = ({ settings, setSettings }) => {
  return (
    <div className="pt-2 border-t border-slate-200">
      <h3 className="text-lg font-semibold mb-3 text-slate-900">Card Design</h3>

      <div className="space-y-4">
        <CardStyleSelector
          value={settings.cardDesign.style}
          onValueChange={style =>
            setSettings({
              ...settings,
              cardDesign: { ...settings.cardDesign, style },
            })}
        />

        <ColorSchemeSelector
          value={settings.cardDesign.colorScheme}
          onValueChange={colorScheme =>
            setSettings({
              ...settings,
              cardDesign: { ...settings.cardDesign, colorScheme },
            })}
        />

        <AccessibilitySettings settings={settings} setSettings={setSettings} />
      </div>
    </div>
  )
}

/* eslint-disable max-lines-per-function */
export const SettingsModal: React.FC<SettingsModalProps> = ({
  children,
  settings,
  setSettings,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
          <DialogDescription className="text-base">
            Customize your game settings below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <GameModeSelector
            value={settings.gameMode}
            onValueChange={mode =>
              setSettings({ ...settings, gameMode: mode })}
          />
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
          {settings.gameMode === 'single' && (
            <SettingSlider
              label="Number of cards"
              description="Set the range of cards to reveal during the game"
              value={settings.cardCountRange}
              onValueChange={value =>
                setSettings({ ...settings, cardCountRange: [value[0], value[1]] })}
            />
          )}
          {settings.gameMode === 'timed-challenge' && (
            <TimedChallengeSettingsSelector
              settings={settings.timedChallenge}
              onSettingsChange={timedChallenge =>
                setSettings({ ...settings, timedChallenge })}
            />
          )}

          <CardDesignSettings settings={settings} setSettings={setSettings} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
