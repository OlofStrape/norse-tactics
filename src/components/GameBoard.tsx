import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Position, GameState } from '../types/game';

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
`;

const Cell = styled(motion.div)<{ isPlayable: boolean }>`
  width: 120px;
  height: 160px;
  background: ${props => props.isPlayable ? '#3a3a3a' : '#2a2a2a'};
  border: 2px solid ${props => props.isPlayable ? '#ffd700' : 'transparent'};
  border-radius: 8px;
  cursor: ${props => props.isPlayable ? 'pointer' : 'default'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.isPlayable ? '#4a4a4a' : '#2a2a2a'};
  }
`;

interface GameBoardProps {
  gameState: GameState;
  onCellClick: (position: Position) => void;
  onDrop?: (position: Position) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState, onCellClick, onDrop }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, position: Position) => {
    e.preventDefault();
    if (onDrop) onDrop(position);
  };

  return (
    <BoardContainer>
      <Grid>
        {gameState.board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const position = { row: rowIndex, col: colIndex };
            const isPlayable = cell === null && gameState.currentTurn === 'player';

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                isPlayable={isPlayable}
                onClick={() => isPlayable && onCellClick(position)}
                onDragOver={handleDragOver}
                onDrop={(e) => isPlayable && handleDrop(e, position)}
                whileHover={isPlayable ? { scale: 1.05 } : {}}
                whileTap={isPlayable ? { scale: 0.95 } : {}}
              >
                {cell && (
                  <div>
                    <img src={cell.image} alt={cell.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </Cell>
            );
          })
        )}
      </Grid>
    </BoardContainer>
  );
}; 