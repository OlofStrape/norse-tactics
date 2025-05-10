import React, { useState } from 'react';
import styled from '@emotion/styled';
import { cards } from '../data/cards';
import { getCardCollection } from '../utils/cardCollection';
import { useNavigate } from 'react-router-dom';

const DECK_KEY = 'playerDeck';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const Title = styled.h1`
  font-family: 'Norsebold', 'Norse', serif;
  color: #ffd700;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 24px;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.2rem;
`;

const CardBox = styled.div<{ selected?: boolean }>`
  background: linear-gradient(135deg, #2a1a0a 0%, #181818 100%);
  border-radius: 12px;
  box-shadow: 0 0 12px #000a, 0 0 0 2px #ffd70044;
  padding: 0.7rem 0.5rem 0.5rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
  border: 2px solid ${props => props.selected ? '#ffd700' : 'transparent'};
  opacity: 1;
  filter: none;
  transition: border 0.2s;
`;

const CardImage = styled.img`
  width: 64px;
  height: 90px;
  border-radius: 8px;
  margin-bottom: 0.4rem;
  box-shadow: 0 2px 8px #0008;
`;

const CardName = styled.div`
  font-family: 'Norsebold', 'Norse', serif;
  font-size: 1rem;
  color: #ffd700;
  margin-bottom: 0.1rem;
  text-align: center;
`;

const CardRarity = styled.div`
  font-size: 0.9rem;
  color: #ffe066;
  text-align: center;
`;

const DeckArea = styled.div`
  display: flex;
  gap: 1.2rem;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const SaveButton = styled.button`
  padding: 0.7rem 2.2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  border: 2px solid #ffd700;
  background: #ffd700;
  color: #1a1a1a;
  font-family: 'Norsebold', 'Norse', serif;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 0 12px 2px #ffd70033;
  margin: 0 auto;
  display: block;
  margin-bottom: 1.2rem;
  transition: background 0.2s;
  &:hover {
    background: #ffe066;
  }
`;

const Message = styled.div`
  color: #81C784;
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
`;

const DeckBuilder: React.FC = () => {
  const ownedIds = getCardCollection();
  const ownedCards = cards.filter(c => ownedIds.includes(c.id));
  const [deck, setDeck] = useState<string[]>(() => {
    const saved = localStorage.getItem(DECK_KEY);
    if (saved) return JSON.parse(saved);
    return ownedCards.slice(0, 5).map(c => c.id);
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fontStyles = `
    @font-face {
      font-family: 'Norse';
      src: url('/fonts/Norse.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'Norsebold';
      src: url('/fonts/Norsebold.otf') format('opentype');
      font-weight: bold;
      font-style: normal;
    }
  `;

  const toggleCard = (cardId: string) => {
    if (deck.includes(cardId)) {
      setDeck(deck.filter(id => id !== cardId));
    } else if (deck.length < 5) {
      setDeck([...deck, cardId]);
    }
  };

  const saveDeck = () => {
    if (deck.length !== 5) {
      setMessage('You must select exactly 5 cards for your deck.');
      return;
    }
    localStorage.setItem(DECK_KEY, JSON.stringify(deck));
    setMessage('Deck saved!');
  };

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
        onClick={() => navigate('/collection')}
      >
        ← Back
      </button>
      <Container>
        <Title>Deck Builder</Title>
        <Section>
          <h2 style={{ color: '#ffd700', fontFamily: 'Norse, serif', textAlign: 'center', fontSize: '1.3rem', marginBottom: 12 }}>Your Deck ({deck.length}/5)</h2>
          <DeckArea>
            {deck.map(cardId => {
              const card = cards.find(c => c.id === cardId);
              if (!card) return null;
              return (
                <CardBox key={card.id} selected onClick={() => toggleCard(card.id)} title="Remove from deck">
                  <CardImage src={card.image} alt={card.name} />
                  <CardName>{card.name}</CardName>
                  <CardRarity>{card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}</CardRarity>
                </CardBox>
              );
            })}
          </DeckArea>
        </Section>
        <Section>
          <h2 style={{ color: '#ffd700', fontFamily: 'Norse, serif', textAlign: 'center', fontSize: '1.1rem', marginBottom: 8 }}>Your Collection</h2>
          <CardGrid>
            {ownedCards.map(card => (
              <CardBox
                key={card.id}
                selected={deck.includes(card.id)}
                onClick={() => toggleCard(card.id)}
                title={deck.includes(card.id) ? 'Remove from deck' : deck.length < 5 ? 'Add to deck' : 'Deck is full'}
              >
                <CardImage src={card.image} alt={card.name} />
                <CardName>{card.name}</CardName>
                <CardRarity>{card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}</CardRarity>
              </CardBox>
            ))}
          </CardGrid>
        </Section>
        <SaveButton onClick={saveDeck}>Save Deck</SaveButton>
        {message && <Message>{message}</Message>}
      </Container>
    </div>
  );
};

export default DeckBuilder; 