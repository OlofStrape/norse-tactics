import React, { useState, useEffect } from 'react';
import QuestMap from './QuestMap';
import QuestCard from './QuestCard';
import { campaignStory, allQuests } from '../data/campaign';
import { CampaignService } from '../services/campaignService';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { Global, css } from '@emotion/react';
import QuestPanelModal from './QuestPanelModal';
import GameCard from './GameCard';
import { cards } from '../data/cards';
import { getLevelFromXP, xpForLevel, xpToNextLevel } from '../utils/xp';

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
  justify-content: flex-start;
  position: relative;
  padding: 2rem 0 0 0;
`;

const Title = styled.h1`
  font-family: 'Norse', 'Cinzel Decorative', serif;
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-align: center;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const SubTitle = styled.div`
  font-family: 'Norse', serif;
  font-size: 1.2rem;
  color: #ffd700;
  text-shadow: 0 0 6px rgba(255, 215, 0, 0.3);
  margin-bottom: 1.5rem;
  letter-spacing: 0.08em;
`;

const QuestList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
`;

const BackButton = styled.button`
  position: absolute;
  top: 24px;
  left: 24px;
  padding: 0.5rem 1.2rem;
  font-size: 1.1rem;
  border-radius: 6px;
  border: 2px solid #ffd700;
  background: #181818cc;
  color: #ffd700;
  font-family: 'Norse', 'Cinzel Decorative', serif;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  z-index: 10;
  transition: background 0.2s, box-shadow 0.2s;
  text-shadow: 0 1px 6px #fff8, 0 0 2px #ffd70044;
  &:hover {
    background: #2a1a0a;
    box-shadow: 0 0 18px 4px #ffd70066, 0 4px 16px rgba(0,0,0,0.18);
  }
`;

const campaignService = new CampaignService();

// Example realm data for QuestMap (should be replaced with real data)
const realms = [
  // Row 1
  { id: 'midgard', name: 'Midgard', description: 'The world of mortals', position: { x: 30, y: 15 }, connections: [], unlocked: true, completed: false },
  { id: 'asgard', name: 'Asgard', description: 'Realm of the gods', position: { x: 50, y: 15 }, connections: [], unlocked: true, completed: false },
  { id: 'vanaheim', name: 'Vanaheim', description: 'Realm of the Vanir', position: { x: 70, y: 15 }, connections: [], unlocked: true, completed: false },
  // Row 2
  { id: 'alfheim', name: 'Alfheim', description: 'Realm of the Light Elves', position: { x: 30, y: 40 }, connections: [], unlocked: true, completed: false },
  { id: 'jotunheim', name: 'Jotunheim', description: 'Land of Giants', position: { x: 50, y: 40 }, connections: [], unlocked: true, completed: false },
  { id: 'nidavellir', name: 'Nidavellir', description: 'Realm of the Dwarves', position: { x: 70, y: 40 }, connections: [], unlocked: true, completed: false },
  // Row 3
  { id: 'svartalfheim', name: 'Svartalfheim', description: 'Realm of the Dark Elves', position: { x: 30, y: 65 }, connections: [], unlocked: true, completed: false },
  { id: 'muspelheim', name: 'Muspelheim', description: 'Realm of Fire', position: { x: 50, y: 65 }, connections: [], unlocked: true, completed: false },
  { id: 'niflheim', name: 'Niflheim', description: 'Realm of Ice', position: { x: 70, y: 65 }, connections: [], unlocked: true, completed: false },
  // Helheim at the bottom center
  { id: 'helheim', name: 'Helheim', description: 'Realm of the Dead', position: { x: 50, y: 90 }, connections: [], unlocked: true, completed: false },
];

// Add this type for chapter keys
type ChapterKey = keyof typeof campaignStory.chapters;

// Progress state management
function loadProgress() {
  const data = localStorage.getItem('campaignProgress');
  if (data) return JSON.parse(data);
  // Use the starter deck as initial deck and unlocked cards
  const starter = ['viking-warrior', 'berserker', 'shield-maiden', 'einherjar', 'tyr'];
  return {
    completedQuests: [],
    playerLevel: 1,
    experience: 0,
    specialAbilities: [],
    unlockedCards: starter,
    deck: starter
  };
}
function saveProgress(progress: any) {
  localStorage.setItem('campaignProgress', JSON.stringify(progress));
}

function loadPlayerProfile(progress: any) {
  const name = localStorage.getItem('playerName') || 'Player';
  const avatar = localStorage.getItem('playerAvatar') || (progress.unlockedCards && progress.unlockedCards[0]) || '';
  return { name, avatar };
}

function savePlayerProfile(name: string, avatar: string) {
  localStorage.setItem('playerName', name);
  localStorage.setItem('playerAvatar', avatar);
}

const CampaignPage: React.FC = () => {
  const [selectedRealm, setSelectedRealm] = useState<ChapterKey | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [progress, setProgress] = useState(loadProgress());
  const navigate = useNavigate();
  const [deckModalOpen, setDeckModalOpen] = useState(false);
  const [deckSelection, setDeckSelection] = useState(progress.deck || []);
  const [questToStart, setQuestToStart] = useState<any | null>(null);
  const [levelUpModalOpen, setLevelUpModalOpen] = useState(false);
  const [newLevel, setNewLevel] = useState<number | null>(null);
  const [playerProfile, setPlayerProfile] = useState(() => loadPlayerProfile(progress));
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(playerProfile.name);
  const [avatarSelectOpen, setAvatarSelectOpen] = useState(false);

  // Calculate level from XP using new formula
  const playerLevel = getLevelFromXP(progress.experience);
  const xpCurrentLevel = progress.experience - xpForLevel(playerLevel);
  const xpNeeded = xpToNextLevel(playerLevel);

  useEffect(() => { saveProgress(progress); }, [progress]);

  // Show level-up modal if player leveled up after a quest
  useEffect(() => {
    const prevLevel = Number(localStorage.getItem('playerPrevLevel') || '1');
    if (progress.playerLevel > prevLevel) {
      setLevelUpModalOpen(true);
      setNewLevel(progress.playerLevel);
      localStorage.setItem('playerPrevLevel', String(progress.playerLevel));
    } else {
      localStorage.setItem('playerPrevLevel', String(progress.playerLevel));
    }
  }, [progress.playerLevel]);

  // Find the realm object by id
  const selectedRealmObj = selectedRealm
    ? realms.find(r => r.id === selectedRealm) ?? null
    : null;
  // Get quests for the selected realm
  const selectedRealmQuests = selectedRealmObj
    ? allQuests.filter(q => q.location === selectedRealmObj.id)
    : [];

  // Helper to determine quest state
  function getQuestState(quest: any) {
    const req = quest.requirements;
    if (progress.completedQuests.includes(quest.id)) return 'completed';
    // Check requirements
    let unlocked = true;
    if (req.playerLevel && playerLevel < req.playerLevel) unlocked = false;
    if (req.completedQuests && req.completedQuests.length > 0 && !req.completedQuests.every((q: string) => progress.completedQuests.includes(q))) unlocked = false;
    // For now, treat all as unlocked if no requirements
    if (!req.playerLevel && !req.completedQuests) unlocked = true;
    if (unlocked) return 'unlocked';
    return 'locked';
  }

  // Handler for quest completion (simulate for now)
  function handleCompleteQuest(quest: any) {
    if (progress.completedQuests.includes(quest.id)) return;
    const newExp = progress.experience + (quest.rewards.experience || 0);
    const newLevel = getLevelFromXP(newExp);
    let newAbilities = progress.specialAbilities || [];
    if (quest.rewards.specialAbilities && quest.rewards.specialAbilities.length > 0) {
      newAbilities = Array.from(new Set([...(progress.specialAbilities || []), ...quest.rewards.specialAbilities]));
    }
    // Add new cards to unlockedCards
    let newUnlocked = progress.unlockedCards ? [...progress.unlockedCards] : [];
    if (quest.rewards.cardIds && quest.rewards.cardIds.length > 0) {
      for (const cardId of quest.rewards.cardIds) {
        if (!newUnlocked.includes(cardId)) newUnlocked.push(cardId);
      }
    }
    // If deck is empty, set to unlocked
    let newDeck = progress.deck && progress.deck.length > 0 ? progress.deck : newUnlocked.slice(0, 5);
    setProgress({
      ...progress,
      completedQuests: [...progress.completedQuests, quest.id],
      experience: newExp,
      playerLevel: newLevel,
      specialAbilities: newAbilities,
      unlockedCards: newUnlocked,
      deck: newDeck
    });
  }

  // Handler for quest start (open modal instead of navigating immediately)
  function handleStartQuest(quest: any) {
    setQuestToStart(quest);
  }

  // Handler for confirming quest start (navigate)
  function handleBeginBattle() {
    if (questToStart) {
      navigate(`/game/${questToStart.id}`);
      setQuestToStart(null);
    }
  }

  // Handler for realm selection (open modal)
  function handleRealmSelect(realmId: string) {
    setSelectedRealm(realmId as ChapterKey);
    setModalOpen(true);
  }

  // Handler to open deck editor
  function handleEditDeck() {
    setDeckSelection(progress.deck || []);
    setDeckModalOpen(true);
  }

  // Handler to toggle card in deck selection
  function handleToggleCard(cardId: string) {
    if (deckSelection.includes(cardId)) {
      setDeckSelection(deckSelection.filter((id: string) => id !== cardId));
    } else if (deckSelection.length < 5) {
      setDeckSelection([...deckSelection, cardId]);
    }
  }

  // Handler to save deck
  function handleSaveDeck() {
    setProgress({ ...progress, deck: deckSelection });
    setDeckModalOpen(false);
  }

  // Handler to save player name
  function handleSaveName() {
    setPlayerProfile({ ...playerProfile, name: nameInput });
    savePlayerProfile(nameInput, playerProfile.avatar);
    setEditingName(false);
  }

  // Handler to select avatar
  function handleSelectAvatar(cardId: string) {
    setPlayerProfile({ ...playerProfile, avatar: cardId });
    savePlayerProfile(playerProfile.name, cardId);
    setAvatarSelectOpen(false);
  }

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
      <BackButton onClick={() => navigate('/')}>← Back to Menu</BackButton>
      <Title>Campaign</Title>
      <SubTitle>{selectedRealm ? campaignStory.chapters[selectedRealm].title : 'Select a realm to view quests'}</SubTitle>
      {/* Player Info Panel */}
      <div style={{
        background: '#222',
        color: '#ffd700',
        borderRadius: 12,
        padding: '1rem 2rem',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        fontFamily: 'Norse, serif',
        boxShadow: '0 0 16px #000a'
      }}>
        {/* Avatar, Name, Level, XP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, minWidth: 320 }}>
          {/* Avatar and Name */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 8 }}>
            <div style={{ width: 72, height: 100, borderRadius: 10, background: '#181818', boxShadow: '0 0 8px #000a', marginBottom: 6, position: 'relative', cursor: 'pointer' }} onClick={() => setAvatarSelectOpen(true)} title="Change Avatar">
              {playerProfile.avatar ? (
                <img src={cards.find(c => c.id === playerProfile.avatar)?.image} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: 10, objectFit: 'cover', border: '2px solid #ffd700' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffd700', fontSize: 32 }}>?</div>
              )}
              <span style={{ position: 'absolute', bottom: 2, right: 6, fontSize: 18, color: '#ffd700', textShadow: '0 0 6px #000' }}>✎</span>
            </div>
            {editingName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  style={{ fontSize: 18, borderRadius: 6, border: '1px solid #ffd700', padding: '2px 8px', fontFamily: 'Norse, serif', color: '#222', background: '#ffd700', fontWeight: 'bold', width: 90 }}
                  maxLength={16}
                  autoFocus
                />
                <button onClick={handleSaveName} style={{ background: '#ffd700', color: '#222', border: 'none', borderRadius: 6, fontWeight: 'bold', padding: '2px 10px', cursor: 'pointer' }}>✔</button>
                <button onClick={() => setEditingName(false)} style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', padding: '2px 10px', cursor: 'pointer' }}>✖</button>
              </div>
            ) : (
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#ffd700', cursor: 'pointer', textShadow: '0 0 6px #ffd70088' }} onClick={() => setEditingName(true)} title="Edit Name">{playerProfile.name}</div>
            )}
          </div>
          {/* Level and XP */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 120 }}>
            <div style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 2 }}>Level {progress.playerLevel}</div>
            <div style={{ fontSize: 16, marginBottom: 4 }}>XP: {progress.experience - ((progress.playerLevel - 1) * 1000)} / {progress.playerLevel * 1000}</div>
            <div style={{ height: 8, background: '#444', borderRadius: 4, width: 140, marginBottom: 2 }}>
              <div style={{ height: 8, background: '#ffd700', borderRadius: 4, width: `${Math.min(100, Math.round((progress.experience - ((progress.playerLevel - 1) * 1000)) / (progress.playerLevel * 1000) * 100))}%`, transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>
        {/* Card Collection & Deck Builder Buttons */}
        <div style={{ display: 'flex', gap: 16, marginLeft: 'auto' }}>
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
            onClick={() => navigate('/collection')}
          >
            Card Collection
          </button>
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
      </div>
      {progress.specialAbilities && progress.specialAbilities.length > 0 && (
        <div style={{ margin: '1rem 0', background: '#222', color: '#ffd700', padding: '0.75rem 1.5rem', borderRadius: 8, boxShadow: '0 0 8px #ffd70055' }}>
          <strong>Unlocked Abilities:</strong>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {progress.specialAbilities.map((ability: string, i: number) => (
              <li key={i}>{ability}</li>
            ))}
          </ul>
        </div>
      )}
      <QuestMap realms={realms} onRealmSelect={handleRealmSelect} />
      <QuestPanelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        realm={selectedRealmObj}
        quests={selectedRealmQuests.map(q => ({ ...q, state: getQuestState(q) }))}
      />
      {/* Quest Start Modal */}
      {questToStart && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.82)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#222', borderRadius: 16, padding: 36, minWidth: 420, maxWidth: 600, color: '#ffd700', boxShadow: '0 0 32px #000', position: 'relative' }}>
            <h2 style={{ fontFamily: 'Norsebold, Norse, serif', fontSize: 32, color: '#ffd700', marginBottom: 8, textShadow: '0 0 8px #ffd70088' }}>{questToStart.name}</h2>
            <div style={{ fontSize: 18, marginBottom: 12 }}>{questToStart.description}</div>
            {questToStart.specialRules && (
              <div style={{ marginBottom: 10 }}>
                <strong>Special Rules:</strong> <span style={{ color: '#fff' }}>{Object.keys(questToStart.specialRules).filter(k => questToStart.specialRules[k]).join(', ') || 'None'}</span>
              </div>
            )}
            {questToStart.rewards && (
              <div style={{ marginBottom: 10 }}>
                <strong>Rewards:</strong> <span style={{ color: '#fff' }}>
                  {questToStart.rewards.experience ? `${questToStart.rewards.experience} XP` : ''}
                  {questToStart.rewards.cardIds && questToStart.rewards.cardIds.length > 0 ? `, Cards: ${questToStart.rewards.cardIds.map((id: string) => cards.find(c => c.id === id)?.name || id).join(', ')}` : ''}
                  {questToStart.rewards.specialAbilities && questToStart.rewards.specialAbilities.length > 0 ? `, Abilities: ${questToStart.rewards.specialAbilities.join(', ')}` : ''}
                </span>
              </div>
            )}
            <div style={{ marginBottom: 10 }}>
              <strong>Your Deck:</strong>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                {progress.deck && progress.deck.map((cardId: string) => {
                  const cardObj = cards.find(c => c.id === cardId);
                  return cardObj ? (
                    <div key={cardId} style={{ width: 80 }}>
                      <GameCard card={cardObj} isPlayable={false} onClick={() => {}} />
                      <div style={{ textAlign: 'center', color: '#ffd700', fontWeight: 'bold', fontSize: 13 }}>{cardObj.name}</div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
              <button onClick={() => setQuestToStart(null)} style={{ padding: '0.5rem 1.2rem', borderRadius: 6, border: 'none', background: '#888', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleBeginBattle} style={{ padding: '0.5rem 1.2rem', borderRadius: 6, border: 'none', background: '#ffd700', color: '#222', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 8px #ffd70088' }}>Begin Battle</button>
            </div>
          </div>
        </div>
      )}
      {/* Deck Edit Modal */}
      {deckModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#222', borderRadius: 12, padding: 32, minWidth: 400, maxWidth: 600, color: '#ffd700', boxShadow: '0 0 24px #000' }}>
            <h2 style={{ color: '#ffd700', marginBottom: 12 }}>Edit Your Deck</h2>
            <div style={{ marginBottom: 16 }}>Select up to 5 cards for your deck:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
              {progress.unlockedCards && progress.unlockedCards.map((cardId: string) => {
                const cardObj = cards.find(c => c.id === cardId);
                return (
                  <div
                    key={cardId}
                    style={{ border: deckSelection.includes(cardId) ? '3px solid #ffd700' : '2px solid #444', borderRadius: 8, padding: 4, background: deckSelection.includes(cardId) ? '#333' : '#181818', cursor: 'pointer', width: 120 }}
                    onClick={() => handleToggleCard(cardId)}
                  >
                    {cardObj ? (
                      <GameCard card={cardObj} isPlayable={false} onClick={() => {}} />
                    ) : (
                      <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>Unknown Card</div>
                    )}
                    <div style={{ textAlign: 'center', marginTop: 4, color: deckSelection.includes(cardId) ? '#ffd700' : '#aaa', fontWeight: 'bold' }}>{cardObj ? cardObj.name : cardId}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setDeckModalOpen(false)} style={{ padding: '0.5rem 1.2rem', borderRadius: 6, border: 'none', background: '#888', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSaveDeck} disabled={deckSelection.length !== 5} style={{ padding: '0.5rem 1.2rem', borderRadius: 6, border: 'none', background: deckSelection.length === 5 ? '#ffd700' : '#444', color: '#222', fontWeight: 'bold', cursor: deckSelection.length === 5 ? 'pointer' : 'not-allowed' }}>Save Deck</button>
            </div>
          </div>
        </div>
      )}
      {/* Level Up Modal */}
      {levelUpModalOpen && newLevel && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.82)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#222', borderRadius: 20, padding: 48, minWidth: 340, maxWidth: 420, color: '#ffd700', boxShadow: '0 0 32px #000', textAlign: 'center', position: 'relative' }}>
            <h2 style={{ fontFamily: 'Norsebold, Norse, serif', fontSize: 38, color: '#ffd700', marginBottom: 12, textShadow: '0 0 12px #ffd70088' }}>Level Up!</h2>
            <div style={{ fontSize: 24, marginBottom: 16 }}>You reached <span style={{ color: '#fff', fontWeight: 'bold' }}>Level {newLevel}</span>!</div>
            <div style={{ fontSize: 18, marginBottom: 24 }}>Keep playing to unlock new quests, realms, and rewards.</div>
            <button onClick={() => setLevelUpModalOpen(false)} style={{ padding: '0.7rem 2rem', borderRadius: 8, border: 'none', background: '#ffd700', color: '#222', fontWeight: 'bold', fontSize: 18, cursor: 'pointer', boxShadow: '0 0 8px #ffd70088' }}>Close</button>
          </div>
        </div>
      )}
      {/* Avatar selection modal */}
      {avatarSelectOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.82)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#222', borderRadius: 20, padding: 36, minWidth: 340, maxWidth: 520, color: '#ffd700', boxShadow: '0 0 32px #000', textAlign: 'center', position: 'relative' }}>
            <h2 style={{ fontFamily: 'Norsebold, Norse, serif', fontSize: 28, color: '#ffd700', marginBottom: 12, textShadow: '0 0 8px #ffd70088' }}>Select Avatar</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 18 }}>
              {progress.unlockedCards && progress.unlockedCards.map((cardId: string) => {
                const cardObj = cards.find(c => c.id === cardId);
                return cardObj ? (
                  <div key={cardId} style={{ width: 72, height: 100, borderRadius: 10, background: '#181818', boxShadow: '0 0 8px #000a', cursor: 'pointer', border: playerProfile.avatar === cardId ? '3px solid #ffd700' : '2px solid #444', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }} onClick={() => handleSelectAvatar(cardId)}>
                    <img src={cardObj.image} alt={cardObj.name} style={{ width: '100%', height: '100%', borderRadius: 10, objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 2, left: 0, right: 0, textAlign: 'center', color: '#ffd700', fontWeight: 'bold', fontSize: 13, textShadow: '0 0 6px #000' }}>{cardObj.name}</div>
                  </div>
                ) : null;
              })}
            </div>
            <button onClick={() => setAvatarSelectOpen(false)} style={{ padding: '0.7rem 2rem', borderRadius: 8, border: 'none', background: '#ffd700', color: '#222', fontWeight: 'bold', fontSize: 18, cursor: 'pointer', boxShadow: '0 0 8px #ffd70088' }}>Close</button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default CampaignPage; 