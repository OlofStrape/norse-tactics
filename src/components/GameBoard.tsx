import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { GameState, Position } from '../types/game';
import GameCard from './GameCard.tsx';

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  background: #2a2a2a;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Cell = styled.div<{ isPlayable: boolean }>`
  width: 120px;
  height: 160px;
  background: ${props => props.isPlayable ? '#3a3a3a' : '#2a2a2a'};
  border: 2px solid #4a4a4a;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${props => props.isPlayable ? 'pointer' : 'default'};
  transition: all 0.2s ease;

  &:hover {
    transform: ${props => props.isPlayable ? 'scale(1.05)' : 'none'};
    border-color: ${props => props.isPlayable ? '#6a6a6a' : '#4a4a4a'};
  }
`;

interface GameBoardProps {
  gameState: GameState;
  onCellClick: (position: Position) => void;
  onCapture?: (cardId: string, isChainReaction: boolean) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState, onCellClick, onCapture }) => {
  const [capturingCards, setCapturingCards] = useState<Set<string>>(new Set());
  const [chainReactionCards, setChainReactionCards] = useState<Set<string>>(new Set());

  const isCellPlayable = (row: number, col: number) => {
    return gameState.board[row][col] === null;
  };

  useEffect(() => {
    // Reset animation states after each turn
    setCapturingCards(new Set());
    setChainReactionCards(new Set());
  }, [gameState.turnCount]);

  const handleCapture = useCallback((cardId: string, isChainReaction: boolean = false) => {
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
    onCapture?.(cardId, isChainReaction);
  }, [onCapture]);

  // Connect the capture handler to the game logic
  useEffect(() => {
    if (onCapture) {
      const handleGameCapture = (cardId: string, isChainReaction: boolean) => {
        handleCapture(cardId, isChainReaction);
      };
      // @ts-ignore - we'll add this to the window object temporarily
      window.handleGameCapture = handleGameCapture;
    }
  }, [onCapture, handleCapture]);

  return (
    <BoardContainer>
      <Grid>
        {Array.from({ length: 3 }, (_, row) => (
          Array.from({ length: 3 }, (_, col) => {
            const card = gameState.board[row][col];
            const isCapturing = card ? capturingCards.has(card.id) : false;
            const isChainReaction = card ? chainReactionCards.has(card.id) : false;

            return (
              <Cell
                key={`${row}-${col}`}
                isPlayable={isCellPlayable(row, col)}
                onClick={() => isCellPlayable(row, col) && onCellClick({ row, col })}
              >
                {card && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <GameCard
                      card={card}
                      isCapturing={isCapturing}
                      isChainReaction={isChainReaction}
                    />
                  </motion.div>
                )}
              </Cell>
            );
          })
        ))}
      </Grid>
    </BoardContainer>
  );
}; 