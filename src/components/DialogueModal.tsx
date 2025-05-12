import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DialogueLine {
  speaker: string;
  text: string;
  portraitUrl?: string;
}

interface DialogueModalProps {
  open: boolean;
  onClose: () => void;
  dialogue: DialogueLine[];
}

const DialogueModal: React.FC<DialogueModalProps> = ({ open, onClose, dialogue }) => {
  const [index, setIndex] = useState(0);
  if (!open || !dialogue.length) return null;
  const line = dialogue[index];

  const next = () => {
    if (index < dialogue.length - 1) setIndex(index + 1);
    else onClose();
  };

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .dialogue-modal-content {
            padding: 1.2rem 0.5rem 1rem 0.5rem !important;
            min-width: 0 !important;
            max-width: 98vw !important;
            width: 98vw !important;
            border-radius: 12px !important;
          }
          .dialogue-modal-content strong {
            font-size: 1.1rem !important;
          }
          .dialogue-modal-content p {
            font-size: 1rem !important;
          }
          .dialogue-modal-content img {
            max-width: 60vw !important;
          }
          .dialogue-modal-content button {
            font-size: 1rem !important;
            padding: 0.7rem 1.2rem !important;
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
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(24,18,8,0.92)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div className="dialogue-modal-content" style={{ background: 'linear-gradient(135deg, #2a1a0a 0%, #181818 100%)', borderRadius: 20, boxShadow: '0 0 48px 8px #000a, 0 0 0 4px #ffd70044', padding: '2.5rem 2.5rem 2rem 2.5rem', minWidth: 320, maxWidth: 420, width: '95vw', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', fontFamily: 'Norse, serif', zIndex: 4100 }}>
              {line.portraitUrl && <img src={line.portraitUrl} alt={line.speaker} style={{ width: 64, height: 64, borderRadius: 32, marginBottom: 16 }} />}
              <strong style={{ color: '#ffd700', fontFamily: 'NorseBold, Norse, serif', fontSize: '1.2rem', textShadow: '0 0 8px #ffd70088' }}>{line.speaker}:</strong>
              <p style={{ color: '#ffe066', fontSize: '1.1rem', marginBottom: '1.5rem', textAlign: 'center', fontFamily: 'Norse, serif' }}>{line.text}</p>
              <motion.button
                onClick={next}
                style={{ padding: '0.8rem 2.2rem', fontSize: '1.2rem', borderRadius: 8, border: '2px solid #ffd700', background: '#ffd700', color: '#1a1a1a', fontFamily: 'Norse, serif', fontWeight: 700, letterSpacing: 1, cursor: 'pointer', boxShadow: '0 0 12px 2px #ffd70033', transition: 'background 0.2s, color 0.2s' }}
                whileHover={{ scale: 1.06, boxShadow: '0 0 18px #ffd70088' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {index < dialogue.length - 1 ? 'Next' : 'Close'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DialogueModal; 