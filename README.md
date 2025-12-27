# doppelkopf-count-training

Training application to practice counting cards in the game Doppelkopf.

## Features

- **Game Modes**:
  - **Single Game Mode**: Play one round at a time with customizable card counts
  - **Survival Mode**: Test your endurance! Keep playing until your first mistake
    - Start with 15 cards to count
    - Difficulty increases by 2 cards after each correct answer
    - Maximum difficulty of 40 cards
    - Track your current streak and longest survival streak
    - Progress saved automatically
- **Tutorial Mode**: Interactive step-by-step guide for beginners
  - Learn card values and their points in Doppelkopf
  - See practical counting examples with explanations
  - Understand the game flow with clear instructions
  - Get helpful tips and strategies for faster counting
  - Navigate at your own pace through 5 tutorial steps
- **Card Counting Practice**: Reveal cards one by one and mentally track the
  total score
- **Result Validation**: After completing a round, enter your calculated total
  and receive immediate feedback on whether you were correct
- **Dark Mode / Light Mode**: Switch between dark and light themes for comfortable
  viewing in any lighting condition. Your preference is automatically saved.
- **Statistics and Progress Tracking**: Comprehensive performance analytics
  - Track total games played and win rate
  - Monitor your best and current streak of correct answers
  - View average calculation time per card
  - Analyze performance by difficulty level (card count ranges)
  - See recent performance trends (last 10 games)
  - Compare statistics across different difficulty levels
- **Highscore System**: Earn points based on accuracy, difficulty, and speed
  - Correct answers earn base points plus difficulty bonus (based on card count)
  - Time bonus for fast calculations (when time tracking is enabled)
  - Local highscore leaderboard shows your top 10 performances
  - Clear all highscores option available
- **Customizable Settings**:
  - Choose between Single Game and Survival Mode
  - Include or exclude 9s from the deck
  - Configure the number of cards to reveal (in Single Game mode)
  - Optional time tracking to measure your calculation speed
- **Hint System**: Get help during gameplay with optional hints
  - Show current running total at any time
  - View the last 5 cards revealed with their values
  - Display card value reminders
  - Each hint costs 20 points from your final score
  - Hint usage tracked in statistics
- **Interactive Feedback**: Get clear visual feedback (✓ Correct or ✗
  Incorrect) when checking your answer
- **Play Again**: Quickly start a new round with a fresh shuffled deck

## How to Play

1. **First time here?** Click the "Tutorial" button to learn the basics through an
   interactive guide
2. Click on the card to reveal it
3. Mentally track the cumulative score based on card values:
   - Ass (Ace): 11 points
   - 10: 10 points
   - König (King): 4 points
   - Dame (Queen): 3 points
   - Bube (Jack): 2 points
   - 9: 0 points
4. **Need help?** Click the "Hint" button to get assistance:
   - View your current running total
   - See the last 5 cards revealed
   - Display card value reminders
   - Each hint costs 20 points from your final score
5. After all cards are revealed, enter your calculated total in the input field
6. Click "Check Result" to see if your answer is correct and view your score
7. Click "Play Again" to start a new round
8. Click "Tutorial" anytime to review card values and get helpful tips
9. Click "Show Stats" to view your performance statistics and highscores
   - **Statistics Tab**: View comprehensive performance analytics including win
     rate, streaks, average times, performance by difficulty, and hint usage
   - **Highscores Tab**: View your top 10 performances
   - **Survival Tab**: View survival mode statistics including current streak,
     longest streak, and difficulty progression

## Scoring System

Your score is calculated based on:

- **Base Points**: 100 points for a correct answer, 0 for incorrect
- **Difficulty Bonus**: 10 points per card counted (e.g., 20 cards = 200 bonus points)
- **Time Bonus** (only when time tracking is enabled):
  - Fast (< 1 second per card): +50 points
  - Normal (1-2 seconds per card): +25 points
  - Slow (> 2 seconds per card): +0 points
- **Hint Penalty**: -20 points per hint used

**Example Scores**:

- 20 cards, correct answer, 15 seconds (0.75s/card), no hints:
  100 + 200 + 50 = **350 points**
- 20 cards, correct answer, 30 seconds (1.5s/card), 1 hint used:
  100 + 200 + 25 - 20 = **305 points**
- 20 cards, correct answer, time tracking off, 2 hints used:
  100 + 200 - 40 = **260 points**
- Any incorrect answer: **0 points**

## Survival Mode

Survival Mode offers an exciting challenge where you test your endurance and skills:

### How It Works

1. **Select Survival Mode** in Settings
2. Click **Start Survival Mode** to begin
3. Start with 15 cards to count
4. Each correct answer increases difficulty by 2 cards
5. Maximum difficulty caps at 40 cards
6. **One wrong answer ends your streak!**
7. Your longest survival streak is saved

### Strategy Tips

- Start carefully - accuracy is everything
- Use hints wisely (they reduce your score but keep your streak alive)
- As difficulty increases, take your time
- Focus on building your longest streak record

### Survival Statistics

Track your survival performance in the Survival tab:

- **Current Streak**: How many rounds you've survived in your current run
- **Longest Streak**: Your best performance ever
- **Current Difficulty**: The number of cards in your current round

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
