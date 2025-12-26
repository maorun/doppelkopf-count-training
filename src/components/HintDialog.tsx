// src/components/HintDialog.tsx
import React, { useState } from 'react'
import { Card } from '../lib/doppelkopf'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'

interface HintDialogProps {
  revealedCards: Card[]
  totalScore: number
  onHintUsed: () => void
  children: React.ReactNode
}

const getCardValueText = (card: Card): string => {
  return `${card.rank} (${card.value} ${card.value === 1 ? 'Punkt' : 'Punkte'})`
}

interface HintSectionProps {
  label: string
  isShown: boolean
  isDisabled: boolean
  onClick: () => void
  children: React.ReactNode
}

const HintSection: React.FC<HintSectionProps> = ({ label, isShown, isDisabled, onClick, children }) => (
  <div className="space-y-2">
    <Button
      variant="outline"
      className="w-full justify-start"
      onClick={onClick}
      disabled={isDisabled}
    >
      {isShown ? '✓ ' : ''}
      {label}
    </Button>
    {isShown && children}
  </div>
)

const RunningTotalHint: React.FC<{ totalScore: number, cardsCount: number }> = ({ totalScore, cardsCount }) => (
  <div className="bg-blue-100 dark:bg-blue-900 border-2 border-blue-400 dark:border-blue-600 rounded-lg p-4 animate-fade-in-slow">
    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
      Aktueller Punktestand:
      {' '}
      {totalScore}
    </p>
    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
      {cardsCount}
      {' '}
      {cardsCount === 1 ? 'Karte' : 'Karten'}
      {' '}
      aufgedeckt
    </p>
  </div>
)

const LastCardsHint: React.FC<{ cards: Card[] }> = ({ cards }) => (
  <div className="bg-green-100 dark:bg-green-900 border-2 border-green-400 dark:border-green-600 rounded-lg p-4 animate-fade-in-slow">
    <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
      Letzte
      {' '}
      {cards.length}
      {' '}
      {cards.length === 1 ? 'Karte' : 'Karten'}
      :
    </p>
    <ul className="space-y-1">
      {cards.map((card, index) => (
        <li key={index} className="text-green-800 dark:text-green-200">
          {getCardValueText(card)}
        </li>
      ))}
    </ul>
  </div>
)

const CardValuesHint: React.FC = () => (
  <div className="bg-purple-100 dark:bg-purple-900 border-2 border-purple-400 dark:border-purple-600 rounded-lg p-4 animate-fade-in-slow">
    <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">
      Kartenwerte:
    </p>
    <ul className="space-y-1 text-purple-800 dark:text-purple-200">
      <li>Ass: 11 Punkte</li>
      <li>10: 10 Punkte</li>
      <li>König: 4 Punkte</li>
      <li>Dame: 3 Punkte</li>
      <li>Bube: 2 Punkte</li>
      <li>9: 0 Punkte</li>
    </ul>
  </div>
)

/* eslint-disable max-lines-per-function */
export const HintDialog: React.FC<HintDialogProps> = ({
  revealedCards,
  totalScore,
  onHintUsed,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showRunningTotal, setShowRunningTotal] = useState(false)
  const [showLastCards, setShowLastCards] = useState(false)
  const [showCardValues, setShowCardValues] = useState(false)

  const handleHintClick = (hintType: 'total' | 'lastCards' | 'values') => {
    onHintUsed()
    if (hintType === 'total') setShowRunningTotal(true)
    else if (hintType === 'lastCards') setShowLastCards(true)
    else setShowCardValues(true)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setShowRunningTotal(false)
      setShowLastCards(false)
      setShowCardValues(false)
    }
  }

  const lastFiveCards = revealedCards.slice(-5)

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Hinweise</DialogTitle>
          <DialogDescription>
            Wähle einen Hinweis aus. Jeder Hinweis kostet 20 Punkte.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <HintSection
            label="Aktuelle Punktzahl anzeigen"
            isShown={showRunningTotal}
            isDisabled={showRunningTotal}
            onClick={() => handleHintClick('total')}
          >
            <RunningTotalHint totalScore={totalScore} cardsCount={revealedCards.length} />
          </HintSection>

          <HintSection
            label="Letzte 5 Karten anzeigen"
            isShown={showLastCards}
            isDisabled={showLastCards || revealedCards.length === 0}
            onClick={() => handleHintClick('lastCards')}
          >
            <LastCardsHint cards={lastFiveCards} />
          </HintSection>

          <HintSection
            label="Kartenwerte anzeigen"
            isShown={showCardValues}
            isDisabled={showCardValues}
            onClick={() => handleHintClick('values')}
          >
            <CardValuesHint />
          </HintSection>
        </div>
      </DialogContent>
    </Dialog>
  )
}
