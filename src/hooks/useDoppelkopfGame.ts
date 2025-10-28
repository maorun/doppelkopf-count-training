// src/hooks/useDoppelkopfGame.ts
import { useState, useEffect } from 'react'
import { Card, createDeck, shuffleDeck } from '../lib/doppelkopf'

export const useDoppelkopfGame = () => {
  const [deck, setDeck] = useState<Card[]>([])
  const [revealedCards, setRevealedCards] = useState<Card[]>([])
  const [totalScore, setTotalScore] = useState<number>(0)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    setDeck(shuffleDeck(createDeck()))
  }, [])

  const handleCardClick = () => {
    if (revealedCards.length >= 20) {
      setIsFinished(true)
      return
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
    handleCardClick,
  }
}
