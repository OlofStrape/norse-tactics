import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { GameBoard } from './GameBoard';
import GameCard from './GameCard';
import { GameLogic } from '../services/gameLogic';
import { Card, GameState, Position, GameRules } from '../types/game';
import { AILogic } from '../services/aiLogic';
import { AILoadingIndicator } from './AILoadingIndicator';
import { EndGameModal } from './EndGameModal';
import { motion } from 'framer-motion';
import { AIDifficultySelector } from './AIDifficultySelector';

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
  background: ${props => props.isActive ? '#ffd700' : 'transparent'};
  border-radius: 8px;
  text-align: center;
  border: 2px solid ${props => props.isActive ? '#ffd700' : 'rgba(60, 40, 20, 0.7)'};
  color: ${props => props.isActive ? '#bfa100' : 'white'};
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  font-weight: bold;
  font-size: 1.1rem;
  &:hover {
    background: ${props => props.isActive ? '#ffed4a' : 'rgba(255,255,255,0.08)'};
  }
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
  background: ${props => props.active ? '#ffd700' : 'transparent'};
  color: ${props => props.active ? '#bfa100' : 'white'};
  border: 2px solid ${props => props.active ? '#ffd700' : 'rgba(60, 40, 20, 0.7)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#ffed4a' : 'rgba(255,255,255,0.08)'};
  }
`;

interface GameSessionProps {
  playerDeck: Card[];
  opponentDeck: Card[];
  rules: GameRules;
  aiDifficulty: 'easy' | 'medium' | 'hard';
  onGameEnd: (winner: 'player' | 'opponent' | 'draw') => void;
  title?: string;
  unlockedAbilities?: string[];
  showControls?: boolean;
}

export const GameSession: React.FC<GameSessionProps> = ({
  playerDeck,
  opponentDeck,
  rules: initialRules,
  aiDifficulty,
  onGameEnd,
  title,
  unlockedAbilities = [],
  showControls = true
}) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [rules, setRules] = useState<GameRules>(initialRules);
  const [capturingCards, setCapturingCards] = useState<Set<string>>(new Set());
  const [chainReactionCards, setChainReactionCards] = useState<Set<string>>(new Set());
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'opponent' | 'draw' | null>(null);
  const [usedAbilities, setUsedAbilities] = useState<string[]>([]);
  const [activeAbility, setActiveAbility] = useState<string | null>(null);

  useEffect(() => {
    const initialState = GameLogic.initializeGame(playerDeck, opponentDeck);
    initialState.rules = rules;
    setGameState(initialState);
    setIsGameOver(false);
    setWinner(null);
    setSelectedCard(null);
    setCapturingCards(new Set());
    setChainReactionCards(new Set());
    // eslint-disable-next-line
  }, [playerDeck, opponentDeck, aiDifficulty]);

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
    window.handleGameCapture = handleCapture;
    return () => { delete window.handleGameCapture; };
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
    let cardToPlay = cardArg || selectedCard;
    if (!cardToPlay) return;

    // If Berserker Rage is active and it's the player's turn, apply the effect
    if (activeAbility === 'Berserker Rage' && gameState.currentTurn === 'player') {
      cardToPlay = applyBerserkerRage(cardToPlay);
      setActiveAbility(null); // Reset after use
      setUsedAbilities(prev => [...prev, 'Berserker Rage']);
    }

    const newState = GameLogic.playCard(gameState, cardToPlay, position, rules, handleCapture);
    setGameState(newState);
    setSelectedCard(null);

    if (GameLogic.isGameOver(newState)) {
      const winner = GameLogic.getWinner(newState);
      setIsGameOver(true);
      setWinner(winner);
      onGameEnd(winner);
      return;
    }

    // If it's now the AI's turn, trigger AI move after a short delay
    if (newState.currentTurn === 'opponent') {
      setIsAIThinking(true);
      setTimeout(() => {
        triggerAIMove(newState);
      }, 700);
    }
  };

  // AI move logic
  const triggerAIMove = (state: GameState) => {
    if (GameLogic.isGameOver(state)) {
      setIsAIThinking(false);
      setIsGameOver(true);
      setWinner(GameLogic.getWinner(state));
      onGameEnd(GameLogic.getWinner(state));
      return;
    }
    const ai = new AILogic(rules, aiDifficulty);
    const aiHand = state.player2Hand;
    if (aiHand.length === 0) {
      setIsAIThinking(false);
      setIsGameOver(true);
      setWinner(GameLogic.getWinner(state));
      onGameEnd(GameLogic.getWinner(state));
      return;
    }
    const aiCard = aiHand[0];
    const aiPosition = ai.getBestMove(state);
    if (!aiPosition) {
      setIsAIThinking(false);
      setIsGameOver(true);
      setWinner(GameLogic.getWinner(state));
      onGameEnd(GameLogic.getWinner(state));
      return;
    }
    const newState = GameLogic.playCard(state, aiCard, aiPosition, rules, handleCapture);
    setGameState(newState);
    setIsAIThinking(false);

    if (GameLogic.isGameOver(newState)) {
      setIsGameOver(true);
      setWinner(GameLogic.getWinner(newState));
      onGameEnd(GameLogic.getWinner(newState));
    }
  };

  const toggleRule = (rule: keyof GameRules) => {
    setRules(prev => ({ ...prev, [rule]: !prev[rule] }));
  };

  function handleActivateAbility(ability: string) {
    if (usedAbilities.includes(ability)) return;
    if (ability === 'Berserker Rage') {
      setActiveAbility('Berserker Rage');
    } else {
      // Placeholder for other abilities
      setUsedAbilities([...usedAbilities, ability]);
      alert(`Activated ability: ${ability}! (Effect not yet implemented)`);
    }
  }

  // Helper to apply Berserker Rage effect
  function applyBerserkerRage(card: Card): Card {
    return {
      ...card,
      top: card.top * 2,
      right: card.right * 2,
      bottom: card.bottom * 2,
      left: card.left * 2,
      name: card.name + ' (Berserked)',
      // Optionally, add a visual indicator property
    };
  }

  const fontStyles = `
    @font-face {
      font-family: 'Norse';
      src: url('/fonts/Norse.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'NorseBold';
      src: url('/fonts/Norsebold.otf') format('opentype');
      font-weight: bold;
      font-style: normal;
    }
  `;

  return (
    <>
      <style>{fontStyles}</style>
      <AppContainer style={{ position: 'relative', background: 'none' }}>
        {title && <Title>{title}</Title>}
        {showControls && (
          <AIDifficultySelector
            selectedDifficulty={aiDifficulty}
            onDifficultyChange={() => {}}
          />
        )}
        {isAIThinking && <AILoadingIndicator />}
        <EndGameModal
          isOpen={isGameOver}
          winner={winner || 'draw'}
          playerScore={gameState.score.player}
          opponentScore={gameState.score.opponent}
          onRestart={() => window.location.reload()}
        />
        {showControls && (
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
        )}
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
        {/* Unlocked Abilities UI */}
        {unlockedAbilities && unlockedAbilities.length > 0 && (
          <div style={{ margin: '1rem 0', background: '#222', color: '#ffd700', padding: '0.75rem 1.5rem', borderRadius: 8, boxShadow: '0 0 8px #ffd70055' }}>
            <strong>Unlocked Abilities:</strong>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {unlockedAbilities.map((ability, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  {ability}
                  <button
                    style={{ marginLeft: 12, padding: '2px 10px', borderRadius: 6, border: 'none', background: usedAbilities.includes(ability) ? '#888' : (activeAbility === ability ? '#ffd700' : '#ffd700'), color: '#222', fontWeight: 'bold', cursor: usedAbilities.includes(ability) ? 'not-allowed' : 'pointer', boxShadow: activeAbility === ability ? '0 0 8px #ffd700' : undefined }}
                    disabled={usedAbilities.includes(ability) || activeAbility === ability}
                    onClick={() => handleActivateAbility(ability)}
                  >
                    {usedAbilities.includes(ability) ? 'Used' : (activeAbility === ability ? 'Active' : 'Activate')}
                  </button>
                </li>
              ))}
            </ul>
            {/* Show a visual indicator if Berserker Rage is active */}
            {activeAbility === 'Berserker Rage' && (
              <div style={{ color: '#ffd700', fontWeight: 'bold', marginTop: 8, textShadow: '0 0 6px #ffd700' }}>
                Berserker Rage active! Your next card will be empowered.
              </div>
            )}
          </div>
        )}
      </AppContainer>
    </>
  );
}; 