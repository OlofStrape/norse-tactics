import React from 'react';
import { Card, CardAbility } from '../types/game';
import styled from 'styled-components';

interface CardAbilitiesProps {
    card: Card;
    isActive?: boolean;
}

const AbilityContainer = styled.div`
    padding: 8px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    max-width: 300px;
`;

const AbilityHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 4px;
`;

const AbilityIcon = styled.div<{ type: CardAbility['triggerType'] }>`
    width: 24px;
    height: 24px;
    margin-right: 8px;
    background: ${props => {
        switch (props.type) {
            case 'onPlay':
                return '#4CAF50';
            case 'onCapture':
                return '#F44336';
            case 'onLoss':
                return '#9C27B0';
            case 'passive':
                return '#2196F3';
            case 'ragnarok':
                return '#FF9800';
            default:
                return '#757575';
        }
    }};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const AbilityName = styled.span`
    font-weight: bold;
    color: #FFD700;
`;

const AbilityDescription = styled.p`
    margin: 4px 0;
    color: #E0E0E0;
`;

const AbilityType = styled.span<{ type: CardAbility['triggerType'] }>`
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 12px;
    margin-left: auto;
    background: ${props => {
        switch (props.type) {
            case 'onPlay':
                return 'rgba(76, 175, 80, 0.2)';
            case 'onCapture':
                return 'rgba(244, 67, 54, 0.2)';
            case 'onLoss':
                return 'rgba(156, 39, 176, 0.2)';
            case 'passive':
                return 'rgba(33, 150, 243, 0.2)';
            case 'ragnarok':
                return 'rgba(255, 152, 0, 0.2)';
            default:
                return 'rgba(117, 117, 117, 0.2)';
        }
    }};
    color: ${props => {
        switch (props.type) {
            case 'onPlay':
                return '#81C784';
            case 'onCapture':
                return '#E57373';
            case 'onLoss':
                return '#BA68C8';
            case 'passive':
                return '#64B5F6';
            case 'ragnarok':
                return '#FFB74D';
            default:
                return '#BDBDBD';
        }
    }};
`;

const NoAbilities = styled.div`
    color: #757575;
    font-style: italic;
    padding: 8px;
`;

const CardAbilities: React.FC<CardAbilitiesProps> = ({ card, isActive }) => {
    if (!card.abilities || card.abilities.length === 0) {
        return <NoAbilities>No special abilities</NoAbilities>;
    }

    const getTriggerTypeLabel = (type: CardAbility['triggerType']): string => {
        switch (type) {
            case 'onPlay':
                return 'On Play';
            case 'onCapture':
                return 'On Capture';
            case 'onLoss':
                return 'On Loss';
            case 'passive':
                return 'Passive';
            case 'ragnarok':
                return 'Ragnarök';
            default:
                return 'Unknown';
        }
    };

    const getAbilityIcon = (type: CardAbility['triggerType']): string => {
        switch (type) {
            case 'onPlay':
                return '▶';
            case 'onCapture':
                return '⚔';
            case 'onLoss':
                return '✖';
            case 'passive':
                return '∞';
            case 'ragnarok':
                return '☠';
            default:
                return '?';
        }
    };

    return (
        <AbilityContainer>
            {card.abilities.map((ability, index) => (
                <div key={ability.id || index}>
                    <AbilityHeader>
                        <AbilityIcon type={ability.triggerType}>
                            {getAbilityIcon(ability.triggerType)}
                        </AbilityIcon>
                        <AbilityName>{ability.name}</AbilityName>
                        <AbilityType type={ability.triggerType}>
                            {getTriggerTypeLabel(ability.triggerType)}
                        </AbilityType>
                    </AbilityHeader>
                    <AbilityDescription>
                        {ability.description}
                    </AbilityDescription>
                </div>
            ))}
        </AbilityContainer>
    );
};

export default CardAbilities; 