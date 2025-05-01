import React from 'react';
import styled from 'styled-components';
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
    onSelect: () => void;
}

const Card = styled(motion.div)<{ difficulty: QuestCardProps['difficulty'] }>`
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
    cursor: pointer;
    width: 300px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-4px);
    }
`;

const Title = styled.h2`
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: bold;
    color: #FFD700;
`;

const Location = styled.div`
    font-size: 14px;
    color: #E0E0E0;
    margin-bottom: 16px;
`;

const Description = styled.p`
    margin: 0 0 16px 0;
    font-size: 16px;
    line-height: 1.5;
`;

const Section = styled.div`
    margin-bottom: 16px;
`;

const SectionTitle = styled.h3`
    margin: 0 0 8px 0;
    font-size: 18px;
    color: #FFD700;
`;

const List = styled.ul`
    margin: 0;
    padding-left: 20px;
`;

const ListItem = styled.li<{ completed?: boolean }>`
    margin-bottom: 4px;
    color: ${props => props.completed ? '#81C784' : '#E0E0E0'};
    
    &::marker {
        content: ${props => props.completed ? '"✓ "' : '"• "'};
        color: ${props => props.completed ? '#81C784' : '#E0E0E0'};
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
`;

const QuestCard: React.FC<QuestCardProps> = ({
    title,
    description,
    location,
    difficulty,
    rewards,
    requirements,
    progress,
    onSelect
}) => {
    const calculateProgress = () => {
        if (progress.completed) return 100;
        const conditions = Object.values(progress.conditions);
        if (conditions.length === 0) return 0;
        return (conditions.filter(Boolean).length / conditions.length) * 100;
    };

    return (
        <Card
            difficulty={difficulty}
            onClick={onSelect}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Title>{title}</Title>
            <Location>{location}</Location>
            <Description>{description}</Description>

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
                </List>
            </Section>

            {requirements.specialConditions && (
                <Section>
                    <SectionTitle>Special Conditions</SectionTitle>
                    <List>
                        {requirements.specialConditions.map(condition => (
                            <ListItem 
                                key={condition}
                                completed={progress.conditions[condition]}
                            >
                                {condition}
                            </ListItem>
                        ))}
                    </List>
                </Section>
            )}

            <ProgressBar progress={calculateProgress()} />
        </Card>
    );
};

export default QuestCard; 