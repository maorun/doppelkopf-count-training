// src/components/TimedChallengeInfo.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TimedChallengeInfo } from './TimedChallengeInfo'

describe('TimedChallengeInfo', () => {
  it('should render time remaining formatted correctly', () => {
    render(
      <TimedChallengeInfo
        timeRemaining={125}
        difficultyLevel="medium"
        cardsToReveal={25}
      />,
    )

    expect(screen.getByText('2:05')).toBeInTheDocument()
  })

  it('should display difficulty level and card count', () => {
    render(
      <TimedChallengeInfo
        timeRemaining={60}
        difficultyLevel="easy"
        cardsToReveal={15}
      />,
    )

    expect(screen.getByText(/Easy/)).toBeInTheDocument()
    expect(screen.getByText(/15 cards/)).toBeInTheDocument()
  })

  it('should show warning indicator when time is low', () => {
    const { container } = render(
      <TimedChallengeInfo
        timeRemaining={5}
        difficultyLevel="hard"
        cardsToReveal={35}
      />,
    )

    // Check for red text color class (low time warning)
    expect(container.querySelector('.text-red-600')).toBeInTheDocument()
  })

  it('should not show warning when time is sufficient', () => {
    const { container } = render(
      <TimedChallengeInfo
        timeRemaining={60}
        difficultyLevel="medium"
        cardsToReveal={25}
      />,
    )

    // Should have normal gray text, not red
    expect(container.querySelector('.text-gray-900')).toBeInTheDocument()
  })

  it('should format single digit seconds with leading zero', () => {
    render(
      <TimedChallengeInfo
        timeRemaining={65}
        difficultyLevel="easy"
        cardsToReveal={15}
      />,
    )

    expect(screen.getByText('1:05')).toBeInTheDocument()
  })

  it('should display medium difficulty correctly', () => {
    render(
      <TimedChallengeInfo
        timeRemaining={90}
        difficultyLevel="medium"
        cardsToReveal={25}
      />,
    )

    expect(screen.getByText(/Medium/)).toBeInTheDocument()
    expect(screen.getByText(/25 cards/)).toBeInTheDocument()
  })

  it('should display hard difficulty correctly', () => {
    render(
      <TimedChallengeInfo
        timeRemaining={120}
        difficultyLevel="hard"
        cardsToReveal={35}
      />,
    )

    expect(screen.getByText(/Hard/)).toBeInTheDocument()
    expect(screen.getByText(/35 cards/)).toBeInTheDocument()
  })

  it('should show Time Remaining label', () => {
    render(
      <TimedChallengeInfo
        timeRemaining={45}
        difficultyLevel="medium"
        cardsToReveal={25}
      />,
    )

    expect(screen.getByText('Time Remaining')).toBeInTheDocument()
  })

  it('should show Difficulty label', () => {
    render(
      <TimedChallengeInfo
        timeRemaining={30}
        difficultyLevel="easy"
        cardsToReveal={15}
      />,
    )

    expect(screen.getByText('Difficulty')).toBeInTheDocument()
  })
})
