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
  overflow-x: auto;
  @media (max-width: 700px) {
    padding: 0.2rem;
    gap: 0.3rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  gap: 8px;
  align-items: stretch;
  justify-items: stretch;
  background: transparent;
  border-radius: 16px;
  box-sizing: border-box;
  @media (max-width: 700px) {
    gap: 2px;
    border-width: 2px;
  }
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
  width: 100%;
  height: 100%;
  aspect-ratio: 3 / 4;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: transparent;
  border: 3px solid rgba(60, 40, 20, 0.7);
  border-radius: 10px;
  box-shadow:
    0 2px 8px rgba(0,0,0,0.18),
    0 1.5px 0 #666 inset,
    0 0 0 2px #8888 inset;
  cursor: ${props => props.isPlayable ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  overflow: hidden;
  box-sizing: border-box;
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: none;
    pointer-events: none;
    z-index: 1;
  }
  &:hover {
    transform: ${props => props.isPlayable ? 'scale(1.05)' : 'none'};
    border-color: ${props => props.isPlayable ? '#ffd700' : 'rgba(60, 40, 20, 0.7)'};
  }
`;

const Rune = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  font-size: 3.5rem;
  color: #181818;
  opacity: 0.22;
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
  pendingCaptures: {id: string, owner: 'player' | 'opponent'}[];
  chainReactionCards: Set<string>;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState, onCellClick, onCapture, pendingCaptures, chainReactionCards }) => {
  const isCellPlayable = (row: number, col: number) => {
    return gameState.board[row][col] === null;
  };

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
            <GameCard 
              card={gameState.board[row][col]!}
              isCapturing={!!pendingCaptures.find(c => c.id === gameState.board[row][col]!.id)}
              isChainReaction={chainReactionCards.has(gameState.board[row][col]!.id)}
            />
          </motion.div>
        )}
      </Cell>
    );
  };

  return (
    <BoardContainer style={{ position: 'relative' }}>
      <div style={{ width: '100%', position: 'relative' }}>
        <Grid>
          {Array.from({ length: 3 }, (_, row) => (
            Array.from({ length: 3 }, (_, col) => renderCell(row, col))
          ))}
        </Grid>
      </div>
    </BoardContainer>
  );
}; 