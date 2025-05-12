import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryChoice {
  text: string;
  result: string;
  flag?: Record<string, any>;
}

interface StoryModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  text?: string;
  images?: string[];
  choices?: StoryChoice[];
  onChoice?: (choice: StoryChoice) => void;
}

const StoryModal: React.FC<StoryModalProps> = ({ open, onClose, title, text, images = [], choices = [], onChoice }) => {
  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .story-modal-content {
            padding: 1.2rem 0.5rem 1rem 0.5rem !important;
            min-width: 0 !important;
            max-width: 98vw !important;
            width: 98vw !important;
            border-radius: 12px !important;
          }
          .story-modal-content h2 {
            font-size: 1.3rem !important;
          }
          .story-modal-content p {
            font-size: 1rem !important;
          }
          .story-modal-content img {
            max-width: 90vw !important;
          }
          .story-modal-content button {
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
            <div className="story-modal-content" style={{ background: 'linear-gradient(135deg, #2a1a0a 0%, #181818 100%)', borderRadius: 20, boxShadow: '0 0 48px 8px #000a, 0 0 0 4px #ffd70044', padding: '2.5rem 2.5rem 2rem 2.5rem', minWidth: 320, maxWidth: 420, width: '95vw', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', fontFamily: 'Norse, serif', zIndex: 4100 }}>
              {title && <h2 style={{ color: '#ffd700', fontFamily: 'NorseBold, Norse, serif', fontSize: '2.2rem', textShadow: '0 0 18px #ffd700, 0 2px 2px #000, 0 0 2px #ffd700', marginBottom: '0.5rem', textAlign: 'center' }}>{title}</h2>}
              {images.map((img, i) => <img key={i} src={img} alt="" style={{ maxWidth: '100%', marginBottom: 12, borderRadius: 12, boxShadow: '0 0 12px #000a' }} />)}
              {text && <p style={{ color: '#ffe066', fontSize: '1.1rem', marginBottom: '1.5rem', textAlign: 'center', fontFamily: 'Norse, serif' }}>{text}</p>}
              {choices.length > 0 ? (
                choices.map((choice, i) => (
                  <motion.button
                    key={i}
                    onClick={() => onChoice?.(choice)}
                    style={{ padding: '0.8rem 2.2rem', fontSize: '1.2rem', borderRadius: 8, border: '2px solid #ffd700', background: '#ffd700', color: '#1a1a1a', fontFamily: 'Norse, serif', fontWeight: 700, letterSpacing: 1, cursor: 'pointer', boxShadow: '0 0 12px 2px #ffd70033', transition: 'background 0.2s, color 0.2s' }}
                    whileHover={{ scale: 1.06, boxShadow: '0 0 18px #ffd70088' }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {choice.text}
                  </motion.button>
                ))
              ) : (
                <motion.button
                  onClick={onClose}
                  style={{ padding: '0.8rem 2.2rem', fontSize: '1.2rem', borderRadius: 8, border: '2px solid #ffd700', background: '#ffd700', color: '#1a1a1a', fontFamily: 'Norse, serif', fontWeight: 700, letterSpacing: 1, cursor: 'pointer', boxShadow: '0 0 12px 2px #ffd70033', transition: 'background 0.2s, color 0.2s' }}
                  whileHover={{ scale: 1.06, boxShadow: '0 0 18px #ffd70088' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  Continue
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StoryModal; 