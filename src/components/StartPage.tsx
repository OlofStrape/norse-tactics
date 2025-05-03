import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { Global, css } from '@emotion/react';

// Add font-face rules for Norse and Norse Bold
const fontStyles = `
  @font-face {
    font-family: 'Norse';
    src: url('/fonts/Norse.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'NorseBold';
    src: url('/fonts/Norsebold.otf') format('opentype');
    font-weight: bold;
    font-style: normal;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
`;

const Subtitle = styled.div`
  font-family: 'Norse', serif;
  font-size: 1.5rem;
  color: #ffd700;
  text-shadow: 0 0 6px rgba(255, 215, 0, 0.4);
  margin-top: -0.5rem;
  margin-bottom: 2.5rem;
  letter-spacing: 0.08em;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ModeButton = styled.button<{ disabled?: boolean }>`
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
  transition: background 0.2s, box-shadow 0.2s;
  text-shadow: 0 1px 6px #fff8, 0 0 2px #ffd70044;
  &:hover {
    background: ${({ disabled }) => disabled ? '#444' : '#ffe066'};
    box-shadow: 0 0 18px 4px #ffd70066, 0 4px 16px rgba(0,0,0,0.18);
  }
`;

const LockText = styled.span`
  font-size: 1rem;
  color: #aaa;
  margin-left: 1rem;
`;

interface StartPageProps {
  multiplayerUnlocked: boolean;
}

const StartPage: React.FC<StartPageProps> = ({ multiplayerUnlocked }) => {
  const navigate = useNavigate();
  return (
    <Container>
      <style>{fontStyles}</style>
      <Global styles={css`
        body {
          min-height: 100vh;
          background: linear-gradient(rgba(20, 15, 5, 0.7), rgba(20, 15, 5, 0.7)), url('/images/tutorial/Background.jpg');
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
      <Subtitle>A card game</Subtitle>
      <ButtonGroup>
        <ModeButton onClick={() => navigate('/free-play')}>
          Free Play
        </ModeButton>
        <ModeButton onClick={() => navigate('/campaign')}>
          Campaign
        </ModeButton>
        <ModeButton
          onClick={() => multiplayerUnlocked && navigate('/multiplayer')}
          disabled={!multiplayerUnlocked}
        >
          Multiplayer
          {!multiplayerUnlocked && <LockText>(Unlock by completing Campaign)</LockText>}
        </ModeButton>
      </ButtonGroup>
    </Container>
  );
};

export default StartPage; 