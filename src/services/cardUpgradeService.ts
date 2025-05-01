import { Card } from '../types/game';

export interface CardCollection {
    [cardId: string]: {
        card: Card;
        count: number;
        level: number;
        progress: number;
    };
}

export interface UpgradeRequirements {
    baseCards: number;
    experience: number;
    level: number;
}

export class CardUpgradeService {
    private static instance: CardUpgradeService;
    private static readonly CARDS_TO_UPGRADE = 10;
    private static readonly MAX_LEVEL = 5;

    private constructor() {}

    public static getInstance(): CardUpgradeService {
        if (!CardUpgradeService.instance) {
            CardUpgradeService.instance = new CardUpgradeService();
        }
        return CardUpgradeService.instance;
    }

    public getUpgradeRequirements(currentLevel: number): UpgradeRequirements {
        return {
            baseCards: this.getRequiredCards(currentLevel),
            experience: this.getRequiredExperience(currentLevel),
            level: currentLevel + 1
        };
    }

    private getRequiredCards(currentLevel: number): number {
        // Increase required cards for each level
        return CardUpgradeService.CARDS_TO_UPGRADE * (currentLevel + 1);
    }

    private getRequiredExperience(currentLevel: number): number {
        // Experience cost increases exponentially with level
        return Math.floor(1000 * Math.pow(1.5, currentLevel));
    }

    public canUpgradeCard(collection: CardCollection, cardId: string): boolean {
        const cardData = collection[cardId];
        if (!cardData || cardData.level >= CardUpgradeService.MAX_LEVEL) {
            return false;
        }

        return cardData.count >= this.getRequiredCards(cardData.level);
    }

    public upgradeCard(card: Card, currentLevel: number): Card {
        const upgradedCard = { ...card };
        
        // Enhance card stats based on level
        upgradedCard.top += Math.floor(currentLevel * 1.5);
        upgradedCard.right += Math.floor(currentLevel * 1.5);
        upgradedCard.bottom += Math.floor(currentLevel * 1.5);
        upgradedCard.left += Math.floor(currentLevel * 1.5);

        // Add special abilities at certain levels
        if (currentLevel === 3) {
            this.addLevelThreeBonus(upgradedCard);
        } else if (currentLevel === 5) {
            this.addLevelFiveBonus(upgradedCard);
        }

        return upgradedCard;
    }

    private addLevelThreeBonus(card: Card): void {
        // Add element-specific ability at level 3
        const ability = this.generateElementalAbility(card.element);
        if (!card.abilities) {
            card.abilities = [];
        }
        card.abilities.push(ability);
    }

    private addLevelFiveBonus(card: Card): void {
        // Add powerful unique ability at max level
        const ability = this.generateUniqueAbility(card.id);
        if (!card.abilities) {
            card.abilities = [];
        }
        card.abilities.push(ability);
    }

    private generateElementalAbility(element: string): any {
        // Generate element-specific ability
        const elementalAbilities = {
            fire: {
                id: 'elemental_mastery_fire',
                name: 'Fire Mastery',
                description: 'Boost attack power against ice cards',
                triggerType: 'passive',
                effect: {
                    type: 'elementalBoost',
                    value: 2,
                    target: 'opponent',
                    condition: {
                        type: 'elementMatch',
                        value: 'ice'
                    }
                }
            },
            ice: {
                id: 'elemental_mastery_ice',
                name: 'Ice Mastery',
                description: 'Boost defense against fire cards',
                triggerType: 'passive',
                effect: {
                    type: 'elementalBoost',
                    value: 2,
                    target: 'self',
                    condition: {
                        type: 'elementMatch',
                        value: 'fire'
                    }
                }
            },
            lightning: {
                id: 'elemental_mastery_lightning',
                name: 'Lightning Mastery',
                description: 'Chance to strike adjacent cards',
                triggerType: 'onPlay',
                effect: {
                    type: 'damage',
                    value: 1,
                    target: 'adjacent'
                }
            }
        };

        return elementalAbilities[element] || elementalAbilities.fire;
    }

    private generateUniqueAbility(cardId: string): any {
        // Generate unique ability based on card type/id
        // This would be expanded based on your card database
        return {
            id: `unique_${cardId}`,
            name: 'Ultimate Power',
            description: 'Powerful unique ability',
            triggerType: 'ragnarok',
            effect: {
                type: 'statBoost',
                value: 3,
                target: 'self'
            }
        };
    }

    public getUpgradePreview(card: Card, currentLevel: number): Card {
        return this.upgradeCard(card, currentLevel);
    }
} 