import React, { useState } from 'react';
import StoryModal from './StoryModal';
import GameCard from './GameCard';
import { cards } from '../data/cards';

interface CampaignOnboardingModalProps {
  open: boolean;
  onComplete: (playerName: string, chosenCards: string[]) => void;
}

// Allow any card with a valid image
const selectableCards = cards.filter(card => card.image && !card.image.includes('/cards/'));

export const CampaignOnboardingModal: React.FC<CampaignOnboardingModalProps> = ({ open, onComplete }) => {
  const [step, setStep] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [chosenCards, setChosenCards] = useState<string[]>([]);
  const [nameError, setNameError] = useState('');

  // Step 1: Epic intro story
  if (step === 0) {
    return (
      <StoryModal
        open={open}
        title="Trials of the Realms"
        text={`Yggdrasil, the World Tree, trembles. An ancient force stirs in Ginnungagap, threatening to unravel the balance of the Nine Realms.\n\nThe Norns, weavers of fate, have chosen you. Only by facing the Trials of the Realms can the worlds be restored and chaos sealed away.\n\nYour journey begins now, Chosen One.`}
        onClose={() => setStep(1)}
      />
    );
  }

  // Step 2: Name prompt (custom modal)
  if (step === 1) {
    return open ? (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(24,18,8,0.92)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="story-modal-content" style={{ background: 'linear-gradient(135deg, #2a1a0a 0%, #181818 100%)', borderRadius: 20, boxShadow: '0 0 48px 8px #000a, 0 0 0 4px #ffd70044', padding: '2.5rem 2.5rem 2rem 2.5rem', minWidth: 320, maxWidth: 420, width: '95vw', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', fontFamily: 'Norse, serif', zIndex: 4100 }}>
          <h2 style={{ color: '#ffd700', fontFamily: 'NorseBold, Norse, serif', fontSize: '2.2rem', textShadow: '0 0 18px #ffd700, 0 2px 2px #000, 0 0 2px #ffd700', marginBottom: '0.5rem', textAlign: 'center' }}>The Norns Speak</h2>
          <p style={{ color: '#ffe066', fontSize: '1.1rem', marginBottom: '1.5rem', textAlign: 'center', fontFamily: 'Norse, serif' }}>
            "What do they call you, Chosen One? Your name will be woven into the fate of the realms."
          </p>
          <input
            type="text"
            value={playerName}
            onChange={e => { setPlayerName(e.target.value); setNameError(''); }}
            placeholder="Enter your name..."
            style={{
              fontSize: '1.2rem',
              padding: '0.6rem 1.2rem',
              borderRadius: 8,
              border: '2px solid #ffd700',
              fontFamily: 'Norse, serif',
              width: '80%',
              marginBottom: 8
            }}
            maxLength={18}
            autoFocus
          />
          {nameError && <div style={{ color: '#ff4444', fontSize: '1rem', marginTop: 4 }}>{nameError}</div>}
          <button
            onClick={() => {
              if (!playerName.trim()) {
                setNameError('Please enter your name.');
                return;
              }
              setStep(2);
            }}
            style={{
              margin: '1.2rem auto 0 auto',
              display: 'block',
              padding: '0.8rem 2.2rem',
              fontSize: '1.2rem',
              borderRadius: 8,
              border: '2px solid #ffd700',
              background: '#ffd700',
              color: '#1a1a1a',
              fontFamily: 'Norse, serif',
              fontWeight: 700,
              letterSpacing: 1,
              cursor: 'pointer',
              boxShadow: '0 0 12px 2px #ffd70033',
              transition: 'background 0.2s, color 0.2s'
            }}
          >
            Continue
          </button>
        </div>
      </div>
    ) : null;
  }

  // Step 3: Card selection (custom modal)
  if (step === 2) {
    return open ? (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(24,18,8,0.92)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="story-modal-content" style={{ background: 'linear-gradient(135deg, #2a1a0a 0%, #181818 100%)', borderRadius: 20, boxShadow: '0 0 48px 8px #000a, 0 0 0 4px #ffd70044', padding: '2.5rem 2.5rem 2rem 2.5rem', minWidth: 320, maxWidth: 620, width: '98vw', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', fontFamily: 'Norse, serif', zIndex: 4100 }}>
          <h2 style={{ color: '#ffd700', fontFamily: 'NorseBold, Norse, serif', fontSize: '2.2rem', textShadow: '0 0 18px #ffd700, 0 2px 2px #000, 0 0 2px #ffd700', marginBottom: '0.5rem', textAlign: 'center' }}>Choose Your Companions</h2>
          <p style={{ color: '#ffe066', fontSize: '1.1rem', marginBottom: '1.5rem', textAlign: 'center', fontFamily: 'Norse, serif' }}>
            "Before you set forth, select five allies to stand with you in the coming trials.\nChoose wisely – their strength may decide the fate of the worlds."
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gridAutoRows: '180px',
            gap: 20,
            rowGap: 36,
            justifyContent: 'center',
            alignItems: 'end',
            margin: '1.2rem 0',
            maxHeight: 540,
            overflowY: 'auto',
            padding: 8,
            background: '#181818cc',
            borderRadius: 12,
          }}>
            {selectableCards.map(card => (
              <div
                key={card.id}
                style={{
                  border: chosenCards.includes(card.id) ? '4px solid #ffd700' : '2px solid #444',
                  borderRadius: 12,
                  boxShadow: chosenCards.includes(card.id) ? '0 0 18px #ffd700cc' : '0 2px 8px #000a',
                  cursor: 'pointer',
                  background: chosenCards.includes(card.id) ? '#222a' : '#222',
                  opacity: chosenCards.length === 5 && !chosenCards.includes(card.id) ? 0.5 : 1,
                  position: 'relative',
                  transition: 'transform 0.15s, box-shadow 0.15s, border 0.15s',
                  width: 110,
                  height: 160,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingBottom: 0,
                }}
                onClick={() => {
                  if (chosenCards.includes(card.id)) {
                    setChosenCards(chosenCards.filter(id => id !== card.id));
                  } else if (chosenCards.length < 5) {
                    setChosenCards([...chosenCards, card.id]);
                  }
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <GameCard card={{ ...card, owner: null }} isPlayable={false} hideName={true} />
                {chosenCards.includes(card.id) && (
                  <div style={{
                    position: 'absolute',
                    top: 6,
                    right: 8,
                    background: '#ffd700',
                    color: '#222',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 20,
                    boxShadow: '0 0 8px #ffd700cc',
                  }}>✓</div>
                )}
                <div style={{
                  marginTop: 12,
                  minHeight: 28,
                  fontSize: 16,
                  color: '#ffd700',
                  fontWeight: 700,
                  textAlign: 'center',
                  fontFamily: 'Norse, serif',
                  textShadow: '0 0 6px #000',
                  wordBreak: 'break-word',
                  lineHeight: 1.15,
                  maxWidth: 120,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>{card.name}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 8, color: '#ffd700', fontFamily: 'Norse, serif' }}>
            {chosenCards.length}/5 selected
          </div>
          <button
            onClick={() => { if (chosenCards.length === 5) setStep(3); }}
            disabled={chosenCards.length !== 5}
            style={{
              margin: '1.2rem auto 0 auto',
              display: 'block',
              padding: '0.8rem 2.2rem',
              fontSize: '1.2rem',
              borderRadius: 8,
              border: '2px solid #ffd700',
              background: chosenCards.length === 5 ? '#ffd700' : '#888',
              color: '#1a1a1a',
              fontFamily: 'Norse, serif',
              fontWeight: 700,
              letterSpacing: 1,
              cursor: chosenCards.length === 5 ? 'pointer' : 'not-allowed',
              boxShadow: '0 0 12px 2px #ffd70033',
              transition: 'background 0.2s, color 0.2s'
            }}
          >
            Continue
          </button>
        </div>
      </div>
    ) : null;
  }

  // Step 4: Final story
  if (step === 3) {
    return (
      <StoryModal
        open={open}
        title="The First Trial Awaits"
        text={`With your name known and your companions chosen, you step onto the path of destiny.\n\nMidgard, the realm of mortals, calls to you. The first trial awaits, ${playerName.trim() || 'warrior'}.\n\nMay the Norns guide your hand.`}
        onClose={() => onComplete(playerName.trim(), chosenCards)}
      />
    );
  }

  return null;
}; 