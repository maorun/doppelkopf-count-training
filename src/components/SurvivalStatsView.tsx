// src/components/SurvivalStatsView.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useSurvivalMode } from '../hooks/useSurvivalMode'
import { Button } from './ui/button'
import { Trophy, Target, TrendingUp } from 'lucide-react'

/* eslint-disable max-lines-per-function */
export const SurvivalStatsView: React.FC = () => {
  const { survivalState, resetLongestStreak } = useSurvivalMode()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Survival Mode Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Target className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {survivalState.currentStreak}
              </p>
            </div>

            <div className="flex flex-col items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Longest Streak</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {survivalState.longestStreak}
              </p>
            </div>

            <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Current Difficulty</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {survivalState.currentDifficulty}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">cards</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <h3 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
              How Survival Mode Works
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Start with 15 cards to count</li>
              <li>• Each correct answer increases difficulty by 2 cards</li>
              <li>• Maximum difficulty is 40 cards</li>
              <li>• One wrong answer ends your streak</li>
              <li>• Your longest streak is saved</li>
            </ul>
          </div>

          {survivalState.longestStreak > 0 && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={resetLongestStreak}
                className="text-sm"
              >
                Reset Longest Streak
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
