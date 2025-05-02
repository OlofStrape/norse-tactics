import React from 'react';
import styled from '@emotion/styled';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #222;
  border-radius: 12px;
  padding: 2rem 3rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  color: #ffd700;
  text-align: center;
  min-width: 320px;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  font-size: 2rem;
`;

const Score = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  background: #ffd700;
  color: #222;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #ffed4a;
  }
`;

interface EndGameModalProps {
  isOpen: boolean;
  winner: 'player' | 'opponent' | 'draw';
  playerScore: number;
  opponentScore: number;
  onRestart: () => void;
}

export const EndGameModal: React.FC<EndGameModalProps> = ({ isOpen, winner, playerScore, opponentScore, onRestart }) => {
  if (!isOpen) return null;
  return (
    <Overlay>
      <Modal>
        <Title>
          {winner === 'draw' ? "It's a draw!" : winner === 'player' ? 'You Win!' : 'AI Wins!'}
        </Title>
        <Score>
          Final Score<br />
          <b>You:</b> {playerScore} &nbsp; | &nbsp; <b>AI:</b> {opponentScore}
        </Score>
        <Button onClick={onRestart}>Play Again</Button>
      </Modal>
    </Overlay>
  );
}; 