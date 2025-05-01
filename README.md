# Norse Tactics - Card Game

A React-based implementation of a strategic card game with chain reactions and special rules.

## Project Structure

```
src/
├── components/
│   ├── GameBoard.tsx      # Main game board component
│   └── GameCard.tsx       # Individual card component
├── services/
│   └── gameLogic.ts       # Core game logic and rules
├── types/
│   └── game.ts           # TypeScript type definitions
├── data/
│   └── cards.ts          # Card data and configurations
└── App.tsx               # Main application component
```

## Components

### GameCard
- Displays individual cards with their stats and visual effects
- Handles capture and chain reaction animations
- Uses Framer Motion for smooth transitions
- Props:
  - `card`: Card data (id, name, stats, element, etc.)
  - `isPlayable`: Whether the card can be played
  - `onClick`: Click handler for playing the card
  - `isCapturing`: Whether the card is being captured
  - `isChainReaction`: Whether the card is part of a chain reaction

### GameBoard
- Renders the 3x3 game grid
- Manages card placement and captures
- Handles game state updates
- Props:
  - `gameState`: Current game state
  - `onCellClick`: Handler for cell selection
  - `onCapture`: Handler for capture events

## Game Logic

### Core Mechanics
1. **Card Placement**
   - Players take turns placing cards on the 3x3 grid
   - Cards can only be placed on empty cells
   - Each card has four directional stats (top, right, bottom, left)

2. **Capture Rules**
   - Normal Capture: Card's stat must be higher than adjacent card's opposite stat
   - Same Rule: If two adjacent cards have the same stat, they capture each other
   - Plus Rule: If the sum of two adjacent cards' stats equals another pair's sum, they capture each other

3. **Chain Reactions**
   - When a card is captured, it can trigger additional captures
   - Chain reactions continue until no more captures are possible
   - Each capture in the chain is visually animated

### GameState
- Tracks:
  - Current board state
  - Player hands
  - Current turn
  - Game rules (Same, Plus, Elements)
  - Score
  - Turn count

## Animation System

### Capture Effects
1. **Card Flip**
   - Captured cards rotate 180 degrees
   - Smooth transition using Framer Motion

2. **Element Effects**
   - Fire: Red glow effect
   - Ice: Blue glow effect
   - Lightning: Yellow glow effect

3. **Chain Reaction**
   - White pulsing glow effect
   - Sequential animation of captures

## State Management

### Capture States
- `capturingCards`: Set of cards currently being captured
- `chainReactionCards`: Set of cards involved in chain reactions
- States are automatically cleared after animations complete

### Game Flow
1. Player selects a card from their hand
2. Player places card on the board
3. GameLogic processes captures and chain reactions
4. Capture animations play
5. Turn switches to the other player

## Error Handling

### Common Issues
1. **Capture Animation Not Playing**
   - Check if `window.handleGameCapture` is properly set
   - Verify card IDs match between game state and animations
   - Ensure Framer Motion is properly imported

2. **Chain Reactions Not Working**
   - Verify `processChainReaction` is being called
   - Check if `processedPositions` set is preventing infinite loops
   - Ensure capture rules are being applied correctly

3. **Game State Not Updating**
   - Check if `setGameState` is being called with correct parameters
   - Verify turn switching logic
   - Ensure score is being updated correctly

## Development Notes

### Dependencies
- React
- TypeScript
- Framer Motion
- Emotion (styled-components)

### Best Practices
1. Always use TypeScript types for props and state
2. Keep game logic separate from UI components
3. Use React hooks for state management
4. Implement proper cleanup in useEffect hooks
5. Use useCallback for event handlers

### Testing
- Test individual card captures
- Verify chain reaction behavior
- Check special rule implementations
- Test animation timing and cleanup

## Future Improvements
1. Add multiplayer support
2. Implement AI opponent
3. Add sound effects
4. Create card collection system
5. Add tutorial mode 