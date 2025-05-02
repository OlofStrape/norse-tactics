import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface ParticleEffectProps {
  type: 'capture' | 'chain' | 'element';
  element?: 'fire' | 'ice' | 'lightning';
  position: { x: number; y: number };
}

const ParticleContainer = styled(motion.div)`
  position: absolute;
  pointer-events: none;
`;

const Particle = styled(motion.div)<{ color: string }>`
  position: absolute;
  background: ${props => props.color};
  border-radius: 50%;
`;

export const ParticleEffect: React.FC<ParticleEffectProps> = ({ type, element, position }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    const particleCount = type === 'chain' ? 20 : 10;
    const baseColor = element === 'fire' ? '#ff4500' : 
                     element === 'ice' ? '#00bfff' : 
                     element === 'lightning' ? '#ffd700' : '#ffffff';

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        size: Math.random() * 4 + 2,
        color: baseColor
      });
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 1000);

    return () => clearTimeout(timer);
  }, [type, element]);

  return (
    <ParticleContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {particles.map(particle => (
        <Particle
          key={particle.id}
          color={particle.color}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
          }}
          transition={{
            duration: 1,
            ease: 'easeOut',
          }}
          style={{
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}
    </ParticleContainer>
  );
}; 