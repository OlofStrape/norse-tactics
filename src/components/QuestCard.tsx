import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface QuestCardProps {
    id: string;
    title: string;
    description: string;
    location: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'boss';
    rewards: {
        cardIds?: string[];
        experience: number;
        unlocks?: string[];
        specialAbilities?: string[];
    };
    requirements: {
        playerLevel?: number;
        requiredCards?: string[];
        completedQuests?: string[];
        specialConditions?: string[];
    };
    progress: {
        completed: boolean;
        conditions: { [key: string]: boolean };
    };
    state: 'locked' | 'unlocked' | 'completed';
    onSelect: () => void;
}

const Card = styled(motion.div)<{ difficulty: QuestCardProps['difficulty']; state: QuestCardProps['state'] }>`
    background: ${props => {
        switch (props.difficulty) {
            case 'easy':
                return 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)';
            case 'medium':
                return 'linear-gradient(135deg, #1976D2 0%, #0D47A1 100%)';
            case 'hard':
                return 'linear-gradient(135deg, #C62828 0%, #B71C1C 100%)';
            case 'boss':
                return 'linear-gradient(135deg, #6A1B9A 0%, #4A148C 100%)';
            default:
                return 'linear-gradient(135deg, #424242 0%, #212121 100%)';
        }
    }};
    border-radius: 12px;
    padding: 20px;
    color: white;
    cursor: ${props => props.state === 'locked' ? 'not-allowed' : 'pointer'};
    width: 300px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, filter 0.2s, box-shadow 0.2s;
    opacity: ${props => props.state === 'locked' ? 0.5 : 1};
    filter: ${props => props.state === 'locked' ? 'grayscale(0.7)' : 'none'};
    border: ${props => props.state === 'completed' ? '3px solid #FFD700' : 'none'};
    box-shadow: ${props => props.state === 'completed' ? '0 0 18px 4px #ffd70066, 0 4px 16px rgba(0,0,0,0.18)' : '0 4px 6px rgba(0, 0, 0, 0.1)'};
    position: relative;

    &:hover {
        transform: ${props => props.state === 'locked' ? 'none' : 'translateY(-4px)'};
    }

    @media (max-width: 700px) {
        width: 98vw;
        min-width: 0;
        max-width: 99vw;
        padding: 10px 8px 14px 8px;
    }
    @media (max-width: 500px) {
        width: 99vw;
        padding: 7px 2vw 10px 2vw;
    }
`;

const Title = styled.h2`
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: bold;
    color: #FFD700;
    word-break: break-word;
    @media (max-width: 700px) {
        font-size: 18px;
    }
    @media (max-width: 500px) {
        font-size: 15px;
    }
`;

const Location = styled.div`
    font-size: 14px;
    color: #E0E0E0;
    margin-bottom: 16px;
    word-break: break-word;
    @media (max-width: 700px) {
        font-size: 12px;
        margin-bottom: 8px;
    }
    @media (max-width: 500px) {
        font-size: 11px;
        margin-bottom: 4px;
    }
`;

const Description = styled.p`
    margin: 0 0 16px 0;
    font-size: 16px;
    line-height: 1.5;
    word-break: break-word;
    @media (max-width: 700px) {
        font-size: 13px;
        margin-bottom: 8px;
    }
    @media (max-width: 500px) {
        font-size: 12px;
        margin-bottom: 4px;
    }
`;

const Section = styled.div`
    margin-bottom: 16px;
    @media (max-width: 700px) {
        margin-bottom: 8px;
    }
    @media (max-width: 500px) {
        margin-bottom: 4px;
    }
`;

const SectionTitle = styled.h3`
    margin: 0 0 8px 0;
    font-size: 18px;
    color: #FFD700;
    @media (max-width: 700px) {
        font-size: 15px;
        margin-bottom: 4px;
    }
    @media (max-width: 500px) {
        font-size: 13px;
        margin-bottom: 2px;
    }
`;

const List = styled.ul`
    margin: 0;
    padding-left: 20px;
    @media (max-width: 700px) {
        padding-left: 12px;
    }
    @media (max-width: 500px) {
        padding-left: 8px;
    }
`;

const ListItem = styled.li<{ completed?: boolean }>`
    margin-bottom: 4px;
    color: ${props => props.completed ? '#81C784' : '#E0E0E0'};
    word-break: break-word;
    &::marker {
        content: ${props => props.completed ? '"✓ "' : '"• "'};
        color: ${props => props.completed ? '#81C784' : '#E0E0E0'};
    }
    @media (max-width: 700px) {
        font-size: 12px;
    }
    @media (max-width: 500px) {
        font-size: 11px;
    }
`;

const ProgressBar = styled.div<{ progress: number }>`
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    margin-top: 16px;
    position: relative;
    overflow: hidden;
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: ${props => props.progress}%;
        background: #FFD700;
        border-radius: 2px;
        transition: width 0.3s ease;
    }
    @media (max-width: 700px) {
        height: 3px;
        margin-top: 8px;
    }
    @media (max-width: 500px) {
        height: 2px;
        margin-top: 4px;
    }
`;

const QuestCard: React.FC<QuestCardProps> = ({
    title,
    description,
    location,
    difficulty,
    rewards,
    requirements,
    progress,
    state,
    onSelect
}) => {
    const [expanded, setExpanded] = useState(state !== 'completed');
    const calculateProgress = () => {
        if (progress.completed) return 100;
        const conditions = Object.values(progress.conditions);
        if (conditions.length === 0) return 0;
        return (conditions.filter(Boolean).length / conditions.length) * 100;
    };

    // For completed quests, collapse by default, expand on click
    const handleCardClick = () => {
        if (state === 'locked') return;
        if (state === 'completed') setExpanded(e => !e);
        else onSelect();
    };

    return (
        <Card
            difficulty={difficulty}
            state={state}
            onClick={handleCardClick}
            whileHover={state === 'locked' ? undefined : { scale: 1.02 }}
            whileTap={state === 'locked' ? undefined : { scale: 0.98 }}
        >
            {state === 'locked' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontSize: 28,
                    color: '#FFD700',
                    opacity: 0.7,
                    zIndex: 2,
                    background: 'rgba(24,18,8,0.96)',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 8px #000a',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                  tabIndex={-1}
                  title="Locked"
                >
                  <span role="img" aria-label="locked">🔒</span>
                </div>
            )}
            {state === 'completed' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontSize: 28,
                    color: '#FFD700',
                    opacity: 0.9,
                    zIndex: 2,
                    background: 'rgba(24,18,8,0.96)',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 8px #000a',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                  tabIndex={-1}
                  title="Completed"
                >
                  <span role="img" aria-label="completed">✔️</span>
                </div>
            )}
            <Title>{title}</Title>
            {state === 'completed' && !expanded ? null : <Location>{location}</Location>}
            {state === 'completed' && !expanded ? null : <Description>{description}</Description>}

            {/* Collapse all details for completed quests unless expanded */}
            {state === 'completed' && !expanded ? (
                <div style={{ color: '#FFD700', textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginTop: 8 }}>
                  Completed
                  <span style={{ fontSize: 18, marginLeft: 8, verticalAlign: 'middle' }}>✔️</span>
                  <div style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>(Click to expand)</div>
                </div>
            ) : (
            <>
            <Section>
                <SectionTitle>Requirements</SectionTitle>
                <List>
                    {requirements.playerLevel && (
                        <ListItem>Level {requirements.playerLevel} required</ListItem>
                    )}
                    {requirements.requiredCards?.map(card => (
                        <ListItem key={card}>Card required: {card}</ListItem>
                    ))}
                    {requirements.completedQuests?.map(quest => (
                        <ListItem 
                            key={quest}
                            completed={progress.conditions[quest]}
                        >
                            Complete: {quest}
                        </ListItem>
                    ))}
                </List>
            </Section>

            <Section>
                <SectionTitle>Rewards</SectionTitle>
                <List>
                    <ListItem>{rewards.experience} XP</ListItem>
                    {rewards.cardIds?.map(card => (
                        <ListItem key={card}>Card: {card}</ListItem>
                    ))}
                    {rewards.unlocks?.map(quest => (
                        <ListItem key={quest}>Unlocks: {quest}</ListItem>
                    ))}
                    {rewards.specialAbilities && rewards.specialAbilities.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                            <strong>Special Ability Unlocked:</strong>
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                {rewards.specialAbilities.map((ability: string, i: number) => (
                                    <li key={i}>{ability}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </List>
            </Section>

            {requirements.specialConditions && (
                <Section>
                    <SectionTitle>Special Conditions</SectionTitle>
                    <List>
                        {requirements.specialConditions.map(condition => (
                            <ListItem key={condition}>{condition}</ListItem>
                        ))}
                    </List>
                </Section>
            )}
            <ProgressBar progress={calculateProgress()} />
            </>
            )}
        </Card>
    );
};

export default QuestCard; 