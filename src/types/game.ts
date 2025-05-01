export type ElementType = 'fire' | 'ice' | 'lightning' | 'none';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface CardAbility {
    id: string;
    name: string;
    description: string;
    triggerType: 'onPlay' | 'onCapture' | 'onLoss' | 'passive' | 'ragnarok';
    effect: CardEffect;
}

export interface CardEffect {
    type: 'statBoost' | 'elementalBoost' | 'swap' | 'copy' | 'destroy' | 'protect' | 'ragnarokBoost';
    value?: number;
    target?: 'adjacent' | 'all' | 'random' | 'self';
    condition?: {
        type: 'elementMatch' | 'rarityMatch' | 'cardMatch' | 'ragnarokActive';
        value?: string;
    };
}

export interface Card {
    id: string;
    name: string;
    image: string;
    top: number;
    right: number;
    bottom: number;
    left: number;
    element: ElementType;
    description: string;
    rarity: Rarity;
    owner: 'player' | 'opponent' | null;
    abilities?: CardAbility[];
}

export interface Position {
    row: number;
    col: number;
}

export interface GameRules {
    same: boolean;
    plus: boolean;
    elements: boolean;
    ragnarok: boolean;
}

export interface GameState {
    board: (Card | null)[][];
    playerHand: Card[];
    opponentHand: Card[];
    currentTurn: 'player' | 'opponent';
    score: {
        player: number;
        opponent: number;
    };
    rules: GameRules;
    ragnarokCounter: number;
    activeEffects: CardEffect[];
    isMultiplayer: boolean;
    isVsAI: boolean;
    player1Stats: {
        id: string;
        name: string;
        rank: number;
    };
    player2Stats: {
        id: string;
        name: string;
        rank: number;
    };
    turnCount: number;
    matchStartTime: Date;
    gameStatus: 'active' | 'completed' | 'surrendered';
    winner?: 'player1' | 'player2' | 'draw';
}

// New types for special abilities and Ragnarök mechanics
export type SpecialAbility = {
    name: string;
    description: string;
    type: 'passive' | 'active';
    effect: SpecialAbilityEffect;
};

export type SpecialAbilityEffect = {
    type: 'boost' | 'weaken' | 'flip' | 'protect' | 'copy';
    target: 'adjacent' | 'all' | 'element' | 'rarity';
    condition?: 'ragnarok' | 'low_health' | 'specific_card';
    value: number;
};

export type RagnarokBonus = {
    stats: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    effect?: SpecialAbilityEffect;
};

export type RagnarokEffect = {
    name: string;
    description: string;
    duration: number;
    effect: {
        type: 'boost_element' | 'weaken_element' | 'flip_random' | 'protect_cards' | 'damage_all';
        element?: 'fire' | 'ice' | 'lightning' | 'none';
        value: number;
    };
};

export interface Realm {
    id: string;
    name: string;
    description: string;
    position: { x: number; y: number };
    connections: string[];
    unlocked: boolean;
    completed: boolean;
}

export interface RealmProgression {
    requiredLevel: number;
    requiredQuests: string[];
    unlocksRealms: string[];
}

export interface RealmProgressions {
    [key: string]: RealmProgression;
} 