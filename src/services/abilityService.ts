import { Card, CardAbility, CardEffect, GameState } from '../types/game';

export class AbilityService {
    private gameState: GameState;

    constructor(gameState: GameState) {
        this.gameState = gameState;
    }

    public triggerAbility(card: Card, triggerType: CardAbility['triggerType'], context?: any): void {
        if (!card.abilities) return;

        card.abilities
            .filter(ability => ability.triggerType === triggerType)
            .forEach(ability => this.applyEffect(card, ability.effect, context));
    }

    private applyEffect(card: Card, effect: CardEffect, context?: any): void {
        switch (effect.type) {
            case 'statBoost':
                this.applyStatBoost(card, effect);
                break;
            case 'elementalBoost':
                this.applyElementalBoost(card, effect, context);
                break;
            case 'swap':
                this.applySwapEffect(card, effect);
                break;
            case 'copy':
                this.applyCopyEffect(card, effect);
                break;
            case 'protect':
                this.applyProtectEffect(card, effect);
                break;
            case 'ragnarokBoost':
                if (this.gameState.ragnarokCounter > 0) {
                    this.applyRagnarokBoost(card, effect);
                }
                break;
        }
    }

    private applyStatBoost(card: Card, effect: CardEffect): void {
        const targetCards = this.getTargetCards(card, effect.target);
        const boostValue = effect.value || 1;

        targetCards.forEach(targetCard => {
            if (this.checkCondition(targetCard, effect.condition)) {
                ['top', 'right', 'bottom', 'left'].forEach(stat => {
                    targetCard[stat] += boostValue;
                });
            }
        });
    }

    private applyElementalBoost(card: Card, effect: CardEffect, context?: any): void {
        const targetCards = this.getTargetCards(card, effect.target);
        const boostValue = effect.value || 1;

        targetCards.forEach(targetCard => {
            if (this.checkCondition(targetCard, effect.condition)) {
                if (context?.type === 'capture' && targetCard.element === card.element) {
                    // Apply elemental boost during capture
                    context.captureValue += boostValue;
                }
            }
        });
    }

    private applySwapEffect(card: Card, effect: CardEffect): void {
        // Implementation for swap effect
        const targetCards = this.getTargetCards(card, effect.target);
        if (targetCards.length > 0) {
            // Allow player to choose which card to swap with
            this.gameState.activeEffects.push({
                type: 'swap',
                target: 'all',
                value: 1
            });
        }
    }

    private applyCopyEffect(card: Card, effect: CardEffect): void {
        if (effect.target === 'random') {
            const opponentHand = this.gameState.opponentHand;
            if (opponentHand.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponentHand.length);
                // Reveal the card to the player (implementation depends on UI)
                this.gameState.activeEffects.push({
                    type: 'copy',
                    target: 'random',
                    value: randomIndex
                });
            }
        }
    }

    private applyProtectEffect(card: Card, effect: CardEffect): void {
        const targetCards = this.getTargetCards(card, effect.target);
        targetCards.forEach(targetCard => {
            if (this.checkCondition(targetCard, effect.condition)) {
                // Add protection effect
                this.gameState.activeEffects.push({
                    type: 'protect',
                    target: 'self',
                    value: 1
                });
            }
        });
    }

    private applyRagnarokBoost(card: Card, effect: CardEffect): void {
        const targetCards = this.getTargetCards(card, effect.target);
        const boostValue = effect.value || 2;

        targetCards.forEach(targetCard => {
            if (this.checkCondition(targetCard, effect.condition)) {
                ['top', 'right', 'bottom', 'left'].forEach(stat => {
                    targetCard[stat] += boostValue;
                });
            }
        });
    }

    private getTargetCards(sourceCard: Card, target?: CardEffect['target']): Card[] {
        switch (target) {
            case 'adjacent':
                return this.getAdjacentCards(sourceCard);
            case 'all':
                return this.getAllBoardCards();
            case 'random':
                return this.getRandomCard();
            case 'self':
            default:
                return [sourceCard];
        }
    }

    private getAdjacentCards(card: Card): Card[] {
        const adjacentCards: Card[] = [];
        const position = this.findCardPosition(card);
        
        if (!position) return [];

        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1] // up, down, left, right
        ];

        directions.forEach(([dx, dy]) => {
            const newRow = position.row + dx;
            const newCol = position.col + dy;

            if (this.isValidPosition(newRow, newCol)) {
                const adjacentCard = this.gameState.board[newRow][newCol];
                if (adjacentCard) {
                    adjacentCards.push(adjacentCard);
                }
            }
        });

        return adjacentCards;
    }

    private getAllBoardCards(): Card[] {
        return this.gameState.board
            .flat()
            .filter((card): card is Card => card !== null);
    }

    private getRandomCard(): Card[] {
        const allCards = this.getAllBoardCards();
        if (allCards.length === 0) return [];
        const randomIndex = Math.floor(Math.random() * allCards.length);
        return [allCards[randomIndex]];
    }

    private findCardPosition(card: Card): { row: number; col: number } | null {
        for (let row = 0; row < this.gameState.board.length; row++) {
            for (let col = 0; col < this.gameState.board[row].length; col++) {
                if (this.gameState.board[row][col]?.id === card.id) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    private isValidPosition(row: number, col: number): boolean {
        return row >= 0 && 
               row < this.gameState.board.length && 
               col >= 0 && 
               col < this.gameState.board[0].length;
    }

    private checkCondition(card: Card, condition?: CardEffect['condition']): boolean {
        if (!condition) return true;

        switch (condition.type) {
            case 'elementMatch':
                return card.element === condition.value;
            case 'rarityMatch':
                return card.rarity === condition.value;
            case 'cardMatch':
                return card.id === condition.value;
            case 'ragnarokActive':
                return this.gameState.ragnarokCounter > 0;
            default:
                return true;
        }
    }
} 