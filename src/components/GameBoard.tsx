import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { GameState, Position } from '../types/game';
import GameCard from './GameCard';
import { useDrop } from 'react-dnd';
import { CARD_TYPE } from './GameCard';

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

const runeSet = [
  '\u16A0', // ᚠ
  '\u16A2', // ᚢ
  '\u16A6', // ᚦ
  '\u16B1', // ᚱ
  '\u16B7', // ᚷ
  '\u16B9', // ᚹ
  '\u16BA', // ᚺ
  '\u16C1', // ᛁ
  '\u16C7', // ᛇ
  '\u16CB', // ᛈ
  '\u16CF', // ᛏ
  '\u16D2', // ᛒ
  '\u16D6', // ᛖ
  '\u16DA', // ᛚ
  '\u16DF', // ᛟ
];

const Cell = styled.div<{ isPlayable: boolean }>`
  width: 120px;
  height: 160px;
  background:
    /* noise overlay */
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><filter id="n" x="0" y="0"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2"/></filter><rect width="60" height="60" filter="url(%23n)" opacity="0.18"/></svg>'),
    /* stone grain */
    repeating-linear-gradient(135deg, #b0b0b0 0 8px, #a0a0a0 8px 16px, #b0b0b0 16px 24px),
    /* main stone color */
    linear-gradient(120deg, #bcbcbc 60%, #888 100%);
  border: 3px solid #444;
  border-radius: 10px;
  box-shadow:
    0 4px 16px rgba(0,0,0,0.28),
    0 1.5px 0 #666 inset,
    0 0 0 2px #888 inset;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${props => props.isPlayable ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 8px);
    pointer-events: none;
    z-index: 1;
  }
  &:hover {
    transform: ${props => props.isPlayable ? 'scale(1.05)' : 'none'};
    border-color: ${props => props.isPlayable ? '#ffd700' : '#4a4a4a'};
  }
`;

const Rune = styled.span`
  position: absolute;
  font-size: 3.5rem;
  color: #181818;
  opacity: 0.22;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  user-select: none;
  mix-blend-mode: multiply;
  z-index: 2;
  text-shadow: 0 2px 6px #000, 0 1px 0 #fff2, 0 0.5px 0 #fff2;
`;

interface GameBoardProps {
  gameState: GameState;
  onCellClick: (position: Position, card?: any) => void;
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

  const renderCell = (row: number, col: number) => {
    const isPlayable = isCellPlayable(row, col);
    // Drop target logic
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: CARD_TYPE,
      canDrop: (item) => isPlayable && gameState.currentTurn === 'player',
      drop: (item: any) => {
        if (isPlayable && gameState.currentTurn === 'player') {
          onCellClick({ row, col }, item.card);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }), [isPlayable, gameState.currentTurn]);

    // Pick a rune for this cell (deterministic by position for consistency)
    const runeIndex = (row * 3 + col) % runeSet.length;
    const runeChar = runeSet[runeIndex];

    return (
      <Cell
        key={`${row}-${col}`}
        ref={isPlayable ? drop : undefined}
        isPlayable={isPlayable}
        style={{ background: isOver && canDrop ? '#bba94a' : undefined }}
        onClick={() => isPlayable && onCellClick({ row, col })}
      >
        {!gameState.board[row][col] && (
          <Rune>{String.fromCharCode(parseInt(runeChar.replace('\\u', ''), 16))}</Rune>
        )}
        {gameState.board[row][col] && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{ width: '100%', height: '100%' }}
          >
            <GameCard card={gameState.board[row][col]!} />
          </motion.div>
        )}
      </Cell>
    );
  };

  return (
    <BoardContainer>
      <Grid>
        {Array.from({ length: 3 }, (_, row) => (
          Array.from({ length: 3 }, (_, col) => renderCell(row, col))
        ))}
      </Grid>
    </BoardContainer>
  );
}; 