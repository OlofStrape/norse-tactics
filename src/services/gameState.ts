import { GameState } from '../types/game';

const GAME_STATE_KEY = 'norse_tactics_game_state';
const GAME_HISTORY_KEY = 'norse_tactics_game_history';

export class GameStateManager {
  static saveGameState(state: GameState) {
    try {
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }

  static loadGameState(): GameState | null {
    try {
      const savedState = localStorage.getItem(GAME_STATE_KEY);
      if (savedState) {
        const state = JSON.parse(savedState);
        // Convert string dates back to Date objects
        state.matchStartTime = new Date(state.matchStartTime);
        return state;
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    }
    return null;
  }

  static clearGameState() {
    try {
      localStorage.removeItem(GAME_STATE_KEY);
    } catch (error) {
      console.error('Failed to clear game state:', error);
    }
  }

  static saveGameHistory(gameResult: {
    winner: 'player' | 'opponent' | 'draw';
    score: { player: number; opponent: number };
    turnCount: number;
    duration: number;
    date: Date;
  }) {
    try {
      const history = this.loadGameHistory();
      history.push(gameResult);
      localStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save game history:', error);
    }
  }

  static loadGameHistory(): Array<{
    winner: 'player' | 'opponent' | 'draw';
    score: { player: number; opponent: number };
    turnCount: number;
    duration: number;
    date: Date;
  }> {
    try {
      const savedHistory = localStorage.getItem(GAME_HISTORY_KEY);
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        // Convert string dates back to Date objects
        return history.map((game: any) => ({
          ...game,
          date: new Date(game.date)
        }));
      }
    } catch (error) {
      console.error('Failed to load game history:', error);
    }
    return [];
  }

  static clearGameHistory() {
    try {
      localStorage.removeItem(GAME_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear game history:', error);
    }
  }
} 