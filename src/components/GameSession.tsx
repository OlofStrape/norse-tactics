import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { GameBoard } from './GameBoard';
import GameCard from './GameCard';
import { GameLogic } from '../services/gameLogic';
import { Card, GameState, Position, GameRules } from '../types/game';
import { AILogic } from '../services/aiLogic';
import { LoadingSpinner } from './AILoadingIndicator';
import { EndGameModal } from './EndGameModal';
import { motion } from 'framer-motion';
import { AIDifficultySelector } from './AIDifficultySelector';
import { useNavigate } from 'react-router-dom';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  color: white;
  padding: 1rem;
`;

const Title = styled.h1`
  font-family: 'Norse', 'Cinzel Decorative', serif;
  font-size: 2.2rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  @media (max-width: 700px) {
    display: none;
  }
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const HandContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2.5rem;
  justify-items: center;
  align-items: center;
  width: 100%;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  &.player1 {
    margin-top: 0;
    margin-bottom: 1.2rem;
  }
  &.player2 {
    margin-top: 1.2rem;
    margin-bottom: 0;
  }
  @media (max-width: 700px) {
    gap: 1.7rem;
    margin-top: 0.1rem;
    margin-bottom: 0.1rem;
    &.player1 {
      margin-top: 0;
      margin-bottom: 0.7rem;
    }
    &.player2 {
      margin-top: 0.7rem;
      margin-bottom: 0;
    }
  }
`;

const PlayerInfo = styled.div<{ isActive: boolean }>`
  padding: 0.7rem 2rem;
  background: ${props => props.isActive ? '#ffd700' : 'transparent'};
  border-radius: 8px;
  text-align: center;
  border: 2px solid ${props => props.isActive ? '#ffd700' : 'rgba(60, 40, 20, 0.7)'};
  color: ${props => props.isActive ? '#bfa100' : 'white'};
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  font-weight: bold;
  font-size: 1.1rem;
  margin: 0.08rem 0 0.04rem 0;
  width: 100%;
  max-width: 420px;
  @media (max-width: 700px) {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    max-width: 98vw;
  }
`;

const CardWrapper = styled.div`
  width: 80px;
  height: 120px;
  @media (max-width: 700px) {
    width: 44px;
    height: 66px;
    min-width: 36px;
    min-height: 48px;
    max-width: 60px;
    max-height: 90px;
  }
`;

const BoardWrapper = styled.div`
  width: 100%;
  max-width: 270px;
  aspect-ratio: 3 / 4;
  height: auto;
  margin: 1rem auto;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  border-radius: 16px;
`;

const GameInfo = styled.div`
  margin-top: 0.7rem;
  text-align: center;
  font-size: 1.1rem;
  @media (max-width: 700px) {
    font-size: 0.95rem;
    margin-top: 0.3rem;
  }
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

// Add a new TurnBar styled component for the top bar
const TurnBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 480px;
  margin: 1.2rem auto 0.3rem auto;
  padding: 0.5rem 0.2rem;
  font-size: 1.1rem;
  font-family: 'NorseBold', 'Norse', serif;
  background: rgba(40, 30, 10, 0.85);
  border-radius: 10px;
  box-shadow: 0 1px 8px #0004;
  gap: 1.2rem;
  @media (max-width: 700px) {
    font-size: 1rem;
    max-width: 98vw;
    gap: 0.5rem;
    padding: 0.3rem 0.1rem;
    margin-top: 0.7rem;
    margin-bottom: 0.2rem;
  }
`;

const PlayerLabel = styled.span<{ active: boolean }>`
  color: ${({ active }) => (active ? '#ffd700' : '#fff')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  text-shadow: ${({ active }) => (active ? '0 0 8px #ffd70088' : 'none')};
  transition: color 0.2s, text-shadow 0.2s;
`;

const Score = styled.span`
  color: #ffd700;
  margin: 0 0.2rem;
`;

const Clock = styled.span`
  color: #fff;
  font-size: 1.1em;
  font-family: 'NorseBold', 'Norse', serif;
  background: #222a;
  border-radius: 6px;
  padding: 0.1em 0.7em;
  margin: 0 0.5em;
  min-width: 2.2em;
  text-align: center;
`;

const BackButton = styled.button`
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 0.5rem 1.2rem;
  font-size: 1.1rem;
  border-radius: 6px;
  border: none;
  background: rgba(24,24,24,0.18);
  color: #ffd700;
  font-family: 'Norse', 'Cinzel Decorative', serif;
  font-weight: 400;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: none;
  z-index: 10;
  transition: background 0.2s;
  text-shadow: 0 1px 6px #fff6, 0 0 2px #ffd70022;
  &:hover {
    background: rgba(24,24,24,0.28);
  }
`;

const MuteButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(32,32,32,0.18);
  border: none;
  border-radius: 50%;
  color: #ffd700;
  font-size: 1.6rem;
  opacity: 0.55;
  cursor: pointer;
  z-index: 20;
  transition: background 0.2s, color 0.2s, opacity 0.2s;
  &:hover, &:focus {
    background: rgba(32,32,32,0.32);
    color: #fff8b0;
    opacity: 1;
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

// Simple sound manager hook
function useSound() {
  const [muted, setMuted] = React.useState(() => {
    const stored = localStorage.getItem('norse_muted');
    return stored === 'true';
  });
  useEffect(() => {
    localStorage.setItem('norse_muted', muted ? 'true' : 'false');
  }, [muted]);
  return [muted, setMuted] as const;
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
  const [turnTimer, setTurnTimer] = useState(30);
  const [missedTurnCount, setMissedTurnCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [muted, setMuted] = useSound();

  useEffect(() => {
    const initialState = GameLogic.initializeGame(playerDeck, opponentDeck);
    initialState.rules = rules;
    setGameState(initialState);
    setIsGameOver(false);
    setWinner(null);
    setSelectedCard(null);
    setCapturingCards(new Set());
    setChainReactionCards(new Set());
    setIsLoading(true);
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

  // Add a useEffect to show the card preview only on mobile
  useEffect(() => {
    const updatePreviewVisibility = () => {
      const preview = document.querySelector('.card-preview-mobile') as HTMLElement;
      if (preview) {
        preview.style.display = window.innerWidth <= 700 && selectedCard ? 'block' : 'none';
      }
    };
    window.addEventListener('resize', updatePreviewVisibility);
    updatePreviewVisibility();
    return () => window.removeEventListener('resize', updatePreviewVisibility);
  }, [selectedCard]);

  // Timer effect for player turn
  useEffect(() => {
    if (!gameState || isGameOver) return;
    if (gameState.currentTurn !== 'player') return;
    setTurnTimer(30);
    let interval = setInterval(() => {
      setTurnTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Timeout: play random card
          if (gameState.currentTurn === 'player') {
            // Find all playable cards and positions
            const hand = gameState.player1Hand;
            const emptyCells: { row: number; col: number }[] = [];
            for (let row = 0; row < 3; row++) {
              for (let col = 0; col < 3; col++) {
                if (!gameState.board[row][col]) emptyCells.push({ row, col });
              }
            }
            if (hand.length > 0 && emptyCells.length > 0) {
              const card = hand[Math.floor(Math.random() * hand.length)];
              const pos = emptyCells[Math.floor(Math.random() * emptyCells.length)];
              handleCellClick(pos, card);
              setMissedTurnCount(c => c + 1);
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [gameState?.currentTurn, isGameOver]);

  // Reset missedTurnCount if player plays in time
  useEffect(() => {
    if (!gameState) return;
    if (gameState.currentTurn !== 'player') return;
    if (turnTimer === 30) setMissedTurnCount(0);
  }, [gameState?.turnCount]);

  // If missed two turns in a row, auto-lose
  useEffect(() => {
    if (missedTurnCount >= 2) {
      setIsGameOver(true);
      setWinner('opponent');
      onGameEnd('opponent');
    }
  }, [missedTurnCount, onGameEnd]);

  // All hooks are now above this early return
  if (!gameState) {
    return (
      <AppContainer>
        <Title>Loading...</Title>
        {isLoading && <LoadingSpinner text="Loading game..." />}
      </AppContainer>
    );
  }

  const handleCardSelect = (card: Card) => {
    if (window.innerWidth <= 700) {
      // On mobile, select card only
      setSelectedCard(card);
    } else {
      // On desktop, select and play immediately
      if (gameState.currentTurn === 'player' && gameState.player1Hand.includes(card)) {
        setSelectedCard(card);
      } else if (gameState.currentTurn === 'opponent' && gameState.player2Hand.includes(card)) {
        setSelectedCard(card);
      }
    }
  };

  const handleCellClick = (position: Position, cardArg?: Card) => {
    let cardToPlay = cardArg || selectedCard;
    if (window.innerWidth <= 700 && !selectedCard) return; // Require selection on mobile
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
      src: url('/fonts/Norse1.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'NorseBold';
      src: url('/fonts/Norsebold1.otf') format('opentype');
      font-weight: bold;
      font-style: normal;
    }
  `;

  return (
    <>
      <style>{fontStyles}</style>
      <AppContainer style={{ position: 'relative', background: 'none' }}>
        <BackButton onClick={() => navigate('/')} aria-label="Back to Menu">
          ←
        </BackButton>
        <MuteButton onClick={() => setMuted(m => !m)} aria-label={muted ? 'Unmute' : 'Mute'}>
          {muted ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 8V14H8L14 20V2L8 8H4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <line x1="17" y1="7" x2="21" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="21" y1="7" x2="17" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 8V14H8L14 20V2L8 8H4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M17 7C18.6569 8.65685 18.6569 11.3431 17 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M19 4C22.3137 7.31371 22.3137 12.6863 19 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </MuteButton>
        {title && <Title>{title}</Title>}
        {isAIThinking && <LoadingSpinner text="AI is thinking..." />}
        <EndGameModal
          isOpen={isGameOver}
          winner={winner || 'draw'}
          playerScore={gameState.score.player}
          opponentScore={gameState.score.opponent}
          onRestart={() => window.location.reload()}
        />
        {/* Turn marker bar at the very top */}
        <TurnBar>
          <PlayerLabel active={gameState.currentTurn === 'player'}>
            Player 1 <Score>({gameState.score.player})</Score>
          </PlayerLabel>
          <Clock>⏳ {gameState.currentTurn === 'player' ? turnTimer : 30}</Clock>
          <PlayerLabel active={gameState.currentTurn === 'opponent'}>
            Player 2 <Score>({gameState.score.opponent})</Score>
          </PlayerLabel>
        </TurnBar>
        <GameContainer>
          {/* Player 2 hand (top, horizontal) */}
          <HandContainer className="player2">
            {(() => {
              const hand = gameState.player2Hand;
              const emptySlots = Math.max(0, 5 - hand.length);
              return [
                ...hand.map(card => (
                  <CardWrapper key={card.id} style={selectedCard && selectedCard.id === card.id ? { border: '2px solid #ffd700', boxShadow: '0 0 8px #ffd700' } : {}}>
                    <GameCard
                      card={card}
                      isPlayable={gameState.currentTurn === 'opponent'}
                      onClick={() => handleCardSelect(card)}
                      isCapturing={capturingCards.has(card.id)}
                      isChainReaction={chainReactionCards.has(card.id)}
                    />
                  </CardWrapper>
                )),
                ...Array(emptySlots).fill(null).map((_, i) => <div key={`empty-p2-${i}`} />)
              ];
            })()}
          </HandContainer>
          <div style={{ height: '2.4rem' }} />
          {/* Board in the center */}
          <BoardWrapper>
            <GameBoard
              gameState={gameState}
              onCellClick={handleCellClick}
              onCapture={handleCapture}
            />
          </BoardWrapper>
          <div style={{ height: '1.2rem' }} />
          {/* Player 1 hand (bottom, horizontal) */}
          <HandContainer className="player1">
            {(() => {
              const hand = gameState.player1Hand;
              const emptySlots = Math.max(0, 5 - hand.length);
              return [
                ...hand.map(card => (
                  <CardWrapper key={card.id} style={selectedCard && selectedCard.id === card.id ? { border: '2px solid #ffd700', boxShadow: '0 0 8px #ffd700' } : {}}>
                    <GameCard
                      card={card}
                      isPlayable={gameState.currentTurn === 'player'}
                      onClick={() => handleCardSelect(card)}
                      isCapturing={capturingCards.has(card.id)}
                      isChainReaction={chainReactionCards.has(card.id)}
                    />
                  </CardWrapper>
                )),
                ...Array(emptySlots).fill(null).map((_, i) => <div key={`empty-p1-${i}`} />)
              ];
            })()}
          </HandContainer>
        </GameContainer>
      </AppContainer>
    </>
  );
};
