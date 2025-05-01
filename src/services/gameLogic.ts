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
      currentTurn: 'player',
      score: {
        player: 0,
        opponent: 0,
      },
      rules: {
        same: false,
        plus: false,
        elements: false,
        ragnarok: false,
      },
      ragnarokCounter: 0,
      activeEffects: [],
      isMultiplayer: false,
      isVsAI: false,
      player1Stats: {
        id: 'player1',
        name: 'Player 1',
        rank: 0,
      },
      player2Stats: {
        id: 'player2',
        name: 'Player 2',
        rank: 0,
      },
      turnCount: 0,
      matchStartTime: new Date(),
      gameStatus: 'active',
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
    const newState = { ...state };

    // Remove card from player's hand
    newState.player1Hand = state.currentTurn === 'player' 
      ? state.player1Hand.filter(c => c.id !== card.id)
      : state.player1Hand;
    newState.player2Hand = state.currentTurn === 'opponent'
      ? state.player2Hand.filter(c => c.id !== card.id)
      : state.player2Hand;

    // Place card on board
    newState.board[position.row][position.col] = {
      ...card,
      owner: state.currentTurn
    };

    // Check for captures
    const adjacentCards = this.getAdjacentCards(newState.board, position);
    let captured = false;

    if (rules.same) {
      captured = captured || this.checkSameRule(card, adjacentCards);
    }

    if (rules.plus) {
      captured = captured || this.checkPlusRule(card, adjacentCards);
    }

    if (captured) {
      adjacentCards.forEach(({ card: adjacentCard, position: adjPos }) => {
        if (newState.board[adjPos.row][adjPos.col]) {
          newState.board[adjPos.row][adjPos.col] = {
            ...newState.board[adjPos.row][adjPos.col]!,
            owner: state.currentTurn
          };
        }
      });
    }

    // Update scores
    newState.score = {
      player: newState.board.flat().filter(cell => cell?.owner === 'player').length,
      opponent: newState.board.flat().filter(cell => cell?.owner === 'opponent').length,
    };

    // Switch turns
    newState.currentTurn = state.currentTurn === 'player' ? 'opponent' : 'player';
    newState.turnCount++;

    return newState;
  }

  static isGameOver(state: GameState): boolean {
    return state.board.flat().every(cell => cell !== null);
  }

  static getWinner(state: GameState): 'player' | 'opponent' | 'draw' {
    if (state.score.player > state.score.opponent) return 'player';
    if (state.score.opponent > state.score.player) return 'opponent';
    return 'draw';
  }
} 