import React, { useEffect, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../types/game';
import { useDrag } from 'react-dnd';

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
  border: ${props => {
    if (props.owner === 'player') return '2.5px solid #bfa100';
    if (props.owner === 'opponent') return '2.5px solid #7a1a1a';
    return 'none';
  }};
  background: ${props => {
    if (props.owner === 'player') {
      // No tint, use rarity background
      switch (props.rarity) {
        case 'legendary': return 'linear-gradient(45deg, #FFD700, #FFA500)';
        case 'epic': return 'linear-gradient(45deg, #9400D3, #4B0082)';
        case 'rare': return 'linear-gradient(45deg, #0066cc, #0033cc)';
        default: return 'linear-gradient(45deg, #666666, #333333)';
      }
    } else if (props.owner === 'opponent') {
      return 'linear-gradient(45deg, #23232a 80%, #111118 100%)'; // dark tint
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
      : 'linear-gradient(135deg, #222 60%, #ffd700 100%)'};
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
`;

const CardBackContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  color: #ffd700;
  text-shadow: 0 0 18px #fff8, 0 0 8px #ffd700cc;
  font-family: 'NorseBold', 'Norse', serif;
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
  word-break: break-word;
  font-size: 1rem;
  @media (max-width: 700px) {
    font-size: 0.8rem;
  }
  @media (max-width: 500px) {
    font-size: 0.7rem;
  }
`;

const CardStats = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const StatValue = styled.div<{ position: 'top' | 'right' | 'bottom' | 'left' }>`
  position: absolute;
  color: rgba(245, 230, 197, 0.7);
  border-radius: 4px;
  background: none;
  padding: 0 4px;
  font-weight: bold;
  font-size: 1.1rem;
  z-index: 2;
  ${props => {
    switch (props.position) {
      case 'top': return 'top: 4px; left: 50%; transform: translateX(-50%);';
      case 'right': return 'right: 4px; top: 50%; transform: translateY(-50%);';
      case 'bottom': return 'bottom: 4px; left: 50%; transform: translateX(-50%);';
      case 'left': return 'left: 4px; top: 50%; transform: translateY(-50%);';
    }
  }}
  @media (max-width: 700px) {
    font-size: 0.8rem;
  }
  @media (max-width: 500px) {
    font-size: 0.7rem;
  }
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
  console.log('[GameCard] card.id:', card.id, 'isCapturing:', isCapturing);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const [flip, setFlip] = useState(0); // 0 = not flipping, 1 = flipping
  const [flipAngle, setFlipAngle] = useState(0);
  const [displayedOwner, setDisplayedOwner] = useState(card.owner);
  const animationRef = React.useRef<number | null>(null);

  // Drag and drop
  const [{ isDragging }, drag] = useDrag(() => ({
    type: CARD_TYPE,
    item: { card },
    canDrag: !!isPlayable,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [card, isPlayable]);

  // Card flip animation function (moved outside useEffect)
  const animateFlip = useCallback((startTime: number, duration: number, onComplete?: () => void) => {
    console.log('[GameCard] Flip animation START for card:', card.id);
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setFlipAngle(progress * 180);
      console.log('[GameCard] Flip animation frame for card:', card.id, 'flipAngle:', progress * 180);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        setFlip(0);
        console.log('[GameCard] Flip animation END for card:', card.id);
        if (onComplete) onComplete();
      }
    };
    step();
  }, [card.id]);

  useEffect(() => {
    if (isCapturing) {
      console.log('[GameCard] isCapturing TRUE for card:', card.id, 'owner:', card.owner);
      setFlip(1);
      setFlipAngle(0);
      setDisplayedOwner(displayedOwner);
      const duration = 600; // ms (faster flip)
      const start = Date.now();
      animateFlip(start, duration, () => {
        setDisplayedOwner(card.owner);
      });
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isCapturing, animateFlip, card.owner]);

  useEffect(() => {
    console.log('[GameCard] displayedOwner changed for card:', card.id, 'now:', displayedOwner);
  }, [displayedOwner, card.id]);

  useEffect(() => {
    if (!isCapturing) {
      setDisplayedOwner(card.owner);
    }
  }, [card.owner, isCapturing]);

  return (
    <motion.div
      whileHover={{ scale: isPlayable ? 1.06 : 1, boxShadow: isPlayable ? '0 0 16px #ffd70088' : undefined }}
      whileTap={{ scale: isPlayable ? 0.97 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
      style={{
        cursor: isPlayable ? 'pointer' : 'default',
        position: 'relative',
        width: '100%',
        height: '100%',
        opacity: isDragging ? 0.5 : 1,
        perspective: '800px',
        willChange: 'transform',
        overflow: 'visible',
        maxWidth: window.innerWidth <= 600 ? '90vw' : undefined,
        maxHeight: window.innerWidth <= 600 ? '120vw' : undefined,
        minWidth: window.innerWidth <= 600 ? 60 : undefined,
        minHeight: window.innerWidth <= 600 ? 80 : undefined,
      }}
      ref={isPlayable ? drag : undefined}
    >
      <Flipper
        style={{
          transform: `rotateY(${flip ? flipAngle : 0}deg)`
        }}
      >
        {/* Front Face (shows after 90deg) */}
        <CardFace
          rarity={card.rarity}
          owner={displayedOwner}
          style={{
            zIndex: 2,
            transform: flip ? (flipAngle < 90 ? 'rotateY(180deg)' : 'rotateY(0deg)') : 'rotateY(0deg)',
            visibility: flip ? (flipAngle < 90 ? 'hidden' : 'visible') : 'visible',
          }}
        >
          <img 
            src={card.image} 
            alt={card.name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              borderRadius: '8px'
            }} 
          />
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
        {/* Back Face (shows before 90deg) */}
        <CardBack
          owner={card.owner}
          rarity={card.rarity}
          style={{
            zIndex: 1,
            transform: flip ? (flipAngle < 90 ? 'rotateY(0deg)' : 'rotateY(180deg)') : 'rotateY(180deg)',
            visibility: flip ? (flipAngle < 90 ? 'visible' : 'hidden') : 'hidden',
            background: 'linear-gradient(135deg, #181818 60%, #ffd700 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CardBackContent style={{ fontSize: '2.5rem', color: '#ffd700', textShadow: '0 0 18px #fff8, 0 0 8px #ffd700cc' }}>
            {''}
          </CardBackContent>
        </CardBack>
      </Flipper>
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
    </motion.div>
  );
};

export default GameCard; 