import { Card, Position, GameState, GameRules } from '../types/game';

export class GameLogic {
  private static directions = [
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 },  // right
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
  ];

  static initializeGame(player1Cards: Card[], player2Cards: Card[]): GameState {
    return {
      board: Array(3).fill(null).map(() => Array(3).fill(null)),
      player1Hand: player1Cards,
      player2Hand: player2Cards,
      currentPlayer: 'player1',
      score: {
        player1: 0,
        player2: 0,
      },
    };
  }

  static isValidMove(state: GameState, position: Position): boolean {
    return position.row >= 0 && position.row < 3 &&
           position.col >= 0 && position.col < 3 &&
           state.board[position.row][position.col] === null;
  }

  static getAdjacentCards(board: (Card | null)[][], position: Position): { card: Card; direction: string; position: Position }[] {
    return this.directions.map((dir, index) => {
      const newRow = position.row + dir.row;
      const newCol = position.col + dir.col;
      
      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3 && board[newRow][newCol]) {
        return {
          card: board[newRow][newCol]!,
          direction: ['left', 'right', 'up', 'down'][index],
          position: { row: newRow, col: newCol }
        };
      }
      return null;
    }).filter((result): result is NonNullable<typeof result> => result !== null);
  }

  static compareCards(playedCard: Card, adjacentCard: Card, direction: string): boolean {
    const getComparisonValues = () => {
      switch (direction) {
        case 'left': return { played: playedCard.left, adjacent: adjacentCard.right };
        case 'right': return { played: playedCard.right, adjacent: adjacentCard.left };
        case 'up': return { played: playedCard.top, adjacent: adjacentCard.bottom };
        case 'down': return { played: playedCard.bottom, adjacent: adjacentCard.top };
        default: return { played: 0, adjacent: 0 };
      }
    };

    const { played, adjacent } = getComparisonValues();
    return played > adjacent;
  }

  static checkSameRule(playedCard: Card, adjacentCards: { card: Card; direction: string }[]): boolean {
    const values: number[] = [];
    adjacentCards.forEach(({ card, direction }) => {
      switch (direction) {
        case 'left': values.push(card.right); break;
        case 'right': values.push(card.left); break;
        case 'up': values.push(card.bottom); break;
        case 'down': values.push(card.top); break;
      }
    });

    return values.length >= 2 && values.every(v => v === values[0]);
  }

  static checkPlusRule(playedCard: Card, adjacentCards: { card: Card; direction: string }[]): boolean {
    const sums: number[] = [];
    adjacentCards.forEach(({ card, direction }) => {
      switch (direction) {
        case 'left': sums.push(playedCard.left + card.right); break;
        case 'right': sums.push(playedCard.right + card.left); break;
        case 'up': sums.push(playedCard.top + card.bottom); break;
        case 'down': sums.push(playedCard.bottom + card.top); break;
      }
    });

    return sums.length >= 2 && sums.every(s => s === sums[0]);
  }

  static playCard(
    state: GameState,
    card: Card,
    position: Position,
    rules: GameRules
  ): GameState {
    if (!this.isValidMove(state, position)) {
      return state;
    }

    const newState = JSON.parse(JSON.stringify(state)) as GameState;
    const playedCard = { ...card, owner: state.currentPlayer };
    newState.board[position.row][position.col] = playedCard;

    // Remove the played card from the player's hand
    const hand = state.currentPlayer === 'player1' ? 'player1Hand' : 'player2Hand';
    newState[hand] = newState[hand].filter(c => c.id !== card.id);

    // Get adjacent cards
    const adjacentCards = this.getAdjacentCards(newState.board, position);
    const cardsToFlip = new Set<string>();

    // Check for special rules
    if (rules.same && this.checkSameRule(playedCard, adjacentCards)) {
      adjacentCards.forEach(({ card }) => cardsToFlip.add(`${card.id}`));
    }

    if (rules.plus && this.checkPlusRule(playedCard, adjacentCards)) {
      adjacentCards.forEach(({ card }) => cardsToFlip.add(`${card.id}`));
    }

    // Normal capture rules
    adjacentCards.forEach(({ card, direction, position }) => {
      if (this.compareCards(playedCard, card, direction)) {
        cardsToFlip.add(`${card.id}`);
      }
    });

    // Flip captured cards
    newState.board = newState.board.map(row =>
      row.map(cell => {
        if (cell && cardsToFlip.has(cell.id)) {
          return { ...cell, owner: state.currentPlayer };
        }
        return cell;
      })
    );

    // Update scores
    newState.score = {
      player1: newState.board.flat().filter(cell => cell?.owner === 'player1').length,
      player2: newState.board.flat().filter(cell => cell?.owner === 'player2').length,
    };

    // Switch players
    newState.currentPlayer = state.currentPlayer === 'player1' ? 'player2' : 'player1';

    return newState;
  }

  static isGameOver(state: GameState): boolean {
    return state.board.flat().filter(cell => cell === null).length === 0;
  }

  static getWinner(state: GameState): 'player1' | 'player2' | 'draw' {
    if (state.score.player1 > state.score.player2) return 'player1';
    if (state.score.player2 > state.score.player1) return 'player2';
    return 'draw';
  }
} 