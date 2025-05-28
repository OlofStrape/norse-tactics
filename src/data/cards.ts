import { Card, ElementType, Rarity, CardAbility } from '../types/game';
import { cardImages } from './cardImages';

// Helper function to create cards with consistent rarity stats
const createCard = (
    id: string,
    name: string,
    stats: [number, number, number, number],
    element: ElementType,
    description: string,
    rarity: Rarity,
    abilities: CardAbility[] = []
): Card => ({
    id,
    name,
    image: cardImages[id] || `/cards/${id}.jpg`,
    top: stats[0],
    right: stats[1],
    bottom: stats[2],
    left: stats[3],
    element,
    description,
    rarity,
    value: 0,
    owner: null,
    abilities
});

// Major Gods (Legendary)
const majorGods: Card[] = [
    createCard('odin', 'Odin', [9, 8, 9, 8], 'lightning', 'The All-Father, ruler of Asgard', 'legendary', [
        {
            id: 'allfather-wisdom',
            name: "All-Father's Wisdom",
            description: "When played, reveals one random card in opponent's hand",
            triggerType: 'onPlay',
            effect: {
                type: 'copy',
                target: 'random'
            }
        },
        {
            id: 'ragnarok-sight',
            name: 'Sight of Ragnarök',
            description: 'During Ragnarök, all adjacent cards gain +1 to all stats',
            triggerType: 'ragnarok',
            effect: {
                type: 'statBoost',
                value: 1,
                target: 'adjacent',
                condition: {
                    type: 'ragnarokActive'
                }
            }
        }
    ]),
    createCard('thor', 'Thor', [8, 9, 7, 8], 'lightning', 'God of Thunder and Lightning', 'legendary', [
        {
            id: 'thunder-strike',
            name: 'Thunder Strike',
            description: 'When capturing a card, deals +2 damage if both cards are lightning element',
            triggerType: 'onCapture',
            effect: {
                type: 'elementalBoost',
                value: 2,
                target: 'self',
                condition: {
                    type: 'elementMatch',
                    value: 'lightning'
                }
            }
        }
    ]),
    createCard('loki', 'Loki', [7, 8, 8, 9], 'fire', 'The Trickster God', 'legendary', [
        {
            id: 'trickster-swap',
            name: "Trickster's Swap",
            description: 'When played, can swap positions with any card on the board',
            triggerType: 'onPlay',
            effect: {
                type: 'swap',
                target: 'all'
            }
        }
    ]),
    createCard('freya', 'Freya', [8, 7, 8, 7], 'none', 'Goddess of Love and War', 'legendary', [
        {
            id: 'valkyrie-blessing',
            name: "Valkyrie's Blessing",
            description: 'Adjacent legendary cards gain +1 to all stats',
            triggerType: 'passive',
            effect: {
                type: 'statBoost',
                value: 1,
                target: 'adjacent',
                condition: {
                    type: 'rarityMatch',
                    value: 'legendary'
                }
            }
        }
    ]),
    createCard('tyr', 'Tyr', [8, 8, 7, 7], 'none', 'God of War and Justice', 'legendary'),
    createCard('heimdall', 'Heimdall', [7, 7, 8, 8], 'lightning', 'Guardian of the Bifrost', 'legendary'),
    createCard('baldur', 'Baldur', [7, 8, 7, 8], 'none', 'God of Light and Purity', 'legendary'),
    createCard('frigg', 'Frigg', [8, 7, 7, 8], 'none', 'Queen of Asgard', 'legendary'),
];

// Lesser Gods and Vanir (Epic)
const lesserGods: Card[] = [
    createCard('njord', 'Njörð', [7, 6, 7, 8], 'ice', 'God of the Sea and Winds', 'epic'),
    createCard('freyr', 'Freyr', [7, 8, 6, 7], 'none', 'God of Fertility and Summer', 'epic'),
    createCard('idun', 'Iðunn', [6, 7, 7, 8], 'none', 'Goddess of Youth', 'epic'),
    createCard('bragi', 'Bragi', [6, 8, 7, 7], 'none', 'God of Poetry', 'epic'),
    createCard('forseti', 'Forseti', [7, 7, 7, 7], 'none', 'God of Justice and Reconciliation', 'epic'),
    createCard('ullr', 'Ullr', [8, 6, 7, 7], 'ice', 'God of Winter and Archery', 'epic'),
    createCard('skadi', 'Skaði', [7, 7, 8, 6], 'ice', 'Goddess of Winter and Mountains', 'epic'),
];

// Major Creatures (Epic)
const majorCreatures: Card[] = [
    createCard('fenrir', 'Fenrir', [8, 7, 6, 7], 'ice', 'The Great Wolf', 'epic'),
    createCard('jormungandr', 'Jörmungandr', [6, 8, 7, 7], 'ice', 'The World Serpent', 'epic'),
    createCard('nidhogg', 'Níðhöggr', [7, 7, 8, 6], 'fire', 'The Dragon of Yggdrasil', 'epic'),
    createCard('sleipnir', 'Sleipnir', [7, 8, 7, 6], 'none', 'Odin\'s Eight-legged Horse', 'epic'),
    createCard('ratatosk', 'Ratatösk', [6, 6, 8, 8], 'none', 'The Messenger Squirrel', 'epic'),
    createCard('garmr', 'Garmr', [7, 7, 7, 7], 'fire', 'The Blood-stained Guardian', 'epic'),
];

// Giants (Epic/Rare)
const giants: Card[] = [
    createCard('surtr', 'Surtr', [8, 8, 6, 6], 'fire', 'The Fire Giant King', 'epic'),
    createCard('ymir', 'Ymir', [7, 7, 7, 7], 'ice', 'The First Frost Giant', 'epic'),
    createCard('thrym', 'Thrym', [6, 8, 7, 7], 'ice', 'King of the Frost Giants', 'rare'),
    createCard('utgard-loki', 'Útgarða-Loki', [7, 6, 7, 8], 'none', 'The Illusionist Giant', 'rare'),
    createCard('hrungnir', 'Hrungnir', [8, 6, 6, 8], 'none', 'The Stone Giant', 'rare'),
    createCard('thiazi', 'Þjazi', [7, 7, 6, 8], 'ice', 'The Giant Who Stole Iðunn', 'rare'),
];

// Valkyries (Rare)
const valkyries: Card[] = [
    createCard('brunhild', 'Brynhildr', [7, 6, 7, 8], 'lightning', 'The Legendary Valkyrie', 'rare'),
    createCard('sigrdriva', 'Sigrdrífa', [6, 8, 7, 7], 'lightning', 'The Victory-Giver', 'rare'),
    createCard('gondul', 'Göndul', [7, 7, 8, 6], 'lightning', 'The Wand-Wielder', 'rare'),
    createCard('hildr', 'Hildr', [8, 6, 7, 7], 'lightning', 'The Battle-Maiden', 'rare'),
];

// Heroes and Warriors (Rare/Common)
const heroes: Card[] = [
    createCard('sigurd', 'Sigurd', [7, 7, 6, 8], 'none', 'The Dragon-Slayer', 'rare'),
    createCard('beowulf', 'Beowulf', [8, 6, 7, 7], 'none', 'Slayer of Grendel', 'rare'),
    createCard('erik', 'Erik the Red', [6, 7, 8, 7], 'none', 'Founder of Greenland', 'rare'),
    createCard('leif', 'Leif Erikson', [7, 7, 7, 7], 'none', 'The Lucky Explorer', 'rare'),
    createCard('ivar', 'Ivar the Boneless', [7, 8, 6, 7], 'none', 'The Cunning Viking', 'common'),
    createCard('bjorn', 'Björn Ironside', [8, 6, 7, 7], 'none', 'The Legendary King', 'common'),
];

// Magical Items and Artifacts (Rare)
const artifacts: Card[] = [
    createCard('mjolnir', 'Mjölnir', [8, 6, 8, 6], 'lightning', 'Thor\'s Hammer', 'rare'),
    createCard('gungnir', 'Gungnir', [6, 8, 6, 8], 'lightning', 'Odin\'s Spear', 'rare'),
    createCard('gleipnir', 'Gleipnir', [7, 7, 7, 7], 'none', 'The Binding of Fenrir', 'rare'),
    createCard('draupnir', 'Draupnir', [6, 8, 8, 6], 'none', 'Odin\'s Ring', 'rare'),
    createCard('brisingamen', 'Brísingamen', [8, 6, 6, 8], 'fire', 'Freya\'s Necklace', 'rare'),
];

// Locations (Common)
const locations: Card[] = [
    createCard('yggdrasil', 'Yggdrasil', [6, 6, 6, 6], 'none', 'The World Tree', 'common'),
    createCard('asgard', 'Asgard', [7, 5, 7, 5], 'none', 'Realm of the Æsir', 'common'),
    createCard('vanaheim', 'Vanaheim', [5, 7, 5, 7], 'none', 'Realm of the Vanir', 'common'),
    createCard('jotunheim', 'Jötunheim', [6, 6, 7, 5], 'ice', 'Realm of the Giants', 'common'),
    createCard('niflheim', 'Niflheim', [5, 6, 6, 7], 'ice', 'The Primordial World of Ice', 'common'),
    createCard('muspelheim', 'Muspelheim', [7, 5, 6, 6], 'fire', 'The Primordial World of Fire', 'common'),
];

// Basic Units (Common)
const basicUnits: Card[] = [
    createCard('viking-warrior', 'Viking Warrior', [5, 5, 5, 5], 'none', 'Fearless Norse Warrior', 'common'),
    createCard('berserker', 'Berserker', [6, 4, 6, 4], 'none', 'Fierce Viking Warrior', 'common'),
    createCard('shield-maiden', 'Shield Maiden', [4, 6, 4, 6], 'none', 'Warrior Woman of the North', 'common'),
    createCard('draugr', 'Draugr', [5, 6, 5, 4], 'ice', 'Undead Viking Warrior', 'common'),
    createCard('einherjar', 'Einherjar', [6, 5, 4, 5], 'none', 'Warrior of Valhalla', 'common'),
];

// Light Elves (Epic/Rare)
const lightElves: Card[] = [
    createCard('freyr-king', 'Freyr the Alfar King', [8, 7, 8, 7], 'lightning', 'Ruler of Alfheim', 'epic'),
    createCard('light-elf-archer', 'Light Elf Archer', [6, 8, 6, 6], 'lightning', 'Master of the Luminous Bow', 'rare'),
    createCard('alfheim-mystic', 'Alfheim Mystic', [6, 6, 8, 6], 'lightning', 'Wielder of Light Magic', 'rare'),
    createCard('light-elf-scout', 'Light Elf Scout', [7, 6, 6, 7], 'lightning', 'Swift Explorer of Alfheim', 'rare'),
    createCard('alfheim-warrior', 'Light Elf Warrior', [7, 7, 6, 6], 'lightning', 'Defender of the Light Realm', 'rare'),
];

// Dwarves (Epic/Rare)
const dwarves: Card[] = [
    createCard('eitri', 'Eitri', [7, 8, 7, 8], 'fire', 'Master Craftsman of Nidavellir', 'epic'),
    createCard('brokkr', 'Brokkr', [8, 7, 8, 7], 'fire', 'Forger of Mjolnir', 'epic'),
    createCard('dwarf-smith', 'Dwarven Smith', [6, 7, 7, 6], 'fire', 'Creator of Magical Artifacts', 'rare'),
    createCard('dwarf-warrior', 'Dwarven Warrior', [7, 6, 7, 6], 'none', 'Guardian of the Underground Forges', 'rare'),
    createCard('dwarf-runemaster', 'Dwarven Runemaster', [6, 6, 8, 6], 'none', 'Master of Ancient Runes', 'rare'),
];

// Dark Elves (Epic/Rare)
const darkElves: Card[] = [
    createCard('malekith', 'Malekith', [8, 7, 7, 8], 'ice', 'Lord of the Dark Elves', 'epic'),
    createCard('dark-elf-assassin', 'Dark Elf Assassin', [7, 8, 6, 7], 'ice', 'Silent Killer from Svartalfheim', 'rare'),
    createCard('shadow-weaver', 'Shadow Weaver', [6, 7, 8, 7], 'ice', 'Master of Dark Magic', 'rare'),
    createCard('dark-elf-ranger', 'Dark Elf Ranger', [7, 7, 7, 7], 'ice', 'Hunter in the Darkness', 'rare'),
];

// Creatures of Helheim (Epic/Rare)
const helheimCreatures: Card[] = [
    createCard('hel', 'Hel', [8, 8, 8, 6], 'ice', 'Goddess of Death', 'epic'),
    createCard('garm', 'Garm', [7, 8, 7, 8], 'ice', 'Guardian of Helheim', 'epic'),
    createCard('draugr-lord', 'Draugr Lord', [7, 7, 7, 7], 'ice', 'Ruler of the Undead', 'rare'),
    createCard('hel-warrior', 'Warrior of Hel', [6, 7, 7, 6], 'ice', 'Undead Champion', 'rare'),
    createCard('ghost-viking', 'Ghost Viking', [6, 6, 7, 7], 'ice', 'Spirit of a Fallen Warrior', 'rare'),
];

// Additional Creatures and Monsters
const additionalCreatures: Card[] = [
    createCard('gullinkambi', 'Gullinkambi', [6, 7, 7, 6], 'fire', 'The Golden Rooster', 'rare'),
    createCard('hraesvelgr', 'Hræsvelgr', [7, 8, 6, 7], 'ice', 'The Corpse Swallower Eagle', 'epic'),
    createCard('vedrfolnir', 'Veðrfölnir', [7, 6, 8, 7], 'lightning', 'The Weather Hawk', 'rare'),
    createCard('audhumbla', 'Auðumbla', [6, 6, 8, 8], 'ice', 'The Primordial Cow', 'epic'),
    createCard('huginn', 'Huginn', [6, 7, 6, 7], 'none', 'Odin\'s Raven of Thought', 'rare'),
    createCard('muninn', 'Muninn', [7, 6, 7, 6], 'none', 'Odin\'s Raven of Memory', 'rare'),
];

// Additional Artifacts and Magical Items
const additionalArtifacts: Card[] = [
    createCard('gram', 'Gram', [7, 8, 6, 7], 'none', 'Sigurd\'s Dragon-Slaying Sword', 'epic'),
    createCard('hofund', 'Hofund', [6, 7, 7, 8], 'none', 'Heimdall\'s Sword', 'rare'),
    createCard('megingjord', 'Megingjörð', [7, 7, 7, 7], 'none', 'Thor\'s Belt of Power', 'rare'),
    createCard('andvaranaut', 'Andvaranaut', [6, 8, 6, 8], 'fire', 'The Cursed Ring', 'epic'),
    createCard('odroerir', 'Óðrœrir', [8, 6, 8, 6], 'none', 'The Mead of Poetry', 'epic'),
];

// Additional Locations
const additionalLocations: Card[] = [
    createCard('bifrost', 'Bifröst', [6, 7, 6, 7], 'lightning', 'The Rainbow Bridge', 'rare'),
    createCard('valhalla', 'Valhalla', [7, 7, 7, 7], 'none', 'Hall of the Slain', 'epic'),
    createCard('folkvangr', 'Fólkvangr', [7, 6, 7, 6], 'none', 'Freya\'s Hall', 'rare'),
    createCard('gimli', 'Gimlé', [8, 6, 8, 6], 'fire', 'The Hall of Gold', 'epic'),
    createCard('hvergelmir', 'Hvergelmir', [6, 8, 6, 8], 'ice', 'The Bubbling Cauldron', 'rare'),
];

// Add new cards for Eir, Gullveig, Gullinbursti, Mimir, Gerdr
const newGodsAndCreatures: Card[] = [
    createCard('eir', 'Eir', [6, 8, 7, 7], 'none', 'Goddess of Healing', 'epic'),
    createCard('gullveig', 'Gullveig', [7, 7, 8, 6], 'fire', 'Witch of the Vanir, master of seidr magic', 'epic'),
    createCard('gullinbursti', 'Gullinbursti', [7, 6, 7, 8], 'none', 'The Golden Boar, Freyr\'s magical mount', 'rare'),
    createCard('mimir', 'Mimir', [7, 8, 6, 7], 'none', 'The wise guardian of Mímisbrunnr', 'epic'),
    createCard('gerdr', 'Gerdr', [6, 7, 8, 7], 'none', 'Giantess, wife of Freyr', 'rare'),
];

// New batch gods/creatures
const newBatchCards: Card[] = [
    createCard('nanna', 'Nanna', [7, 7, 7, 7], 'none', 'Goddess of joy and peace', 'epic'),
    createCard('fjolnir', 'Fjolnir', [7, 8, 7, 6], 'none', 'Legendary king, son of Freyr', 'epic'),
    createCard('hodr', 'Höðr', [6, 7, 8, 7], 'none', 'Blind god, brother of Baldr', 'epic'),
    createCard('syn', 'Syn', [7, 6, 7, 8], 'none', 'Goddess of vigilance and denial', 'epic'),
    createCard('huldra', 'Huldra', [6, 8, 7, 7], 'none', 'Forest spirit of Norse folklore', 'epic'),
    createCard('volva', 'Völva', [7, 7, 8, 6], 'none', 'Seeress and practitioner of seidr', 'epic'),
    createCard('mare', 'Mare', [6, 7, 6, 8], 'none', 'Nightmare-bringer of Norse myth', 'epic'),
    createCard('vidar', 'Víðarr', [8, 7, 8, 7], 'none', 'God of vengeance and silence', 'epic'),
];

// Combine all cards
export const cards: Card[] = [
    ...majorGods,
    ...lesserGods,
    ...majorCreatures,
    ...giants,
    ...valkyries,
    ...heroes,
    ...artifacts,
    ...locations,
    ...basicUnits,
    ...lightElves,
    ...dwarves,
    ...darkElves,
    ...helheimCreatures,
    ...additionalCreatures,
    ...additionalArtifacts,
    ...additionalLocations,
    ...newGodsAndCreatures,
    ...newBatchCards,
]; 