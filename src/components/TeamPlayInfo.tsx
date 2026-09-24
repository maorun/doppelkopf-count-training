import React from 'react'
import { TeamPlayer } from '../hooks/useTeamPlay'

interface TeamPlayInfoProps {
  activePlayer: TeamPlayer
  players: TeamPlayer[]
}

export const TeamPlayInfo: React.FC<TeamPlayInfoProps> = ({ activePlayer, players }) => (
  <section className="w-full max-w-sm rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
    <p className="text-center text-sm font-medium text-blue-800 dark:text-blue-200">Current turn</p>
    <p className="mt-1 text-center text-lg font-bold text-blue-950 dark:text-blue-100">
      {activePlayer.name}
      {' '}
      <span className="text-sm font-medium">
        (
        {activePlayer.team}
        )
      </span>
    </p>
    <ul className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-blue-800 dark:text-blue-200" aria-label="Team players">
      {players.map(player => (
        <li key={player.name} className={player.name === activePlayer.name ? 'font-bold underline' : ''}>
          {player.name}
          {' · '}
          {player.team}
        </li>
      ))}
    </ul>
  </section>
)
