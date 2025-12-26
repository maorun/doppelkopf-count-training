// src/components/TutorialModal.tsx
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'

interface TutorialModalProps {
  children: React.ReactNode
}

interface TutorialStep {
  title: string
  description: string
  content: React.ReactNode
}

const CardValueExplanation: React.FC = () => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-3">
      <div className="p-3 bg-slate-100 dark:bg-gray-800 rounded-lg">
        <div className="font-bold text-lg mb-1">Ass (Ace)</div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">11 Punkte</div>
      </div>
      <div className="p-3 bg-slate-100 dark:bg-gray-800 rounded-lg">
        <div className="font-bold text-lg mb-1">10</div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">10 Punkte</div>
      </div>
      <div className="p-3 bg-slate-100 dark:bg-gray-800 rounded-lg">
        <div className="font-bold text-lg mb-1">König (King)</div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">4 Punkte</div>
      </div>
      <div className="p-3 bg-slate-100 dark:bg-gray-800 rounded-lg">
        <div className="font-bold text-lg mb-1">Dame (Queen)</div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3 Punkte</div>
      </div>
      <div className="p-3 bg-slate-100 dark:bg-gray-800 rounded-lg">
        <div className="font-bold text-lg mb-1">Bube (Jack)</div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2 Punkte</div>
      </div>
      <div className="p-3 bg-slate-100 dark:bg-gray-800 rounded-lg">
        <div className="font-bold text-lg mb-1">9</div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0 Punkte</div>
      </div>
    </div>
  </div>
)

const CountingExampleStep: React.FC = () => (
  <div className="space-y-4">
    <p className="text-base text-gray-700 dark:text-gray-300">
      Beim Zählen addierst du die Punkte jeder aufgedeckten Karte:
    </p>
    <div className="bg-slate-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-gray-700 pb-2">
        <span className="font-medium">1. Karte: Ass</span>
        <span className="font-bold text-blue-600 dark:text-blue-400">= 11 Punkte</span>
      </div>
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-gray-700 pb-2">
        <span className="font-medium">2. Karte: König</span>
        <span className="font-bold text-blue-600 dark:text-blue-400">11 + 4 = 15 Punkte</span>
      </div>
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-gray-700 pb-2">
        <span className="font-medium">3. Karte: 10</span>
        <span className="font-bold text-blue-600 dark:text-blue-400">15 + 10 = 25 Punkte</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium">4. Karte: Dame</span>
        <span className="font-bold text-green-600 dark:text-green-400">25 + 3 = 28 Punkte</span>
      </div>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
      💡 Tipp: Merke dir immer nur die laufende Summe, nicht alle einzelnen Karten!
    </p>
  </div>
)

const getColorClasses = (color: string) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      title: 'text-blue-900 dark:text-blue-300',
      text: 'text-blue-800 dark:text-blue-200',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      title: 'text-green-900 dark:text-green-300',
      text: 'text-green-800 dark:text-green-200',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      title: 'text-purple-900 dark:text-purple-300',
      text: 'text-purple-800 dark:text-purple-200',
    },
  }
  return colorMap[color as keyof typeof colorMap] || colorMap.blue
}

const TipsSection: React.FC<{
  title: string
  color: string
  children: React.ReactNode
}> = ({ title, color, children }) => {
  const colors = getColorClasses(color)
  return (
    <div className={`${colors.bg} p-4 rounded-lg`}>
      <h4 className={`font-bold ${colors.title} mb-2`}>
        {title}
      </h4>
      <ul className={`space-y-2 text-sm ${colors.text}`}>
        {children}
      </ul>
    </div>
  )
}

const TipsAndTricksStep: React.FC = () => (
  <div className="space-y-4">
    <TipsSection title="🎯 Strategie-Tipps" color="blue">
      <li>• Konzentriere dich auf die laufende Summe</li>
      <li>• Rechne bei jeder Karte sofort</li>
      <li>• Asse und Zehner bringen die meisten Punkte</li>
      <li>• Übe zunächst mit weniger Karten</li>
    </TipsSection>
    <TipsSection title="⚡ Geschwindigkeits-Tricks" color="green">
      <li>• Nutze einfache Rechenregeln (z.B. 11 + 10 = 21)</li>
      <li>• Gruppiere Karten mental (z.B. zwei Könige = 8)</li>
      <li>• Übe regelmäßig, um schneller zu werden</li>
    </TipsSection>
    <TipsSection title="📊 Punktesystem" color="purple">
      <li>• Richtige Antwort: 100 Basispunkte</li>
      <li>• Schwierigkeitsbonus: +10 pro Karte</li>
      <li>• Zeitbonus: bis zu +50 Punkte</li>
    </TipsSection>
  </div>
)

const getStepItemColorClass = (color: string): string => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  }
  return colorMap[color] || colorMap.blue
}

const GameplayStepItem: React.FC<{
  number: number
  title: string
  description: string
  color?: string
}> = ({ number, title, description, color = 'blue' }) => {
  const bgColor = getStepItemColorClass(color)
  return (
    <div className="flex gap-3">
      <div className={`flex-shrink-0 w-8 h-8 ${bgColor} text-white rounded-full flex items-center justify-center font-bold`}>
        {number}
      </div>
      <div>
        <h4 className="font-bold mb-1">
          {title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  )
}

const GameplayStep: React.FC = () => (
  <div className="space-y-4">
    <p className="text-base text-gray-700 dark:text-gray-300">
      So funktioniert das Spiel:
    </p>
    <div className="space-y-3">
      <GameplayStepItem
        number={1}
        title="Karte aufdecken"
        description="Klicke auf die Karte, um die nächste Karte aufzudecken"
      />
      <GameplayStepItem
        number={2}
        title="Punkte addieren"
        description="Zähle die Punkte der Karte zu deiner laufenden Summe hinzu"
      />
      <GameplayStepItem
        number={3}
        title="Weiter zählen"
        description="Wiederhole Schritt 1 und 2 für alle Karten"
      />
      <GameplayStepItem
        number={4}
        title="Ergebnis eingeben"
        description="Gib deine berechnete Gesamtsumme ein und prüfe das Ergebnis"
        color="green"
      />
    </div>
  </div>
)

const WelcomeStep: React.FC = () => (
  <div className="space-y-4">
    <p className="text-base text-gray-700 dark:text-gray-300">
      Willkommen beim Doppelkopf-Zähltraining! Diese Anwendung hilft dir, das Kartenzählen im
      Doppelkopf zu üben und zu meistern.
    </p>
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
      <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Was lernst du hier?</h4>
      <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
        <li>✓ Kartenwerte im Doppelkopf kennenlernen</li>
        <li>✓ Schnelles Kopfrechnen trainieren</li>
        <li>✓ Konzentration und Gedächtnis verbessern</li>
        <li>✓ Deine Fortschritte verfolgen</li>
      </ul>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Klicke auf "Weiter", um mehr über die Kartenwerte und das Zählen zu erfahren.
    </p>
  </div>
)

const getTutorialSteps = (): TutorialStep[] => [
  {
    title: 'Willkommen zum Tutorial',
    description: 'Lerne die Grundlagen des Doppelkopf-Zähltrainings',
    content: <WelcomeStep />,
  },
  {
    title: 'Kartenwerte',
    description: 'Diese Punkte haben die verschiedenen Karten',
    content: <CardValueExplanation />,
  },
  {
    title: 'Zähl-Beispiel',
    description: 'So addierst du die Punkte während des Spiels',
    content: <CountingExampleStep />,
  },
  {
    title: 'Spielablauf',
    description: 'Schritt für Schritt zum Erfolg',
    content: <GameplayStep />,
  },
  {
    title: 'Tipps & Tricks',
    description: 'Verbessere deine Zählfähigkeiten',
    content: <TipsAndTricksStep />,
  },
]

const ProgressIndicator: React.FC<{ steps: TutorialStep[], currentStep: number }> = ({ steps, currentStep }) => (
  <div className="flex gap-2 justify-center py-2">
    {steps.map((_, index) => (
      <div
        key={index}
        className={`h-2 rounded-full transition-all ${
          index === currentStep
            ? 'w-8 bg-blue-600 dark:bg-blue-400'
            : 'w-2 bg-gray-300 dark:bg-gray-600'
        }`}
      />
    ))}
  </div>
)

const TutorialNavigation: React.FC<{
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
}> = ({ currentStep, totalSteps, onPrevious, onNext }) => {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  return (
    <div className="flex justify-between gap-4 pt-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
      >
        Zurück
      </Button>
      <div className="text-sm text-gray-500 dark:text-gray-400 self-center">
        Schritt
        {' '}
        {currentStep + 1}
        {' '}
        von
        {' '}
        {totalSteps}
      </div>
      <Button
        onClick={onNext}
        disabled={isLastStep}
        className="dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        {isLastStep ? 'Fertig' : 'Weiter'}
      </Button>
    </div>
  )
}

/* eslint-disable max-lines-per-function */
export const TutorialModal: React.FC<TutorialModalProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const tutorialSteps = getTutorialSteps()
  const currentTutorialStep = tutorialSteps[currentStep]

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setCurrentStep(0)
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          handleClose()
        }
      }}
    >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl dark:text-gray-100">
            {currentTutorialStep.title}
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            {currentTutorialStep.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {currentTutorialStep.content}
        </div>

        <ProgressIndicator steps={tutorialSteps} currentStep={currentStep} />

        <TutorialNavigation
          currentStep={currentStep}
          totalSteps={tutorialSteps.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </DialogContent>
    </Dialog>
  )
}
