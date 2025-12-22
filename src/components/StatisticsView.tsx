// src/components/StatisticsView.tsx

import React from 'react'
import { Statistics } from '../lib/statistics'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface StatisticsViewProps {
  statistics: Statistics
  recentTrend: number
}

const StatCard: React.FC<{
  title: string
  value: string | number
  subtitle?: string
}> = ({ title, value, subtitle }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </CardContent>
  </Card>
)

const DifficultyCard: React.FC<{
  label: string
  gamesPlayed: number
  correctAnswers: number
  averageTime: number
}> = ({ label, gamesPlayed, correctAnswers, averageTime }) => {
  const winRate = gamesPlayed > 0 ? ((correctAnswers / gamesPlayed) * 100).toFixed(1) : '0'

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-sm">
          Games:
          {' '}
          <span className="font-semibold">{gamesPlayed}</span>
        </p>
        <p className="text-sm">
          Win Rate:
          {' '}
          <span className="font-semibold">
            {winRate}
            %
          </span>
        </p>
        {averageTime > 0 && (
          <p className="text-sm">
            Avg Time:
            {' '}
            <span className="font-semibold">
              {averageTime.toFixed(2)}
              s/card
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

/* eslint-disable max-lines-per-function */
export const StatisticsView: React.FC<StatisticsViewProps> = ({ statistics, recentTrend }) => {
  if (statistics.totalGames === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No games played yet. Start playing to see your statistics!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Games"
            value={statistics.totalGames}
          />
          <StatCard
            title="Win Rate"
            value={`${statistics.winRate.toFixed(1)}%`}
            subtitle={`${statistics.correctAnswers} correct, ${statistics.incorrectAnswers} incorrect`}
          />
          <StatCard
            title="Best Streak"
            value={statistics.bestStreak}
            subtitle={`Current: ${statistics.currentStreak}`}
          />
          <StatCard
            title="Recent Trend"
            value={`${recentTrend.toFixed(0)}%`}
            subtitle="Last 10 games"
          />
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Cards"
            value={statistics.totalCardsPlayed}
          />
          {statistics.averageTimePerCard > 0 && (
            <StatCard
              title="Avg Time/Card"
              value={`${statistics.averageTimePerCard.toFixed(2)}s`}
            />
          )}
          <StatCard
            title="Average Score"
            value={statistics.averageScore.toFixed(0)}
          />
          <StatCard
            title="Best Score"
            value={statistics.bestScore}
          />
        </div>
      </div>

      {/* Performance by Difficulty */}
      {Object.keys(statistics.performanceByDifficulty).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Performance by Difficulty</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(statistics.performanceByDifficulty).map(([label, stats]) => (
              <DifficultyCard
                key={label}
                label={label}
                gamesPlayed={stats.gamesPlayed}
                correctAnswers={stats.correctAnswers}
                averageTime={stats.averageTime}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
