// src/lib/doppelkopf.ts

export type Suit = 'Kreuz' | 'Pik' | 'Herz' | 'Karo'
export type Rank = 'Ass' | '10' | 'König' | 'Dame' | 'Bube' | '9'

export interface Card {
  suit: Suit
  rank: Rank
  value: number
}

const suits: Suit[] = ['Kreuz', 'Pik', 'Herz', 'Karo']
const ranks: Array<{ rank: Rank, value: number }> = [
  { rank: 'Ass', value: 11 },
  { rank: '10', value: 10 },
  { rank: 'König', value: 4 },
  { rank: 'Dame', value: 3 },
  { rank: 'Bube', value: 2 },
  { rank: '9', value: 0 },
]

export const createDeck = (includeNines = false): Card[] => {
  const singleDeck: Card[] = []
  const ranksToUse = includeNines ? ranks : ranks.filter(r => r.rank !== '9')
  for (const suit of suits) {
    for (const rank of ranksToUse) {
      singleDeck.push({ suit, rank: rank.rank, value: rank.value })
    }
  }
  return [...singleDeck, ...singleDeck]
}

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffledDeck = [...deck]
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]]
  }
  return shuffledDeck
}
