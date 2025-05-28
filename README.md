# Norse Tactics

## Major Campaign & UI Progress (2024)
- **Campaign Mode:** Play through a multi-realm campaign with unlockable quests, XP, and rewards.
- **Quest Map:** Interactive Norse realms map with clickable realms and quest selection.
- **Player Progression:** Earn XP, level up, and unlock new cards and abilities. Player info panel shows avatar, name, level, and XP progress.
- **Contextual Tutorials:** In-game tutorials appear contextually to teach new rules and abilities as you unlock them.
- **Deck Builder & Card Collection:** Build your deck from unlocked cards and view your collection.
- **Bug Fixes & UI Polish:** Improved quest modal layout, fixed checkmark/close button overlap, and made campaign UI more consistent and visually appealing.

## Recent Updates
- **Norse-Themed UI:** All text now uses the Norse font, and the background features a Norse-inspired image for all game modes.
- **Modern Transparent Look:** Game board, cells, buttons, and player/score boxes are now transparent with subtle gold and dark brown borders, and soft glowing effects for a modern, immersive feel.
- **Consistent Button & Box Styling:** All interactive elements (AI difficulty, rules, game mode buttons, player boxes) now share a unified style for a cohesive experience.
- **Improved Visibility:** Game mode buttons are more visible with a soft gold-tinted background and glow.
- **Default AI Difficulty:** The AI now defaults to 'medium' difficulty for a balanced challenge.

## To Do
- Revisit and improve card flip and visual effects (e.g., 3D flip, polish card animations)

Norse Tactics is a turn-based card strategy game inspired by Triple Triad, built with React, TypeScript, and Emotion for styling. The game features Norse mythology-themed cards, special rules, and animated card capture effects.

## Project Structure

```
norse-tactics/
├── build/                # Build output (images, sounds)
├── dist/                 # Distribution output
├── public/               # Static assets (images, sounds)
├── scripts/              # Utility scripts
├── src/
│   ├── components/       # React components (GameBoard, GameCard, etc.)
│   ├── data/             # Card and campaign data
│   ├── services/         # Game logic, image, and ability services
│   ├── types/            # TypeScript type definitions
│   └── ...
├── index.html            # Main HTML file
├── package.json          # NPM dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── webpack.config.js     # Webpack configuration
└── README.md             # This file
```

## How the Game Works

- **Players:** Two players (Player 1 and Player 2, or Player vs AI) take turns placing cards on a 3x3 board.
- **Cards:** Each card has four numbers (top, right, bottom, left), an element, a rarity, and may have special abilities.
- **Turns:** On your turn, select a card from your hand and place it on an empty cell on the board. If playing against the AI, the AI will automatically make its move after yours.
- **Capturing:** When you place a card, it can capture adjacent opponent cards if its number on the touching side is higher than the opponent's number.
- **Ownership:** Player 1's cards are shown with a red border, Player 2's with a blue border. Ownership updates dynamically as cards are captured.
- **Chain Reactions:** If a card is captured, it can immediately capture adjacent cards in a chain reaction, following the same rules.
- **Special Rules:**
  - **Same Rule:** If two or more adjacent numbers are the same, all matching cards are captured.
  - **Plus Rule:** If the sum of the placed card's number and an adjacent card's number matches the sum on another side, all involved cards are captured.
  - **Elements & Ragnarök:** Additional rules can be toggled for more complex gameplay.

## Animation System

- **Card Capture:** When a card is captured, it flips and shows an element-based effect (fire, lightning, or ice glow).
- **Chain Reaction:** Cards captured in a chain reaction show a pulsing white glow.
- **Ownership Change:** Cards update their border and background color to reflect the new owner.
- **Animations:** All animations are handled with Framer Motion and React state.

## AI Competitor (New Feature)

- **Automatic AI Opponent:**
  - When playing solo, Player 2 is controlled by an AI.
  - The AI automatically selects and plays a card after your turn, with a short delay for realism.
  - The AI difficulty can be selected using the buttons above the game board: **Easy**, **Medium**, or **Hard**.
  - **Easy:** AI picks a random valid move.
  - **Medium:** AI prefers moves that capture a card, otherwise random.
  - **Hard:** AI evaluates all possible card and position combinations in its hand and picks the move that gives it the best immediate advantage (much more strategic).
  - No button press is needed; the AI acts as soon as your move is complete.

- **How to Play Against the AI:**
  - Start the game as usual. After you place a card, the AI will respond automatically.
  - Use the AI Difficulty buttons above the board to change the challenge at any time before or during a game.
  - The game continues until the board is full or a win condition is met.

## Running the Project

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm start
   ```
   The game will be available at `http://localhost:3000` (or the port shown in your terminal).

3. **Build for production:**
   ```bash
   npm run build
   ```

## Development Tips

- **Component Structure:**
  - `App.tsx` is the main entry point and manages game state.
  - `GameBoard.tsx` renders the board and handles cell clicks and animation triggers.
  - `GameCard.tsx` renders individual cards and their animations.
  - `gameLogic.ts` contains all the rules for card placement, capturing, and chain reactions.
- **Adding Cards:** Add new cards in `src/data/cards.ts`.
- **Adding Rules:** Modify or extend rules in `src/services/gameLogic.ts`.
- **Styling:** Uses Emotion for CSS-in-JS styling.
- **Animations:** Uses Framer Motion for smooth transitions and effects.

## Troubleshooting

- **Blank Screen or Errors:**
  - Make sure all imports use the correct file extension (e.g., `.tsx` for components).
  - Ensure all components are using the correct export/import style (default vs named).
  - If you see TypeScript or ESLint warnings, read the message for hints. Most are about unused variables or missing dependencies in hooks.
- **Animations Not Showing:**
  - Make sure the `handleCapture` callback is properly connected between `App.tsx`, `GameBoard.tsx`, and `gameLogic.ts`.
  - Ensure the `GameCard` component is receiving the `isCapturing` and `isChainReaction` props.
- **Rules Not Working:**
  - Check the logic in `gameLogic.ts` for the relevant rule.
  - Make sure the rule is enabled in the UI toggle.

## Extending the Game

- **Add new elements, abilities, or rules** by editing the relevant files in `src/data/` and `src/services/`.
- **Improve animations** by customizing the Framer Motion props in `GameCard.tsx`.
- **Add sound effects** by integrating audio playback in the capture/chain reaction handlers.

## Contact & Contribution

If you encounter issues or want to contribute, please open an issue or pull request on the repository. For major changes, please open an issue first to discuss what you would like to change.

---

**Enjoy Norse Tactics!**

<!-- Trigger redeploy: removed src/index.css for font fix --> 