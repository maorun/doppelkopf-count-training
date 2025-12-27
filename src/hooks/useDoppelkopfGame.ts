// src/hooks/useDoppelkopfGame.ts
import { useState, useEffect, useCallback } from 'react'
import { Card, createDeck, shuffleDeck } from '../lib/doppelkopf'
import { GameSettings } from './useSettings'
import { useSurvivalMode } from './useSurvivalMode'

const handleTimer = (
  measureTime: boolean,
  startTime: number | null,
  setStartTime: (time: number) => void,
) => {
  if (measureTime && startTime === null) {
    setStartTime(Date.now())
  }
}

const revealNextCard = (
  deck: Card[],
  revealedCards: Card[],
  setRevealedCards: (cards: Card[]) => void,
  totalScore: number,
  setTotalScore: (score: number) => void,
) => {
  const nextCard = deck[revealedCards.length]
  setRevealedCards([...revealedCards, nextCard])
  setTotalScore(totalScore + nextCard.value)
}

const calculateCardsToReveal = (
  gameMode: 'single' | 'survival' | 'timed-challenge',
  cardCountRange: [number, number],
  survivalDifficulty: number,
  timedChallengeDifficulty?: 'easy' | 'medium' | 'hard',
): number => {
  if (gameMode === 'survival') {
    return survivalDifficulty
  }
  if (gameMode === 'timed-challenge') {
    // Return card count based on difficulty level
    switch (timedChallengeDifficulty) {
      case 'easy':
        return 15
      case 'hard':
        return 35
      case 'medium':
      default:
        return 25
    }
  }
  const [min, max] = cardCountRange
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const shouldFinishGame = (
  revealedCount: number,
  cardsToReveal: number,
  measureTime: boolean,
  startTime: number | null,
  setIsFinished: (finished: boolean) => void,
  setElapsedTime: (time: number) => void,
): boolean => {
  if (revealedCount >= cardsToReveal - 1) {
    setIsFinished(true)
    if (measureTime && startTime) {
      setElapsedTime(Date.now() - startTime)
    }
    return true
  }
  return false
}

const getCurrentCard = (revealedCards: Card[]): Card | null => {
  return revealedCards.length > 0 ? revealedCards[revealedCards.length - 1] : null
}

const resetGameState = (
  settings: GameSettings,
  survivalDifficulty: number,
  setCardsToReveal: (cards: number) => void,
  setDeck: (deck: Card[]) => void,
  setRevealedCards: (cards: Card[]) => void,
  setTotalScore: (score: number) => void,
  setIsFinished: (finished: boolean) => void,
  setStartTime: (time: number | null) => void,
  setElapsedTime: (time: number) => void,
  setHintsUsed: (hints: number) => void,
) => {
  const newCardsToReveal = calculateCardsToReveal(
    settings.gameMode,
    settings.cardCountRange,
    survivalDifficulty,
    settings.timedChallenge?.difficultyLevel,
  )

  setCardsToReveal(newCardsToReveal)
  setDeck(shuffleDeck(createDeck(settings.includeNines)))
  setRevealedCards([])
  setTotalScore(0)
  setIsFinished(false)
  setStartTime(null)
  setElapsedTime(0)
  setHintsUsed(0)
}

const processCardClick = (
  isFinished: boolean,
  settings: GameSettings,
  startTime: number | null,
  setStartTime: (time: number) => void,
  revealedCards: Card[],
  cardsToReveal: number,
  setIsFinished: (finished: boolean) => void,
  setElapsedTime: (time: number) => void,
  deck: Card[],
  setRevealedCards: (cards: Card[]) => void,
  totalScore: number,
  setTotalScore: (score: number) => void,
) => {
  if (isFinished) return

  handleTimer(settings.measureTime, startTime, setStartTime)

  const finished = shouldFinishGame(
    revealedCards.length,
    cardsToReveal,
    settings.measureTime,
    startTime,
    setIsFinished,
    setElapsedTime,
  )

  if (!finished && revealedCards.length < cardsToReveal) {
    revealNextCard(deck, revealedCards, setRevealedCards, totalScore, setTotalScore)
  }
}

export const useDoppelkopfGame = (settings: GameSettings) => {
  const [deck, setDeck] = useState<Card[]>([])
  const [revealedCards, setRevealedCards] = useState<Card[]>([])
  const [totalScore, setTotalScore] = useState<number>(0)
  const [isFinished, setIsFinished] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [cardsToReveal, setCardsToReveal] = useState(20)
  const [hintsUsed, setHintsUsed] = useState<number>(0)
  const { survivalState, recordCorrectAnswer, recordIncorrectAnswer } = useSurvivalMode()

  const resetGame = useCallback(() => {
    resetGameState(
      settings, survivalState.currentDifficulty, setCardsToReveal, setDeck,
      setRevealedCards, setTotalScore, setIsFinished, setStartTime, setElapsedTime, setHintsUsed,
    )
  }, [settings, survivalState.currentDifficulty])

  useEffect(() => {
    resetGame()
  }, [resetGame])

  const handleCardClick = useCallback(() => {
    processCardClick(
      isFinished, settings, startTime, setStartTime, revealedCards, cardsToReveal,
      setIsFinished, setElapsedTime, deck, setRevealedCards, totalScore, setTotalScore,
    )
  }, [isFinished, settings, startTime, revealedCards, cardsToReveal, deck, totalScore])

  const useHint = useCallback(() => setHintsUsed(prev => prev + 1), [])
  const handleSurvivalResult = useCallback((isCorrect: boolean) => {
    if (settings.gameMode === 'survival') isCorrect ? recordCorrectAnswer() : recordIncorrectAnswer()
  }, [settings.gameMode, recordCorrectAnswer, recordIncorrectAnswer])

  return {
    currentCard: getCurrentCard(revealedCards), isFinished, totalScore, elapsedTime,
    handleCardClick, resetGame, revealedCards, cardsToReveal, hintsUsed, useHint, handleSurvivalResult,
  }
}
