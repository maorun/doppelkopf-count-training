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
    expect(container.querySelector('[class*="text-red-600"]')).toBeInTheDocument()
    // Also check for the warning animation
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
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
    // No warning class should be present
    expect(container.querySelector('.text-red-600')).toBeNull()
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

  it('should handle zero seconds correctly', () => {
    const { container } = render(
      <TimedChallengeInfo
        timeRemaining={0}
        difficultyLevel="easy"
        cardsToReveal={15}
      />,
    )

    expect(screen.getByText('0:00')).toBeInTheDocument()
    expect(container.querySelector('.text-red-600')).toBeInTheDocument()
  })

  it('should handle exactly 10 seconds (warning threshold)', () => {
    const { container } = render(
      <TimedChallengeInfo
        timeRemaining={10}
        difficultyLevel="medium"
        cardsToReveal={25}
      />,
    )

    expect(screen.getByText('0:10')).toBeInTheDocument()
    expect(container.querySelector('.text-red-600')).toBeInTheDocument()
  })

  it('should not show warning at 11 seconds', () => {
    const { container } = render(
      <TimedChallengeInfo
        timeRemaining={11}
        difficultyLevel="easy"
        cardsToReveal={15}
      />,
    )

    expect(screen.getByText('0:11')).toBeInTheDocument()
    expect(container.querySelector('.text-gray-900')).toBeInTheDocument()
  })

  it('should format maximum time (180 seconds = 3:00)', () => {
    render(
      <TimedChallengeInfo
        timeRemaining={180}
        difficultyLevel="hard"
        cardsToReveal={35}
      />,
    )

    expect(screen.getByText('3:00')).toBeInTheDocument()
  })

  it('should format 59 minutes correctly', () => {
    render(
      <TimedChallengeInfo
        timeRemaining={3540}
        difficultyLevel="hard"
        cardsToReveal={35}
      />,
    )

    expect(screen.getByText('59:00')).toBeInTheDocument()
  })

  it('should format 60 minutes correctly', () => {
    render(
      <TimedChallengeInfo
        timeRemaining={3600}
        difficultyLevel="hard"
        cardsToReveal={35}
      />,
    )

    expect(screen.getByText('60:00')).toBeInTheDocument()
  })

  it('should format single digit minutes with leading zero', () => {
    render(
      <TimedChallengeInfo
        timeRemaining={65}
        difficultyLevel="easy"
        cardsToReveal={15}
      />,
    )

    expect(screen.getByText('1:05')).toBeInTheDocument()
  })

  it('should format minutes less than 10 correctly', () => {
    render(
      <TimedChallengeInfo
        timeRemaining={55}
        difficultyLevel="easy"
        cardsToReveal={15}
      />,
    )

    expect(screen.getByText('0:55')).toBeInTheDocument()
  })

  it('should apply red color class for low time warning', () => {
    const { container } = render(
      <TimedChallengeInfo
        timeRemaining={8}
        difficultyLevel="hard"
        cardsToReveal={35}
      />,
    )

    // Check that at least one element has the red color class
    const hasRedClass = container.querySelector('[class*="text-red-600"]')
    expect(hasRedClass).toBeInTheDocument()
  })

  it('should apply dark mode red color class for low time', () => {
    document.body.classList.add('dark')
    const { container } = render(
      <TimedChallengeInfo
        timeRemaining={5}
        difficultyLevel="hard"
        cardsToReveal={35}
      />,
    )

    // Check that at least one element has the dark mode red color class
    const hasRedClass = container.querySelector('[class*="dark:text-red-400"]')
    expect(hasRedClass).toBeInTheDocument()
    document.body.classList.remove('dark')
  })

  it('should apply dark mode normal color for sufficient time', () => {
    document.body.classList.add('dark')
    const { container } = render(
      <TimedChallengeInfo
        timeRemaining={60}
        difficultyLevel="medium"
        cardsToReveal={25}
      />,
    )

    // Check that the container has dark mode styling
    const div = container.querySelector('div')
    expect(div?.classList.contains('dark:bg-gray-800')).toBe(true)
    document.body.classList.remove('dark')
  })

  it('should handle all difficulty levels with correct card counts', () => {
    // Easy
    render(
      <TimedChallengeInfo
        timeRemaining={45}
        difficultyLevel="easy"
        cardsToReveal={15}
      />,
    )
    expect(screen.getByText(/Easy/)).toBeInTheDocument()
    expect(screen.getByText(/15 cards/)).toBeInTheDocument()

    // Medium
    render(
      <TimedChallengeInfo
        timeRemaining={45}
        difficultyLevel="medium"
        cardsToReveal={25}
      />,
    )
    expect(screen.getByText(/Medium/)).toBeInTheDocument()
    expect(screen.getByText(/25 cards/)).toBeInTheDocument()

    // Hard
    render(
      <TimedChallengeInfo
        timeRemaining={45}
        difficultyLevel="hard"
        cardsToReveal={35}
      />,
    )
    expect(screen.getByText(/Hard/)).toBeInTheDocument()
    expect(screen.getByText(/35 cards/)).toBeInTheDocument()
  })

  it('should handle very low time with AlertTriangle component', () => {
    const { container } = render(
      <TimedChallengeInfo
        timeRemaining={3}
        difficultyLevel="easy"
        cardsToReveal={15}
      />,
    )

    // Check for the warning alert icon
    expect(container.querySelector('[class*="text-red-600"]')).toBeInTheDocument()
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('should not show AlertTriangle when time is sufficient', () => {
    const { container } = render(
      <TimedChallengeInfo
        timeRemaining={15}
        difficultyLevel="easy"
        cardsToReveal={15}
      />,
    )

    // Check that no warning elements are present
    expect(container.querySelector('.text-red-600')).toBeNull()
    expect(container.querySelector('.animate-pulse')).toBeNull()
  })

  it('should handle time boundary at 1 second', () => {
    const { container } = render(
      <TimedChallengeInfo
        timeRemaining={1}
        difficultyLevel="easy"
        cardsToReveal={15}
      />,
    )

    expect(screen.getByText('0:01')).toBeInTheDocument()
    expect(container.querySelector('.text-red-600')).toBeInTheDocument()
  })

  it('should handle time boundary at 2 seconds', () => {
    const { container } = render(
      <TimedChallengeInfo
        timeRemaining={2}
        difficultyLevel="easy"
        cardsToReveal={15}
      />,
    )

    expect(screen.getByText('0:02')).toBeInTheDocument()
    expect(container.querySelector('.text-red-600')).toBeInTheDocument()
  })

  it('should handle time boundary at 9 seconds', () => {
    const { container } = render(
      <TimedChallengeInfo
        timeRemaining={9}
        difficultyLevel="easy"
        cardsToReveal={15}
      />,
    )

    expect(screen.getByText('0:09')).toBeInTheDocument()
    expect(container.querySelector('.text-red-600')).toBeInTheDocument()
  })
})
