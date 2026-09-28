import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createTeamPlayers, normalizeTeamPlayerCount, useTeamPlay } from './useTeamPlay'

describe('useTeamPlay', () => {
  it('creates alternating teams for the configured players', () => {
    expect(createTeamPlayers(4)).toEqual([
      { name: 'Player 1', team: 'Team A' },
      { name: 'Player 2', team: 'Team B' },
      { name: 'Player 3', team: 'Team A' },
      { name: 'Player 4', team: 'Team B' },
    ])
  })

  it.each([
    [2, ['Player 1', 'Player 2', 'Player 1', 'Player 2']],
    [3, ['Player 1', 'Player 2', 'Player 3', 'Player 1', 'Player 2', 'Player 3']],
    [4, ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 1', 'Player 2', 'Player 3', 'Player 4']],
  ])('assigns every player their turn before starting the next rotation (%i players)', (playerCount, expectedTurns) => {
    const { result, rerender } = renderHook(({ completedTurns }) => useTeamPlay(playerCount, completedTurns), {
      initialProps: { completedTurns: 0 },
    })

    expectedTurns.forEach((expectedPlayerName, completedTurns) => {
      rerender({ completedTurns })
      expect(result.current.activePlayer.name).toBe(expectedPlayerName)
    })
  })

  it('keeps malformed player counts within the supported range', () => {
    expect(normalizeTeamPlayerCount(undefined)).toBe(4)
    expect(normalizeTeamPlayerCount(1)).toBe(2)
    expect(normalizeTeamPlayerCount(9)).toBe(4)
  })
})
