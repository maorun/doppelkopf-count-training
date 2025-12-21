// src/components/StatisticsView.test.tsx

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatisticsView } from './StatisticsView'
import { Statistics } from '../lib/statistics'

describe('StatisticsView', () => {
  it('should show message when no games played', () => {
    const emptyStats: Statistics = {
      totalGames: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      winRate: 0,
      averageTimePerCard: 0,
      bestStreak: 0,
      currentStreak: 0,
      totalCardsPlayed: 0,
      averageScore: 0,
      bestScore: 0,
      performanceByDifficulty: {},
    }

    render(<StatisticsView statistics={emptyStats} recentTrend={0} />)

    expect(screen.getByText(/No games played yet/i)).toBeInTheDocument()
  })

  it('should display overview statistics', () => {
    const stats: Statistics = {
      totalGames: 10,
      correctAnswers: 7,
      incorrectAnswers: 3,
      winRate: 70,
      averageTimePerCard: 1.5,
      bestStreak: 5,
      currentStreak: 2,
      totalCardsPlayed: 200,
      averageScore: 300,
      bestScore: 350,
      performanceByDifficulty: {},
    }

    render(<StatisticsView statistics={stats} recentTrend={80} />)

    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('70.0%')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('80%')).toBeInTheDocument()
  })

  it('should display performance metrics', () => {
    const stats: Statistics = {
      totalGames: 5,
      correctAnswers: 4,
      incorrectAnswers: 1,
      winRate: 80,
      averageTimePerCard: 1.2,
      bestStreak: 3,
      currentStreak: 3,
      totalCardsPlayed: 100,
      averageScore: 320,
      bestScore: 350,
      performanceByDifficulty: {},
    }

    render(<StatisticsView statistics={stats} recentTrend={100} />)

    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('1.20s')).toBeInTheDocument()
    expect(screen.getByText('320')).toBeInTheDocument()
    expect(screen.getByText('350')).toBeInTheDocument()
  })

  it('should display difficulty statistics when available', () => {
    const stats: Statistics = {
      totalGames: 10,
      correctAnswers: 8,
      incorrectAnswers: 2,
      winRate: 80,
      averageTimePerCard: 1.5,
      bestStreak: 5,
      currentStreak: 2,
      totalCardsPlayed: 200,
      averageScore: 300,
      bestScore: 350,
      performanceByDifficulty: {
        '1-10 cards': {
          gamesPlayed: 3,
          correctAnswers: 2,
          averageTime: 0.8,
        },
        '11-20 cards': {
          gamesPlayed: 7,
          correctAnswers: 6,
          averageTime: 1.2,
        },
      },
    }

    render(<StatisticsView statistics={stats} recentTrend={75} />)

    expect(screen.getByText('1-10 cards')).toBeInTheDocument()
    expect(screen.getByText('11-20 cards')).toBeInTheDocument()
    expect(screen.getByText('Performance by Difficulty')).toBeInTheDocument()
  })

  it('should display current streak in subtitle', () => {
    const stats: Statistics = {
      totalGames: 10,
      correctAnswers: 7,
      incorrectAnswers: 3,
      winRate: 70,
      averageTimePerCard: 1.5,
      bestStreak: 5,
      currentStreak: 3,
      totalCardsPlayed: 200,
      averageScore: 300,
      bestScore: 350,
      performanceByDifficulty: {},
    }

    render(<StatisticsView statistics={stats} recentTrend={80} />)

    expect(screen.getByText('Current: 3')).toBeInTheDocument()
  })

  it('should show correct and incorrect count in subtitle', () => {
    const stats: Statistics = {
      totalGames: 10,
      correctAnswers: 7,
      incorrectAnswers: 3,
      winRate: 70,
      averageTimePerCard: 1.5,
      bestStreak: 5,
      currentStreak: 2,
      totalCardsPlayed: 200,
      averageScore: 300,
      bestScore: 350,
      performanceByDifficulty: {},
    }

    render(<StatisticsView statistics={stats} recentTrend={80} />)

    expect(screen.getByText('7 correct, 3 incorrect')).toBeInTheDocument()
  })

  it('should not show average time when not measured', () => {
    const stats: Statistics = {
      totalGames: 5,
      correctAnswers: 4,
      incorrectAnswers: 1,
      winRate: 80,
      averageTimePerCard: 0,
      bestStreak: 3,
      currentStreak: 3,
      totalCardsPlayed: 100,
      averageScore: 300,
      bestScore: 350,
      performanceByDifficulty: {},
    }

    render(<StatisticsView statistics={stats} recentTrend={100} />)

    expect(screen.queryByText(/Avg Time\/Card/)).not.toBeInTheDocument()
  })
})
