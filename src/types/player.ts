import { Card } from './game';
import { CardCollection } from '../services/cardUpgradeService';

export interface PlayerStats {
    wins: number;
    losses: number;
    draws: number;
    rank: number;
    eloRating: number;
}

export interface PlayerAchievement {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    progress: number;
    maxProgress: number;
}

export interface Player {
    id: string;
    name: string;
    level: number;
    experience: number;
    rank: number;
    selectedDeck: Card[];
    cardCollection: CardCollection;
    completedQuests: string[];
    stats: PlayerStats;
    achievements: PlayerAchievement[];
    unlockedRealms: string[];
    lastActive: Date;
    preferences: {
        favoriteCards: string[];
        preferredElements: string[];
        deckPresets: {
            name: string;
            cards: string[];
        }[];
    };
}

export interface PlayerMatchHistory {
    matchId: string;
    timestamp: Date;
    opponent: {
        id: string;
        name: string;
        rank: number;
    };
    result: 'win' | 'loss' | 'draw';
    score: {
        player: number;
        opponent: number;
    };
    deck: string[]; // Card IDs used
    eloChange: number;
}

export interface PlayerProgress {
    currentLevel: number;
    experienceToNext: number;
    totalExperience: number;
    rankProgress: number;
    questProgress: {
        [questId: string]: {
            completed: boolean;
            conditions: { [condition: string]: boolean };
        };
    };
} 