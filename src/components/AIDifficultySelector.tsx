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
  color: #f0f0f0;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const DifficultyButton = styled.button<{ isSelected: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.isSelected ? '#4CAF50' : '#666'};
  border-radius: 4px;
  background-color: ${props => props.isSelected ? '#4CAF50' : '#333'};
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.isSelected ? '#45a049' : '#444'};
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