import { GameState, Card, Position, GameRules } from '../types/game';

export class AILogic {
  private rules: GameRules;

  constructor(rules: GameRules) {
    this.rules = rules;
  }

  getBestMove(gameState: GameState): Position | null {
    // Get all valid moves
    const validMoves = this.getValidMoves(gameState);
    if (validMoves.length === 0) return null;

    // For now, just return a random valid move
    // TODO: Implement minimax algorithm with difficulty levels
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  }

  private getValidMoves(gameState: GameState): Position[] {
    const validMoves: Position[] = [];
    const board = gameState.board;

    // Check each cell in the board
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        // If the cell is empty, it's a valid move
        if (!board[row][col]) {
          validMoves.push({ row, col });
        }
      }
    }

    return validMoves;
  }
} 