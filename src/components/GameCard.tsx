import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { Card } from '../types/game';
import { motion } from 'framer-motion';

interface CardContainerProps {
  rarity: string;
  isPlayable?: boolean;
  isSelected?: boolean;
}

const CardContainer = styled(motion.div)<CardContainerProps>`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 8px;
  background: ${props => {
    switch (props.rarity) {
      case 'legendary': return 'linear-gradient(45deg, #FFD700, #FFA500)';
      case 'epic': return 'linear-gradient(45deg, #9400D3, #4B0082)';
      case 'rare': return 'linear-gradient(45deg, #0066cc, #0033cc)';
      default: return 'linear-gradient(45deg, #666666, #333333)';
    }
  }};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: ${props => props.isPlayable ? 'grab' : 'default'};
  border: ${props => props.isSelected ? '2px solid #ffd700' : 'none'};
  transform: ${props => props.isSelected ? 'scale(1.05)' : 'none'};
  transition: all 0.2s ease;

  &:hover {
    transform: ${props => props.isPlayable ? 'scale(1.05)' : 'none'};
  }
`;

const CardImage = styled.div<{ image: string }>`
  width: 100%;
  height: 60%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
`;

const CardInfo = styled.div`
  padding: 0.5rem;
  color: white;
  font-size: 0.8rem;
`;

const CardName = styled.div`
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.25rem;
`;

const CardDescription = styled.div`
  font-size: 0.8rem;
`;

const CardStats = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

interface StatValueProps {
  position: 'top' | 'right' | 'bottom' | 'left';
}

const StatValue = styled.div<StatValueProps>`
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem;
  border-radius: 4px;
  font-weight: bold;
  ${props => {
    switch (props.position) {
      case 'top': return 'top: 0; left: 50%; transform: translateX(-50%);';
      case 'right': return 'right: 0; top: 50%; transform: translateY(-50%);';
      case 'bottom': return 'bottom: 0; left: 50%; transform: translateX(-50%);';
      case 'left': return 'left: 0; top: 50%; transform: translateY(-50%);';
    }
  }}
`;

const ElementIcon = styled.div<{ element: string }>`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background: ${props => {
    switch (props.element) {
      case 'fire': return '#ff4400';
      case 'ice': return '#00ccff';
      case 'lightning': return '#ffcc00';
      default: return 'transparent';
    }
  }};
  border-radius: 50%;
  display: ${props => props.element === 'none' ? 'none' : 'block'};
`;

interface GameCardProps {
  card: Card;
  isPlayable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ 
  card, 
  isPlayable, 
  isSelected,
  onClick,
  onDragStart,
  onDragEnd 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    if (!isPlayable) return;
    e.dataTransfer.setData('text/plain', card.id);
    if (onDragStart) onDragStart(e);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (!isPlayable) return;
    if (onDragEnd) onDragEnd(e);
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      draggable={isPlayable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardContainer
        rarity={card.rarity}
        isPlayable={isPlayable}
        isSelected={isSelected}
        whileHover={isPlayable ? { scale: 1.05 } : {}}
        whileTap={isPlayable ? { scale: 0.95 } : {}}
      >
        <CardImage image={card.image} />
        <CardInfo>
          <CardName>{card.name}</CardName>
          <CardDescription>{card.description}</CardDescription>
        </CardInfo>
        <CardStats>
          <StatValue position="top">{card.top}</StatValue>
          <StatValue position="right">{card.right}</StatValue>
          <StatValue position="bottom">{card.bottom}</StatValue>
          <StatValue position="left">{card.left}</StatValue>
        </CardStats>
        <ElementIcon element={card.element || 'none'} />
      </CardContainer>
    </div>
  );
}; 