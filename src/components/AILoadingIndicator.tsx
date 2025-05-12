import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 10;
`;

const Text = styled.div`
  color: #ffd700;
  font-size: 1.2rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Dot = styled(motion.div)`
  width: 8px;
  height: 8px;
  background: #ffd700;
  border-radius: 50%;
`;

export const LoadingSpinner: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <Container>
      <Text>{text}</Text>
      <LoadingDots>
        <Dot
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        />
        <Dot
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <Dot
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        />
      </LoadingDots>
    </Container>
  );
}; 