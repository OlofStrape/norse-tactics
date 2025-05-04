import React from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import QuestCard from './QuestCard';
import QuestDetailsModal from './QuestDetailsModal';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(24, 18, 8, 0.92);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled(motion.div)`
  background: linear-gradient(135deg, #181818 0%, #2a1a0a 100%);
  border-radius: 24px;
  box-shadow: 0 0 48px 8px #000a, 0 0 0 4px #ffd70044;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 420px;
  max-width: 700px;
  width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  font-family: 'Norse', serif;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: none;
  border: none;
  font-size: 2.2rem;
  color: #ffd700;
  cursor: pointer;
  font-family: 'Norse', serif;
  text-shadow: 0 0 8px #ffd70088;
  transition: color 0.2s;
  &:hover {
    color: #fffbe6;
  }
`;

const RealmName = styled.h2`
  font-family: 'NorseBold', 'Norse', serif;
  font-size: 3rem;
  color: #ffd700;
  text-shadow: 0 0 18px #ffd700, 0 2px 2px #000, 0 0 2px #ffd700;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const RealmDescription = styled.p`
  color: #ffe066;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  text-align: center;
  font-family: 'Norse', serif;
`;

const QuestList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-height: 45vh;
  overflow-y: auto;
  padding-bottom: 1rem;
  scrollbar-width: thin;
  scrollbar-color: #ffd700 #181818;
  &::-webkit-scrollbar {
    width: 10px;
    background: #181818;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #ffd700 60%, #bfa100 100%);
    border-radius: 8px;
    border: 2px solid #181818;
    min-height: 40px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #ffe066 60%, #ffd700 100%);
  }
`;

interface QuestPanelModalProps {
  open: boolean;
  onClose: () => void;
  realm: {
    id: string;
    name: string;
    description: string;
  } | null;
  quests: any[];
}

const QuestPanelModal: React.FC<QuestPanelModalProps> = ({ open, onClose, realm, quests }) => {
  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedQuest, setSelectedQuest] = React.useState<any | null>(null);

  function handleQuestClick(quest: any) {
    setSelectedQuest(quest);
    setDetailsOpen(true);
  }

  function handleDetailsClose() {
    setDetailsOpen(false);
    setSelectedQuest(null);
  }

  if (!open || !realm) return null;

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
          <CloseButton onClick={onClose} title="Close">×</CloseButton>
          <RealmName>{realm.name}</RealmName>
          <RealmDescription>{realm.description}</RealmDescription>
          {!detailsOpen && (
            <QuestList>
              {quests.length === 0 ? (
                <div style={{ color: '#fff', textAlign: 'center', fontFamily: 'Norse', fontSize: '1.2rem' }}>
                  No quests available for this realm yet.
                </div>
              ) : (
                quests.map(quest => (
                  <div key={quest.id} onClick={() => handleQuestClick(quest)} style={{ cursor: 'pointer' }}>
                    <QuestCard
                      id={quest.id}
                      title={quest.name}
                      description={quest.description}
                      location={quest.location}
                      difficulty={quest.opponent.difficulty}
                      rewards={quest.rewards}
                      requirements={quest.requirements}
                      progress={{ completed: false, conditions: {} }}
                      state={quest.state || 'unlocked'}
                      onSelect={() => handleQuestClick(quest)}
                    />
                  </div>
                ))
              )}
            </QuestList>
          )}
          <QuestDetailsModal
            open={detailsOpen}
            onClose={handleDetailsClose}
            quest={selectedQuest}
            unlocked={selectedQuest ? (selectedQuest.state === 'unlocked' || selectedQuest.state === 'completed') : false}
            completed={selectedQuest ? selectedQuest.state === 'completed' : false}
          />
        </Modal>
      </Overlay>
    </AnimatePresence>
  );
};

export default QuestPanelModal; 