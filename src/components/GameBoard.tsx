import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Card, Position, GameState } from '../types/game';

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
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState, onCellClick }) => {
  const isCellPlayable = (row: number, col: number) => {
    return gameState.board[row][col] === null;
  };

  return (
    <BoardContainer>
      <Grid>
        {Array.from({ length: 3 }, (_, row) => (
          Array.from({ length: 3 }, (_, col) => (
            <Cell
              key={`${row}-${col}`}
              isPlayable={isCellPlayable(row, col)}
              onClick={() => isCellPlayable(row, col) && onCellClick({ row, col })}
            >
              {gameState.board[row][col] && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {/* Card component will go here */}
                  {gameState.board[row][col]?.name}
                </motion.div>
              )}
            </Cell>
          ))
        ))}
      </Grid>
    </BoardContainer>
  );
}; 