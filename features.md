# Features of Doppelkopf Count Training

This document summarizes the functionality available in the application. See the
[README](README.md) for setup instructions, a complete scoring breakdown, and
step-by-step gameplay instructions.

## Game Modes

- **Single Game**: Practice one round at your own pace. Configure a minimum and
  maximum number of cards; each new round randomly selects a number within that
  range.
- **Survival Mode**: Start with 15 cards and build a streak through progressively
  harder rounds. Every correct answer adds two cards, up to 40; an incorrect
  answer ends the current streak. Current and best streaks are retained locally.
- **Timed Challenge**: Complete a fixed-size round before the selected 30- to
  180-second limit expires. Easy, medium, and hard use 15, 25, and 35 cards,
  respectively. The timer warns when ten seconds or fewer remain and ends the
  round when it expires.
- **Team Play**: Play with two to four players. In player order, Players 1 and
  3 are assigned to Team A, while Players 2 and 4 are assigned to Team B. The
  active player rotates after every revealed card.

## Counting Practice

- **Card-by-card play**: Reveal one shuffled card at a time and enter the final
  total after the round.
- **Configurable cards**: Include or exclude 9s, choose the ranks to count, and
  choose the suits to count. A card contributes points only when both its rank
  and suit are selected.
- **Reverse counting**: Begin at the total value of the round's selected cards
  and subtract each revealed card's counted value until the running total reaches
  zero. The standard mode instead starts at zero and adds values.
- **Optional time measurement**: Record the time from the first revealed card to
  the end of the round for scoring and statistics.

## Learning Support and Accessibility

- **Tutorial**: Work through six interactive steps covering card values, a
  counting example, game flow, the Include 9s setting, and practical tips.
- **Hints**: During an active round, reveal the current total, the last five
  cards, or the card-value reference. Each selected hint costs 20 points.
- **Automatic running total**: Optionally display the total after every card in
  Single Game and Team Play. This learning aid does not consume hints and is not
  available in Survival or Timed Challenge.
- **Card presentation**: Select classic, modern, or minimalist card styles and
  traditional, monochrome, or vibrant suit colours. High-contrast and larger-text
  options improve readability.
- **Responsive interaction**: Use touch or keyboard controls on small and large
  screens, and switch between light and dark themes.

## Results and Progress

- **Immediate result feedback**: Submit the calculated total after a round to see
  whether it is correct and the resulting score.
- **Scoring and highscores**: Scores account for correctness, card count, optional
  time measurement, and hint penalties. The locally stored leaderboard displays
  the top ten results and can be cleared.
- **Statistics**: Review games played, win rate, streaks, scores, total cards,
  average time per card, recent trends, difficulty breakdowns, and hint usage.
- **Saved preferences**: Game settings, theme choice, highscores, and statistics
  are stored locally in the browser so they persist between visits on the same
  device.

## Progressive Web App

The application is installable as a Progressive Web App (PWA) on supported
desktop and mobile browsers.
