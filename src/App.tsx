import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { GameBoard } from './components/GameBoard';
import GameCard from './components/GameCard';
import { GameLogic } from './services/gameLogic';
import { cards } from './data/cards';
import { Card, GameState, Position, GameRules } from './types/game';
import { AILogic } from './services/aiLogic';
import { AILoadingIndicator } from './components/AILoadingIndicator';
import { EndGameModal } from './components/EndGameModal';
import { motion } from 'framer-motion';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AIDifficultySelector } from './components/AIDifficultySelector';

// Add window handler type
declare global {
  interface Window {
    handleGameCapture?: (cardId: string, isChainReaction: boolean) => void;
  }
}

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-family: 'Norse', 'Cinzel Decorative', serif;
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const GameContainer = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
`;

const PlayerHand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 200px;
`;

const PlayerInfo = styled.div<{ isActive: boolean }>`
  padding: 1rem;
  background: ${props => props.isActive ? '#3a3a3a' : '#2a2a2a'};
  border-radius: 8px;
  text-align: center;
  border: 2px solid ${props => props.isActive ? '#ffd700' : 'transparent'};
`;

const HandContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const CardWrapper = styled.div`
  width: 120px;
  height: 160px;
`;

const GameInfo = styled.div`
  margin-top: 2rem;
  text-align: center;
  font-size: 1.2rem;
`;

const RulesToggle = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const RuleButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? '#ffd700' : '#3a3a3a'};
  color: ${props => props.active ? '#1a1a1a' : 'white'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#ffed4a' : '#4a4a4a'};
  }
`;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [rules, setRules] = useState<GameRules>({
    same: false,
    plus: false,
    elements: false,
    ragnarok: false,
    captureRules: {
      sameElement: false,
      higherValue: false,
      adjacent: false,
    },
    chainReaction: false,
  });
  const [capturingCards, setCapturingCards] = useState<Set<string>>(new Set());
  const [chainReactionCards, setChainReactionCards] = useState<Set<string>>(new Set());
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'opponent' | 'draw' | null>(null);
  const [aiDifficulty, setAIDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const initializeGame = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const player1Cards = shuffled.slice(0, 5);
    const player2Cards = shuffled.slice(5, 10);
    setGameState(GameLogic.initializeGame(player1Cards, player2Cards));
    setIsGameOver(false);
    setWinner(null);
    setSelectedCard(null);
    setCapturingCards(new Set());
    setChainReactionCards(new Set());
  };

  useEffect(() => {
    // Initialize game state after component mount
    initializeGame();
  }, []);

  const handleCapture = useCallback((cardId: string, isChainReaction: boolean) => {
    if (isChainReaction) {
      setChainReactionCards(prev => new Set([...Array.from(prev), cardId]));
      setTimeout(() => {
        setChainReactionCards(prev => {
          const newSet = new Set(Array.from(prev));
          newSet.delete(cardId);
          return newSet;
        });
      }, 1000);
    } else {
      setCapturingCards(prev => new Set([...Array.from(prev), cardId]));
      setTimeout(() => {
        setCapturingCards(prev => {
          const newSet = new Set(Array.from(prev));
          newSet.delete(cardId);
          return newSet;
        });
      }, 1000);
    }
  }, []);

  useEffect(() => {
    // Set up the window handler for captures
    window.handleGameCapture = handleCapture;

    return () => {
      // Clean up the window handler
      delete window.handleGameCapture;
    };
  }, [handleCapture]);

  if (!gameState) {
    return (
      <AppContainer>
        <Title>Loading...</Title>
      </AppContainer>
    );
  }

  const handleCardSelect = (card: Card) => {
    if (gameState.currentTurn === 'player' && gameState.player1Hand.includes(card)) {
      setSelectedCard(card);
    } else if (gameState.currentTurn === 'opponent' && gameState.player2Hand.includes(card)) {
      setSelectedCard(card);
    }
  };

  const handleCellClick = (position: Position, cardArg?: Card) => {
    const cardToPlay = cardArg || selectedCard;
    if (!cardToPlay) return;

    const newState = GameLogic.playCard(gameState, cardToPlay, position, rules, handleCapture);
    setGameState(newState);
    setSelectedCard(null);

    if (GameLogic.isGameOver(newState)) {
      const winner = GameLogic.getWinner(newState);
      setIsGameOver(true);
      setWinner(winner);
      return;
    }

    // If it's now the AI's turn, trigger AI move after a short delay
    if (newState.currentTurn === 'opponent') {
      setIsAIThinking(true);
      setTimeout(() => {
        triggerAIMove(newState);
      }, 700); // 700ms delay for realism
    }
  };

  // AI move logic
  const triggerAIMove = (state: GameState) => {
    if (GameLogic.isGameOver(state)) {
      setIsAIThinking(false);
      setIsGameOver(true);
      setWinner(GameLogic.getWinner(state));
      return;
    }
    const ai = new AILogic(rules, aiDifficulty);
    // Pick the first available card in AI's hand
    const aiHand = state.player2Hand;
    if (aiHand.length === 0) {
      setIsAIThinking(false);
      setIsGameOver(true);
      setWinner(GameLogic.getWinner(state));
      return;
    }
    const aiCard = aiHand[0];
    // Pick the best move (currently random valid position)
    const aiPosition = ai.getBestMove(state);
    if (!aiPosition) {
      setIsAIThinking(false);
      setIsGameOver(true);
      setWinner(GameLogic.getWinner(state));
      return;
    }
    // Play the move
    const newState = GameLogic.playCard(state, aiCard, aiPosition, rules, handleCapture);
    setGameState(newState);
    setIsAIThinking(false);

    if (GameLogic.isGameOver(newState)) {
      setIsGameOver(true);
      setWinner(GameLogic.getWinner(newState));
    }
  };

  const toggleRule = (rule: keyof GameRules) => {
    setRules(prev => ({ ...prev, [rule]: !prev[rule] }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <Title>Norse Tactics</Title>
        <AIDifficultySelector
          selectedDifficulty={aiDifficulty}
          onDifficultyChange={setAIDifficulty}
        />
        {isAIThinking && <AILoadingIndicator />}
        <EndGameModal
          isOpen={isGameOver}
          winner={winner || 'draw'}
          playerScore={gameState.score.player}
          opponentScore={gameState.score.opponent}
          onRestart={initializeGame}
        />
        <RulesToggle>
          <RuleButton active={rules.same} onClick={() => toggleRule('same')}>
            Same Rule
          </RuleButton>
          <RuleButton active={rules.plus} onClick={() => toggleRule('plus')}>
            Plus Rule
          </RuleButton>
          <RuleButton active={rules.elements} onClick={() => toggleRule('elements')}>
            Elements
          </RuleButton>
          <RuleButton active={rules.ragnarok} onClick={() => toggleRule('ragnarok')}>
            Ragnarök
          </RuleButton>
        </RulesToggle>
        <GameContainer>
          <PlayerHand>
            <PlayerInfo isActive={gameState.currentTurn === 'player'}>
              Player 1 (Score: 
                <motion.span
                  key={gameState.score.player}
                  initial={{ scale: 1, color: '#ffd700' }}
                  animate={{ scale: [1.2, 1], color: ['#fff', '#ffd700'] }}
                  transition={{ duration: 0.4 }}
                  style={{ display: 'inline-block', marginLeft: 4 }}
                >
                  {gameState.score.player}
                </motion.span>
              )
            </PlayerInfo>
            <HandContainer>
              {gameState.player1Hand.map(card => (
                <CardWrapper key={card.id}>
                  <GameCard
                    card={card}
                    isPlayable={gameState.currentTurn === 'player'}
                    onClick={() => handleCardSelect(card)}
                    isCapturing={capturingCards.has(card.id)}
                    isChainReaction={chainReactionCards.has(card.id)}
                  />
                </CardWrapper>
              ))}
            </HandContainer>
          </PlayerHand>

          <GameBoard
            gameState={gameState}
            onCellClick={handleCellClick}
            onCapture={handleCapture}
          />

          <PlayerHand>
            <PlayerInfo isActive={gameState.currentTurn === 'opponent'}>
              Player 2 (Score: 
                <motion.span
                  key={gameState.score.opponent}
                  initial={{ scale: 1, color: '#ffd700' }}
                  animate={{ scale: [1.2, 1], color: ['#fff', '#ffd700'] }}
                  transition={{ duration: 0.4 }}
                  style={{ display: 'inline-block', marginLeft: 4 }}
                >
                  {gameState.score.opponent}
                </motion.span>
              )
            </PlayerInfo>
            <HandContainer>
              {gameState.player2Hand.map(card => (
                <CardWrapper key={card.id}>
                  <GameCard
                    card={card}
                    isPlayable={gameState.currentTurn === 'opponent'}
                    onClick={() => handleCardSelect(card)}
                    isCapturing={capturingCards.has(card.id)}
                    isChainReaction={chainReactionCards.has(card.id)}
                  />
                </CardWrapper>
              ))}
            </HandContainer>
          </PlayerHand>
        </GameContainer>

        <GameInfo>
          {selectedCard ? (
            `Selected: ${selectedCard.name} - Place it on the board`
          ) : (
            `${gameState.currentTurn === 'player' ? 'Player 1' : 'Player 2'}'s turn`
          )}
        </GameInfo>
      </AppContainer>
    </DndProvider>
  );
};

export default App; 