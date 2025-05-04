import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoreJournalProps {
  open: boolean;
  onClose: () => void;
  progress: any;
  allQuests: any[];
}

const LoreJournal: React.FC<LoreJournalProps> = ({ open, onClose, progress, allQuests }) => {
  // Filter quests to only those completed by the player
  const completedQuests = allQuests.filter(q => progress.completedQuests.includes(q.id));

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .lore-journal-modal-content {
            padding: 1.2rem 0.5rem 1rem 0.5rem !important;
            min-width: 0 !important;
            max-width: 98vw !important;
            width: 98vw !important;
            border-radius: 12px !important;
          }
          .lore-journal-modal-content h2 {
            font-size: 1.3rem !important;
          }
          .lore-journal-modal-content div {
            font-size: 1rem !important;
          }
          .lore-journal-modal-content img {
            max-width: 90vw !important;
          }
        }
      `}</style>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(24,18,8,0.96)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div className="lore-journal-modal-content" style={{ background: 'linear-gradient(135deg, #2a1a0a 0%, #181818 100%)', borderRadius: 20, boxShadow: '0 0 48px 8px #000a, 0 0 0 4px #ffd70044', padding: '2.5rem 2.5rem 2rem 2.5rem', minWidth: 320, maxWidth: 420, width: '95vw', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', fontFamily: 'Norse, serif', zIndex: 5100 }}>
              <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 32, color: '#ffd700', cursor: 'pointer', fontFamily: 'Norse', textShadow: '0 0 8px #ffd70088' }} title="Close">×</button>
              <h2 style={{ color: '#ffd700', fontFamily: 'NorseBold, Norse, serif', fontSize: '2.2rem', textShadow: '0 0 18px #ffd700, 0 2px 2px #000, 0 0 2px #ffd700', marginBottom: '1.2rem', textAlign: 'center' }}>Lore Journal</h2>
              {completedQuests.length === 0 && <div style={{ color: '#ffe066', fontSize: 18, textAlign: 'center' }}>No lore entries unlocked yet. Complete quests to discover Norse legends!</div>}
              {completedQuests.map(quest => (
                <div key={quest.id} style={{ marginBottom: 32, width: '100%', background: 'rgba(24,18,8,0.92)', borderRadius: 12, padding: '1.2rem 1.5rem', boxShadow: '0 0 12px #000a' }}>
                  <div style={{ fontSize: 22, color: '#ffd700', fontFamily: 'NorseBold, Norse, serif', marginBottom: 6 }}>{quest.name}</div>
                  {quest.storyImages && quest.storyImages.length > 0 && (
                    <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                      {quest.storyImages.map((img: string, i: number) => (
                        <img key={i} src={img} alt="" style={{ maxWidth: 120, borderRadius: 8, boxShadow: '0 0 8px #000a' }} />
                      ))}
                    </div>
                  )}
                  {quest.storyIntro && <div style={{ color: '#ffe066', fontSize: 16, marginBottom: 8 }}><strong>Intro:</strong> {quest.storyIntro}</div>}
                  {quest.storyOutro && <div style={{ color: '#ffe066', fontSize: 16 }}><strong>Outro:</strong> {quest.storyOutro}</div>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LoreJournal; 