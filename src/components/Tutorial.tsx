import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const TutorialContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const TutorialContent = styled(motion.div)`
  background: #2a2a2a;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  color: white;
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
    max-width: 98vw;
    max-height: 90vh;
  }
`;

const TutorialTitle = styled.h2`
  color: #ffd700;
  margin: 0 0 1rem 0;
  text-align: center;
  font-family: 'NorseBold', 'Norse', serif;
`;

const TutorialText = styled.p`
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
  font-family: 'Norse', serif;
`;

const TutorialImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  margin: 1rem 0;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const TutorialButton = styled(motion.button)<{ primary?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: ${props => props.primary ? '#ffd700' : '#3a3a3a'};
  color: ${props => props.primary ? '#1a1a1a' : 'white'};
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
  font-family: 'Norse', serif;

  &:hover {
    background: ${props => props.primary ? '#ffed4a' : '#4a4a4a'};
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
`;

interface TutorialStep {
  title: string;
  content: string;
  image?: string;
}

interface TutorialProps {
  steps: TutorialStep[];
  onComplete: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <TutorialContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <TutorialContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <CloseButton
              whileHover={{ scale: 1.12, color: '#ffd700' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={handleSkip}
            >
              ×
            </CloseButton>
            <TutorialTitle>{steps[currentStep].title}</TutorialTitle>
            {steps[currentStep].image && (
              <TutorialImage src={steps[currentStep].image} alt={steps[currentStep].title} />
            )}
            <TutorialText>{steps[currentStep].content}</TutorialText>
            <ButtonGroup>
              <TutorialButton
                whileHover={{ scale: 1.06, boxShadow: '0 0 12px #ffd70088' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </TutorialButton>
              <TutorialButton
                primary
                whileHover={{ scale: 1.06, boxShadow: '0 0 18px #ffd70088' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={handleNext}
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              </TutorialButton>
            </ButtonGroup>
          </TutorialContent>
        </TutorialContainer>
      )}
    </AnimatePresence>
  );
}; 