import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { realmIcons } from '../data/realmIcons';

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
    editable?: boolean;
}

const MapContainer = styled.div`
    width: 100%;
    max-width: 600px;
    aspect-ratio: 3/4;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    box-shadow: 0 0 32px #000a;
    background: url('https://res.cloudinary.com/dvfobknn4/image/upload/v1747334704/ChatGPT_Image_5_maj_2025_13_13_51_wvf9bb.png') center center/contain no-repeat;
    font-family: 'Norse', serif;
    touch-action: pan-x pan-y;
    padding: 0;
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

const RealmNode = styled(motion.div)<{ unlocked: boolean; completed: boolean; x: number; y: number }>`
    position: absolute;
    left: ${props => props.x}%;
    top: ${props => props.y}%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    max-width: 120px;
    max-height: 120px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background: transparent;
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
        width: 48px;
        height: 48px;
        font-size: 0.7rem;
    }
    &:hover {
        box-shadow: ${props => props.unlocked ? '0 0 32px 8px #ffd70088, 0 0 20px rgba(0,0,0,0.3)' : '0 0 20px rgba(0,0,0,0.3)'};
    }
`;

const RealmLabel = styled.div<{ unlocked: boolean }>`
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%, 0);
    margin-top: 0.4em;
    width: max-content;
    max-width: 120px;
    text-align: center;
    color: ${props => props.unlocked ? '#FFD700' : '#c8b98a'};
    font-size: 1.1em;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    pointer-events: none;
    font-family: 'Norse', serif;
    @media (max-width: 700px) {
        font-size: 0.85em;
        max-width: 60px;
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

// Add Padlock SVG component
const PadlockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    <rect x="8" y="14" width="16" height="10" rx="3" fill="#222" stroke="#ffd700" strokeWidth="2" />
    <path d="M12 14v-3a4 4 0 1 1 8 0v3" stroke="#ffd700" strokeWidth="2" fill="none" />
    <circle cx="16" cy="20" r="2" fill="#ffd700" />
  </svg>
);

// Ny modern progressring
const ProgressCircle = ({ percent, color = '#ffd700', completed = false }: { percent: number; color?: string; completed?: boolean }) => {
  const size = 60;
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  const dash = c * (percent / 100);
  // Gradient id för unikhet
  const gradId = completed ? 'gold-grad' : 'blue-grad';
  return (
    <svg width={size} height={size} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 2 }}>
      <defs>
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#fffbe6" />
        </linearGradient>
        <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5ad0ff" />
          <stop offset="100%" stopColor="#e0f7ff" />
        </linearGradient>
      </defs>
      {/* Bakgrundsring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        opacity={0.18}
      />
      {/* Progressring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={`url(#${completed ? 'gold-grad' : 'blue-grad'})`}
        strokeWidth="2"
        fill="none"
        strokeDasharray={`${dash} ${c - dash}`}
        strokeLinecap="round"
        style={{ filter: completed ? 'drop-shadow(0 0 6px #ffd70088)' : 'drop-shadow(0 0 6px #5ad0ff88)', transition: 'stroke-dasharray 0.4s' }}
      />
    </svg>
  );
};

// Lägg till en styled komponent för ikonen
const RealmIconImg = styled.img<{ locked?: boolean; realmId?: string }>`
  width: 90%;
  height: 90%;
  object-fit: contain;
  opacity: ${({ locked }) => (locked ? 0.45 : 1)};
  filter: ${({ locked }) => (locked ? 'grayscale(0.7)' : 'none')};
  pointer-events: none;
  z-index: 3;
  position: relative;
  display: block;
  margin: auto;
`;

const QuestMap: React.FC<QuestMapProps> = ({ realms, onRealmSelect, editable }) => {
    // Ref for drag constraints
    const containerRef = useRef<HTMLDivElement>(null);
    // Håll koll på lokala positioner i edit-läge
    const [positions, setPositions] = React.useState<Record<string, { x: number; y: number }>>(
        realms.reduce((acc, realm) => ({ ...acc, [realm.id]: { x: realm.position.x, y: realm.position.y } }), {})
    );

    // Uppdatera positions om realms ändras
    React.useEffect(() => {
        setPositions(realms.reduce((acc, realm) => ({ ...acc, [realm.id]: { x: realm.position.x, y: realm.position.y } }), {}));
    }, [realms]);

    // Hantera drag
    const handleDragEnd = (realmId: string, event: any, info: any) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const x = ((info.point.x - rect.left) / rect.width) * 100;
        const y = ((info.point.y - rect.top) / rect.height) * 100;
        setPositions(pos => ({ ...pos, [realmId]: { x, y } }));
        // Logga ut nya positionen
        console.log(`Realm ${realmId}: x: ${x.toFixed(1)}, y: ${y.toFixed(1)}`);
    };

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
        <MapContainer ref={containerRef}>
            {/* Removed drawConnections() to hide lines between nodes */}
            {realms.map((realm) => (
                <RealmNode
                    key={realm.id}
                    unlocked={realm.unlocked}
                    completed={realm.completed}
                    x={editable ? positions[realm.id]?.x : realm.position.x}
                    y={editable ? positions[realm.id]?.y : realm.position.y}
                    onClick={() => !editable && realm.unlocked && onRealmSelect(realm.id)}
                    variants={nodeVariants}
                    initial="initial"
                    animate="animate"
                    whileHover={realm.unlocked ? "hover" : undefined}
                    transition={{ duration: 0.3 }}
                    drag={editable}
                    dragMomentum={false}
                    dragConstraints={containerRef}
                    onDragEnd={editable ? (e, info) => handleDragEnd(realm.id, e, info) : undefined}
                    style={{ zIndex: 10 }}
                >
                    {/* Progress ring for unlocked nodes */}
                    {realm.unlocked && (
                        <ProgressCircle percent={realm.progressPercent || 0} color={realm.completed ? '#ffd700' : '#5ad0ff'} completed={realm.completed} />
                    )}
                    {/* Padlock for locked nodes */}
                    {!realm.unlocked && (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3 }}>
                            <PadlockIcon />
                        </div>
                    )}
                    {/* Realm ikon */}
                    {realmIcons[realm.id] && (
                        <RealmIconImg
                            src={realmIcons[realm.id]}
                            alt={realm.name + ' ikon'}
                            locked={!realm.unlocked}
                            draggable={false}
                            realmId={realm.id}
                        />
                    )}
                    <RealmLabel unlocked={realm.unlocked}>{realm.name}</RealmLabel>
                </RealmNode>
            ))}
        </MapContainer>
    );
};

export default QuestMap; 