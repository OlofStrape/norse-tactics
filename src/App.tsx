import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { GameBoard } from './components/GameBoard';
import GameCard from './components/GameCard';
import { GameLogic } from './services/gameLogic';
import { cards } from './data/cards';
import { Card, GameState, Position, GameRules } from './types/game';
import { AILogic } from './services/aiLogic';
import { AILoadingIndicator } from './components/AILoadingIndicator';
import { EndGameModal } from './components/EndGameModal';
import { motion } from 'framer-motion';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AIDifficultySelector } from './components/AIDifficultySelector';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import StartPage from './components/StartPage';
import { Global, css } from '@emotion/react';
import CampaignPage from './components/CampaignPage';
import { allQuests } from './data/campaign';
import { GameSession } from './components/GameSession';
import { Tutorial } from './components/Tutorial';
import { tutorialSteps } from './data/tutorials';
import CardCollection from './components/CardCollection';
import DeckBuilder from './components/DeckBuilder';

// Add window handler type
declare global {
  interface Window {
    handleGameCapture?: (cardId: string, isChainReaction: boolean) => void;
  }
}

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-family: 'Norse', 'Cinzel Decorative', serif;
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const GameContainer = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
`;

const PlayerHand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 200px;
`;

const PlayerInfo = styled.div<{ isActive: boolean }>`
  padding: 1rem;
  background: ${props => props.isActive ? '#ffd700' : 'transparent'};
  border-radius: 8px;
  text-align: center;
  border: 2px solid ${props => props.isActive ? '#ffd700' : 'rgba(60, 40, 20, 0.7)'};
  color: ${props => props.isActive ? '#bfa100' : 'white'};
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  font-weight: bold;
  font-size: 1.1rem;
  &:hover {
    background: ${props => props.isActive ? '#ffed4a' : 'rgba(255,255,255,0.08)'};
  }
`;

const HandContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const CardWrapper = styled.div`
  width: 120px;
  height: 160px;
`;

const GameInfo = styled.div`
  margin-top: 2rem;
  text-align: center;
  font-size: 1.2rem;
`;

const RulesToggle = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const RuleButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? '#ffd700' : 'transparent'};
  color: ${props => props.active ? '#bfa100' : 'white'};
  border: 2px solid ${props => props.active ? '#ffd700' : 'rgba(60, 40, 20, 0.7)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#ffed4a' : 'rgba(255,255,255,0.08)'};
  }
`;

const fontStyles = css`
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

const AppRoutes: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [rules, setRules] = useState<GameRules>({
    same: false,
    plus: false,
    elements: false,
    ragnarok: false,
    captureRules: {
      sameElement: false,
      higherValue: false,
      adjacent: false,
    },
    chainReaction: false,
  });
  const [capturingCards, setCapturingCards] = useState<Set<string>>(new Set());
  const [chainReactionCards, setChainReactionCards] = useState<Set<string>>(new Set());
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'opponent' | 'draw' | null>(null);
  const [aiDifficulty, setAIDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [multiplayerUnlocked, setMultiplayerUnlocked] = useState<boolean>(false);

  const initializeGame = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const player1Cards = shuffled.slice(0, 5);
    const player2Cards = shuffled.slice(5, 10);
    setGameState(GameLogic.initializeGame(player1Cards, player2Cards));
    setIsGameOver(false);
    setWinner(null);
    setSelectedCard(null);
    setCapturingCards(new Set());
    setChainReactionCards(new Set());
  };

  useEffect(() => {
    // Initialize game state after component mount
    initializeGame();
  }, []);

  useEffect(() => {
    // Check campaign progress for multiplayer unlock
    const data = localStorage.getItem('campaignProgress');
    if (data) {
      try {
        const progress = JSON.parse(data);
        if (progress.completedQuests && Array.isArray(progress.completedQuests)) {
          setMultiplayerUnlocked(progress.completedQuests.includes('helheim-boss'));
        } else {
          setMultiplayerUnlocked(false);
        }
      } catch {
        setMultiplayerUnlocked(false);
      }
    } else {
      setMultiplayerUnlocked(false);
    }
  }, []);

  const handleCapture = useCallback((cardId: string, isChainReaction: boolean) => {
    if (isChainReaction) {
      setChainReactionCards(prev => new Set([...Array.from(prev), cardId]));
      setTimeout(() => {
        setChainReactionCards(prev => {
          const newSet = new Set(Array.from(prev));
          newSet.delete(cardId);
          return newSet;
        });
      }, 1000);
    } else {
      setCapturingCards(prev => new Set([...Array.from(prev), cardId]));
      setTimeout(() => {
        setCapturingCards(prev => {
          const newSet = new Set(Array.from(prev));
          newSet.delete(cardId);
          return newSet;
        });
      }, 1000);
    }
  }, []);

  useEffect(() => {
    // Set up the window handler for captures
    window.handleGameCapture = handleCapture;

    return () => {
      // Clean up the window handler
      delete window.handleGameCapture;
    };
  }, [handleCapture]);

  if (!gameState) {
    return (
      <AppContainer>
        <Title>Loading...</Title>
      </AppContainer>
    );
  }

  const handleCardSelect = (card: Card) => {
    if (gameState.currentTurn === 'player' && gameState.player1Hand.includes(card)) {
      setSelectedCard(card);
    } else if (gameState.currentTurn === 'opponent' && gameState.player2Hand.includes(card)) {
      setSelectedCard(card);
    }
  };

  const handleCellClick = (position: Position, cardArg?: Card) => {
    const cardToPlay = cardArg || selectedCard;
    if (!cardToPlay) return;

    const newState = GameLogic.playCard(gameState, cardToPlay, position, rules, handleCapture);
    setGameState(newState);
    setSelectedCard(null);

    if (GameLogic.isGameOver(newState)) {
      const winner = GameLogic.getWinner(newState);
      setIsGameOver(true);
      setWinner(winner);
      return;
    }

    // If it's now the AI's turn, trigger AI move after a short delay
    if (newState.currentTurn === 'opponent') {
      setIsAIThinking(true);
      setTimeout(() => {
        triggerAIMove(newState);
      }, 700); // 700ms delay for realism
    }
  };

  // AI move logic
  const triggerAIMove = (state: GameState) => {
    if (GameLogic.isGameOver(state)) {
      setIsAIThinking(false);
      setIsGameOver(true);
      setWinner(GameLogic.getWinner(state));
      return;
    }
    const ai = new AILogic(rules, aiDifficulty);
    // Pick the first available card in AI's hand
    const aiHand = state.player2Hand;
    if (aiHand.length === 0) {
      setIsAIThinking(false);
      setIsGameOver(true);
      setWinner(GameLogic.getWinner(state));
      return;
    }
    const aiCard = aiHand[0];
    // Pick the best move (currently random valid position)
    const aiPosition = ai.getBestMove(state);
    if (!aiPosition) {
      setIsAIThinking(false);
      setIsGameOver(true);
      setWinner(GameLogic.getWinner(state));
      return;
    }
    // Play the move
    const newState = GameLogic.playCard(state, aiCard, aiPosition, rules, handleCapture);
    setGameState(newState);
    setIsAIThinking(false);

    if (GameLogic.isGameOver(newState)) {
      setIsGameOver(true);
      setWinner(GameLogic.getWinner(newState));
    }
  };

  const toggleRule = (rule: keyof GameRules) => {
    setRules(prev => ({ ...prev, [rule]: !prev[rule] }));
  };

  // Free Play setup page
  const FreePlay = () => {
    const navigate = useNavigate();
    const [rules, setRules] = useState<GameRules>({
      same: false,
      plus: false,
      elements: false,
      ragnarok: false,
      captureRules: {
        sameElement: false,
        higherValue: false,
        adjacent: false,
      },
      chainReaction: false,
    });
    const [aiDifficulty, setAIDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    // Font-face and global styles for Free-play
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
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(rgba(20, 15, 5, 0.7), rgba(20, 15, 5, 0.7)), url(https://res.cloudinary.com/dvfobknn4/image/upload/v1746867992/Background_snigeo.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', fontFamily: 'Norse, serif', padding: '0', position: 'relative' }}>
        <style>{fontStyles}</style>
        <button
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            padding: '0.4rem 0.7rem',
            fontSize: '1.3rem',
            borderRadius: 6,
            border: 'none',
            background: '#ffd700',
            color: '#1a1a1a',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            zIndex: 10,
            fontFamily: 'Norsebold, Norse, serif',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
          onClick={() => navigate('/')}
        >
          <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>←</span>
          <span className="back-menu-text" style={{ display: 'inline-block' }}>Back to Menu</span>
        </button>
        <style>{`
          @media (max-width: 600px) {
            .back-menu-text { display: none !important; }
            button[style] { padding: 0.4rem 0.7rem !important; font-size: 1.5rem !important; }
          }
        `}</style>
        <div style={{ width: '100%', maxWidth: 420, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <h1 style={{
            fontFamily: 'Norsebold, Norse, Cinzel Decorative, serif',
            fontSize: '3rem',
            marginBottom: '0.5rem',
            textAlign: 'center',
            color: 'transparent',
            textShadow: '0 0 8px #ffd70088, 0 0 12px #ffd70044, 0 0 1px #fff',
            WebkitTextStroke: '1px #ffd700',
            letterSpacing: '2px',
            fontWeight: 'bold',
          }}>
            Norse Tactics
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, fontFamily: 'Norsebold, Norse, serif' }}>
            <AIDifficultySelector
              selectedDifficulty={aiDifficulty}
              onDifficultyChange={setAIDifficulty}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16, maxWidth: 200, width: '100%' }}>
            <button style={{ padding: '0.08rem 0.2rem', fontSize: '0.78rem', borderRadius: 4, border: rules.same ? '2px solid #ffd700' : '2px solid #444', background: rules.same ? '#ffd700' : 'transparent', color: rules.same ? '#bfa100' : '#fff', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Norsebold, Norse, serif', width: '100%', minHeight: 36, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} onClick={() => setRules(r => ({ ...r, same: !r.same }))}>Same<br />Rule</button>
            <button style={{ padding: '0.08rem 0.2rem', fontSize: '0.78rem', borderRadius: 4, border: rules.plus ? '2px solid #ffd700' : '2px solid #444', background: rules.plus ? '#ffd700' : 'transparent', color: rules.plus ? '#bfa100' : '#fff', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Norsebold, Norse, serif', width: '100%', minHeight: 36, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} onClick={() => setRules(r => ({ ...r, plus: !r.plus }))}>Plus<br />Rule</button>
            <button style={{ padding: '0.08rem 0.2rem', fontSize: '0.78rem', borderRadius: 4, border: rules.elements ? '2px solid #ffd700' : '2px solid #444', background: rules.elements ? '#ffd700' : 'transparent', color: rules.elements ? '#bfa100' : '#fff', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Norsebold, Norse, serif', width: '100%', minHeight: 36, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} onClick={() => setRules(r => ({ ...r, elements: !r.elements }))}>Elements</button>
            <button style={{ padding: '0.08rem 0.2rem', fontSize: '0.78rem', borderRadius: 4, border: rules.ragnarok ? '2px solid #ffd700' : '2px solid #444', background: rules.ragnarok ? '#ffd700' : 'transparent', color: rules.ragnarok ? '#bfa100' : '#fff', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Norsebold, Norse, serif', width: '100%', minHeight: 36, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} onClick={() => setRules(r => ({ ...r, ragnarok: !r.ragnarok }))}>Ragnarök</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <button
              style={{ padding: '1rem 2.5rem', fontSize: '1.6rem', borderRadius: 8, border: '3px solid #ffd700', background: '#ffd700', color: '#1a1a1a', fontFamily: 'Norsebold, Norse, serif', fontWeight: 'bold', letterSpacing: 1, cursor: 'pointer', boxShadow: '0 0 12px 2px #ffd70033', transition: 'box-shadow 0.2s, text-shadow 0.2s, color 0.2s' }}
              onClick={() => navigate('/free-play/game', { state: { rules, aiDifficulty } })}
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Free Play actual game page (no controls, just board and hands)
  const FreePlayGame = () => {
    const location = useLocation();
    const { state } = location as any;
    const rules = state?.rules || {
      same: false,
      plus: false,
      elements: false,
      ragnarok: false,
      captureRules: {
        sameElement: false,
        higherValue: false,
        adjacent: false,
      },
      chainReaction: false,
    };
    const aiDifficulty = state?.aiDifficulty || 'medium';
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const player1Cards = shuffled.slice(0, 5);
    const player2Cards = shuffled.slice(5, 10);
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(rgba(20, 15, 5, 0.7), rgba(20, 15, 5, 0.7)), url(https://res.cloudinary.com/dvfobknn4/image/upload/v1746867992/Background_snigeo.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', fontFamily: 'Norse, serif', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100vw', maxWidth: 600, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <GameSession
            playerDeck={player1Cards}
            opponentDeck={player2Cards}
            rules={rules}
            aiDifficulty={aiDifficulty}
            onGameEnd={() => {}}
            showControls={false}
          />
        </div>
      </div>
    );
  };

  // Placeholder components for Campaign and Multiplayer
  const Multiplayer = () => {
    const navigate = useNavigate();
    const BackButton = (
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
        }}
        onClick={() => navigate('/')}
      >
        ← Back to Menu
      </button>
    );
    return (
      <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem', fontSize: '2rem', position: 'relative' }}>
        {BackButton}
        Multiplayer Mode (Unlock by completing Campaign)
      </div>
    );
  };

  // GamePage for campaign quests
  const GamePage = () => {
    const { questId } = useParams();
    const navigate = useNavigate();
    const quest = allQuests.find(q => q.id === questId);
    // Fallback: if quest not found, go back
    useEffect(() => {
      if (!quest) navigate('/campaign');
    }, [quest, navigate]);
    if (!quest) return <div style={{ color: '#ffd700', textAlign: 'center', marginTop: 40 }}>Quest not found. Please return to the campaign map.</div>;
    // Load player progress
    const progress = (() => {
      const data = localStorage.getItem('campaignProgress');
      if (data) return JSON.parse(data);
      return { specialAbilities: [], tutorials: {} };
    })();
    type TutorialKey = keyof typeof tutorialSteps;
    const [tutorialToShow, setTutorialToShow] = React.useState<TutorialKey | null>(null);
    const playerDeck = (() => {
      const saved = localStorage.getItem('playerDeck');
      if (saved) {
        const ids = JSON.parse(saved);
        return cards.filter(c => ids.includes(c.id));
      }
      // fallback: 5 common cards
      return cards.filter(c => c.rarity === 'common').slice(0, 5);
    })();
    const opponentDeck = quest.opponent.deck;
    const rules = quest.specialRules;
    const handleGameEnd = (winner: 'player' | 'opponent' | 'draw') => {
      if (winner === 'player') {
        // Mark quest as completed
        if (!progress.completedQuests.includes(quest.id)) {
          progress.completedQuests.push(quest.id);
          progress.experience += quest.rewards.experience || 0;
          progress.playerLevel = Math.max(progress.playerLevel, Math.floor(progress.experience / 1000) + 1);
          // Save progress to localStorage
          localStorage.setItem('campaignProgress', JSON.stringify(progress));
        }
      }
      setTimeout(() => navigate('/campaign'), 1200);
    };
    React.useEffect(() => {
      // Show basic rules tutorial for the very first quest if not seen
      if (quest.id === 'training-grounds' && !progress.tutorials?.basicRules) {
        setTutorialToShow('basicRules');
        return;
      }
      if (rules?.plus && !progress.tutorials?.plusRule) {
        setTutorialToShow('plusRule');
        return;
      }
      if (rules?.same && !progress.tutorials?.sameRule) {
        setTutorialToShow('sameRule');
        return;
      }
      if (rules?.elements && !progress.tutorials?.elementsRule) {
        setTutorialToShow('elementsRule');
        return;
      }
      if (rules?.ragnarok && !progress.tutorials?.ragnarokRule) {
        setTutorialToShow('ragnarokRule');
        return;
      }
      if (rules?.chainReaction && !progress.tutorials?.chainReactionRule) {
        setTutorialToShow('chainReactionRule');
        return;
      }
      if (rules?.captureRules?.sameElement && !progress.tutorials?.sameElementRule) {
        setTutorialToShow('sameElementRule');
        return;
      }
      if (rules?.captureRules?.higherValue && !progress.tutorials?.higherValueRule) {
        setTutorialToShow('higherValueRule');
        return;
      }
      if (rules?.captureRules?.adjacent && !progress.tutorials?.adjacentRule) {
        setTutorialToShow('adjacentRule');
        return;
      }
      // Add more triggers for special abilities if needed
      // Example: if (someAbilityActive && !progress.tutorials?.berserkerRage) { setTutorialToShow('berserkerRage'); return; }
    }, [rules, progress.tutorials, quest.id]);

    const handleTutorialComplete = () => {
      if (!tutorialToShow) return;
      setTutorialToShow(null);
      const updatedProgress = {
        ...progress,
        tutorials: { ...progress.tutorials, [tutorialToShow]: true }
      };
      localStorage.setItem('campaignProgress', JSON.stringify(updatedProgress));
    };

    // Render the Tutorial modal if needed
    if (tutorialToShow) {
      return <Tutorial steps={tutorialSteps[tutorialToShow]} onComplete={handleTutorialComplete} />;
    }

    return (
      <div style={{ minHeight: '100vh', height: '100vh', background: 'linear-gradient(rgba(20, 15, 5, 0.7), rgba(20, 15, 5, 0.7)), url(https://res.cloudinary.com/dvfobknn4/image/upload/v1746867992/Background_snigeo.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', fontFamily: 'Norse, serif', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 1200, margin: 0, fontFamily: 'Norse, serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <GameSession
            playerDeck={playerDeck}
            opponentDeck={opponentDeck}
            rules={rules}
            aiDifficulty={quest.opponent.difficulty === 'boss' ? 'hard' : quest.opponent.difficulty || 'medium'}
            onGameEnd={handleGameEnd}
            showControls={true}
          />
        </div>
      </div>
    );
  };

  return (
    <Routes>
      <Route path="/" element={<StartPage multiplayerUnlocked={multiplayerUnlocked} />} />
      <Route path="/free-play" element={<FreePlay />} />
      <Route path="/free-play/game" element={<FreePlayGame />} />
      <Route path="/campaign" element={<CampaignPage />} />
      <Route path="/campaign/:questId" element={<GamePage />} />
      <Route path="/collection" element={<CardCollection />} />
      <Route path="/deckbuilder" element={<DeckBuilder />} />
      {/* Add other routes as needed */}
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <>
      <Global styles={fontStyles} />
      <DndProvider backend={HTML5Backend}>
        <Router>
          <AppRoutes />
        </Router>
      </DndProvider>
    </>
  );
};

export default App;