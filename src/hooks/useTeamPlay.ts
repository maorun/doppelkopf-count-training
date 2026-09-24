import { useMemo } from 'react'

export const MIN_TEAM_PLAYERS = 2
export const MAX_TEAM_PLAYERS = 4

export interface TeamPlayer {
  name: string
  team: 'Team A' | 'Team B'
}

export const normalizeTeamPlayerCount = (playerCount: number | undefined): number => {
  if (!Number.isFinite(playerCount)) return MAX_TEAM_PLAYERS
  return Math.min(Math.max(Math.floor(playerCount!), MIN_TEAM_PLAYERS), MAX_TEAM_PLAYERS)
}

export const createTeamPlayers = (playerCount: number | undefined): TeamPlayer[] => (
  Array.from({ length: normalizeTeamPlayerCount(playerCount) }, (_, index) => ({
    name: `Player ${index + 1}`,
    team: index % 2 === 0 ? 'Team A' : 'Team B',
  }))
)

export const useTeamPlay = (playerCount: number | undefined, completedTurns: number) => {
  const players = useMemo(() => createTeamPlayers(playerCount), [playerCount])
  const activePlayer = players[completedTurns % players.length]

  return { players, activePlayer }
}
