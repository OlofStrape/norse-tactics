import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../types/game';
import { useDrag } from 'react-dnd';

const CardContainer = styled.div`
  width: 100%;
  height: 100%;
  perspective: 800px;
  position: relative;
  will-change: transform;
  overflow: visible;
  @media (max-width: 600px) {
    max-width: 90vw;
    max-height: 120vw;
    min-width: 60px;
    min-height: 80px;
  }
`;

const Flipper = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transform-style: preserve-3d;
  will-change: transform;
  overflow: visible;
`;

const CardFace = styled.div<{ rarity: string; owner: string | null }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 2px solid ${props => {
    if (props.owner === 'player') return '#ff4444';
    if (props.owner === 'opponent') return '#4444ff';
    return 'transparent';
  }};
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
`;

const CardBack = styled(CardFace)<{ owner: string | null; rarity: string }>`
  background: ${props =>
    props.owner === 'player'
      ? 'linear-gradient(45deg, #ff4444, #aa2222)'
      : props.owner === 'opponent'
      ? 'linear-gradient(45deg, #4444ff, #2222aa)'
      : 'linear-gradient(45deg, #666666, #333333)'};
  transform: rotateY(180deg);
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

const Tooltip = styled.div`
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: #222;
  color: #ffd700;
  padding: 0.75rem 1.2rem;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  font-size: 1rem;
  z-index: 20;
  pointer-events: none;
  white-space: pre-line;
  min-width: 180px;
`;

export const CARD_TYPE = 'CARD';

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
  const [showTooltip, setShowTooltip] = useState(false);

  // Drag and drop
  const [{ isDragging }, drag] = useDrag(() => ({
    type: CARD_TYPE,
    item: { card },
    canDrag: !!isPlayable,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [card, isPlayable]);

  useEffect(() => {
    if (isCapturing) {
      setShowCaptureEffect(true);
      setTimeout(() => setShowCaptureEffect(false), 1000);
    }
  }, [isCapturing]);

  useEffect(() => {
    if (isChainReaction) {
      setShowChainEffect(true);
      setTimeout(() => setShowChainEffect(false), 600);
    }
  }, [isChainReaction]);

  return (
    <div
      ref={isPlayable ? drag : undefined}
      style={{ position: 'relative', width: '100%', height: '100%', opacity: isDragging ? 0.5 : 1, cursor: isPlayable ? 'grab' : 'default' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <CardContainer onClick={isPlayable ? onClick : undefined}>
        <Flipper
          animate={isCapturing ? { rotateY: 360, scale: [1, 1.15, 1] } : { rotateY: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {/* Front Face */}
          <CardFace rarity={card.rarity} owner={card.owner} style={{ zIndex: 2, transform: 'rotateY(0deg)' }}>
            <CardImage image={card.image} />
            <CardInfo>
              <CardName>{card.name}</CardName>
            </CardInfo>
            <ElementIcon element={card.element || 'none'} />
            <CardStats>
              <StatValue position="top">{card.top}</StatValue>
              <StatValue position="right">{card.right}</StatValue>
              <StatValue position="bottom">{card.bottom}</StatValue>
              <StatValue position="left">{card.left}</StatValue>
            </CardStats>
          </CardFace>
          {/* Back Face */}
          <CardBack owner={card.owner} rarity={card.rarity} style={{ zIndex: 1 }}>
            <CardInfo>
              <CardName>{card.name}</CardName>
            </CardInfo>
            <ElementIcon element={card.element || 'none'} />
            <CardStats>
              <StatValue position="top">{card.top}</StatValue>
              <StatValue position="right">{card.right}</StatValue>
              <StatValue position="bottom">{card.bottom}</StatValue>
              <StatValue position="left">{card.left}</StatValue>
            </CardStats>
          </CardBack>
          <AnimatePresence>
            {showCaptureEffect && (
              <CaptureEffect
                element={card.element || 'none'}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            )}
            {showChainEffect && (
              <ChainEffect
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            )}
          </AnimatePresence>
        </Flipper>
      </CardContainer>
      {/* Tooltip for hand cards only */}
      {isPlayable && showTooltip && (
        <Tooltip>
          <b>{card.name}</b> ({card.element})
          <br />
          <span>Top: {card.top} | Right: {card.right} | Bottom: {card.bottom} | Left: {card.left}</span>
          {card.abilities && card.abilities.length > 0 && (
            <>
              <br />
              <b>Abilities:</b>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {card.abilities.map(ability => (
                  <li key={ability.id}>{ability.name}: {ability.description}</li>
                ))}
              </ul>
            </>
          )}
        </Tooltip>
      )}
    </div>
  );
};

export default GameCard; 