import React from 'react'

interface GameProgressBarProps {
  currentCount: number
  totalCount: number
  mode?: string
  streak?: number
  timeRemaining?: number
}

export const GameProgressBar: React.FC<GameProgressBarProps> = ({
  currentCount,
  totalCount,
}) => {
  const percentage = totalCount > 0 ? Math.min(100, Math.round((currentCount / totalCount) * 100)) : 0

  return (
    <div className="w-full max-w-sm px-2 py-1 select-none" data-testid="game-progress-bar">
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
        <span className="flex items-center gap-1">
          <span>Card</span>
          <span className="font-bold text-slate-900 dark:text-slate-100">{currentCount}</span>
          <span>of</span>
          <span className="font-bold text-slate-900 dark:text-slate-100">{totalCount}</span>
        </span>
        <span className="tabular-nums font-semibold text-slate-500 dark:text-slate-400">
          {percentage}
          %
        </span>
      </div>

      <div
        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={currentCount}
        aria-valuemin={0}
        aria-valuemax={totalCount}
        aria-label="Kartenfortschritt"
      >
        <div
          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
