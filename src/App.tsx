import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { GameBoard } from './components/GameBoard.tsx';
import GameCard from './components/GameCard.tsx';
import { GameLogic } from './services/gameLogic.ts';
import { cards } from './data/cards.ts';
import { Card, GameState, Position, GameRules } from './types/game';

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
  gap: 0.5rem;
`;

const CardWrapper = styled.div`
  width: 100%;
  aspect-ratio: 3/4;
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
  });
  const [capturingCards, setCapturingCards] = useState<Set<string>>(new Set());
  const [chainReactionCards, setChainReactionCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initialize game state after component mount
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const player1Cards = shuffled.slice(0, 5);
    const player2Cards = shuffled.slice(5, 10);
    setGameState(GameLogic.initializeGame(player1Cards, player2Cards));
  }, []);

  const handleCapture = useCallback((cardId: string, isChainReaction: boolean) => {
    if (isChainReaction) {
      setChainReactionCards(prev => new Set([...prev, cardId]));
      setTimeout(() => {
        setChainReactionCards(prev => {
          const newSet = new Set(prev);
          newSet.delete(cardId);
          return newSet;
        });
      }, 1000);
    } else {
      setCapturingCards(prev => new Set([...prev, cardId]));
      setTimeout(() => {
        setCapturingCards(prev => {
          const newSet = new Set(prev);
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

  const handleCellClick = (position: Position) => {
    if (!selectedCard) return;

    const newState = GameLogic.playCard(gameState, selectedCard, position, rules, handleCapture);
    setGameState(newState);
    setSelectedCard(null);

    if (GameLogic.isGameOver(newState)) {
      const winner = GameLogic.getWinner(newState);
      alert(`Game Over! ${winner === 'draw' ? "It's a draw!" : `${winner} wins!`}`);
    }
  };

  const toggleRule = (rule: keyof GameRules) => {
    setRules(prev => ({ ...prev, [rule]: !prev[rule] }));
  };

  return (
    <AppContainer>
      <Title>Norse Tactics</Title>
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
            Player 1 (Score: {gameState.score.player})
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
            Player 2 (Score: {gameState.score.opponent})
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
  );
};

export default App; 