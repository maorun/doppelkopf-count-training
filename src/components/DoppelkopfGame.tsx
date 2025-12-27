// src/components/DoppelkopfGame.tsx
import React, { useState } from 'react'
import { useDoppelkopfGame } from '../hooks/useDoppelkopfGame'
import { useSettings } from '../hooks/useSettings'
import { useHighscores } from '../hooks/useHighscores'
import { useStatistics } from '../hooks/useStatistics'
import { useSurvivalMode } from '../hooks/useSurvivalMode'
import { Card, Suit } from '../lib/doppelkopf'
import { CardDesignOptions } from '../lib/card-design'
import {
  getCardContainerClasses,
  getCardBackClasses,
  getSuitColorClasses,
  getTextSizeClasses,
  getCardContentClasses,
} from '../lib/card-design-utils'
import { SettingsModal } from './SettingsModal'
import { Button } from './ui/button'
import { GameOverScreen } from './GameOverScreen'
import { HighscoreList } from './HighscoreList'
import { StatisticsView } from './StatisticsView'
import { SurvivalInfo } from './SurvivalInfo'
import { SurvivalStatsView } from './SurvivalStatsView'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { ThemeToggle } from './ThemeToggle'
import { TutorialModal } from './TutorialModal'
import { HintDialog } from './HintDialog'

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

const GameScreen: React.FC<{
  currentCard: Card | null
  handleCardClick: () => void
  cardDesign: CardDesignOptions
}> = ({ currentCard, handleCardClick, cardDesign }) => (
  <div
    className={getCardContainerClasses(cardDesign.style)}
    onClick={handleCardClick}
    role="button"
    data-testid="game-card"
  >
    {currentCard ? (
      <div
        className={getCardContentClasses(cardDesign.style)}
        key={currentCard.suit + currentCard.rank}
      >
        <span
          className={`${getTextSizeClasses('small', cardDesign.accessibility)} font-bold ${getSuitColorClasses(
            currentCard.suit,
            cardDesign.colorScheme,
            cardDesign.accessibility,
          )}`}
        >
          {currentCard.rank}
        </span>
        <span
          className={`${getTextSizeClasses('medium', cardDesign.accessibility)} self-center ${getSuitColorClasses(
            currentCard.suit,
            cardDesign.colorScheme,
            cardDesign.accessibility,
          )}`}
        >
          {getSuitSymbol(currentCard.suit)}
        </span>
        <span
          className={`${getTextSizeClasses('small', cardDesign.accessibility)} font-bold self-end transform rotate-180 ${getSuitColorClasses(
            currentCard.suit,
            cardDesign.colorScheme,
            cardDesign.accessibility,
          )}`}
        >
          {currentCard.rank}
        </span>
      </div>
    ) : (
      <div data-testid="card-back" className={getCardBackClasses(cardDesign.style)}></div>
    )}
  </div>
)

/* eslint-disable max-lines-per-function, complexity */
const DoppelkopfGame: React.FC = () => {
  const { settings, setSettings } = useSettings()
  const { addHighscore, getTop, clearHighscores, highscores } = useHighscores()
  const [showHighscores, setShowHighscores] = useState(false)
  const { statistics, recentTrend } = useStatistics(highscores)
  const { survivalState, startSurvival } = useSurvivalMode()
  const {
    currentCard,
    isFinished,
    totalScore,
    elapsedTime,
    handleCardClick,
    resetGame,
    revealedCards,
    cardsToReveal,
    hintsUsed,
    useHint,
    handleSurvivalResult,
  } = useDoppelkopfGame(settings)

  const topHighscores = getTop(10)

  const handleStartSurvival = () => {
    startSurvival()
    resetGame()
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 py-8 transition-colors">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">Doppelkopf Game</h1>

      {settings.gameMode === 'survival' && survivalState.isActive && (
        <SurvivalInfo
          currentStreak={survivalState.currentStreak}
          longestStreak={survivalState.longestStreak}
          currentDifficulty={survivalState.currentDifficulty}
        />
      )}

      {settings.gameMode === 'survival' && !survivalState.isActive && !isFinished && (
        <div className="mb-8 text-center">
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
            Ready for Survival Mode?
          </p>
          <Button onClick={handleStartSurvival} size="lg">
            Start Survival Mode
          </Button>
        </div>
      )}

      <div className="mb-8">
        {isFinished ? (
          <GameOverScreen
            totalScore={totalScore}
            elapsedTime={elapsedTime}
            cardsCount={cardsToReveal}
            timeWasMeasured={settings.measureTime}
            resetGame={resetGame}
            onHighscoreSubmit={addHighscore}
            hintsUsed={hintsUsed}
            onSurvivalResult={handleSurvivalResult}
            isSurvivalMode={settings.gameMode === 'survival'}
          />
        ) : (
          <>
            <GameScreen currentCard={currentCard} handleCardClick={handleCardClick} cardDesign={settings.cardDesign} />
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
              <HintDialog
                revealedCards={revealedCards}
                totalScore={totalScore}
                onHintUsed={useHint}
              >
                <Button variant="secondary" disabled={revealedCards.length === 0}>
                  Hint
                  {hintsUsed > 0 && (
                    <span className="ml-1 text-xs">
                      (
                      {hintsUsed}
                      )
                    </span>
                  )}
                </Button>
              </HintDialog>
              <ThemeToggle />
            </div>
          </>
        )}
      </div>

      {showHighscores && (
        <div className="w-full max-w-6xl px-4">
          <Tabs defaultValue="statistics" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
              <TabsTrigger value="highscores">Highscores</TabsTrigger>
              <TabsTrigger value="survival">Survival</TabsTrigger>
            </TabsList>
            <TabsContent value="statistics">
              <StatisticsView statistics={statistics} recentTrend={recentTrend} />
            </TabsContent>
            <TabsContent value="highscores">
              <HighscoreList highscores={topHighscores} onClear={clearHighscores} />
            </TabsContent>
            <TabsContent value="survival">
              <SurvivalStatsView />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

export default DoppelkopfGame
