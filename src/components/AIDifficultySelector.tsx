import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
`;

const Title = styled.h2`
  color: #ffd700;
  margin: 0;
  font-family: 'Norsebold', 'Norse', serif;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 0 4px #ffd70066, 0 0 1px #fff;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const DifficultyButton = styled.button<{ isSelected: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.isSelected ? '#ffd700' : 'rgba(60, 40, 20, 0.7)'};
  border-radius: 4px;
  background-color: ${props => props.isSelected ? 'rgba(255, 215, 0, 0.18)' : 'transparent'};
  color: #fff;
  font-family: 'Norsebold', 'Norse', serif;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.isSelected ? '0 0 8px #ffd70088' : 'none'};
  
  &:hover {
    background-color: ${props => props.isSelected ? 'rgba(255, 215, 0, 0.28)' : 'rgba(255,255,255,0.08)'};
    border-color: #ffd700;
  }
`;

interface AIDifficultySelectorProps {
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export const AIDifficultySelector: React.FC<AIDifficultySelectorProps> = ({
  selectedDifficulty,
  onDifficultyChange,
}) => {
  return (
    <Container>
      <Title>AI Difficulty</Title>
      <ButtonGroup>
        <DifficultyButton
          isSelected={selectedDifficulty === 'easy'}
          onClick={() => onDifficultyChange('easy')}
        >
          Easy
        </DifficultyButton>
        <DifficultyButton
          isSelected={selectedDifficulty === 'medium'}
          onClick={() => onDifficultyChange('medium')}
        >
          Medium
        </DifficultyButton>
        <DifficultyButton
          isSelected={selectedDifficulty === 'hard'}
          onClick={() => onDifficultyChange('hard')}
        >
          Hard
        </DifficultyButton>
      </ButtonGroup>
    </Container>
  );
}; 