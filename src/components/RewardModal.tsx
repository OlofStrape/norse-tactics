import React from 'react';
import styled from '@emotion/styled';

const Backdrop = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.82);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: #222;
  border-radius: 20px;
  padding: 48px 32px 32px 32px;
  color: #ffd700;
  box-shadow: 0 0 32px #000;
  text-align: center;
  min-width: 320px;
  max-width: 95vw;
`;

const Title = styled.h2`
  font-family: 'NorseBold', 'Norse', serif;
  font-size: 2.2rem;
  margin-bottom: 1.2rem;
  text-shadow: 0 0 12px #ffd70088;
`;

const CardsRow = styled.div`
  display: flex;
  gap: 2.2rem;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const CardAnim = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: pop-in 0.7s cubic-bezier(.68,-0.55,.27,1.55);
  box-shadow: 0 0 24px #ffd70088, 0 0 8px #fff4;
  border-radius: 12px;
  background: #181818;
  padding: 1.2rem 1rem 1rem 1rem;
  position: relative;
  @keyframes pop-in {
    0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
    80% { transform: scale(1.1) rotate(2deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); }
  }
`;

const CardFlipContainer = styled.div`
  perspective: 1200px;
  width: 120px;
  height: 168px;
  margin-bottom: 0.7rem;
`;

const CardFlip = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: flip-in 1.2s cubic-bezier(.68,-0.55,.27,1.55) forwards;
  @keyframes flip-in {
    0% { transform: rotateY(0deg); }
    60% { transform: rotateY(90deg); }
    100% { transform: rotateY(180deg); }
  }
`;

const CardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: linear-gradient(135deg, #222 60%, #ffd700 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffd700;
  font-size: 2.2rem;
  font-family: 'NorseBold', 'Norse', serif;
  box-shadow: 0 0 16px #ffd70088, 0 2px 8px #0008;
`;

const CardFront = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: rotateY(180deg);
`;

const CardName = styled.div`
  font-family: 'NorseBold', 'Norse', serif;
  font-size: 1.2rem;
  color: #ffd700;
  margin-top: 0.2rem;
  text-shadow: 0 0 8px #ffd70088;
`;

const ContinueButton = styled.button`
  margin-top: 1.2rem;
  padding: 0.7rem 2.2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  border: 2px solid #ffd700;
  background: #ffd700;
  color: #1a1a1a;
  font-family: 'NorseBold', 'Norse', serif;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 0 12px 2px #ffd70033;
  transition: background 0.2s;
  &:hover {
    background: #ffe066;
  }
`;

export interface RewardModalProps {
  cards: { id: string; name: string; image: string }[];
  onClose: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({ cards, onClose }) => {
  return (
    <Backdrop onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Title>New Card{cards.length > 1 ? 's' : ''} Unlocked!</Title>
        <CardsRow>
          {cards.map(card => (
            <CardAnim key={card.id}>
              <CardFlipContainer>
                <CardFlip>
                  <CardBack>?</CardBack>
                  <CardFront src={card.image} alt={card.name} />
                </CardFlip>
              </CardFlipContainer>
              <CardName>{card.name}</CardName>
            </CardAnim>
          ))}
        </CardsRow>
        <ContinueButton onClick={onClose}>Continue</ContinueButton>
      </Modal>
    </Backdrop>
  );
}; 