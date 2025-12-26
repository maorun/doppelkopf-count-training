// src/components/DoppelkopfGame.tsx
import React, { useState } from 'react'
import { useDoppelkopfGame } from '../hooks/useDoppelkopfGame'
import { useSettings } from '../hooks/useSettings'
import { useHighscores } from '../hooks/useHighscores'
import { useStatistics } from '../hooks/useStatistics'
import { Card, Suit } from '../lib/doppelkopf'
import { SettingsModal } from './SettingsModal'
import { Button } from './ui/button'
import { GameOverScreen } from './GameOverScreen'
import { HighscoreList } from './HighscoreList'
import { StatisticsView } from './StatisticsView'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { ThemeToggle } from './ThemeToggle'
import { TutorialModal } from './TutorialModal'

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
    className="w-64 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center cursor-pointer transition-colors"
    onClick={handleCardClick}
    role="button"
    data-testid="game-card"
  >
    {currentCard ? (
      <div
        className="w-full h-full p-4 flex flex-col justify-between animate-fade-in-slow"
        key={currentCard.suit + currentCard.rank}
      >
        <span className={`text-2xl font-bold ${isRedSuit(currentCard.suit) ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>{currentCard.rank}</span>
        <span className={`text-4xl self-center ${isRedSuit(currentCard.suit) ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>{getSuitSymbol(currentCard.suit)}</span>
        <span className={`text-2xl font-bold self-end transform rotate-180 ${isRedSuit(currentCard.suit) ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>{currentCard.rank}</span>
      </div>
    ) : (
      <div data-testid="card-back" className="w-full h-full bg-blue-500 dark:bg-blue-700 rounded-lg border-4 border-white dark:border-gray-600 transition-colors"></div>
    )}
  </div>
)

/* eslint-disable max-lines-per-function */
const DoppelkopfGame: React.FC = () => {
  const { settings, setSettings } = useSettings()
  const { addHighscore, getTop, clearHighscores, highscores } = useHighscores()
  const [showHighscores, setShowHighscores] = useState(false)
  const { statistics, recentTrend } = useStatistics(highscores)
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

  const topHighscores = getTop(10)

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 py-8 transition-colors">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">Doppelkopf Game</h1>

      <div className="mb-8">
        {isFinished ? (
          <GameOverScreen
            totalScore={totalScore}
            elapsedTime={elapsedTime}
            cardsCount={cardsToReveal}
            timeWasMeasured={settings.measureTime}
            resetGame={resetGame}
            onHighscoreSubmit={addHighscore}
          />
        ) : (
          <>
            <GameScreen currentCard={currentCard} handleCardClick={handleCardClick} />
            <p className="text-xl mt-4 text-center text-gray-900 dark:text-gray-100">
              Card
              {' '}
              {revealedCards.length}
              {' '}
              of
              {' '}
              {cardsToReveal}
            </p>
            <div className="mt-4 flex gap-2 justify-center">
              <TutorialModal>
                <Button variant="outline">Tutorial</Button>
              </TutorialModal>
              <SettingsModal settings={settings} setSettings={setSettings}>
                <Button>Settings</Button>
              </SettingsModal>
              <Button
                variant="outline"
                onClick={() => setShowHighscores(!showHighscores)}
              >
                {showHighscores ? 'Hide Stats' : 'Show Stats'}
              </Button>
              <ThemeToggle />
            </div>
          </>
        )}
      </div>

      {showHighscores && (
        <div className="w-full max-w-6xl px-4">
          <Tabs defaultValue="statistics" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
              <TabsTrigger value="highscores">Highscores</TabsTrigger>
            </TabsList>
            <TabsContent value="statistics">
              <StatisticsView statistics={statistics} recentTrend={recentTrend} />
            </TabsContent>
            <TabsContent value="highscores">
              <HighscoreList highscores={topHighscores} onClear={clearHighscores} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

export default DoppelkopfGame
