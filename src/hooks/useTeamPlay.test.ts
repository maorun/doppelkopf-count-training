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

  it.each([
    [undefined, 4],
    [Number.NaN, 4],
    [Number.POSITIVE_INFINITY, 4],
    [1, 2],
    [2.9, 2],
    [9, 4],
  ])('normalizes invalid player count %s to %i players before assigning turns', (playerCount, expectedCount) => {
    expect(normalizeTeamPlayerCount(playerCount)).toBe(expectedCount)
    expect(createTeamPlayers(playerCount)).toHaveLength(expectedCount)
  })
})
