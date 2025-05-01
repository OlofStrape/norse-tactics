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

  static compareCards(playedCard: Card, adjacentCard: Card, direction: string): { captured: boolean; value: number } {
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
    return {
      captured: played > adjacent,
      value: played - adjacent
    };
  }

  static checkSameRule(playedCard: Card, adjacentCards: { card: Card; direction: string }[]): { captured: boolean; cards: Card[] } {
    const values: number[] = [];
    const cards: Card[] = [];
    
    adjacentCards.forEach(({ card, direction }) => {
      switch (direction) {
        case 'left': values.push(card.right); break;
        case 'right': values.push(card.left); break;
        case 'up': values.push(card.bottom); break;
        case 'down': values.push(card.top); break;
      }
      cards.push(card);
    });

    return {
      captured: values.length >= 2 && values.every(v => v === values[0]),
      cards
    };
  }

  static checkPlusRule(playedCard: Card, adjacentCards: { card: Card; direction: string }[]): { captured: boolean; cards: Card[] } {
    const sums: number[] = [];
    const cards: Card[] = [];
    
    adjacentCards.forEach(({ card, direction }) => {
      switch (direction) {
        case 'left': sums.push(playedCard.left + card.right); break;
        case 'right': sums.push(playedCard.right + card.left); break;
        case 'up': sums.push(playedCard.top + card.bottom); break;
        case 'down': sums.push(playedCard.bottom + card.top); break;
      }
      cards.push(card);
    });

    return {
      captured: sums.length >= 2 && sums.every(s => s === sums[0]),
      cards
    };
  }

  private static processChainReaction(
    board: (Card | null)[][],
    position: Position,
    currentTurn: 'player' | 'opponent',
    rules: GameRules,
    onCapture?: (cardId: string, isChainReaction: boolean) => void
  ): { board: (Card | null)[][] } {
    const newBoard = [...board];
    let cardsToProcess = [position];
    let processedPositions = new Set<string>();

    while (cardsToProcess.length > 0) {
      const currentPos = cardsToProcess.shift()!;
      const posKey = `${currentPos.row},${currentPos.col}`;
      
      if (processedPositions.has(posKey)) continue;
      processedPositions.add(posKey);

      const currentCard = newBoard[currentPos.row][currentPos.col];
      if (!currentCard || currentCard.owner !== currentTurn) continue;

      const adjacentCards = this.getAdjacentCards(newBoard, currentPos);
      
      // Check normal captures
      adjacentCards.forEach(({ card: adjacentCard, direction, position: adjPos }) => {
        if (adjacentCard.owner === currentTurn) return;
        
        const { captured } = this.compareCards(currentCard, adjacentCard, direction);
        if (captured) {
          newBoard[adjPos.row][adjPos.col] = {
            ...newBoard[adjPos.row][adjPos.col]!,
            owner: currentTurn
          };
          cardsToProcess.push(adjPos);
          // @ts-ignore - we'll use the window handler
          window.handleGameCapture?.(adjacentCard.id, processedPositions.size > 1);
        }
      });

      // Check special rules
      if (rules.same) {
        const { captured, cards } = this.checkSameRule(currentCard, adjacentCards);
        if (captured) {
          cards.forEach(capturedCard => {
            const pos = this.findCardPosition(newBoard, capturedCard);
            if (pos && capturedCard.owner !== currentTurn) {
              newBoard[pos.row][pos.col] = {
                ...newBoard[pos.row][pos.col]!,
                owner: currentTurn
              };
              cardsToProcess.push(pos);
              // @ts-ignore - we'll use the window handler
              window.handleGameCapture?.(capturedCard.id, processedPositions.size > 1);
            }
          });
        }
      }

      if (rules.plus) {
        const { captured, cards } = this.checkPlusRule(currentCard, adjacentCards);
        if (captured) {
          cards.forEach(capturedCard => {
            const pos = this.findCardPosition(newBoard, capturedCard);
            if (pos && capturedCard.owner !== currentTurn) {
              newBoard[pos.row][pos.col] = {
                ...newBoard[pos.row][pos.col]!,
                owner: currentTurn
              };
              cardsToProcess.push(pos);
              // @ts-ignore - we'll use the window handler
              window.handleGameCapture?.(capturedCard.id, processedPositions.size > 1);
            }
          });
        }
      }
    }

    return { board: newBoard };
  }

  static playCard(
    state: GameState,
    card: Card,
    position: Position,
    rules: GameRules,
    onCapture?: (cardId: string, isChainReaction: boolean) => void
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

    // Process initial captures and chain reactions
    const { board } = this.processChainReaction(
      newState.board,
      position,
      state.currentTurn,
      rules,
      onCapture
    );
    newState.board = board;

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

  private static findCardPosition(board: (Card | null)[][], card: Card): Position | null {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col]?.id === card.id) {
          return { row, col };
        }
      }
    }
    return null;
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