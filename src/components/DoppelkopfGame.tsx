// src/components/DoppelkopfGame.tsx
import React, { useState, useEffect } from 'react'
import { useDoppelkopfGame } from '../hooks/useDoppelkopfGame'
import { useSettings } from '../hooks/useSettings'
import { useHighscores } from '../hooks/useHighscores'
import { useStatistics } from '../hooks/useStatistics'
import { useSurvivalMode } from '../hooks/useSurvivalMode'
import { useTimedChallenge } from '../hooks/useTimedChallenge'
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
import { TimedChallengeInfo } from './TimedChallengeInfo'
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
  <button
    type="button"
    className={getCardContainerClasses(cardDesign.style)}
    onClick={handleCardClick}
    aria-label={currentCard ? 'Aufgedeckte Karte anzeigen' : 'Nächste Karte aufdecken'}
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
  </button>
)

/* eslint-disable max-lines-per-function, complexity */
const DoppelkopfGame: React.FC = () => {
  const { settings, setSettings } = useSettings()
  const { addHighscore, getTop, clearHighscores, highscores } = useHighscores()
  const [showHighscores, setShowHighscores] = useState(false)
  const { statistics, recentTrend } = useStatistics(highscores)
  const { survivalState, startSurvival } = useSurvivalMode()
  const { timedChallengeState, startChallenge, endChallenge, resetChallenge } = useTimedChallenge(
    settings.timedChallenge.timeLimitSeconds,
  )
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

  const handleStartTimedChallenge = () => {
    startChallenge()
    resetGame()
  }

  const handleTimedChallengeReset = () => {
    resetChallenge()
    resetGame()
  }

  // Auto-end game when time runs out in timed challenge mode
  useEffect(() => {
    if (settings.gameMode === 'timed-challenge' && timedChallengeState.isTimeUp && !isFinished) {
      // Time is up - force finish the game
      endChallenge()
    }
  }, [settings.gameMode, timedChallengeState.isTimeUp, isFinished, endChallenge])

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="w-full bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            🃏 Doppelkopf Training
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col items-center gap-4">
        {settings.gameMode === 'survival' && survivalState.isActive && (
          <SurvivalInfo
            currentStreak={survivalState.currentStreak}
            longestStreak={survivalState.longestStreak}
            currentDifficulty={survivalState.currentDifficulty}
          />
        )}

        {settings.gameMode === 'survival' && !survivalState.isActive && !isFinished && (
          <div className="text-center space-y-3">
            <p className="text-base text-gray-700 dark:text-gray-300">
              Ready for Survival Mode?
            </p>
            <Button onClick={handleStartSurvival} size="lg">
              Start Survival Mode
            </Button>
          </div>
        )}

        {settings.gameMode === 'timed-challenge' && timedChallengeState.isActive && !isFinished && (
          <TimedChallengeInfo
            timeRemaining={timedChallengeState.timeRemaining}
            difficultyLevel={settings.timedChallenge.difficultyLevel}
            cardsToReveal={cardsToReveal}
          />
        )}

        {settings.gameMode === 'timed-challenge' && !timedChallengeState.isActive && !isFinished && (
          <div className="text-center space-y-3">
            <p className="text-base text-gray-700 dark:text-gray-300">
              Ready for Timed Challenge?
            </p>
            <Button onClick={handleStartTimedChallenge} size="lg">
              Start Timed Challenge
            </Button>
          </div>
        )}

        <div className="w-full flex flex-col items-center">
          {isFinished ? (
            <div className="w-full max-w-sm">
              <GameOverScreen
                totalScore={totalScore}
                elapsedTime={elapsedTime}
                cardsCount={cardsToReveal}
                timeWasMeasured={settings.measureTime}
                resetGame={settings.gameMode === 'timed-challenge' ? handleTimedChallengeReset : resetGame}
                onHighscoreSubmit={addHighscore}
                hintsUsed={hintsUsed}
                onSurvivalResult={handleSurvivalResult}
                isSurvivalMode={settings.gameMode === 'survival'}
                isTimedChallenge={settings.gameMode === 'timed-challenge'}
                timeRanOut={settings.gameMode === 'timed-challenge' && timedChallengeState.isTimeUp}
              />
            </div>
          ) : (
            <>
              <GameScreen
                currentCard={currentCard}
                handleCardClick={handleCardClick}
                cardDesign={settings.cardDesign}
              />
              <p className="text-base sm:text-lg mt-3 text-center font-medium text-gray-600 dark:text-gray-400">
                Card
                {' '}
                <span className="font-bold text-gray-900 dark:text-gray-100">{revealedCards.length}</span>
                {' '}
                of
                {' '}
                <span className="font-bold text-gray-900 dark:text-gray-100">{cardsToReveal}</span>
              </p>
              <div className="mt-3 grid grid-cols-2 sm:flex sm:flex-wrap gap-2 justify-center w-full">
                <TutorialModal>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">Tutorial</Button>
                </TutorialModal>
                <SettingsModal settings={settings} setSettings={setSettings}>
                  <Button size="sm" className="w-full sm:w-auto">Settings</Button>
                </SettingsModal>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => setShowHighscores(!showHighscores)}
                >
                  {showHighscores ? 'Hide Stats' : 'Show Stats'}
                </Button>
                <HintDialog
                  revealedCards={revealedCards}
                  totalScore={totalScore}
                  onHintUsed={useHint}
                >
                  <Button variant="secondary" size="sm" className="w-full sm:w-auto" disabled={revealedCards.length === 0}>
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
              </div>
            </>
          )}
        </div>

        {showHighscores && (
          <div className="w-full">
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
      </main>
    </div>
  )
}

export default DoppelkopfGame
