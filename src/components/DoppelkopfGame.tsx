// src/components/DoppelkopfGame.tsx
import React, { useState, useEffect } from 'react'
import { useDoppelkopfGame } from '../hooks/useDoppelkopfGame'
import { useSettings, GameSettings } from '../hooks/useSettings'
import { useHighscores } from '../hooks/useHighscores'
import { useStatistics } from '../hooks/useStatistics'
import { useSurvivalMode, SurvivalState } from '../hooks/useSurvivalMode'
import { useTimedChallenge, TimedChallengeState } from '../hooks/useTimedChallenge'
import { useTeamPlay } from '../hooks/useTeamPlay'
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
import { TeamPlayInfo } from './TeamPlayInfo'
import { GameProgressBar } from './GameProgressBar'
import { MobileBottomNav, NavTab } from './MobileBottomNav'
import { Lightbulb } from 'lucide-react'

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

const RunningTotal: React.FC<{
  totalScore: number
  isCountdown: boolean
}> = ({ totalScore, isCountdown }) => (
  <p
    className="text-sm sm:text-base text-center font-medium text-blue-800 dark:text-blue-200 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900 mt-2"
    role="status"
    aria-live="polite"
  >
    {isCountdown ? 'Remaining total:' : 'Running total:'}
    {' '}
    <span className="font-bold">{totalScore}</span>
  </p>
)

const CardFace: React.FC<{
  currentCard: Card
  cardDesign: CardDesignOptions
}> = ({ currentCard, cardDesign }) => (
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
)

const GameScreen: React.FC<{
  currentCard: Card | null
  handleCardClick: () => void
  cardDesign: CardDesignOptions
  isDisabled: boolean
}> = ({ currentCard, handleCardClick, cardDesign, isDisabled }) => (
  <button
    type="button"
    className={getCardContainerClasses(cardDesign.style)}
    onClick={handleCardClick}
    disabled={isDisabled}
    aria-label={currentCard ? 'Aufgedeckte Karte anzeigen' : 'Nächste Karte aufdecken'}
    data-testid="game-card"
  >
    {currentCard ? (
      <CardFace currentCard={currentCard} cardDesign={cardDesign} />
    ) : (
      <div data-testid="card-back" className={getCardBackClasses(cardDesign.style)}></div>
    )}
  </button>
)

const ModeStartSection: React.FC<{
  settings: GameSettings
  survivalState: SurvivalState
  timedChallengeState: TimedChallengeState
  isFinished: boolean
  onStartSurvival: () => void
  onStartTimedChallenge: () => void
}> = ({ settings, survivalState, timedChallengeState, isFinished, onStartSurvival, onStartTimedChallenge }) => {
  if (settings.gameMode === 'survival' && !survivalState.isActive && !isFinished) {
    return (
      <div className="text-center space-y-3 py-2">
        <p className="text-base text-gray-700 dark:text-gray-300 font-medium">Ready for Survival Mode?</p>
        <Button onClick={onStartSurvival} size="lg" className="rounded-xl shadow-md">
          Start Survival Mode
        </Button>
      </div>
    )
  }
  if (settings.gameMode === 'timed-challenge' && !timedChallengeState.isActive && !isFinished) {
    return (
      <div className="text-center space-y-3 py-2">
        <p className="text-base text-gray-700 dark:text-gray-300 font-medium">Ready for Timed Challenge?</p>
        <Button onClick={onStartTimedChallenge} size="lg" className="rounded-xl shadow-md">
          Start Timed Challenge
        </Button>
      </div>
    )
  }
  return null
}

const ActiveModeInfo: React.FC<{
  settings: GameSettings
  survivalState: SurvivalState
  timedChallengeState: TimedChallengeState
  cardsToReveal: number
}> = ({ settings, survivalState, timedChallengeState, cardsToReveal }) => {
  if (settings.gameMode === 'survival' && survivalState.isActive) {
    return (
      <SurvivalInfo
        currentStreak={survivalState.currentStreak}
        longestStreak={survivalState.longestStreak}
        currentDifficulty={survivalState.currentDifficulty}
      />
    )
  }
  if (settings.gameMode === 'timed-challenge' && timedChallengeState.isActive) {
    return (
      <TimedChallengeInfo
        timeRemaining={timedChallengeState.timeRemaining}
        difficultyLevel={settings.timedChallenge.difficultyLevel}
        cardsToReveal={cardsToReveal}
      />
    )
  }
  return null
}

const SecondaryActionButtons: React.FC<{
  settings: GameSettings
  setSettings: (settings: GameSettings) => void
  showHighscores: boolean
  setShowHighscores: (show: boolean) => void
}> = ({ settings, setSettings, showHighscores, setShowHighscores }) => (
  <div className="grid grid-cols-3 gap-2">
    <TutorialModal>
      <Button variant="outline" size="sm" className="w-full rounded-lg text-xs sm:text-sm">
        Tutorial
      </Button>
    </TutorialModal>
    <SettingsModal settings={settings} setSettings={setSettings}>
      <Button variant="outline" size="sm" className="w-full rounded-lg text-xs sm:text-sm">
        Settings
      </Button>
    </SettingsModal>
    <Button
      variant="outline"
      size="sm"
      className="w-full rounded-lg text-xs sm:text-sm"
      onClick={() => setShowHighscores(!showHighscores)}
    >
      {showHighscores ? 'Hide Stats' : 'Show Stats'}
    </Button>
  </div>
)

const GameControls: React.FC<{
  settings: GameSettings
  setSettings: (settings: GameSettings) => void
  showHighscores: boolean
  setShowHighscores: (show: boolean) => void
  revealedCards: Card[]
  totalScore: number
  hintsUsed: number
  useHint: () => void
}> = ({
  settings,
  setSettings,
  showHighscores,
  setShowHighscores,
  revealedCards,
  totalScore,
  hintsUsed,
  useHint,
}) => (
  <div className="w-full max-w-sm mt-3 space-y-2.5">
    <HintDialog revealedCards={revealedCards} totalScore={totalScore} onHintUsed={useHint}>
      <Button
        variant="secondary"
        size="lg"
        className="w-full h-12 rounded-xl text-base font-semibold shadow-sm active:scale-95 flex items-center justify-center gap-2"
        disabled={revealedCards.length === 0}
      >
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <span>Hint</span>
        {hintsUsed > 0 && (
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold">
            (
            {hintsUsed}
            )
          </span>
        )}
      </Button>
    </HintDialog>

    <SecondaryActionButtons
      settings={settings}
      setSettings={setSettings}
      showHighscores={showHighscores}
      setShowHighscores={setShowHighscores}
    />
  </div>
)

const StatsSection: React.FC<{
  statsTab: string
  onTabChange: (value: string) => void
  onClose: () => void
  statistics: ReturnType<typeof useStatistics>['statistics']
  recentTrend: ReturnType<typeof useStatistics>['recentTrend']
  countingMode: GameSettings['countingMode']
  topHighscores: ReturnType<typeof useHighscores>['highscores']
  clearHighscores: () => void
}> = ({
  statsTab,
  onTabChange,
  onClose,
  statistics,
  recentTrend,
  countingMode,
  topHighscores,
  clearHighscores,
}) => (
  <div className="w-full space-y-4">
    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
      <h2 className="text-base sm:text-lg font-bold">Statistik & Highscores</h2>
      <Button variant="outline" size="sm" onClick={onClose}>
        Hide Stats
      </Button>
    </div>
    <Tabs value={statsTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="statistics">Statistics</TabsTrigger>
        <TabsTrigger value="highscores">Highscores</TabsTrigger>
        <TabsTrigger value="survival">Survival</TabsTrigger>
      </TabsList>
      <TabsContent value="statistics">
        <StatisticsView
          statistics={statistics}
          recentTrend={recentTrend}
          countingMode={countingMode}
        />
      </TabsContent>
      <TabsContent value="highscores">
        <HighscoreList highscores={topHighscores} onClear={clearHighscores} />
      </TabsContent>
      <TabsContent value="survival">
        <SurvivalStatsView />
      </TabsContent>
    </Tabs>
  </div>
)

/* eslint-disable max-lines-per-function, complexity */
const DoppelkopfGame: React.FC = () => {
  const { settings, setSettings } = useSettings()
  const { addHighscore, getTop, clearHighscores, highscores } = useHighscores()
  const [showHighscores, setShowHighscores] = useState(false)
  const [navTab, setNavTab] = useState<NavTab>('game')
  const [statsTab, setStatsTab] = useState<string>('statistics')
  const { statistics, recentTrend } = useStatistics(highscores)
  const { survivalState, startSurvival, recordCorrectAnswer, recordIncorrectAnswer } = useSurvivalMode()
  const { timedChallengeState, startChallenge, endChallenge, resetChallenge } = useTimedChallenge(
    settings.timedChallenge.timeLimitSeconds,
  )
  const {
    currentCard,
    isFinished,
    totalScore,
    elapsedTime,
    handleCardClick,
    finishGame,
    resetGame,
    revealedCards,
    cardsToReveal,
    hintsUsed,
    useHint,
  } = useDoppelkopfGame(settings, survivalState.currentDifficulty)

  const { players, activePlayer } = useTeamPlay(settings.teamPlay?.playerCount, revealedCards.length)
  const topHighscores = getTop(10)
  const isGameActive = settings.gameMode === 'single'
    || settings.gameMode === 'team-play'
    || survivalState.isActive
    || timedChallengeState.isActive
  const isCountdownMode = settings.countingMode === 'count-down'
  const shouldShowRunningTotal = (settings.autoShowRunningTotal || isCountdownMode)
    && (settings.gameMode === 'single' || settings.gameMode === 'team-play')
    && revealedCards.length > 0

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

  const handleSurvivalResult = (isCorrect: boolean) => {
    if (isCorrect) recordCorrectAnswer()
    else recordIncorrectAnswer()
  }

  const handleNavChange = (tab: NavTab) => {
    setNavTab(tab)
    if (tab === 'game') {
      setShowHighscores(false)
    }
    else {
      setShowHighscores(true)
      setStatsTab(tab)
    }
  }

  const handleStatsTabChange = (value: string) => {
    setStatsTab(value)
    if (value === 'highscores') {
      setNavTab('highscores')
    }
    else if (value === 'statistics') {
      setNavTab('statistics')
    }
  }

  const handleCloseStats = () => {
    setShowHighscores(false)
    setNavTab('game')
  }

  const handleToggleStats = (show: boolean) => {
    setShowHighscores(show)
    if (show) {
      setNavTab(statsTab === 'highscores' ? 'highscores' : 'statistics')
    }
    else {
      setNavTab('game')
    }
  }

  useEffect(() => {
    if (settings.gameMode === 'timed-challenge' && timedChallengeState.isTimeUp && !isFinished) {
      endChallenge()
      finishGame()
    }
  }, [endChallenge, finishGame, isFinished, settings.gameMode, timedChallengeState.isTimeUp])

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-16 sm:pb-8">
      {/* Header */}
      <header className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xs border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 pt-[env(safe-area-inset-top)]">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-xl font-bold tracking-tight">
              🃏 Doppelkopf Training
            </h1>
            <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
              {settings.gameMode}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-6 flex flex-col items-center justify-center">
        {navTab === 'game' && !showHighscores ? (
          <>
            <ActiveModeInfo
              settings={settings}
              survivalState={survivalState}
              timedChallengeState={timedChallengeState}
              cardsToReveal={cardsToReveal}
            />

            <ModeStartSection
              settings={settings}
              survivalState={survivalState}
              timedChallengeState={timedChallengeState}
              isFinished={isFinished}
              onStartSurvival={handleStartSurvival}
              onStartTimedChallenge={handleStartTimedChallenge}
            />

            <div className="w-full flex flex-col items-center">
              {isFinished ? (
                <div className="w-full max-w-sm">
                  <GameOverScreen
                    totalScore={totalScore}
                    isCountdownMode={isCountdownMode}
                    elapsedTime={elapsedTime}
                    cardsCount={cardsToReveal}
                    timeWasMeasured={settings.measureTime}
                    resetGame={settings.gameMode === 'timed-challenge' ? handleTimedChallengeReset : resetGame}
                    onHighscoreSubmit={addHighscore}
                    hintsUsed={hintsUsed}
                    onSurvivalResult={settings.gameMode === 'survival' ? handleSurvivalResult : undefined}
                    isSurvivalMode={settings.gameMode === 'survival'}
                    isTimedChallenge={settings.gameMode === 'timed-challenge'}
                    timeRanOut={settings.gameMode === 'timed-challenge' && timedChallengeState.isTimeUp}
                  />
                </div>
              ) : (
                <>
                  {settings.gameMode === 'team-play' && (
                    <div className="mb-2 w-full flex justify-center">
                      <TeamPlayInfo activePlayer={activePlayer} players={players} />
                    </div>
                  )}

                  <GameProgressBar
                    currentCount={revealedCards.length}
                    totalCount={cardsToReveal}
                  />

                  <div className="my-2 flex justify-center">
                    <GameScreen
                      currentCard={currentCard}
                      handleCardClick={handleCardClick}
                      cardDesign={settings.cardDesign}
                      isDisabled={!isGameActive}
                    />
                  </div>

                  {shouldShowRunningTotal && (
                    <RunningTotal totalScore={totalScore} isCountdown={isCountdownMode} />
                  )}

                  <GameControls
                    settings={settings}
                    setSettings={setSettings}
                    showHighscores={showHighscores}
                    setShowHighscores={handleToggleStats}
                    revealedCards={revealedCards}
                    totalScore={totalScore}
                    hintsUsed={hintsUsed}
                    useHint={useHint}
                  />
                </>
              )}
            </div>
          </>
        ) : (
          <StatsSection
            statsTab={statsTab}
            onTabChange={handleStatsTabChange}
            onClose={handleCloseStats}
            statistics={statistics}
            recentTrend={recentTrend}
            countingMode={settings.countingMode}
            topHighscores={topHighscores}
            clearHighscores={clearHighscores}
          />
        )}
      </main>

      <MobileBottomNav
        activeTab={showHighscores ? (statsTab === 'highscores' ? 'highscores' : 'statistics') : 'game'}
        onTabChange={handleNavChange}
      />
    </div>
  )
}

export default DoppelkopfGame
