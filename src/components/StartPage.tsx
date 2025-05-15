import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { Global, css } from '@emotion/react';
import { Tutorial } from './Tutorial';
import { tutorialSteps } from '../data/tutorials';
import { motion } from 'framer-motion';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0.5rem;
`;

const Title = styled.h1`
  font-family: 'NorseBold', 'Norse', serif;
  font-size: 7rem;
  color: #2a1a0a; /* dark brown, similar to background */
  text-shadow:
    0 0 18px #ffd700,
    0 0 36px #ffd700,
    0 2px 2px #000,
    0 0 2px #ffd700;
  margin-bottom: 2rem;
  letter-spacing: 0.15em;
  text-align: center;
  @media (max-width: 600px) {
    font-size: 3.2rem;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
  }
`;

const Subtitle = styled.div`
  font-family: 'Norse', serif;
  font-size: 1.5rem;
  color: #ffd700;
  text-shadow: 0 0 6px rgba(255, 215, 0, 0.4);
  margin-top: -0.5rem;
  margin-bottom: 2.5rem;
  letter-spacing: 0.08em;
  text-align: center;
  @media (max-width: 600px) {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ModeButton = styled(motion.button)<{ disabled?: boolean }>`
  padding: 1rem 2.5rem;
  font-size: 1.6rem;
  border-radius: 8px;
  border: 3px solid rgba(60, 40, 20, 0.7);
  background: ${({ disabled }) => disabled ? '#444' : 'rgba(255,215,0,0.12)'};
  color: ${({ disabled }) => disabled ? '#aaa' : '#1a1a1a'};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  box-shadow: 0 0 12px 2px #ffd70033, 0 4px 16px rgba(0,0,0,0.18);
  font-family: 'Cinzel Decorative', serif;
  font-weight: bold;
  letter-spacing: 1px;
  transition: box-shadow 0.2s, text-shadow 0.2s, color 0.2s;
  text-shadow: 0 1px 6px #fff8, 0 0 2px #ffd70044;
  min-width: 220px;
  min-height: 56px;
  @media (max-width: 600px) {
    font-size: 1.1rem;
    min-width: 160px;
    min-height: 44px;
    padding: 0.7rem 1.2rem;
  }
  &:hover {
    background: ${({ disabled }) => disabled ? '#444' : 'rgba(255,215,0,0.12)'};
    color: ${({ disabled }) => disabled ? '#aaa' : '#ffd700'};
    text-shadow: 0 0 18px #ffd700, 0 0 36px #ffd700, 0 2px 2px #000, 0 0 2px #ffd700;
    box-shadow: 0 0 18px 4px #ffd70066, 0 4px 16px rgba(0,0,0,0.18);
  }
`;

const LockText = styled.span`
  font-size: 1rem;
  color: #aaa;
  margin-left: 1rem;
`;

const HowToPlayButton = styled(motion.button)`
  margin-top: 2.5rem;
  padding: 0.7rem 2rem;
  font-size: 1.2rem;
  border-radius: 8px;
  border: 2px solid #ffd700;
  background: rgba(255,215,0,0.08);
  color: #ffd700;
  font-family: 'Norse', serif;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 0 8px 2px #ffd70022;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #ffd700;
    color: #1a1a1a;
  }
  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 0.5rem 1.2rem;
    margin-top: 1.2rem;
  }
`;

interface StartPageProps {
  multiplayerUnlocked: boolean;
}

const StartPage: React.FC<StartPageProps> = ({ multiplayerUnlocked }) => {
  const navigate = useNavigate();
  const [showHowToPlay, setShowHowToPlay] = React.useState(false);
  return (
    <Container>
      <Global styles={css`
        body {
          min-height: 100vh;
          background: linear-gradient(rgba(20, 15, 5, 0.7), rgba(20, 15, 5, 0.7)), url('https://res.cloudinary.com/dvfobknn4/image/upload/v1746867992/Background_snigeo.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          font-family: 'Norse', serif !important;
        }
        button, input, textarea, select {
          font-family: 'Norse', serif !important;
        }
      `} />
      <Title>NORSE</Title>
      <Subtitle>Outsmart the gods. Conquer the nine realms</Subtitle>
      <ButtonGroup>
        <ModeButton
          whileHover={{ scale: 1.06, boxShadow: '0 0 18px #ffd70088' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={() => navigate('/campaign')}
        >
          Campaign
        </ModeButton>
        <ModeButton
          whileHover={{ scale: multiplayerUnlocked ? 1.06 : 1, boxShadow: multiplayerUnlocked ? '0 0 18px #ffd70088' : undefined }}
          whileTap={{ scale: multiplayerUnlocked ? 0.97 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={() => multiplayerUnlocked && navigate('/multiplayer')}
          disabled={!multiplayerUnlocked}
        >
          Multiplayer
          {!multiplayerUnlocked && <LockText>(Unlock by completing Campaign)</LockText>}
        </ModeButton>
        <ModeButton
          whileHover={{ scale: 1.06, boxShadow: '0 0 18px #ffd70088' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={() => navigate('/free-play')}
        >
          Free Play
        </ModeButton>
      </ButtonGroup>
      <HowToPlayButton
        whileHover={{ scale: 1.06, boxShadow: '0 0 18px #ffd70088' }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={() => setShowHowToPlay(true)}
        aria-label="How to Play"
      >
        How to Play
      </HowToPlayButton>
      {showHowToPlay && (
        <Tutorial steps={tutorialSteps.basicRules} onComplete={() => setShowHowToPlay(false)} />
      )}
    </Container>
  );
};

export default StartPage; 