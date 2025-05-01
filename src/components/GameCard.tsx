import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../types/game';

const CardContainer = styled(motion.div)<{ rarity: string; owner: string | null }>`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 8px;
  background: ${props => {
    if (props.owner === 'player') {
      return 'linear-gradient(45deg, #1a1a1a, #2a2a2a)';
    } else if (props.owner === 'opponent') {
      return 'linear-gradient(45deg, #2a2a2a, #1a1a1a)';
    }
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
  border: 2px solid ${props => {
    if (props.owner === 'player') return '#ff4444';
    if (props.owner === 'opponent') return '#4444ff';
    return 'transparent';
  }};
  transform-style: preserve-3d;
`;

const CaptureEffect = styled(motion.div)<{ element: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  background: ${props => {
    switch (props.element) {
      case 'fire': return 'radial-gradient(circle, rgba(255,100,0,0.5) 0%, rgba(255,0,0,0) 70%)';
      case 'lightning': return 'radial-gradient(circle, rgba(255,255,0,0.5) 0%, rgba(255,255,0,0) 70%)';
      case 'ice': return 'radial-gradient(circle, rgba(0,200,255,0.5) 0%, rgba(0,200,255,0) 70%)';
      default: return 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)';
    }
  }};
`;

const ChainEffect = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
  pointer-events: none;
  z-index: 5;
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
  background: rgba(0, 0, 0, 0.8);
  color: white;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  z-index: 2;
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
  isCapturing?: boolean;
  isChainReaction?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ 
  card, 
  isPlayable, 
  onClick,
  isCapturing = false,
  isChainReaction = false
}) => {
  const [showCaptureEffect, setShowCaptureEffect] = useState(false);
  const [showChainEffect, setShowChainEffect] = useState(false);

  useEffect(() => {
    if (isCapturing) {
      setShowCaptureEffect(true);
      setTimeout(() => setShowCaptureEffect(false), 1000);
    }
  }, [isCapturing]);

  useEffect(() => {
    if (isChainReaction) {
      setShowChainEffect(true);
      setTimeout(() => setShowChainEffect(false), 1000);
    }
  }, [isChainReaction]);

  return (
    <CardContainer
      rarity={card.rarity}
      owner={card.owner}
      onClick={isPlayable ? onClick : undefined}
      style={{ cursor: isPlayable ? 'pointer' : 'default' }}
      animate={{
        rotateY: isCapturing ? [0, 180, 360] : 0,
        scale: isCapturing ? [1, 1.2, 1] : 1,
      }}
      transition={{
        duration: 0.8,
        ease: "easeInOut"
      }}
    >
      <AnimatePresence>
        {showCaptureEffect && (
          <CaptureEffect
            element={card.element || 'none'}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
        {showChainEffect && (
          <ChainEffect
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
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

export default GameCard; 