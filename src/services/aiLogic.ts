import { GameState, Card, Position, GameRules } from '../types/game';

export class AILogic {
  private rules: GameRules;
  private difficulty: 'easy' | 'medium' | 'hard';

  constructor(rules: GameRules, difficulty: 'easy' | 'medium' | 'hard' = 'easy') {
    this.rules = rules;
    this.difficulty = difficulty;
  }

  getBestMove(gameState: GameState): Position | null {
    const validMoves = this.getValidMoves(gameState);
    if (validMoves.length === 0) return null;

    if (this.difficulty === 'easy') {
      // Random move
      const randomIndex = Math.floor(Math.random() * validMoves.length);
      return validMoves[randomIndex];
    }

    if (this.difficulty === 'medium') {
      // Prefer moves that capture a card, otherwise random
      const capturingMoves = validMoves.filter(pos => this.wouldCapture(gameState, pos));
      if (capturingMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * capturingMoves.length);
        return capturingMoves[randomIndex];
      } else {
        const randomIndex = Math.floor(Math.random() * validMoves.length);
        return validMoves[randomIndex];
      }
    }

    // Hard: evaluate all (card, position) pairs and pick the best
    let bestMove: { pos: Position; cardIndex: number } | null = null;
    let bestScore = -Infinity;
    const aiHand = gameState.player2Hand;
    for (let cardIdx = 0; cardIdx < aiHand.length; cardIdx++) {
      const card = aiHand[cardIdx];
      for (const pos of validMoves) {
        const score = this.simulateMoveScore(gameState, pos, card);
        if (score > bestScore) {
          bestScore = score;
          bestMove = { pos, cardIndex: cardIdx };
        }
      }
    }
    // Optionally, you could store bestMove.cardIndex for use in App.tsx to play the best card
    return bestMove ? bestMove.pos : validMoves[0];
  }

  private getValidMoves(gameState: GameState): Position[] {
    const validMoves: Position[] = [];
    const board = gameState.board;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (!board[row][col]) {
          validMoves.push({ row, col });
        }
      }
    }
    return validMoves;
  }

  // Simple check: would placing a card here capture an opponent card?
  private wouldCapture(gameState: GameState, pos: Position): boolean {
    // For simplicity, just check if any adjacent cell has an opponent card
    const { row, col } = pos;
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];
    for (const [dr, dc] of directions) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3) {
        const neighbor = gameState.board[nr][nc];
        if (neighbor && neighbor.owner === 'player') {
          return true;
        }
      }
    }
    return false;
  }

  // Simulate placing a card and return the resulting score difference for the AI
  private simulateMoveScore(gameState: GameState, pos: Position, card: Card): number {
    // Clone the board
    const newBoard = gameState.board.map(row => row.slice());
    newBoard[pos.row][pos.col] = { ...card, owner: 'opponent' };
    // Count AI and player cards after move
    let aiCount = 0;
    let playerCount = 0;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const c = newBoard[row][col];
        if (c) {
          if (c.owner === 'opponent') aiCount++;
          if (c.owner === 'player') playerCount++;
        }
      }
    }
    return aiCount - playerCount;
  }
} 