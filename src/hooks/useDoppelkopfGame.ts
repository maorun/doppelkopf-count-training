import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { Card, createDeck, shuffleDeck } from '../lib/doppelkopf'
import { GameSettings } from './useSettings'

const TIMED_CHALLENGE_CARD_COUNTS = { easy: 15, medium: 25, hard: 35 } as const

const normalizeCardCount = (count: number, maxCards: number): number => {
  if (!Number.isFinite(count)) return maxCards
  return Math.min(Math.max(Math.floor(count), 1), maxCards)
}

const calculateCardsToReveal = (
  gameMode: GameSettings['gameMode'],
  cardCountRange: [number, number],
  survivalDifficulty: number,
  timedChallengeDifficulty: GameSettings['timedChallenge']['difficultyLevel'],
  maxCards: number,
): number => {
  if (gameMode === 'survival') return normalizeCardCount(survivalDifficulty, maxCards)

  if (gameMode === 'timed-challenge') {
    return TIMED_CHALLENGE_CARD_COUNTS[timedChallengeDifficulty] ?? TIMED_CHALLENGE_CARD_COUNTS.medium
  }

  const min = normalizeCardCount(cardCountRange[0], maxCards)
  const max = Math.max(min, normalizeCardCount(cardCountRange[1], maxCards))
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getCompletedElapsedTime = (
  measureTime: boolean,
  startTime: number | null,
  completedAt: number,
): number | null => (measureTime && startTime !== null ? completedAt - startTime : null)

const getCurrentCard = (revealedCards: Card[]): Card | null => revealedCards.at(-1) ?? null

const getRevealTiming = (startTime: number | null): [number, number] => {
  const revealedAt = Date.now()
  return [revealedAt, startTime ?? revealedAt]
}

const getCardScore = (
  card: Card,
  countedRanks: GameSettings['countedRanks'],
  countedSuits: GameSettings['countedSuits'],
): number => (
  countedRanks.includes(card.rank) && countedSuits.includes(card.suit) ? card.value : 0
)

const isLastCard = (revealedCardsCount: number, cardsToReveal: number): boolean => (
  revealedCardsCount + 1 >= cardsToReveal
)

const getInitialScore = (
  deck: Card[],
  cardsToReveal: number,
  settings: GameSettings,
): number => {
  if (settings.countingMode === 'count-up') return 0

  return deck
    .slice(0, cardsToReveal)
    .reduce((score, card) => score + getCardScore(card, settings.countedRanks, settings.countedSuits), 0)
}

const updateScore = (
  score: number,
  cardScore: number,
  countingMode: GameSettings['countingMode'],
): number => (countingMode === 'count-down' ? score - cardScore : score + cardScore)

type StateSetter<T> = Dispatch<SetStateAction<T>>

const resetGameState = (
  settings: GameSettings,
  survivalDifficulty: number,
  setCardsToReveal: StateSetter<number>,
  setDeck: StateSetter<Card[]>,
  setRevealedCards: StateSetter<Card[]>,
  setTotalScore: StateSetter<number>,
  setIsFinished: StateSetter<boolean>,
  setStartTime: StateSetter<number | null>,
  setElapsedTime: StateSetter<number>,
  setHintsUsed: StateSetter<number>,
): void => {
  const newDeck = shuffleDeck(createDeck(settings.includeNines))
  const newCardsToReveal = calculateCardsToReveal(
    settings.gameMode,
    settings.cardCountRange,
    survivalDifficulty,
    settings.timedChallenge.difficultyLevel,
    newDeck.length,
  )

  setCardsToReveal(newCardsToReveal)
  setDeck(newDeck)
  setRevealedCards([])
  setTotalScore(getInitialScore(newDeck, newCardsToReveal, settings))
  setIsFinished(false)
  setStartTime(null)
  setElapsedTime(0)
  setHintsUsed(0)
}

export const useDoppelkopfGame = (settings: GameSettings, survivalDifficulty = 15) => {
  const [deck, setDeck] = useState<Card[]>([])
  const [revealedCards, setRevealedCards] = useState<Card[]>([])
  const [totalScore, setTotalScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [cardsToReveal, setCardsToReveal] = useState(20)
  const [hintsUsed, setHintsUsed] = useState(0)
  const finishGame = useCallback(() => {
    setIsFinished(true)
    if (settings.measureTime && startTime !== null) {
      setElapsedTime(Date.now() - startTime)
    }
  }, [settings.measureTime, startTime])

  const resetGame = useCallback(() => {
    resetGameState(
      settings, survivalDifficulty, setCardsToReveal, setDeck, setRevealedCards,
      setTotalScore, setIsFinished, setStartTime, setElapsedTime, setHintsUsed,
    )
  }, [settings, survivalDifficulty])

  useEffect(() => {
    resetGame()
  }, [resetGame])

  const completeGameAt = useCallback((completedAt: number, gameStartTime: number) => {
    setIsFinished(true)
    const completedElapsedTime = getCompletedElapsedTime(settings.measureTime, gameStartTime, completedAt)
    if (completedElapsedTime !== null) setElapsedTime(completedElapsedTime)
  }, [settings.measureTime])

  const handleCardClick = useCallback(() => {
    if (isFinished || revealedCards.length >= cardsToReveal) return
    const nextCard = deck[revealedCards.length]
    if (!nextCard) return

    const [revealedAt, gameStartTime] = getRevealTiming(startTime)
    if (settings.measureTime && startTime === null) setStartTime(gameStartTime)

    setRevealedCards(previousCards => [...previousCards, nextCard])
    const scoreChange = getCardScore(nextCard, settings.countedRanks, settings.countedSuits)
    setTotalScore(previousScore => updateScore(previousScore, scoreChange, settings.countingMode))

    if (isLastCard(revealedCards.length, cardsToReveal)) {
      completeGameAt(revealedAt, gameStartTime)
    }
  }, [cardsToReveal, completeGameAt, deck, isFinished, revealedCards.length,
    settings, startTime])

  const useHint = useCallback(() => setHintsUsed(previousHints => previousHints + 1), [])

  return { currentCard: getCurrentCard(revealedCards), isFinished, totalScore, elapsedTime,
    handleCardClick, finishGame, resetGame, revealedCards, cardsToReveal, hintsUsed, useHint }
}
