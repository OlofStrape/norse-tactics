import { GameState, Card } from '../types/game';

interface QuestCondition {
    type: string;
    check: (gameState: GameState, context?: any) => boolean;
    description: string;
}

export class QuestService {
    private static instance: QuestService;
    private gameState: GameState;
    private conditions: Map<string, QuestCondition>;

    private constructor(gameState: GameState) {
        this.gameState = gameState;
        this.conditions = new Map();
        this.initializeConditions();
    }

    public static getInstance(gameState: GameState): QuestService {
        if (!QuestService.instance) {
            QuestService.instance = new QuestService(gameState);
        }
        return QuestService.instance;
    }

    private initializeConditions(): void {
        this.conditions.set('win_without_fire', {
            type: 'deck_restriction',
            check: (gameState: GameState) => {
                return !gameState.playerHand.some(card => card.element === 'fire');
            },
            description: 'Win without using any fire element cards'
        });

        this.conditions.set('win_with_elemental_combo', {
            type: 'combo',
            check: (gameState: GameState) => {
                const board = gameState.board.flat().filter((card): card is Card => card !== null);
                const elements = new Set(board.map(card => card.element));
                return elements.size >= 3;
            },
            description: 'Win using cards of at least 3 different elements'
        });

        this.conditions.set('survive_three_elements', {
            type: 'defense',
            check: (gameState: GameState) => {
                const opponentElements = new Set(
                    gameState.opponentHand.map(card => card.element)
                );
                return opponentElements.size >= 3 && gameState.score.player > 0;
            },
            description: 'Survive against cards of three different elements'
        });

        this.conditions.set('win_with_vanir_combo', {
            type: 'combo',
            check: (gameState: GameState) => {
                const vanirCards = ['freya', 'freyr', 'njord'];
                const playerCards = [...gameState.playerHand, ...gameState.board.flat().filter((card): card is Card => 
                    card !== null && card.owner === 'player'
                )];
                return vanirCards.every(cardId => 
                    playerCards.some(card => card.id === cardId)
                );
            },
            description: 'Win while having Freya, Freyr, and Njörðr on your side'
        });
    }

    public checkCondition(conditionId: string, context?: any): boolean {
        const condition = this.conditions.get(conditionId);
        if (!condition) {
            console.warn(`Unknown condition: ${conditionId}`);
            return false;
        }
        return condition.check(this.gameState, context);
    }

    public getConditionDescription(conditionId: string): string {
        const condition = this.conditions.get(conditionId);
        if (!condition) {
            return 'Unknown condition';
        }
        return condition.description;
    }

    public async grantRewards(rewards: {
        cardIds?: string[];
        experience: number;
        unlocks?: string[];
    }): Promise<void> {
        // Grant experience
        await this.grantExperience(rewards.experience);

        // Grant cards
        if (rewards.cardIds) {
            await this.grantCards(rewards.cardIds);
        }

        // Unlock new quests
        if (rewards.unlocks) {
            await this.unlockQuests(rewards.unlocks);
        }
    }

    private async grantExperience(amount: number): Promise<void> {
        // Implementation would depend on your leveling system
        console.log(`Granting ${amount} experience`);
        // TODO: Update player level and experience
    }

    private async grantCards(cardIds: string[]): Promise<void> {
        // Implementation would depend on your card collection system
        console.log(`Granting cards: ${cardIds.join(', ')}`);
        // TODO: Add cards to player's collection
    }

    private async unlockQuests(questIds: string[]): Promise<void> {
        // Implementation would depend on your quest progression system
        console.log(`Unlocking quests: ${questIds.join(', ')}`);
        // TODO: Update quest availability
    }

    public getQuestProgress(questId: string): {
        completed: boolean;
        conditions: { [key: string]: boolean };
    } {
        // Implementation would depend on your quest tracking system
        return {
            completed: false,
            conditions: {}
        };
    }

    public async completeQuest(questId: string): Promise<void> {
        // Implementation would depend on your quest completion system
        console.log(`Completing quest: ${questId}`);
        // TODO: Mark quest as completed and trigger any post-completion events
    }
} 