import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

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

const Button = styled(motion.button)`
  background: #ffd700;
  color: #222;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-family: 'Norse', serif;
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
  /** If provided, shows a Next Quest button and calls this when clicked */
  onNextQuest?: () => void;
  /** If true, shows the Next Quest button */
  showNextQuestButton?: boolean;
}

export const EndGameModal: React.FC<EndGameModalProps> = ({ isOpen, winner, playerScore, opponentScore, onRestart, onNextQuest, showNextQuestButton }) => {
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
        <Button
          whileHover={{ scale: 1.06, boxShadow: '0 0 18px #ffd70088' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={onRestart}
        >
          Play Again
        </Button>
        {showNextQuestButton && onNextQuest && (
          <Button
            style={{ marginTop: 16, background: '#bfa100', color: '#fff' }}
            whileHover={{ scale: 1.06, boxShadow: '0 0 18px #bfa10088' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={onNextQuest}
          >
            Next Quest
          </Button>
        )}
      </Modal>
    </Overlay>
  );
}; 