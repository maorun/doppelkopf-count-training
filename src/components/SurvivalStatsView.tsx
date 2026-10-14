// src/components/SurvivalStatsView.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useSurvivalMode, type SurvivalState } from '../hooks/useSurvivalMode'
import { Button } from './ui/button'
import { Trophy, Target, TrendingUp, List } from 'lucide-react'
import { useHighscores } from '../hooks/useHighscores'
import { HighscoreList } from './HighscoreList'

const StatCard: React.FC<{
  icon: React.ReactNode
  label: string
  value: string | number
  suffix?: string
  colorClass: string
}> = ({ icon, label, value, suffix, colorClass }) => (
  <div className={`flex flex-col items-center p-4 ${colorClass} rounded-lg`}>
    {icon}
    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{label}</p>
    <p className={`text-3xl font-bold ${colorClass.includes('purple') ? 'text-purple-600 dark:text-purple-400' : colorClass.includes('yellow') ? 'text-yellow-800 dark:text-yellow-300' : 'text-blue-600 dark:text-blue-400'}`}>
      {value}
    </p>
    {suffix && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{suffix}</p>}
  </div>
)

const HowItWorksSection: React.FC = () => (
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
)

const SurvivalStatsCardContent: React.FC<{
  survivalState: SurvivalState
  resetLongestStreak: () => void
  resetAllStats: () => void
}> = ({ survivalState, resetLongestStreak, resetAllStats }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        icon={<Target className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />}
        label="Current Streak"
        value={survivalState.currentStreak}
        colorClass="bg-purple-50 dark:bg-purple-900/20"
      />
      <StatCard
        icon={<Trophy className="h-8 w-8 text-yellow-800 dark:text-yellow-300 mb-2" />}
        label="Longest Streak"
        value={survivalState.longestStreak}
        colorClass="bg-yellow-50 dark:bg-yellow-900/20"
      />
      <StatCard
        icon={<TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />}
        label="Current Difficulty"
        value={survivalState.currentDifficulty}
        suffix="cards"
        colorClass="bg-blue-50 dark:bg-blue-900/20"
      />
    </div>
    <HowItWorksSection />
    {survivalState.longestStreak > 0 && (
      <>
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={resetLongestStreak}
            className="text-sm"
          >
            Reset Longest Streak
          </Button>
        </div>
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={resetAllStats}
            className="text-sm"
          >
            Clear All Stats
          </Button>
        </div>
      </>
    )}
  </div>
)

export const SurvivalStatsView: React.FC = () => {
  const { survivalState, resetLongestStreak, resetAllStats } = useSurvivalMode()
  const { highscores } = useHighscores()
  const survivalHighscores = highscores.filter(entry => entry.gameMode === 'survival')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Survival Mode Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <SurvivalStatsCardContent
            survivalState={survivalState}
            resetLongestStreak={resetLongestStreak}
            resetAllStats={resetAllStats}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <List className="h-5 w-5" />
            Survival Highscores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HighscoreList
            highscores={survivalHighscores}
          />
        </CardContent>
      </Card>
    </div>
  )
}
