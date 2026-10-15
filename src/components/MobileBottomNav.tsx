import React from 'react'
import { Layers, BarChart2, Trophy } from 'lucide-react'

export type NavTab = 'game' | 'statistics' | 'highscores'

interface MobileBottomNavProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
}

interface NavItem {
  id: NavTab
  label: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  { id: 'game', label: 'Spiel', icon: <Layers className="w-5 h-5" /> },
  { id: 'statistics', label: 'Statistik', icon: <BarChart2 className="w-5 h-5" /> },
  { id: 'highscores', label: 'Highscores', icon: <Trophy className="w-5 h-5" /> },
]

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] sm:hidden"
      aria-label="Hauptnavigation"
      data-testid="mobile-bottom-nav"
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-4">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors select-none ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
            >
              {item.icon}
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
