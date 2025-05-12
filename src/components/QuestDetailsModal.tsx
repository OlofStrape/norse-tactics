import React from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(24, 18, 8, 1);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled(motion.div)`
  background: linear-gradient(135deg, #2a1a0a 0%, #181818 100%);
  border-radius: 20px;
  box-shadow: 0 0 48px 8px #000a, 0 0 0 4px #ffd70044;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 400px;
  max-width: 600px;
  width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  font-family: 'Norse', serif;
  z-index: 3100;

  @media (max-width: 700px) {
    min-width: 0;
    max-width: 98vw;
    width: 99vw;
    padding: 1.2rem 0.7rem 1.2rem 0.7rem;
  }
  @media (max-width: 500px) {
    min-width: 0;
    max-width: 100vw;
    width: 100vw;
    padding: 0.7rem 0.2rem 1rem 0.2rem;
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #ffd700;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;
  transition: color 0.2s;
  &:hover {
    color: #fff8b0;
  }
`;

const QuestName = styled.h2`
  font-family: 'NorseBold', 'Norse', serif;
  font-size: 2.2rem;
  color: #ffd700;
  text-shadow: 0 0 18px #ffd700, 0 2px 2px #000, 0 0 2px #ffd700;
  margin-bottom: 0.5rem;
  text-align: center;
  @media (max-width: 700px) {
    font-size: 1.4rem;
    margin-bottom: 0.3rem;
  }
  @media (max-width: 500px) {
    font-size: 1.1rem;
    margin-bottom: 0.2rem;
  }
`;

const Description = styled.p`
  color: #ffe066;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: 'Norse', serif;
  @media (max-width: 700px) {
    font-size: 0.95rem;
    margin-bottom: 0.7rem;
  }
  @media (max-width: 500px) {
    font-size: 0.85rem;
    margin-bottom: 0.4rem;
  }
`;

const Section = styled.div`
  margin-bottom: 1.2rem;
  width: 100%;
  
  /* Make the first section more compact and move it up */
  &:first-of-type {
    margin-top: 0.7rem; /* was 1.5rem */
    background: rgba(24, 18, 8, 0.96);
    padding: 0.5rem 0.8rem 0.7rem 0.8rem; /* was 1rem 1.2rem 1.2rem 1.2rem */
    border-radius: 12px;
  }
  @media (max-width: 700px) {
    margin-bottom: 0.7rem;
    &:first-of-type {
      margin-top: 0.3rem;
      padding: 0.3rem 0.3rem 0.4rem 0.3rem;
    }
  }
  @media (max-width: 500px) {
    margin-bottom: 0.3rem;
    &:first-of-type {
      margin-top: 0.1rem;
      padding: 0.15rem 0.1rem 0.2rem 0.1rem;
    }
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  color: #ffd700;
  margin-bottom: 0.3rem;
  font-family: 'Norse', serif;
  @media (max-width: 700px) {
    font-size: 0.95rem;
    margin-bottom: 0.15rem;
  }
  @media (max-width: 500px) {
    font-size: 0.8rem;
    margin-bottom: 0.08rem;
  }
`;

const ReqList = styled.div`
  margin: 0;
  padding-left: 16px; /* was 20px */
  display: flex;
  flex-direction: column;
  gap: 2px; /* was 4px */
  @media (max-width: 700px) {
    padding-left: 8px;
    gap: 1px;
  }
  @media (max-width: 500px) {
    padding-left: 4px;
    gap: 0;
  }
`;

const ReqItem = styled.span<{ met?: boolean }>`
  color: ${props => props.met ? '#81C784' : '#E0E0E0'};
  font-size: 0.95rem; /* was 1rem */
  line-height: 1.2; /* compress vertical spacing */
  user-select: none;
  pointer-events: none;
  outline: none;
  @media (max-width: 700px) {
    font-size: 0.85rem;
  }
  @media (max-width: 500px) {
    font-size: 0.75rem;
  }
`;

const Rewards = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  @media (max-width: 700px) {
    gap: 0.5rem;
    margin-top: 0.2rem;
  }
  @media (max-width: 500px) {
    gap: 0.2rem;
    margin-top: 0.1rem;
  }
`;

const RewardIcon = styled.span`
  font-size: 1.5rem;
  color: #ffd700;
  @media (max-width: 700px) {
    font-size: 1.1rem;
  }
  @media (max-width: 500px) {
    font-size: 0.9rem;
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin: 1.2rem 0 1.5rem 0;
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: #FFD700;
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  @media (max-width: 700px) {
    height: 4px;
    margin: 0.5rem 0 0.7rem 0;
  }
  @media (max-width: 500px) {
    height: 2px;
    margin: 0.2rem 0 0.3rem 0;
  }
`;

const StartButton = styled(motion.button)<{ unlocked: boolean }>`
  padding: 1rem 2.5rem;
  font-size: 1.3rem;
  border-radius: 8px;
  border: 2px solid #ffd700;
  background: ${({ unlocked }) => unlocked ? '#ffd700' : '#444'};
  color: ${({ unlocked }) => unlocked ? '#1a1a1a' : '#aaa'};
  font-family: 'Norse', serif;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: ${({ unlocked }) => unlocked ? 'pointer' : 'not-allowed'};
  box-shadow: 0 0 12px 2px #ffd70033, 0 4px 16px rgba(0,0,0,0.18);
  transition: box-shadow 0.2s, text-shadow 0.2s, color 0.2s;
  text-shadow: 0 1px 6px #fff8, 0 0 2px #ffd70044;
  min-width: 220px;
  min-height: 56px;
  &:hover {
    background: ${({ unlocked }) => unlocked ? '#ffed4a' : '#444'};
    color: ${({ unlocked }) => unlocked ? '#ffd700' : '#aaa'};
    text-shadow: 0 0 18px #ffd700, 0 0 36px #ffd700, 0 2px 2px #000, 0 0 2px #ffd700;
    box-shadow: 0 0 18px 4px #ffd70066, 0 4px 16px rgba(0,0,0,0.18);
  }
`;

interface QuestDetailsModalProps {
  open: boolean;
  onClose: () => void;
  quest: any | null;
  unlocked: boolean;
  completed: boolean;
}

const QuestDetailsModal: React.FC<QuestDetailsModalProps> = ({ open, onClose, quest, unlocked, completed }) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open || !quest) return null;

  // Example progress calculation (replace with real logic)
  const progress = completed ? 100 : unlocked ? 80 : 0;

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <Modal
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={e => e.stopPropagation()}
        >
          <CloseButton
            whileHover={{ scale: 1.12, color: '#fff8b0' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={onClose}
            title="Close"
          >
            ×
          </CloseButton>
          <QuestName>{quest.name}</QuestName>
          <Description>{quest.description}</Description>
          <Section>
            <SectionTitle>Requirements</SectionTitle>
            <ReqList>
              {quest.requirements.playerLevel && (
                <ReqItem met={unlocked}>
                  Level {quest.requirements.playerLevel} required
                </ReqItem>
              )}
              {quest.requirements.requiredCards?.map((card: string) => (
                <ReqItem key={card} met={unlocked}>
                  Card required: {card}
                </ReqItem>
              ))}
              {quest.requirements.completedQuests?.map((q: string) => (
                <ReqItem key={q} met={unlocked}>
                  Complete: {q}
                </ReqItem>
              ))}
              {quest.requirements.specialConditions?.map((cond: string) => (
                <ReqItem key={cond} met={unlocked}>
                  {cond}
                </ReqItem>
              ))}
            </ReqList>
          </Section>
          <Section>
            <SectionTitle>Rewards</SectionTitle>
            <Rewards>
              <RewardIcon title="XP">⭐</RewardIcon>
              <span>{quest.rewards.experience} XP</span>
              {quest.rewards.cardIds?.map((card: string) => (
                <span key={card}><RewardIcon title="Card">🃏</RewardIcon> {card}</span>
              ))}
              {quest.rewards.unlocks?.map((q: string) => (
                <span key={q}><RewardIcon title="Unlocks">🔓</RewardIcon> {q}</span>
              ))}
            </Rewards>
          </Section>
          <ProgressBar progress={progress} />
          <StartButton
            unlocked={unlocked}
            whileHover={{ scale: unlocked ? 1.06 : 1, boxShadow: unlocked ? '0 0 18px #ffd70088' : undefined }}
            whileTap={{ scale: unlocked ? 0.97 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={unlocked ? () => { onClose(); navigate(`/campaign/${quest.id}`); } : undefined}
            disabled={!unlocked}
          >
            {completed ? 'Completed' : unlocked ? 'Start Quest' : 'Locked'}
          </StartButton>
        </Modal>
      </Overlay>
    </AnimatePresence>
  );
};

export default QuestDetailsModal; 