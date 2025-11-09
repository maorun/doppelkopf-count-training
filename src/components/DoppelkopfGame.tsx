// src/components/DoppelkopfGame.tsx
import React from 'react'
import { useDoppelkopfGame } from '../hooks/useDoppelkopfGame'
import { useSettings } from '../hooks/useSettings'
import { Card, Suit } from '../lib/doppelkopf'
import { SettingsModal } from './SettingsModal'
import { Button } from './ui/button'

const getSuitSymbol = (suit: Suit): string => {
  switch (suit) {
    case 'Herz':
      return '♥'
    case 'Pik':
      return '♠'
    case 'Kreuz':
      return '♣'
    case 'Karo':
      return '♦'
  }
}

const isRedSuit = (suit: Suit): boolean => {
  return suit === 'Herz' || suit === 'Karo'
}

const GameScreen: React.FC<{
  currentCard: Card | null
  handleCardClick: () => void
}> = ({ currentCard, handleCardClick }) => (
  <div
    className="w-64 h-96 bg-white rounded-lg shadow-lg flex items-center justify-center cursor-pointer"
    onClick={handleCardClick}
    role="button"
    data-testid="game-card"
  >
    {currentCard ? (
      <div
        className="w-full h-full p-4 flex flex-col justify-between animate-fade-in-slow"
        key={currentCard.suit + currentCard.rank}
      >
        <span className={`text-2xl font-bold ${isRedSuit(currentCard.suit) ? 'text-red-600' : ''}`}>{currentCard.rank}</span>
        <span className={`text-4xl self-center ${isRedSuit(currentCard.suit) ? 'text-red-600' : ''}`}>{getSuitSymbol(currentCard.suit)}</span>
        <span className={`text-2xl font-bold self-end transform rotate-180 ${isRedSuit(currentCard.suit) ? 'text-red-600' : ''}`}>{currentCard.rank}</span>
      </div>
    ) : (
      <div data-testid="card-back" className="w-full h-full bg-blue-500 rounded-lg border-4 border-white"></div>
    )}
  </div>
)

const GameOverScreen: React.FC<{
  totalScore: number
  elapsedTime: number
  resetGame: () => void
}> = ({ totalScore, elapsedTime, resetGame }) => (
  <div className="text-center">
    <h2 className="text-2xl font-bold">Game Over</h2>
    <p className="text-xl">
      Total Score:
      {' '}
      {totalScore}
    </p>
    <p className="text-lg">
      Time:
      {' '}
      {(elapsedTime / 1000).toFixed(2)}
      s
    </p>
    <button
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      onClick={resetGame}
    >
      Repeat
    </button>
  </div>
)

const DoppelkopfGame: React.FC = () => {
  const { settings, setSettings } = useSettings()
  const {
    currentCard,
    isFinished,
    totalScore,
    elapsedTime,
    handleCardClick,
    resetGame,
    revealedCards,
    cardsToReveal,
  } = useDoppelkopfGame(settings)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Doppelkopf Game</h1>
      {isFinished ? (
        <GameOverScreen totalScore={totalScore} elapsedTime={elapsedTime} resetGame={resetGame} />
      ) : (
        <>
          <GameScreen currentCard={currentCard} handleCardClick={handleCardClick} />
          <p className="text-xl mt-4">
            Card
            {' '}
            {revealedCards.length}
            {' '}
            of
            {' '}
            {cardsToReveal}
          </p>
          <div className="mt-4">
            <SettingsModal settings={settings} setSettings={setSettings}>
              <Button>Settings</Button>
            </SettingsModal>
          </div>
        </>
      )}
    </div>
  )
}

export default DoppelkopfGame
