// src/hooks/useDoppelkopfGame.ts
import { useState, useEffect, useCallback } from 'react'
import { Card, createDeck, shuffleDeck } from '../lib/doppelkopf'
import { GameSettings } from './useSettings'

export const useDoppelkopfGame = (settings: GameSettings) => {
  const [deck, setDeck] = useState<Card[]>([])
  const [revealedCards, setRevealedCards] = useState<Card[]>([])
  const [totalScore, setTotalScore] = useState<number>(0)
  const [isFinished, setIsFinished] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [cardsToReveal, setCardsToReveal] = useState(20)

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
  }, [settings])

  useEffect(() => {
    resetGame()
  }, [resetGame])

  const handleCardClick = () => {
    if (isFinished) return

    if (settings.measureTime && startTime === null) {
      setStartTime(Date.now())
    }

    if (revealedCards.length >= cardsToReveal - 1) {
      setIsFinished(true)
      if (settings.measureTime && startTime) {
        setElapsedTime(Date.now() - startTime)
      }
    }

    if (revealedCards.length < cardsToReveal) {
      const nextCard = deck[revealedCards.length]
      setRevealedCards([...revealedCards, nextCard])
      setTotalScore(totalScore + nextCard.value)
    }
  }

  const currentCard = revealedCards.length > 0 ? revealedCards[revealedCards.length - 1] : null

  return {
    currentCard,
    isFinished,
    totalScore,
    elapsedTime,
    handleCardClick,
    resetGame,
    revealedCards,
    cardsToReveal,
  }
}
