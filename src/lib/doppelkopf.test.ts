import { describe, expect, it } from 'vitest'
import { createDeck, Rank, Suit } from './doppelkopf'

const suits: Suit[] = ['Kreuz', 'Pik', 'Herz', 'Karo']
const cardValues: Record<Rank, number> = {
  Ass: 11,
  10: 10,
  König: 4,
  Dame: 3,
  Bube: 2,
  9: 0,
}

describe('createDeck', () => {
  it('assigns every rank its standard value in every suit', () => {
    const deck = createDeck(true)

    for (const suit of suits) {
      for (const [rank, value] of Object.entries(cardValues) as Array<[Rank, number]>) {
        const matchingCards = deck.filter(card => card.suit === suit && card.rank === rank)
        expect(matchingCards).toHaveLength(2)
        expect(matchingCards.every(card => card.value === value)).toBe(true)
      }
    }
  })

  it('has the expected 240-point total regardless of the zero-value nines variant', () => {
    expect(createDeck(false).reduce((total, card) => total + card.value, 0)).toBe(240)
    expect(createDeck(true).reduce((total, card) => total + card.value, 0)).toBe(240)
  })

  it('filters nines while retaining every other rank and suit by default', () => {
    const deck = createDeck()

    expect(deck).toHaveLength(40)
    expect(deck.some(card => card.rank === '9')).toBe(false)
    expect(new Set(deck.map(card => card.suit))).toEqual(new Set(suits))
    expect(new Set(deck.map(card => card.rank))).toEqual(new Set<Rank>(['Ass', '10', 'König', 'Dame', 'Bube']))
  })

  it('includes two nines of every suit when requested', () => {
    const deck = createDeck(true)

    expect(deck).toHaveLength(48)
    for (const suit of suits) {
      expect(deck.filter(card => card.suit === suit && card.rank === '9')).toHaveLength(2)
    }
  })
})
