import React from 'react';
import styled from '@emotion/styled';
import { cards } from '../data/cards';
import { getCardCollection, hasCard } from '../utils/cardCollection';
import { useNavigate } from 'react-router-dom';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const CardBox = styled.div<{ owned: boolean }>`
  background: linear-gradient(135deg, #2a1a0a 0%, #181818 100%);
  border-radius: 12px;
  box-shadow: 0 0 16px #000a, 0 0 0 2px #ffd70044;
  padding: 1.2rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  opacity: ${props => props.owned ? 1 : 0.4};
  filter: ${props => props.owned ? 'none' : 'grayscale(1)'};
`;

const CardImage = styled.img`
  width: 80px;
  height: 112px;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 8px #0008;
`;

const CardName = styled.div`
  font-family: 'Norsebold', 'Norse', serif;
  font-size: 1.1rem;
  color: #ffd700;
  margin-bottom: 0.2rem;
  text-align: center;
`;

const CardRarity = styled.div`
  font-size: 0.95rem;
  color: #ffe066;
  text-align: center;
`;

const LockIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.6rem;
  color: #ffd700cc;
  pointer-events: none;
`;

const CardCollection: React.FC = () => {
  const collection = getCardCollection();
  const navigate = useNavigate();
  const fontStyles = `
    @font-face {
      font-family: 'Norse';
      src: url('/fonts/Norse1.woff2') format('woff2'),
           url('/fonts/Norse1.woff') format('woff');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'NorseBold';
      src: url('/fonts/Norsebold1.woff2') format('woff2'),
           url('/fonts/Norsebold1.woff') format('woff');
      font-weight: bold;
      font-style: normal;
    }
  `;
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(rgba(20, 15, 5, 0.7), rgba(20, 15, 5, 0.7)), url(https://res.cloudinary.com/dvfobknn4/image/upload/v1746867992/Background_snigeo.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', fontFamily: 'Norse, serif', padding: '2rem 0' }}>
      <style>{fontStyles}</style>
      <button
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          padding: '0.5rem 1.2rem',
          fontSize: '1.1rem',
          borderRadius: 6,
          border: 'none',
          background: '#ffd700',
          color: '#1a1a1a',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          zIndex: 10,
          fontFamily: 'Norsebold, Norse, serif',
        }}
        onClick={() => navigate('/')}
      >
        ← Back
      </button>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 0' }}>
        <h1 style={{ fontFamily: 'Norsebold, Norse, serif', color: '#ffd700', textAlign: 'center', fontSize: '2.5rem', marginBottom: 24 }}>Card Collection</h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <button
            style={{
              padding: '0.7rem 2rem',
              fontSize: '1.1rem',
              borderRadius: 8,
              border: '2px solid #ffd700',
              background: '#181818',
              color: '#ffd700',
              fontFamily: 'Norsebold, Norse, serif',
              fontWeight: 'bold',
              letterSpacing: 1,
              cursor: 'pointer',
              boxShadow: '0 0 12px 2px #ffd70033',
              transition: 'background 0.2s, color 0.2s',
            }}
            onClick={() => navigate('/deck-builder')}
          >
            Deck Builder
          </button>
        </div>
        <Grid>
          {cards.map(card => {
            const owned = hasCard(card.id);
            return (
              <CardBox key={card.id} owned={owned}>
                <CardImage src={card.image} alt={card.name} />
                <CardName>{card.name}</CardName>
                <CardRarity>{card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}</CardRarity>
                {!owned && <LockIcon title="Locked">🔒</LockIcon>}
              </CardBox>
            );
          })}
        </Grid>
      </div>
    </div>
  );
};

export default CardCollection; 