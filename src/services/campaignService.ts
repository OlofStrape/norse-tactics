import { Card, GameState, GameRules } from '../types/game';
import { cards } from '../data/cards';
import { midgardQuests, asgardQuests, vanaheimQuests, alfheimQuests, jotunheimQuests, nidavellirQuests, muspelheimQuests, niflheimQuests, helheimQuests } from '../data/campaign';
import { xpForLevel, getLevelFromXP } from '../utils/xp';

export interface DialogueLine {
    speaker: string;
    text: string;
    portraitUrl?: string;
}

export interface StoryChoice {
    text: string;
    result: string; // Could be next dialogue/story segment or effect
}

export interface Quest {
    id: string;
    name: string;
    description: string;
    location: string;
    opponent: Opponent;
    rewards: QuestRewards;
    requirements: QuestRequirements;
    specialRules: GameRules;
    // Storytelling fields
    storyIntro?: string;
    storyOutro?: string;
    storyImages?: string[];
    dialogue?: DialogueLine[];
    choices?: StoryChoice[];
}

export interface Opponent {
    id: string;
    name: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'boss';
    deck: Card[];
    specialRules?: GameRules;
    aiStrategy: AIStrategy;
}

export interface QuestRewards {
    cards?: Card[];
    specialAbilities?: string[];
    items?: string[];
    experience: number;
    unlocks?: string[]; // IDs of new quests or locations unlocked
}

export interface QuestRequirements {
    playerLevel?: number;
    requiredCards?: string[]; // Card IDs
    completedQuests?: string[]; // Quest IDs
    specialConditions?: string[];
}

export interface AIStrategy {
    preferredElements?: ('fire' | 'ice' | 'lightning' | 'none')[];
    aggressiveness: number; // 0-1, how likely to play offensive vs defensive
    specialCardPreferences?: string[]; // Card IDs the AI prefers to use
    ragnarokStrategy?: 'aggressive' | 'defensive' | 'balanced';
}

export interface CampaignState {
    currentLocation: string;
    completedQuests: string[];
    playerDeck: Card[];
    unlockedCards: Card[];
    playerLevel: number;
    experience: number;
    specialAbilities: string[];
    items: string[];
}

// Define the campaign structure following Yggdrasil's branches
export const campaignLocations = {
    asgard: {
        name: 'Asgard',
        description: 'Realm of the Æsir Gods',
        quests: [
            {
                id: 'training-grounds',
                name: 'The Training Grounds',
                description: 'Learn the basics of card combat from the Einherjar.',
                location: 'asgard',
                opponent: {
                    id: 'einherjar-trainer',
                    name: 'Einherjar Trainer',
                    description: 'A veteran warrior of Valhalla',
                    difficulty: 'easy',
                    deck: cards.filter(c => c.rarity === 'common').slice(0, 5),
                    aiStrategy: {
                        aggressiveness: 0.3,
                    }
                },
                rewards: {
                    cards: [cards.find(c => c.id === 'viking-warrior')!],
                    experience: 100,
                    unlocks: ['valhalla-challenge']
                },
                requirements: {
                    playerLevel: 1
                },
                specialRules: {
                    same: false,
                    plus: false,
                    elements: false,
                    ragnarok: false
                }
            },
            // Add more quests...
        ]
    },
    vanaheim: {
        name: 'Vanaheim',
        description: 'Realm of the Vanir Gods',
        quests: [
            // Add quests...
        ]
    },
    // Add more locations...
};

export class CampaignService {
    private state: CampaignState;

    constructor() {
        this.state = this.initializeCampaign();
    }

    private initializeCampaign(): CampaignState {
        return {
            currentLocation: 'asgard',
            completedQuests: [],
            playerDeck: cards.filter(c => c.rarity === 'common').slice(0, 5),
            unlockedCards: cards.filter(c => c.rarity === 'common'),
            playerLevel: 1,
            experience: 0,
            specialAbilities: [],
            items: []
        };
    }

    public getAvailableQuests(): Quest[] {
        let quests: Quest[] = [];
        switch (this.state.currentLocation) {
            case 'midgard': quests = midgardQuests; break;
            case 'asgard': quests = asgardQuests; break;
            case 'vanaheim': quests = vanaheimQuests; break;
            case 'alfheim': quests = alfheimQuests; break;
            case 'jotunheim': quests = jotunheimQuests; break;
            case 'nidavellir': quests = nidavellirQuests; break;
            case 'muspelheim': quests = muspelheimQuests; break;
            case 'niflheim': quests = niflheimQuests; break;
            case 'helheim': quests = helheimQuests; break;
            default: quests = []; break;
        }
        return quests.filter(quest => this.isQuestAvailable(quest));
    }

    private isQuestAvailable(quest: Quest): boolean {
        const reqs = quest.requirements;
        
        if (reqs.playerLevel && this.state.playerLevel < reqs.playerLevel) {
            return false;
        }

        if (reqs.completedQuests && 
            !reqs.completedQuests.every(q => this.state.completedQuests.includes(q))) {
            return false;
        }

        if (reqs.requiredCards && 
            !reqs.requiredCards.every(c => this.state.unlockedCards.some(uc => uc.id === c))) {
            return false;
        }

        return true;
    }

    public startQuest(questId: string): { gameState: GameState; opponent: Opponent } | null {
        const quest = this.getAvailableQuests().find(q => q.id === questId);
        if (!quest) return null;

        // Initialize game state for the quest
        const gameState: GameState = {
            board: Array(3).fill(null).map(() => Array(3).fill(null)),
            player1Hand: this.state.playerDeck.slice(0, 5),
            player2Hand: quest.opponent.deck,
            currentTurn: 'player',
            score: { player: 0, opponent: 0 },
            rules: quest.specialRules,
            ragnarokCounter: 0,
            activeEffects: [],
            isMultiplayer: false,
            isVsAI: true,
            aiDifficulty: 'medium',
            player1Stats: { id: 'player', name: 'Player 1', rank: 1 },
            player2Stats: { id: quest.opponent.id, name: quest.opponent.name, rank: 1 },
            turnCount: 0,
            matchStartTime: new Date(),
            gameStatus: 'active',
        };

        return { gameState, opponent: quest.opponent };
    }

    public completeQuest(questId: string, victory: boolean): void {
        if (!victory) return;

        const quest = this.getAvailableQuests().find(q => q.id === questId);
        if (!quest) return;

        // Add rewards
        this.state.experience += quest.rewards.experience;
        this.state.completedQuests.push(questId);

        if (quest.rewards.cards) {
            this.state.unlockedCards.push(...quest.rewards.cards);
        }

        if (quest.rewards.specialAbilities) {
            this.state.specialAbilities.push(...quest.rewards.specialAbilities);
        }

        if (quest.rewards.items) {
            this.state.items.push(...quest.rewards.items);
        }

        // Level up check
        this.checkLevelUp();
    }

    private checkLevelUp(): void {
        const newLevel = getLevelFromXP(this.state.experience);
        if (newLevel !== this.state.playerLevel) {
            this.state.playerLevel = newLevel;
            // Could add level-up rewards here
        }
    }

    public getAIMove(opponent: Opponent, gameState: GameState): { card: Card; position: { row: number; col: number } } {
        // Implement AI strategy based on opponent.aiStrategy
        // This would be a complex implementation considering various factors
        // For now, return a simple move
        const availableCards = gameState.player2Hand;
        const availablePositions = [];
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (!gameState.board[row][col]) {
                    availablePositions.push({ row, col });
                }
            }
        }

        return {
            card: availableCards[0],
            position: availablePositions[0]
        };
    }

    public getState(): CampaignState {
        return this.state;
    }
} 