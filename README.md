# doppelkopf-count-training

Training application to practice counting cards in the game Doppelkopf.

## Features

- **Card Counting Practice**: Reveal cards one by one and mentally track the
  total score
- **Result Validation**: After completing a round, enter your calculated total
  and receive immediate feedback on whether you were correct
- **Customizable Settings**:
  - Include or exclude 9s from the deck
  - Configure the number of cards to reveal (card count range)
  - Optional time tracking to measure your calculation speed
- **Interactive Feedback**: Get clear visual feedback (✓ Correct or ✗
  Incorrect) when checking your answer
- **Play Again**: Quickly start a new round with a fresh shuffled deck

## How to Play

1. Click on the card to reveal it
2. Mentally track the cumulative score based on card values:
   - Ass (Ace): 11 points
   - 10: 10 points
   - König (King): 4 points
   - Dame (Queen): 3 points
   - Bube (Jack): 2 points
   - 9: 0 points
3. After all cards are revealed, enter your calculated total in the input field
4. Click "Check Result" to see if your answer is correct
5. Click "Play Again" to start a new round

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```
