// src/components/SurvivalInfo.tsx
import React from 'react'
import { Card, CardContent } from './ui/card'
import { Trophy, Target } from 'lucide-react'

interface SurvivalInfoProps {
  currentStreak: number
  longestStreak: number
  currentDifficulty: number
}

export const SurvivalInfo: React.FC<SurvivalInfoProps> = ({
  currentStreak,
  longestStreak,
  currentDifficulty,
}) => {
  return (
    <Card className="w-full max-w-md mx-auto mb-4 border-purple-200/70 bg-gradient-to-r from-purple-50 to-blue-50 dark:border-purple-800/60 dark:from-purple-900/30 dark:to-blue-900/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Current Streak</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {currentStreak}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Best Streak</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {longestStreak}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Difficulty</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
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
