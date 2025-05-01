import React from 'react';
import styled from '@emotion/styled';
import { Card } from '../types/game';

const CardContainer = styled.div<{ rarity: string }>`
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

const CardStats = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const StatValue = styled.div<{ position: 'top' | 'right' | 'bottom' | 'left' }>`
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.8rem;
  ${props => {
    switch (props.position) {
      case 'top': return 'top: 5px; left: 50%; transform: translateX(-50%);';
      case 'right': return 'right: 5px; top: 50%; transform: translateY(-50%);';
      case 'bottom': return 'bottom: 5px; left: 50%; transform: translateX(-50%);';
      case 'left': return 'left: 5px; top: 50%; transform: translateY(-50%);';
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
  onClick?: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ card, isPlayable, onClick }) => {
  return (
    <CardContainer
      rarity={card.rarity}
      onClick={isPlayable ? onClick : undefined}
      style={{ cursor: isPlayable ? 'pointer' : 'default' }}
    >
      <CardImage image={card.image} />
      <CardInfo>
        <CardName>{card.name}</CardName>
      </CardInfo>
      <CardStats>
        <StatValue position="top">{card.top}</StatValue>
        <StatValue position="right">{card.right}</StatValue>
        <StatValue position="bottom">{card.bottom}</StatValue>
        <StatValue position="left">{card.left}</StatValue>
      </CardStats>
      <ElementIcon element={card.element || 'none'} />
    </CardContainer>
  );
}; 