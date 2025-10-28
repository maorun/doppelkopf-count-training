// src/components/DoppelkopfGame.tsx
import React from 'react'
import { useDoppelkopfGame } from '../hooks/useDoppelkopfGame'
import { Suit } from '../lib/doppelkopf'

// Helper function to get the suit symbol
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

const DoppelkopfGame: React.FC = () => {
  const {
    currentCard,
    isFinished,
    totalScore,
    handleCardClick,
  } = useDoppelkopfGame()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Doppelkopf Game</h1>
      <div
        className="w-64 h-96 bg-white rounded-lg shadow-lg flex items-center justify-center cursor-pointer"
        onClick={handleCardClick}
        role="button"
      >
        {!isFinished ? (
          currentCard ? (
            <div className="w-full h-full p-4 flex flex-col justify-between">
              <span className="text-2xl font-bold">{currentCard.rank}</span>
              <span className="text-4xl self-center">{getSuitSymbol(currentCard.suit)}</span>
              <span className="text-2xl font-bold self-end transform rotate-180">{currentCard.rank}</span>
            </div>
          ) : (
            <div data-testid="card-back" className="w-full h-full bg-blue-500 rounded-lg border-4 border-white"></div>
          )
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold">Game Over</h2>
            <p className="text-xl">
              Total Score:
              {' '}
              {totalScore}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoppelkopfGame
