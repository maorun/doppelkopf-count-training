// src/hooks/useDoppelkopfGame.ts
import { useState, useEffect, useCallback } from 'react'
import { Card, createDeck, shuffleDeck } from '../lib/doppelkopf'
import { GameSettings } from './useSettings'

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

export const useDoppelkopfGame = (settings: GameSettings) => {
  const [deck, setDeck] = useState<Card[]>([])
  const [revealedCards, setRevealedCards] = useState<Card[]>([])
  const [totalScore, setTotalScore] = useState<number>(0)
  const [isFinished, setIsFinished] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [cardsToReveal, setCardsToReveal] = useState(20)
  const [hintsUsed, setHintsUsed] = useState<number>(0)

  const resetGame = useCallback(() => {
    const [min, max] = settings.cardCountRange
    const newCardsToReveal = Math.floor(Math.random() * (max - min + 1)) + min
    setCardsToReveal(newCardsToReveal)
    setDeck(shuffleDeck(createDeck(settings.includeNines)))
    setRevealedCards([])
    setTotalScore(0)
    setIsFinished(false)
    setStartTime(null)
    setElapsedTime(0)
    setHintsUsed(0)
  }, [settings])

  useEffect(() => {
    resetGame()
  }, [resetGame])

  const handleCardClick = () => {
    if (isFinished) return

    handleTimer(settings.measureTime, startTime, setStartTime)

    if (revealedCards.length >= cardsToReveal - 1) {
      setIsFinished(true)
      if (settings.measureTime && startTime) setElapsedTime(Date.now() - startTime)
    }

    if (revealedCards.length < cardsToReveal) {
      revealNextCard(deck, revealedCards, setRevealedCards, totalScore, setTotalScore)
    }
  }

  const useHint = useCallback(() => setHintsUsed(prev => prev + 1), [])

  return {
    currentCard: revealedCards.length > 0 ? revealedCards[revealedCards.length - 1] : null,
    isFinished,
    totalScore,
    elapsedTime,
    handleCardClick,
    resetGame,
    revealedCards,
    cardsToReveal,
    hintsUsed,
    useHint,
  }
}
