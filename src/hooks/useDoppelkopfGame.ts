// src/hooks/useDoppelkopfGame.ts
import { useState, useEffect, useCallback } from 'react'
import { Card, createDeck, shuffleDeck } from '../lib/doppelkopf'

export const useDoppelkopfGame = () => {
  const [deck, setDeck] = useState<Card[]>([])
  const [revealedCards, setRevealedCards] = useState<Card[]>([])
  const [totalScore, setTotalScore] = useState<number>(0)
  const [isFinished, setIsFinished] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState<number>(0)

  const resetGame = useCallback(() => {
    setDeck(shuffleDeck(createDeck()))
    setRevealedCards([])
    setTotalScore(0)
    setIsFinished(false)
    setStartTime(null)
    setElapsedTime(0)
  }, [])

  useEffect(() => {
    resetGame()
  }, [resetGame])

  const handleCardClick = () => {
    if (isFinished) return

    if (startTime === null) {
      setStartTime(Date.now())
    }

    if (revealedCards.length >= 19) {
      setIsFinished(true)
      if (startTime) {
        setElapsedTime(Date.now() - startTime)
      }
    }

    const nextCard = deck[revealedCards.length]
    setRevealedCards([...revealedCards, nextCard])
    setTotalScore(totalScore + nextCard.value)
  }

  const currentCard = revealedCards.length > 0 ? revealedCards[revealedCards.length - 1] : null

  return {
    currentCard,
    isFinished,
    totalScore,
    elapsedTime,
    handleCardClick,
    resetGame,
  }
}
