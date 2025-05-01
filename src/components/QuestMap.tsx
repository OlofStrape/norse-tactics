import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface Realm {
    id: string;
    name: string;
    description: string;
    position: { x: number; y: number };
    connections: string[];
    unlocked: boolean;
    completed: boolean;
}

interface QuestMapProps {
    realms: Realm[];
    onRealmSelect: (realmId: string) => void;
}

const MapContainer = styled.div`
    width: 100%;
    height: 800px;
    background: #1a1a1a;
    position: relative;
    overflow: hidden;
`;

const YggdrasilTrunk = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    width: 40px;
    height: 600px;
    background: linear-gradient(90deg, #4a3728 0%, #6b4c34 50%, #4a3728 100%);
    transform: translate(-50%, -50%);
    z-index: 1;
`;

const YggdrasilBranches = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
`;

const RealmNode = styled(motion.div)<{ 
    unlocked: boolean; 
    completed: boolean;
    x: number;
    y: number;
}>`
    position: absolute;
    left: ${props => props.x}%;
    top: ${props => props.y}%;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: ${props => {
        if (!props.unlocked) return 'linear-gradient(135deg, #424242 0%, #212121 100%)';
        if (props.completed) return 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)';
        return 'linear-gradient(135deg, #1976D2 0%, #0D47A1 100%)';
    }};
    cursor: ${props => props.unlocked ? 'pointer' : 'not-allowed'};
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    z-index: 3;

    &::before {
        content: '';
        position: absolute;
        width: 110%;
        height: 110%;
        border-radius: 50%;
        border: 2px solid ${props => props.unlocked ? '#FFD700' : '#424242'};
        opacity: ${props => props.unlocked ? 1 : 0.5};
    }
`;

const RealmLabel = styled.div`
    position: absolute;
    width: 150px;
    text-align: center;
    color: #FFD700;
    font-size: 16px;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    pointer-events: none;
    transform: translateY(60px);
`;

const Connection = styled.svg<{ active: boolean }>`
    position: absolute;
    pointer-events: none;
    z-index: 1;
    opacity: ${props => props.active ? 1 : 0.3};

    path {
        stroke: ${props => props.active ? '#FFD700' : '#424242'};
        stroke-width: 3;
        fill: none;
    }
`;

const QuestMap: React.FC<QuestMapProps> = ({ realms, onRealmSelect }) => {
    const drawConnections = () => {
        return realms.map(realm => 
            realm.connections.map(targetId => {
                const target = realms.find(r => r.id === targetId);
                if (!target) return null;

                const startX = realm.position.x;
                const startY = realm.position.y;
                const endX = target.position.x;
                const endY = target.position.y;

                // Calculate control points for curved paths
                const midX = (startX + endX) / 2;
                const midY = (startY + endY) / 2;
                const curve = 20; // Curve intensity

                const path = `M ${startX} ${startY} 
                             Q ${midX + curve} ${midY} ${endX} ${endY}`;

                return (
                    <Connection 
                        key={`${realm.id}-${targetId}`}
                        active={realm.unlocked && target.unlocked}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <path d={path} />
                    </Connection>
                );
            })
        );
    };

    const nodeVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        hover: { scale: 1.1, boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)' }
    };

    return (
        <MapContainer>
            <YggdrasilTrunk />
            <YggdrasilBranches>
                {drawConnections()}
            </YggdrasilBranches>
            {realms.map(realm => (
                <RealmNode
                    key={realm.id}
                    unlocked={realm.unlocked}
                    completed={realm.completed}
                    x={realm.position.x}
                    y={realm.position.y}
                    onClick={() => realm.unlocked && onRealmSelect(realm.id)}
                    variants={nodeVariants}
                    initial="initial"
                    animate="animate"
                    whileHover={realm.unlocked ? "hover" : undefined}
                    transition={{ duration: 0.3 }}
                >
                    <RealmLabel>{realm.name}</RealmLabel>
                </RealmNode>
            ))}
        </MapContainer>
    );
};

export default QuestMap; 