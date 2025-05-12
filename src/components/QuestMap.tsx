import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface Realm {
    id: string;
    name: string;
    description: string;
    position: { x: number; y: number };
    connections: string[];
    unlocked: boolean;
    completed: boolean;
    progressPercent?: number;
}

interface QuestMapProps {
    realms: Realm[];
    onRealmSelect: (realmId: string) => void;
}

const MapContainer = styled.div`
    width: 100%;
    max-width: 270px;
    margin: 0 auto;
    aspect-ratio: 3/4;
    height: auto;
    min-height: 320px;
    max-height: 90vh;
    background: transparent;
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    box-shadow: 0 0 32px #000a;
    font-family: 'Norse', serif;
    touch-action: pan-x pan-y;
    @media (max-width: 700px) {
        aspect-ratio: 3/4;
        min-height: 180px;
        max-height: 70vw;
        min-width: 180px;
        max-width: 98vw;
        padding: 0;
    }
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
    width: 90%;
    height: 90%;
    max-width: 120px;
    max-height: 120px;
    border-radius: 50%;
    background: ${props => {
        if (!props.unlocked) return 'linear-gradient(135deg, #b0a98f 0%, #6e6651 100%)';
        if (props.completed) return 'linear-gradient(135deg, #FFD700 0%, #bfa100 100%)';
        return 'linear-gradient(135deg, #e6d8a3 0%, #bfa100 100%)';
    }};
    cursor: ${props => props.unlocked ? 'pointer' : 'not-allowed'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #181818;
    font-weight: bold;
    box-shadow: 0 0 24px 4px #ffd70033, 0 0 20px rgba(0, 0, 0, 0.3);
    z-index: 3;
    transition: box-shadow 0.2s, background 0.2s;
    font-size: 1.1rem;
    @media (max-width: 700px) {
        width: 90%;
        height: 90%;
        max-width: 60px;
        max-height: 60px;
        font-size: 0.7rem;
    }
    &:hover {
        box-shadow: ${props => props.unlocked ? '0 0 32px 8px #ffd70088, 0 0 20px rgba(0,0,0,0.3)' : '0 0 20px rgba(0,0,0,0.3)'};
    }
`;

const RealmLabel = styled.div`
    width: 100%;
    margin-top: 0.3em;
    text-align: center;
    color: #FFD700;
    font-size: 1.1em;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    pointer-events: none;
    font-family: 'Norse', serif;
    @media (max-width: 700px) {
        font-size: 0.85em;
    }
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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const GridRealmNode = styled(motion.div)<{ unlocked: boolean; completed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  pointer-events: auto;
`;

// Add Padlock SVG component
const PadlockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    <rect x="8" y="14" width="16" height="10" rx="3" fill="#222" stroke="#ffd700" strokeWidth="2" />
    <path d="M12 14v-3a4 4 0 1 1 8 0v3" stroke="#ffd700" strokeWidth="2" fill="none" />
    <circle cx="16" cy="20" r="2" fill="#ffd700" />
  </svg>
);

// Add ProgressCircle SVG component
const ProgressCircle = ({ percent, color = '#ffd700' }: { percent: number; color?: string }) => {
  const size = 60;
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  const dash = c * (percent / 100);
  return (
    <svg width={size} height={size} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 2 }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#444"
        strokeWidth="4"
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeDasharray={`${dash} ${c - dash}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.4s' }}
      />
    </svg>
  );
};

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
            <GridContainer>
                {realms.map((realm, idx) => (
                    <GridRealmNode
                        key={realm.id}
                        unlocked={realm.unlocked}
                        completed={realm.completed}
                        onClick={() => realm.unlocked && onRealmSelect(realm.id)}
                        variants={nodeVariants}
                        initial="initial"
                        animate="animate"
                        whileHover={realm.unlocked ? "hover" : undefined}
                        transition={{ duration: 0.3 }}
                    >
                        <RealmNode
                            unlocked={realm.unlocked}
                            completed={realm.completed}
                            x={0}
                            y={0}
                            style={{ position: 'relative', left: 'unset', top: 'unset', transform: 'none' }}
                        >
                            {/* Progress ring for unlocked nodes */}
                            {realm.unlocked && (
                                <ProgressCircle percent={realm.progressPercent || 0} color={realm.completed ? '#ffd700' : '#8888ff'} />
                            )}
                            {/* Padlock for locked nodes */}
                            {!realm.unlocked && (
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3 }}>
                                    <PadlockIcon />
                                </div>
                            )}
                        </RealmNode>
                        <RealmLabel>{realm.name}</RealmLabel>
                    </GridRealmNode>
                ))}
            </GridContainer>
        </MapContainer>
    );
};

export default QuestMap; 