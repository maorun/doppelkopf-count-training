// src/components/SurvivalInfo.tsx
import React from 'react'
import { Card, CardContent } from './ui/card'
import { Trophy, Target } from 'lucide-react'

interface SurvivalInfoProps {
  currentStreak: number
  longestStreak: number
  currentDifficulty: number
}

function StreakDisplay({
  icon: Icon,
  label,
  value,
  colorClass,
  ariaLabel,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number | string
  colorClass: string
  ariaLabel: string
}) {
  return (
    <div className="flex items-center gap-2" role="region" aria-label={ariaLabel}>
      <Icon className={`h-5 w-5 ${colorClass}`} aria-hidden="true" />
      <div>
        <p className="text-xs text-slate-600 dark:text-slate-400">{label}</p>
        <p className={`text-2xl font-bold ${colorClass}`} aria-live="polite">
          {value}
        </p>
      </div>
    </div>
  )
}

export function SurvivalInfo({
  currentStreak,
  longestStreak,
  currentDifficulty,
}: SurvivalInfoProps) {
  return (
    <Card
      className="w-full max-w-md mx-auto mb-4 border-purple-200/70 bg-gradient-to-r from-purple-50 to-blue-50 dark:border-purple-800/60 dark:from-purple-900/30 dark:to-blue-900/30"
      role="region"
      aria-label="Survival Mode Information"
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <StreakDisplay
            icon={Target}
            label="Current Streak"
            value={currentStreak}
            colorClass="text-purple-600 dark:text-purple-400"
            ariaLabel={`Current Streak: ${currentStreak}`}
          />
          <StreakDisplay
            icon={Trophy}
            label="Best Streak"
            value={longestStreak}
            colorClass="text-yellow-800 dark:text-yellow-300"
            ariaLabel={`Best Streak: ${longestStreak}`}
          />
          <div role="region" aria-label={`Difficulty: ${currentDifficulty} cards`}>
            <p className="text-xs text-slate-600 dark:text-slate-400">Difficulty</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400" aria-live="polite">
              {currentDifficulty}
              {' '}
              cards
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
