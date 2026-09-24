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

  it('cycles the active player after every revealed card', () => {
    const { result, rerender } = renderHook(({ completedTurns }) => useTeamPlay(3, completedTurns), {
      initialProps: { completedTurns: 0 },
    })

    expect(result.current.activePlayer.name).toBe('Player 1')
    rerender({ completedTurns: 2 })
    expect(result.current.activePlayer.name).toBe('Player 3')
    rerender({ completedTurns: 3 })
    expect(result.current.activePlayer.name).toBe('Player 1')
  })

  it('keeps malformed player counts within the supported range', () => {
    expect(normalizeTeamPlayerCount(undefined)).toBe(4)
    expect(normalizeTeamPlayerCount(1)).toBe(2)
    expect(normalizeTeamPlayerCount(9)).toBe(4)
  })
})
