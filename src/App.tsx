import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { GameBoard } from './components/GameBoard.tsx';
import { GameCard } from './components/GameCard.tsx';
import { GameLogic } from './services/gameLogic';
import { cards } from './data/cards';
import { Card, GameState, Position, GameRules } from './types/game';

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
  const [gameState, setGameState] = useState<GameState>(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const player1Cards = shuffled.slice(0, 5);
    const player2Cards = shuffled.slice(5, 10);
    return GameLogic.initializeGame(player1Cards, player2Cards);
  });

  const [rules, setRules] = useState<GameRules>({
    same: false,
    plus: false,
    elements: false,
    ragnarok: false,
  });

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleCardSelect = (card: Card) => {
    if (gameState.currentPlayer === 'player1' && gameState.player1Hand.includes(card)) {
      setSelectedCard(card);
    } else if (gameState.currentPlayer === 'player2' && gameState.player2Hand.includes(card)) {
      setSelectedCard(card);
    }
  };

  const handleCellClick = (position: Position) => {
    if (!selectedCard) return;

    const newState = GameLogic.playCard(gameState, selectedCard, position, rules);
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
          <PlayerInfo isActive={gameState.currentPlayer === 'player1'}>
            Player 1 (Score: {gameState.score.player1})
          </PlayerInfo>
          <HandContainer>
            {gameState.player1Hand.map(card => (
              <CardWrapper key={card.id}>
                <GameCard
                  card={card}
                  isPlayable={gameState.currentPlayer === 'player1'}
                  onClick={() => handleCardSelect(card)}
                />
              </CardWrapper>
            ))}
          </HandContainer>
        </PlayerHand>

        <GameBoard gameState={gameState} onCellClick={handleCellClick} />

        <PlayerHand>
          <PlayerInfo isActive={gameState.currentPlayer === 'player2'}>
            Player 2 (Score: {gameState.score.player2})
          </PlayerInfo>
          <HandContainer>
            {gameState.player2Hand.map(card => (
              <CardWrapper key={card.id}>
                <GameCard
                  card={card}
                  isPlayable={gameState.currentPlayer === 'player2'}
                  onClick={() => handleCardSelect(card)}
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
          `${gameState.currentPlayer === 'player1' ? 'Player 1' : 'Player 2'}'s turn`
        )}
      </GameInfo>
    </AppContainer>
  );
};

export default App; 