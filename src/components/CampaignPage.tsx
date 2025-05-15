import React, { useState, useEffect, Suspense } from 'react';
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
import { realms as baseRealms, realmProgression } from '../data/realms';
import { PlayerProgress } from '../types/player';
import { Quest } from '../services/campaignService';
import { LoadingSpinner } from './AILoadingIndicator';
import { RewardModal } from './RewardModal';
import { CampaignOnboardingModal } from './CampaignOnboardingModal';
import StoryModal from './StoryModal';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  padding: 1.1rem 0 0 0;
  width: 100vw;
  box-sizing: border-box;
  @media (max-width: 700px) {
    padding: 0.5rem 0 0 0;
    width: 100vw;
  }
`;

const Title = styled.h1`
  font-family: 'Norse', 'Cinzel Decorative', serif;
  font-size: clamp(2rem, 6vw, 3rem);
  margin-top: 0.2rem;
  margin-bottom: 0.3rem;
  text-align: center;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  @media (max-width: 700px) {
    font-size: clamp(1.2rem, 8vw, 2.2rem);
    margin-bottom: 0.7rem;
  }
`;

const SubTitle = styled.div`
  font-family: 'Norse', serif;
  font-size: 1.2rem;
  color: #ffd700;
  text-shadow: 0 0 6px rgba(255, 215, 0, 0.3);
  margin-bottom: 1.1rem;
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
  top: 10px;
  left: 8px;
  padding: 0.5rem 1.2rem;
  font-size: 1.1rem;
  border-radius: 6px;
  border: none;
  background: rgba(24,24,24,0.18);
  color: #ffd700;
  font-family: 'Norse', 'Cinzel Decorative', serif;
  font-weight: 400;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: none;
  z-index: 10;
  transition: background 0.2s;
  text-shadow: 0 1px 6px #fff6, 0 0 2px #ffd70022;
  &:hover {
    background: rgba(24,24,24,0.28);
  }
`;

const InfoPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 420px;
  background: #222c;
  border-radius: 16px;
  box-shadow: 0 2px 12px #0006;
  padding: 2rem 1.2rem 2rem 1.2rem;
  margin: 0 auto 1.2rem auto;
  gap: 1.2rem;
  box-sizing: border-box;
  @media (max-width: 700px) {
    max-width: 98vw;
    width: 95vw;
    padding: 1rem 0.5rem;
    gap: 0.7rem;
  }
`;

const AvatarBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  min-width: 72px;
  height: 100px;
  margin: 0 auto 0.5rem auto;
  @media (max-width: 700px) {
    width: 44px;
    min-width: 44px;
    height: 60px;
    margin-bottom: 0.3rem;
  }
`;

const NameEditBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0.2rem 0 0.7rem 0;
  gap: 0.5rem;
`;

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
`;

const LevelBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: #181818cc;
  border-radius: 10px;
  padding: 0.5rem 0.7rem;
  margin-bottom: 0.2rem;
  @media (max-width: 700px) {
    padding: 0.4rem 0.3rem;
  }
`;

const ButtonBlock = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0.7rem 0 0 0;
  @media (max-width: 700px) {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    justify-content: center;
    margin: 0.5rem 0 0 0;
  }
`;

const campaignService = new CampaignService();

// Helper to compute realm progress and lock/unlock state
function getRealmStates(progress: any, playerLevel: number) {
  // Map of realmId -> quests in that realm
  const questsByRealm: { [realmId: string]: typeof allQuests } = allQuests.reduce((acc: { [realmId: string]: typeof allQuests }, quest) => {
    if (!acc[quest.location]) acc[quest.location] = [];
    acc[quest.location].push(quest);
    return acc;
  }, {});

  // Helper: is realm completed?
  function isRealmCompleted(realmId: string): boolean {
    const quests = questsByRealm[realmId] || [];
    return quests.length > 0 && quests.every((q: any) => progress.completedQuests.includes(q.id));
  }

  // Helper: is realm unlocked?
  function isRealmUnlocked(realmId: string): boolean {
    if (realmId === 'midgard') return true;
    const req = realmProgression[realmId as keyof typeof realmProgression];
    if (!req) return false;
    // All required quests must be completed
    if (req.requiredQuests && req.requiredQuests.length > 0 && !req.requiredQuests.every((q: string) => progress.completedQuests.includes(q))) return false;
    // Level requirement
    if (req.requiredLevel && playerLevel < req.requiredLevel) return false;
    return true;
  }

  // Helper: percent complete for progress bar
  function getRealmProgressPercent(realmId: string): number {
    const quests = questsByRealm[realmId] || [];
    if (quests.length === 0) return 0;
    const completed = quests.filter((q: any) => progress.completedQuests.includes(q.id)).length;
    return Math.round((completed / quests.length) * 100);
  }

  // Build the new realms array
  return baseRealms.map(realm => ({
    ...realm,
    unlocked: isRealmUnlocked(realm.id),
    completed: isRealmCompleted(realm.id),
    progressPercent: getRealmProgressPercent(realm.id)
  }));
}

// Add this type for chapter keys
type ChapterKey = keyof typeof campaignStory.chapters;

// Extend StoryChoice type to include flag
interface StoryChoice {
  text: string;
  result: string;
  flag?: Record<string, any>;
}

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
    deck: starter,
    storyFlags: {}
  };
}
function saveProgress(progress: any) {
  localStorage.setItem('campaignProgress', JSON.stringify(progress));
  // --- Sync unlockedCards to cardCollection ---
  if (progress.unlockedCards) {
    const collection = JSON.parse(localStorage.getItem('cardCollection') || '[]');
    let changed = false;
    for (const cardId of progress.unlockedCards) {
      if (!collection.includes(cardId)) {
        collection.push(cardId);
        changed = true;
      }
    }
    if (changed) {
      localStorage.setItem('cardCollection', JSON.stringify(collection));
    }
  }
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

const LoreJournal = React.lazy(() => import('./LoreJournal'));
const DialogueModal = React.lazy(() => import('./DialogueModal'));

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
  const [showStory, setShowStory] = useState(false);
  const [showDialogue, setShowDialogue] = useState(false);
  const [showOutro, setShowOutro] = useState(false);
  const [choiceResult, setChoiceResult] = useState<string | null>(null);
  const [showLoreJournal, setShowLoreJournal] = useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [rewardModalCards, setRewardModalCards] = useState<{ id: string; name: string; image: string }[] | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('campaignProgress'));
  const [showNextTrialModal, setShowNextTrialModal] = useState(false);
  const [nextQuest, setNextQuest] = useState<any | null>(null);

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
    ? baseRealms.find(r => r.id === selectedRealm) ?? null
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
    // NEW: Check storyFlags requirements
    if (req.storyFlags) {
      for (const flag in req.storyFlags) {
        if (progress.storyFlags?.[flag] !== req.storyFlags[flag]) unlocked = false;
      }
    }
    // For now, treat all as unlocked if no requirements
    if (!req.playerLevel && !req.completedQuests && !req.storyFlags) unlocked = true;
    if (unlocked) return 'unlocked';
    return 'locked';
  }

  // After quest completion, show outro, then next trial modal
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
    let actuallyNewCards: { id: string; name: string; image: string }[] = [];
    if (quest.rewards.cardIds && quest.rewards.cardIds.length > 0) {
      for (const cardId of quest.rewards.cardIds) {
        if (!newUnlocked.includes(cardId)) {
          newUnlocked.push(cardId);
          const cardObj = cards.find(c => c.id === cardId);
          if (cardObj) {
            actuallyNewCards.push({ id: cardObj.id, name: cardObj.name, image: cardObj.image });
          }
        }
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
    if (actuallyNewCards.length > 0) {
      setRewardModalCards(actuallyNewCards);
    }
    // Show outro story if present
    if (quest.storyOutro) {
      setQuestToStart(quest);
      setShowOutro(true);
    } else {
      // After outro, show next trial modal
      handleShowNextTrial(quest);
    }
  }

  // Show next trial modal after outro/reward
  function handleShowNextTrial(completedQuest: any) {
    // Find next unlocked quest in the same realm
    const realmQuests = allQuests.filter(q => q.location === completedQuest.location);
    const completedIndex = realmQuests.findIndex(q => q.id === completedQuest.id);
    let next = null;
    for (let i = completedIndex + 1; i < realmQuests.length; i++) {
      // Check if quest is unlocked (requirements met)
      const q = realmQuests[i];
      let unlocked = true;
      if (q.requirements.playerLevel && playerLevel < q.requirements.playerLevel) unlocked = false;
      if (q.requirements.completedQuests && q.requirements.completedQuests.length > 0 && !q.requirements.completedQuests.every((qid: string) => progress.completedQuests.includes(qid))) unlocked = false;
      if (unlocked) { next = q; break; }
    }
    setNextQuest(next);
    setShowNextTrialModal(!!next);
  }

  // When outro closes, show next trial modal
  function handleOutroClose() {
    setShowOutro(false);
    if (questToStart) handleShowNextTrial(questToStart);
  }

  // Handler for quest start (open modal instead of navigating immediately)
  function handleStartQuest(quest: any) {
    setQuestToStart(quest);
    if (quest.storyIntro) setShowStory(true);
    else if (quest.dialogue) setShowDialogue(true);
    else {
      // Start quest directly (existing logic)
      setModalOpen(true);
    }
  }

  // Handler for confirming quest start (navigate)
  function handleBeginBattle() {
    if (questToStart) {
      console.log('Starting quest:', questToStart);
      navigate(`/campaign/${questToStart.id}`);
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

  const computedRealms = getRealmStates(progress, playerLevel);

  React.useEffect(() => {
    // Simulate loading for demonstration; replace with real data fetch if needed
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // DEV: Reset Progress Button
  const handleResetProgress = () => {
    localStorage.removeItem('campaignProgress');
    localStorage.removeItem('playerName');
    localStorage.removeItem('playerAvatar');
    localStorage.removeItem('cardCollection');
    localStorage.removeItem('norse_muted');
    localStorage.removeItem('playerPrevLevel');
    window.location.reload();
  };

  // Onboarding complete handler
  const handleOnboardingComplete = (playerName: string, chosenCards: string[]) => {
    // Save to localStorage and campaignProgress
    const progress = {
      completedQuests: [],
      playerLevel: 1,
      experience: 0,
      specialAbilities: [],
      unlockedCards: chosenCards,
      deck: chosenCards,
      storyFlags: {}
    };
    localStorage.setItem('campaignProgress', JSON.stringify(progress));
    localStorage.setItem('playerName', playerName);
    localStorage.setItem('playerAvatar', chosenCards[0] || '');
    localStorage.setItem('cardCollection', JSON.stringify(chosenCards));
    setShowOnboarding(false);
    // Find the first quest in Midgard
    const firstQuest = allQuests.find(q => q.location === 'midgard');
    if (firstQuest) {
      navigate(`/campaign/${firstQuest.id}`);
    } else {
      window.location.reload();
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading campaign..." />;
  }

  return (
    <Container>
      <CampaignOnboardingModal open={showOnboarding} onComplete={handleOnboardingComplete} />
      {/* DEV ONLY: Reset Progress Button */}
      <button
        onClick={handleResetProgress}
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          zIndex: 9999,
          background: '#b22222',
          color: '#fff',
          border: '2px solid #ffd700',
          borderRadius: 8,
          padding: '0.7rem 1.5rem',
          fontSize: '1.1rem',
          fontWeight: 700,
          fontFamily: 'Norse, serif',
          boxShadow: '0 0 12px #ffd70088',
          cursor: 'pointer',
          letterSpacing: 1,
        }}
      >
        Reset Progress (DEV)
      </button>
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
      <BackButton onClick={() => navigate('/')}>←</BackButton>
      <Title>Campaign</Title>
      <SubTitle>{selectedRealm ? campaignStory.chapters[selectedRealm].title : 'Select a realm to view quests'}</SubTitle>
      <InfoPanel>
        <AvatarBlock>
          <div style={{ width: 72, height: 100, borderRadius: 10, background: '#181818', boxShadow: '0 0 8px #000a', marginBottom: 4, position: 'relative', cursor: 'pointer' }} onClick={() => setAvatarSelectOpen(true)} title="Change Avatar">
            {playerProfile.avatar ? (
              <img src={cards.find(c => c.id === playerProfile.avatar)?.image} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: 10, objectFit: 'cover', border: '2px solid #ffd700' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffd700', fontSize: 32 }}>?</div>
            )}
            <span style={{ position: 'absolute', bottom: 2, right: 6, fontSize: 18, color: '#ffd700', textShadow: '0 0 6px #000' }}>✎</span>
          </div>
        </AvatarBlock>
        <NameEditBlock>
          <NameBlock>
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
          </NameBlock>
        </NameEditBlock>
        <ButtonBlock>
          <button
            style={{
              padding: '0.7rem 1.2rem',
              fontSize: '1.05rem',
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
              width: '100%',
              maxWidth: 160,
            }}
            onClick={() => navigate('/collection')}
          >
            Card Collection
          </button>
          <button
            style={{
              padding: '0.7rem 1.2rem',
              fontSize: '1.05rem',
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
              width: '100%',
              maxWidth: 160,
            }}
            onClick={() => navigate('/deck-builder')}
          >
            Deck Builder
          </button>
          <button
            style={{
              padding: '0.7rem 1.2rem',
              fontSize: '1.05rem',
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
              width: '100%',
              maxWidth: 160,
            }}
            onClick={() => setShowLoreJournal(true)}
          >
            Lore Journal
          </button>
        </ButtonBlock>
        <LevelBlock>
          <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 2 }}>Level {progress.playerLevel}</div>
          <div style={{ fontSize: 15, marginBottom: 4 }}>XP: {progress.experience - ((progress.playerLevel - 1) * 1000)} / {progress.playerLevel * 1000}</div>
          <div style={{ height: 8, background: '#444', borderRadius: 4, width: '100%', maxWidth: 140, marginBottom: 2 }}>
            <div style={{ height: 8, background: '#ffd700', borderRadius: 4, width: `${Math.min(100, Math.round((progress.experience - ((progress.playerLevel - 1) * 1000)) / (progress.playerLevel * 1000) * 100))}%`, transition: 'width 0.3s' }} />
          </div>
        </LevelBlock>
      </InfoPanel>
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
      <QuestMap realms={computedRealms} onRealmSelect={handleRealmSelect} />
      <QuestPanelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        realm={selectedRealmObj}
        quests={selectedRealmQuests.map(q => ({ ...q, state: getQuestState(q) }))}
      />
      {/* Quest Start Modal */}
      {questToStart && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.82)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#222', borderRadius: 16, padding: 36, width: '95%', maxWidth: '98%', color: '#ffd700', boxShadow: '0 0 32px #000', position: 'relative' }}>
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
          <div style={{ background: '#222', borderRadius: 12, padding: 32, width: '95%', maxWidth: '98%', color: '#ffd700', boxShadow: '0 0 24px #000' }}>
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
          <div style={{ background: '#222', borderRadius: 20, padding: 48, width: '95%', maxWidth: '98%', color: '#ffd700', boxShadow: '0 0 32px #000', textAlign: 'center', position: 'relative' }}>
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
          <div style={{ background: '#222', borderRadius: 20, padding: 36, width: '95%', maxWidth: '98%', color: '#ffd700', boxShadow: '0 0 32px #000', textAlign: 'center', position: 'relative' }}>
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
      {rewardModalCards && (
        <RewardModal cards={rewardModalCards} onClose={() => setRewardModalCards(null)} />
      )}
      <Suspense fallback={<div style={{ color: '#ffd700', textAlign: 'center', marginTop: 40 }}>Loading...</div>}>
        <StoryModal
          open={showStory}
          onClose={() => {
            setShowStory(false);
            setChoiceResult(null);
            if (questToStart?.dialogue) setShowDialogue(true);
            else setModalOpen(true);
          }}
          title={questToStart?.name}
          text={questToStart?.storyIntro}
          images={questToStart?.storyImages}
          choices={questToStart?.choices as StoryChoice[]}
          onChoice={(choice: StoryChoice) => {
            setChoiceResult(choice.result);
            if (choice.flag) {
              setProgress((prev: typeof progress) => ({
                ...prev,
                storyFlags: { ...prev.storyFlags, ...choice.flag }
              }));
            }
          }}
        />
        {choiceResult && (
          <div style={{ color: '#ffd700', marginTop: 12, textAlign: 'center', fontSize: 18 }}>{choiceResult}</div>
        )}
        <DialogueModal
          open={showDialogue}
          onClose={() => {
            setShowDialogue(false);
            setModalOpen(true);
          }}
          dialogue={questToStart?.dialogue || []}
        />
        <LoreJournal
          open={showLoreJournal}
          onClose={() => setShowLoreJournal(false)}
          progress={progress}
          allQuests={allQuests}
        />
      </Suspense>
      {/* Next Trial Modal */}
      {showNextTrialModal && nextQuest && (
        <StoryModal
          open={showNextTrialModal}
          title="The Next Trial"
          text={"The next trial awaits..." /* TODO: Add custom story intros later */}
          onClose={() => {
            setShowNextTrialModal(false);
            navigate(`/campaign/${nextQuest.id}`);
          }}
        />
      )}
      <StoryModal
        open={showOutro}
        onClose={handleOutroClose}
        title={questToStart?.name}
        text={questToStart?.storyOutro}
        images={questToStart?.storyImages}
      />
    </Container>
  );
};

export default CampaignPage; 