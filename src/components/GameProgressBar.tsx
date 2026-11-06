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
  const safeTotalCount = Math.max(0, totalCount)
  const safeCurrentCount = safeTotalCount > 0 ? Math.max(0, Math.min(safeTotalCount, currentCount)) : 0
  const percentage = safeTotalCount > 0
    ? Math.min(100, Math.max(0, Math.round((safeCurrentCount / safeTotalCount) * 100)))
    : 0

  return (
    <div className="w-full max-w-sm px-2 py-1 select-none" data-testid="game-progress-bar">
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
        <span className="flex items-center gap-1">
          <span>Card</span>
          <span className="font-bold text-slate-900 dark:text-slate-100">{safeCurrentCount}</span>
          <span>of</span>
          <span className="font-bold text-slate-900 dark:text-slate-100">{safeTotalCount}</span>
        </span>
        <span className="tabular-nums font-semibold text-slate-500 dark:text-slate-400">
          {percentage}
          %
        </span>
      </div>

      <div
        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={safeCurrentCount}
        aria-valuemin={0}
        aria-valuemax={safeTotalCount}
        aria-label="Kartenfortschritt"
        aria-valuetext={`${percentage}% (${safeCurrentCount} von ${safeTotalCount} Karten)`}
      >
        <div
          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
