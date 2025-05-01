import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../types/game';
import { CardCollection, UpgradeRequirements } from '../services/cardUpgradeService';

interface CardUpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    card: Card;
    cardCollection: CardCollection;
    upgradeRequirements: UpgradeRequirements;
    onUpgrade: () => void;
    previewCard: Card;
}

const ModalOverlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled(motion.div)`
    background: linear-gradient(135deg, #2C3E50 0%, #1B2838 100%);
    border-radius: 16px;
    padding: 32px;
    width: 800px;
    color: white;
    position: relative;
`;

const Title = styled.h2`
    color: #FFD700;
    text-align: center;
    margin-bottom: 24px;
    font-size: 24px;
`;

const CardComparison = styled.div`
    display: flex;
    justify-content: space-around;
    margin-bottom: 32px;
`;

const CardContainer = styled.div`
    text-align: center;
`;

const CardTitle = styled.h3`
    color: #E0E0E0;
    margin-bottom: 16px;
`;

const StatsComparison = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 32px;
`;

const StatRow = styled.div<{ isImproved?: boolean }>`
    display: flex;
    justify-content: space-between;
    padding: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    color: ${props => props.isImproved ? '#4CAF50' : '#E0E0E0'};
`;

const RequirementsSection = styled.div`
    background: rgba(0, 0, 0, 0.2);
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
`;

const RequirementRow = styled.div<{ isMet: boolean }>`
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    color: ${props => props.isMet ? '#4CAF50' : '#FF5252'};
`;

const UpgradeButton = styled(motion.button)<{ canUpgrade: boolean }>`
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 8px;
    background: ${props => props.canUpgrade ? 
        'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)' : 
        'linear-gradient(135deg, #9E9E9E 0%, #616161 100%)'};
    color: white;
    font-size: 18px;
    font-weight: bold;
    cursor: ${props => props.canUpgrade ? 'pointer' : 'not-allowed'};
    transition: transform 0.2s ease;

    &:hover {
        transform: ${props => props.canUpgrade ? 'translateY(-2px)' : 'none'};
    }
`;

const CloseButton = styled(motion.button)`
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    color: #E0E0E0;
    font-size: 24px;
    cursor: pointer;
`;

const CardUpgradeModal: React.FC<CardUpgradeModalProps> = ({
    isOpen,
    onClose,
    card,
    cardCollection,
    upgradeRequirements,
    onUpgrade,
    previewCard
}) => {
    const cardData = cardCollection[card.id];
    const canUpgrade = cardData.count >= upgradeRequirements.baseCards;

    return (
        <AnimatePresence>
            {isOpen && (
                <ModalOverlay
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <ModalContent
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                    >
                        <CloseButton onClick={onClose}>×</CloseButton>
                        <Title>Upgrade Card: {card.name}</Title>

                        <CardComparison>
                            <CardContainer>
                                <CardTitle>Current (Level {cardData.level})</CardTitle>
                                {/* Render current card */}
                            </CardContainer>
                            <CardContainer>
                                <CardTitle>After Upgrade (Level {cardData.level + 1})</CardTitle>
                                {/* Render preview card */}
                            </CardContainer>
                        </CardComparison>

                        <StatsComparison>
                            <StatRow>
                                <span>Top</span>
                                <span>{card.top} → {previewCard.top}</span>
                            </StatRow>
                            <StatRow>
                                <span>Right</span>
                                <span>{card.right} → {previewCard.right}</span>
                            </StatRow>
                            <StatRow>
                                <span>Bottom</span>
                                <span>{card.bottom} → {previewCard.bottom}</span>
                            </StatRow>
                            <StatRow>
                                <span>Left</span>
                                <span>{card.left} → {previewCard.left}</span>
                            </StatRow>
                        </StatsComparison>

                        <RequirementsSection>
                            <RequirementRow isMet={cardData.count >= upgradeRequirements.baseCards}>
                                <span>Cards Required:</span>
                                <span>{cardData.count} / {upgradeRequirements.baseCards}</span>
                            </RequirementRow>
                            <RequirementRow isMet={cardData.level < 5}>
                                <span>Maximum Level:</span>
                                <span>{cardData.level} / 5</span>
                            </RequirementRow>
                        </RequirementsSection>

                        <UpgradeButton
                            canUpgrade={canUpgrade}
                            onClick={canUpgrade ? onUpgrade : undefined}
                            whileHover={canUpgrade ? { scale: 1.02 } : {}}
                            whileTap={canUpgrade ? { scale: 0.98 } : {}}
                        >
                            {canUpgrade ? 'Upgrade Card' : 'Cannot Upgrade Yet'}
                        </UpgradeButton>
                    </ModalContent>
                </ModalOverlay>
            )}
        </AnimatePresence>
    );
};

export default CardUpgradeModal; 