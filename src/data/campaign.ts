import { Quest, Opponent } from '../services/campaignService';
import { cards } from './cards';
import { GameRules } from '../types/game';

// Helper function to create opponents
const createOpponent = (
    id: string,
    name: string,
    description: string,
    difficulty: 'easy' | 'medium' | 'hard' | 'boss',
    deck: string[],
    aiStrategy: {
        aggressiveness: number;
        preferredElements?: ('fire' | 'ice' | 'lightning' | 'none')[];
        ragnarokStrategy?: 'aggressive' | 'defensive' | 'balanced';
    }
): Opponent => ({
    id,
    name,
    description,
    difficulty,
    deck: deck.map(cardId => cards.find(c => c.id === cardId)!),
    aiStrategy
});

// Helper function to create quests
const createQuest = (
    id: string,
    name: string,
    description: string,
    location: string,
    opponent: Opponent,
    rewards: {
        cardIds?: string[];
        specialAbilities?: string[];
        items?: string[];
        experience: number;
        unlocks?: string[];
    },
    requirements: {
        playerLevel?: number;
        requiredCards?: string[];
        completedQuests?: string[];
        specialConditions?: string[];
    },
    specialRules: GameRules
): Quest => ({
    id,
    name,
    description,
    location,
    opponent,
    rewards: {
        ...rewards,
        cards: rewards.cardIds?.map(id => cards.find(c => c.id === id)!)
    },
    requirements,
    specialRules
});

export const campaignStory = {
    prologue: `In the time of legends, when the Nine Realms were connected by Yggdrasil, 
    a new form of combat emerged - one that channeled the power of gods, creatures, and heroes 
    into mystical cards. As a young warrior seeking glory, you must master this art and travel 
    through the realms, gathering allies and power to prevent Ragnarök.`,

    chapters: {
        midgard: {
            title: "Chapter 1: Rise of the Card Master",
            description: `Your journey begins in Midgard, where you must prove yourself worthy 
            of traveling the realms. Learn the ancient art of card combat from seasoned warriors 
            and earn your first legendary cards.`
        },
        asgard: {
            title: "Chapter 2: The Halls of the Gods",
            description: `Having proven your worth, you are granted access to Asgard. Here, 
            among the Æsir, you must demonstrate your skills and earn their respect - and 
            perhaps their powers.`
        },
        vanaheim: {
            title: "Chapter 3: Mysteries of the Vanir",
            description: `The Vanir, masters of seiðr magic, hold secrets that could help 
            prevent Ragnarök. Journey through their mystical realm and learn their ancient arts.`
        },
        alfheim: {
            title: "Chapter 4: Light of the Light Elves",
            description: `In the realm of the Light Elves, new challenges await. Master the 
            element of light and earn the allegiance of these graceful beings.`
        },
        nidavellir: {
            title: "Chapter 5: Forges of the Dwarves",
            description: `Deep in the dwarven realm, legendary artifacts await. Prove your worth 
            to the master craftsmen and they might forge special cards just for you.`
        },
        jotunheim: {
            title: "Chapter 6: Land of Giants",
            description: `Face the mighty giants in their own realm. Here, every victory brings 
            you closer to understanding the true nature of Ragnarök.`
        },
        niflheim: {
            title: "Chapter 7: The Primordial Ice",
            description: `In the realm of primordial ice, ancient powers slumber. Master the 
            ice element and uncover the first signs of the coming Ragnarök.`
        },
        muspelheim: {
            title: "Chapter 8: The Fires of Destiny",
            description: `Journey through the realm of fire, where Surtr prepares for Ragnarök. 
            Master the fire element and gather the strength for the final battles ahead.`
        },
        helheim: {
            title: "Chapter 9: Shadows of the Dead",
            description: `In Hel's domain, face the spirits of the dead and master the most 
            forbidden cards. The final pieces of the Ragnarök prophecy await.`
        },
        finale: {
            title: "Chapter 10: Ragnarök Rising",
            description: `Return to Asgard for the final confrontation. Use all you've learned 
            and the cards you've gathered to prevent - or perhaps guide - the coming of Ragnarök.`
        }
    }
};

// Starting deck options
export const starterDecks = {
    warrior: {
        name: "Warrior's Path",
        description: "Focus on direct combat and strength",
        cards: ['viking-warrior', 'berserker', 'shield-maiden', 'einherjar', 'tyr']
    },
    mystic: {
        name: "Mystic's Way",
        description: "Harness elemental powers",
        cards: ['draugr', 'viking-warrior', 'shield-maiden', 'muspelheim', 'niflheim']
    },
    strategist: {
        name: "Strategist's Mind",
        description: "Utilize tactical advantages",
        cards: ['shield-maiden', 'viking-warrior', 'yggdrasil', 'asgard', 'vanaheim']
    }
};

// Define the actual quests for each realm
export const midgardQuests = [
    createQuest(
        'training-grounds',
        'The Art of Combat',
        'Learn the basics of card combat from a veteran shield-maiden.',
        'midgard',
        createOpponent(
            'shield-trainer',
            'Astrid the Shield-Maiden',
            'A patient but demanding teacher',
            'easy',
            ['shield-maiden', 'viking-warrior', 'viking-warrior', 'berserker', 'einherjar'],
            { aggressiveness: 0.3 }
        ),
        {
            cardIds: ['shield-maiden'],
            experience: 100,
            unlocks: ['village-defense']
        },
        { playerLevel: 1 },
        { same: false, plus: false, elements: false, ragnarok: false }
    ),
    createQuest(
        'village-defense',
        'Defend the Village',
        'Put your training to the test against raiders threatening the village.',
        'midgard',
        createOpponent(
            'raider-chief',
            'Bjorn the Raider',
            'A fierce but unrefined opponent',
            'easy',
            ['berserker', 'viking-warrior', 'viking-warrior', 'draugr', 'draugr'],
            { aggressiveness: 0.7 }
        ),
        {
            cardIds: ['berserker'],
            experience: 150,
            unlocks: ['elemental-wisdom']
        },
        { 
            playerLevel: 2,
            completedQuests: ['training-grounds']
        },
        { same: true, plus: false, elements: false, ragnarok: false }
    ),
    createQuest(
        'elemental-wisdom',
        'The Elements Awaken',
        'A wandering mystic teaches you about elemental affinities.',
        'midgard',
        createOpponent(
            'mystic-teacher',
            'Grida the Wise',
            'A mysterious woman with knowledge of the elements',
            'medium',
            ['muspelheim', 'niflheim', 'light-elf-archer', 'alfheim-mystic', 'draugr'],
            { 
                aggressiveness: 0.4,
                preferredElements: ['fire', 'ice']
            }
        ),
        {
            cardIds: ['muspelheim', 'niflheim'],
            experience: 200,
            unlocks: ['coastal-challenge']
        },
        {
            playerLevel: 3,
            completedQuests: ['village-defense']
        },
        { same: true, plus: false, elements: true, ragnarok: false }
    ),
    createQuest(
        'coastal-challenge',
        'Raiders of the Storm',
        'Face a powerful raiding party using your newfound elemental knowledge.',
        'midgard',
        createOpponent(
            'storm-raider',
            'Erik Stormborn',
            'A raider who harnesses the power of lightning',
            'medium',
            ['thor', 'viking-warrior', 'berserker', 'shield-maiden', 'huginn'],
            {
                aggressiveness: 0.6,
                preferredElements: ['lightning']
            }
        ),
        {
            cardIds: ['huginn'],
            experience: 250,
            unlocks: ['the-calling']
        },
        {
            playerLevel: 4,
            completedQuests: ['elemental-wisdom'],
            requiredCards: ['muspelheim', 'niflheim']
        },
        { same: true, plus: true, elements: true, ragnarok: false }
    ),
    createQuest(
        'the-calling',
        'The Call of the Gods',
        'Prove yourself worthy of ascending to Asgard.',
        'midgard',
        createOpponent(
            'valkyrie-judge',
            'Sigrdrífa the Valkyrie',
            'A valkyrie testing your worth',
            'hard',
            ['sigrdriva', 'einherjar', 'valhalla', 'odroerir', 'gungnir'],
            {
                aggressiveness: 0.5,
                preferredElements: ['lightning'],
                ragnarokStrategy: 'balanced'
            }
        ),
        {
            cardIds: ['bifrost'],
            experience: 300,
            unlocks: ['asgard-arrival']
        },
        {
            playerLevel: 5,
            completedQuests: ['coastal-challenge'],
            specialConditions: ['win_with_elemental_combo']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    )
];

// Define quest chains for other realms
export const asgardQuests = [
    // First quest in Asgard
    createQuest(
        'asgard-arrival',
        'Welcome to the Realm Eternal',
        'Your first steps in Asgard lead you to the training grounds of the Einherjar.',
        'asgard',
        createOpponent(
            'einherjar-captain',
            'Captain of the Einherjar',
            'A seasoned warrior of Valhalla',
            'medium',
            ['einherjar', 'einherjar', 'valhalla', 'odin', 'gungnir'],
            {
                aggressiveness: 0.5,
                preferredElements: ['lightning'],
                ragnarokStrategy: 'defensive'
            }
        ),
        {
            cardIds: ['einherjar', 'valhalla'],
            experience: 350,
            unlocks: ['thor-challenge']
        },
        {
            playerLevel: 6,
            completedQuests: ['the-calling']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    )
];

export const vanaheimQuests = [
    createQuest(
        'vanaheim-arrival',
        'The Realm of Magic',
        'Enter Vanaheim, where the Vanir gods teach you the secrets of seiðr magic.',
        'vanaheim',
        createOpponent(
            'vanir-apprentice',
            'Seiðr Apprentice',
            'A young practitioner of Vanir magic',
            'medium',
            ['freyr', 'freya', 'vanaheim', 'light-elf-archer', 'alfheim-mystic'],
            {
                aggressiveness: 0.4,
                preferredElements: ['fire', 'ice'],
                ragnarokStrategy: 'defensive'
            }
        ),
        {
            cardIds: ['vanaheim'],
            experience: 400,
            unlocks: ['freyrs-blessing']
        },
        {
            playerLevel: 7,
            completedQuests: ['asgard-arrival']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'freyrs-blessing',
        'Blessing of Fertility',
        'Prove your worth to Freyr by mastering the power of growth and abundance.',
        'vanaheim',
        createOpponent(
            'freyr-champion',
            'Champion of Freyr',
            'A warrior blessed by the god of fertility',
            'medium',
            ['freyr', 'light-elf-archer', 'alfheim-mystic', 'yggdrasil', 'audhumbla'],
            {
                aggressiveness: 0.5,
                preferredElements: ['none'],
                ragnarokStrategy: 'balanced'
            }
        ),
        {
            cardIds: ['freyr', 'audhumbla'],
            experience: 450,
            unlocks: ['freyjas-magic']
        },
        {
            playerLevel: 8,
            completedQuests: ['vanaheim-arrival'],
            specialConditions: ['win_without_fire']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'freyjas-magic',
        'Secrets of Seiðr',
        'Learn the art of seiðr magic from Freyja herself.',
        'vanaheim',
        createOpponent(
            'freya',
            'Freyja',
            'The powerful Vanir goddess of magic',
            'hard',
            ['freya', 'brisingamen', 'folkvangr', 'valkyrie-blessing', 'light-elf-archer'],
            {
                aggressiveness: 0.6,
                preferredElements: ['fire', 'lightning'],
                ragnarokStrategy: 'aggressive'
            }
        ),
        {
            cardIds: ['freya', 'brisingamen'],
            experience: 500,
            unlocks: ['njords-test']
        },
        {
            playerLevel: 9,
            completedQuests: ['freyrs-blessing'],
            requiredCards: ['freyr']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'njords-test',
        'Trial of the Sea',
        'Face Njörðr's challenge to master the powers of wind and waves.',
        'vanaheim',
        createOpponent(
            'njord',
            'Njörðr',
            'God of the Sea and Winds',
            'hard',
            ['njord', 'aegir', 'ran', 'jormungandr', 'hraesvelgr'],
            {
                aggressiveness: 0.7,
                preferredElements: ['ice'],
                ragnarokStrategy: 'defensive'
            }
        ),
        {
            cardIds: ['njord', 'aegir'],
            experience: 550,
            unlocks: ['vanir-mastery']
        },
        {
            playerLevel: 10,
            completedQuests: ['freyjas-magic'],
            specialConditions: ['survive_three_elements']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'vanir-mastery',
        'Master of Vanaheim',
        'Prove your mastery of Vanir magic in a final challenge.',
        'vanaheim',
        createOpponent(
            'vanir-council',
            'The Vanir Council',
            'The combined might of the Vanir gods',
            'boss',
            ['freya', 'freyr', 'njord', 'brisingamen', 'folkvangr'],
            {
                aggressiveness: 0.8,
                preferredElements: ['fire', 'ice', 'lightning'],
                ragnarokStrategy: 'aggressive'
            }
        ),
        {
            cardIds: ['folkvangr', 'odroerir'],
            experience: 600,
            unlocks: ['alfheim-gate']
        },
        {
            playerLevel: 11,
            completedQuests: ['njords-test'],
            requiredCards: ['freya', 'freyr', 'njord'],
            specialConditions: ['win_with_vanir_combo']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    )
];

// Add new cards for Vanaheim
const newVanirCards = [
    createCard('aegir', 'Ægir', [7, 7, 8, 6], 'ice', 'God of the Ocean', 'epic', [
        {
            id: 'ocean-mastery',
            name: 'Ocean Mastery',
            description: 'Adjacent ice element cards gain +1 to all stats',
            triggerType: 'passive',
            effect: {
                type: 'statBoost',
                value: 1,
                target: 'adjacent',
                condition: {
                    type: 'elementMatch',
                    value: 'ice'
                }
            }
        }
    ]),
    createCard('ran', 'Rán', [6, 8, 7, 7], 'ice', 'Goddess of the Drowned', 'epic', [
        {
            id: 'drowning-pull',
            name: 'Drowning Pull',
            description: 'When capturing a card, has a chance to capture adjacent cards',
            triggerType: 'onCapture',
            effect: {
                type: 'copy',
                target: 'adjacent'
            }
        }
    ])
];

// Update the cards array with new additions
export const cards = [
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
    ...newVanirCards
];

export const alfheimQuests = [
    createQuest(
        'alfheim-arrival',
        'Light of the Elves',
        'Enter the ethereal realm of Alfheim and seek the wisdom of the Light Elves.',
        'alfheim',
        createOpponent(
            'light-elf-scout',
            'Alviss the Scout',
            'A graceful Light Elf archer',
            'medium',
            ['light-elf-archer', 'alfheim-mystic', 'light-elf-archer', 'alfheim', 'yggdrasil'],
            {
                aggressiveness: 0.4,
                preferredElements: ['lightning'],
                ragnarokStrategy: 'defensive'
            }
        ),
        {
            cardIds: ['light-elf-archer', 'alfheim'],
            experience: 650,
            unlocks: ['elven-archery']
        },
        {
            playerLevel: 12,
            completedQuests: ['vanir-mastery']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'elven-archery',
        'The Art of the Bow',
        'Learn the ancient elven art of archery and its application in card combat.',
        'alfheim',
        createOpponent(
            'master-archer',
            'Alruna the Bowmaster',
            'An elite elven archer',
            'hard',
            ['light-elf-archer', 'light-elf-archer', 'alfheim-mystic', 'freya', 'brisingamen'],
            {
                aggressiveness: 0.6,
                preferredElements: ['lightning'],
                ragnarokStrategy: 'aggressive'
            }
        ),
        {
            cardIds: ['alfheim-mystic'],
            experience: 700,
            unlocks: ['mystic-training']
        },
        {
            playerLevel: 13,
            completedQuests: ['alfheim-arrival'],
            specialConditions: ['win_with_ranged_combo']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'mystic-training',
        'Secrets of Light Magic',
        'Study the mystical arts of light with the elven sages.',
        'alfheim',
        createOpponent(
            'elven-sage',
            'Lysander the Sage',
            'A wise elven mystic',
            'hard',
            ['alfheim-mystic', 'alfheim-mystic', 'light-elf-archer', 'freya', 'odroerir'],
            {
                aggressiveness: 0.5,
                preferredElements: ['lightning', 'ice'],
                ragnarokStrategy: 'balanced'
            }
        ),
        {
            cardIds: ['elven-blessing', 'light-crystal'],
            experience: 750,
            unlocks: ['dark-warning']
        },
        {
            playerLevel: 14,
            completedQuests: ['elven-archery'],
            specialConditions: ['cast_three_spells']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'dark-warning',
        'Shadows in the Light',
        'Investigate disturbing reports of dark elf activity in Alfheim.',
        'alfheim',
        createOpponent(
            'dark-scout',
            'Svartulf the Infiltrator',
            'A dark elf spy',
            'hard',
            ['dark-elf-assassin', 'dark-elf-warlock', 'svartalfheim', 'cursed-blade', 'shadow-magic'],
            {
                aggressiveness: 0.8,
                preferredElements: ['fire'],
                ragnarokStrategy: 'aggressive'
            }
        ),
        {
            cardIds: ['light-barrier', 'elven-scout'],
            experience: 800,
            unlocks: ['light-dark-balance']
        },
        {
            playerLevel: 15,
            completedQuests: ['mystic-training'],
            specialConditions: ['survive_darkness']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'light-dark-balance',
        'Balance of Light and Shadow',
        'Master both light and shadow to achieve true understanding.',
        'alfheim',
        createOpponent(
            'elder-council',
            'The Elven Council',
            'The wisest of the Light Elves',
            'boss',
            ['alfheim-mystic', 'light-elf-archer', 'freya', 'elven-blessing', 'light-crystal'],
            {
                aggressiveness: 0.6,
                preferredElements: ['lightning', 'ice'],
                ragnarokStrategy: 'balanced'
            }
        ),
        {
            cardIds: ['elder-mystic', 'crown-of-light'],
            experience: 850,
            unlocks: ['nidavellir-entrance']
        },
        {
            playerLevel: 16,
            completedQuests: ['dark-warning'],
            specialConditions: ['use_light_and_dark']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    )
];

export const jotunheimQuests = [
    createQuest(
        'giant-lands',
        'Into the Land of Giants',
        'Venture into the harsh realm of Jötunheim.',
        'jotunheim',
        createOpponent(
            'frost-giant',
            'Hrímgrimnir the Frost Giant',
            'A towering frost giant',
            'hard',
            ['frost-giant', 'ice-wolf', 'niflheim', 'frozen-heart', 'winter-fury'],
            {
                aggressiveness: 0.7,
                preferredElements: ['ice'],
                ragnarokStrategy: 'aggressive'
            }
        ),
        {
            cardIds: ['frost-giant', 'ice-wolf'],
            experience: 900,
            unlocks: ['giant-strength']
        },
        {
            playerLevel: 17,
            completedQuests: ['thor-challenge']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'giant-strength',
        'Trial of Might',
        'Prove your strength in contests against the giants.',
        'jotunheim',
        createOpponent(
            'giant-champion',
            'Thrymr the Strong',
            'Champion of the frost giants',
            'hard',
            ['frost-giant', 'frost-giant', 'winter-fury', 'frozen-heart', 'ice-wolf'],
            {
                aggressiveness: 0.8,
                preferredElements: ['ice'],
                ragnarokStrategy: 'aggressive'
            }
        ),
        {
            cardIds: ['winter-fury', 'frozen-heart'],
            experience: 950,
            unlocks: ['ancient-knowledge']
        },
        {
            playerLevel: 18,
            completedQuests: ['giant-lands'],
            specialConditions: ['win_by_strength']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'ancient-knowledge',
        'Wisdom of the Ancients',
        'Learn the ancient lore of the giants and their connection to Yggdrasil',
        'jotunheim',
        createOpponent(
            'giant-elder',
            'Vafþrúðnir the Wise',
            'An ancient giant sage',
            'hard',
            ['frost-giant', 'winter-fury', 'yggdrasil', 'ancient-runes', 'ice-magic'],
            {
                aggressiveness: 0.5,
                preferredElements: ['ice'],
                ragnarokStrategy: 'balanced'
            }
        ),
        {
            cardIds: ['ancient-runes', 'ice-magic'],
            experience: 1000,
            unlocks: ['frost-giant-pact']
        },
        {
            playerLevel: 19,
            completedQuests: ['giant-strength'],
            specialConditions: ['learn_three_secrets']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'frost-giant-pact',
        'The Giant\'s Accord',
        'Forge an alliance with the frost giants to gain their support.',
        'jotunheim',
        createOpponent(
            'giant-king',
            'Þrymr the Giant King',
            'King of the Frost Giants',
            'boss',
            ['frost-giant', 'frost-giant', 'winter-fury', 'ancient-runes', 'crown-of-frost'],
            {
                aggressiveness: 0.9,
                preferredElements: ['ice'],
                ragnarokStrategy: 'aggressive'
            }
        ),
        {
            cardIds: ['crown-of-frost', 'giant-pact'],
            experience: 1100,
            unlocks: ['niflheim-gate']
        },
        {
            playerLevel: 20,
            completedQuests: ['ancient-knowledge'],
            specialConditions: ['win_with_ice_mastery']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    )
];

export const nidavellirQuests = [
    createQuest(
        'nidavellir-entrance',
        'The Dwarven Halls',
        'Enter the underground realm of Nidavellir and seek the master craftsmen.',
        'nidavellir',
        createOpponent(
            'dwarf-guard',
            'Mótsognir the Guard',
            'A stalwart dwarven guardian',
            'medium',
            ['dwarf-warrior', 'dwarf-smith', 'forge-hammer', 'rune-axe', 'dwarven-shield'],
            {
                aggressiveness: 0.6,
                preferredElements: ['fire'],
                ragnarokStrategy: 'defensive'
            }
        ),
        {
            cardIds: ['dwarf-warrior', 'dwarven-shield'],
            experience: 950,
            unlocks: ['master-smith']
        },
        {
            playerLevel: 18,
            completedQuests: ['light-dark-balance']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'master-smith',
        'The Art of the Forge',
        'Learn the secrets of dwarven craftsmanship.',
        'nidavellir',
        createOpponent(
            'master-craftsman',
            'Sindri the Smith',
            'A legendary dwarven craftsman',
            'hard',
            ['dwarf-smith', 'dwarf-smith', 'forge-hammer', 'mythril-armor', 'enchanted-anvil'],
            {
                aggressiveness: 0.5,
                preferredElements: ['fire'],
                ragnarokStrategy: 'balanced'
            }
        ),
        {
            cardIds: ['forge-hammer', 'mythril-armor'],
            experience: 1000,
            unlocks: ['enchanted-forge']
        },
        {
            playerLevel: 19,
            completedQuests: ['nidavellir-entrance'],
            specialConditions: ['craft_artifact']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'enchanted-forge',
        'Secrets of Enchantment',
        'Master the art of imbuing cards with magical properties.',
        'nidavellir',
        createOpponent(
            'rune-master',
            'Dvalin the Enchanter',
            'A master of runic magic',
            'hard',
            ['dwarf-smith', 'rune-master', 'enchanted-anvil', 'mythril-armor', 'runic-hammer'],
            {
                aggressiveness: 0.7,
                preferredElements: ['fire', 'lightning'],
                ragnarokStrategy: 'balanced'
            }
        ),
        {
            cardIds: ['runic-hammer', 'enchanted-anvil'],
            experience: 1050,
            unlocks: ['dragon-forge']
        },
        {
            playerLevel: 20,
            completedQuests: ['master-smith'],
            specialConditions: ['enchant_weapon']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'dragon-forge',
        'The Dragon\'s Fire',
        'Harness the power of dragon fire in the legendary Dragon Forge.',
        'nidavellir',
        createOpponent(
            'forge-master',
            'Eitri the Forge Master',
            'The greatest of all dwarven smiths',
            'boss',
            ['dwarf-smith', 'rune-master', 'dragon-fire', 'mythril-armor', 'mjolnir'],
            {
                aggressiveness: 0.8,
                preferredElements: ['fire'],
                ragnarokStrategy: 'aggressive'
            }
        ),
        {
            cardIds: ['dragon-fire', 'mjolnir-fragment'],
            experience: 1100,
            unlocks: ['dark-depths']
        },
        {
            playerLevel: 21,
            completedQuests: ['enchanted-forge'],
            specialConditions: ['forge_legendary']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    )
];

export const svartalfheimQuests = [
    createQuest(
        'dark-depths',
        'Into the Dark',
        'Descend into the shadowy realm of Svartalfheim.',
        'svartalfheim',
        createOpponent(
            'dark-elf-scout',
            'Malekith the Shadow',
            'A stealthy dark elf scout',
            'hard',
            ['dark-elf-assassin', 'shadow-magic', 'cursed-blade', 'poison-dagger', 'dark-crystal'],
            {
                aggressiveness: 0.7,
                preferredElements: ['fire'],
                ragnarokStrategy: 'aggressive'
            }
        ),
        {
            cardIds: ['dark-elf-assassin', 'shadow-magic'],
            experience: 1150,
            unlocks: ['shadow-arts']
        },
        {
            playerLevel: 22,
            completedQuests: ['dragon-forge']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'shadow-arts',
        'Ways of Shadow',
        'Learn the dark arts of stealth and deception.',
        'svartalfheim',
        createOpponent(
            'shadow-master',
            'Algrim the Dark',
            'Master of shadow magic',
            'hard',
            ['dark-elf-assassin', 'shadow-magic', 'dark-crystal', 'void-portal', 'soul-drain'],
            {
                aggressiveness: 0.6,
                preferredElements: ['fire'],
                ragnarokStrategy: 'balanced'
            }
        ),
        {
            cardIds: ['void-portal', 'soul-drain'],
            experience: 1200,
            unlocks: ['dark-alliance']
        },
        {
            playerLevel: 23,
            completedQuests: ['dark-depths'],
            specialConditions: ['master_shadows']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'dark-alliance',
        'Alliance of Shadows',
        'Forge an uneasy alliance with the dark elves.',
        'svartalfheim',
        createOpponent(
            'dark-king',
            'Dökkálfr the Dark King',
            'King of the Dark Elves',
            'boss',
            ['dark-elf-assassin', 'shadow-magic', 'void-portal', 'soul-drain', 'crown-of-shadows'],
            {
                aggressiveness: 0.9,
                preferredElements: ['fire'],
                ragnarokStrategy: 'aggressive'
            }
        ),
        {
            cardIds: ['crown-of-shadows', 'dark-pact'],
            experience: 1250,
            unlocks: ['helheim-gate']
        },
        {
            playerLevel: 24,
            completedQuests: ['shadow-arts'],
            specialConditions: ['unite_shadows']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    )
];

export const muspelheimQuests = [
    createQuest(
        'fire-realm',
        'Realm of Eternal Fire',
        'Enter Muspelheim, the realm of fire and home of the fire giants.',
        'muspelheim',
        createOpponent(
            'fire-giant',
            'Surtr\'s Champion',
            'A mighty fire giant warrior',
            'hard',
            ['fire-giant', 'flame-sword', 'inferno', 'burning-rage', 'fire-giant'],
            {
                aggressiveness: 0.9,
                preferredElements: ['fire'],
                ragnarokStrategy: 'aggressive'
            }
        ),
        {
            cardIds: ['fire-giant', 'flame-sword'],
            experience: 1300,
            unlocks: ['eternal-flame']
        },
        {
            playerLevel: 25,
            completedQuests: ['niflheim-mastery']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'eternal-flame',
        'The Eternal Flame',
        'Master the power of Muspelheim\'s eternal fire.',
        'muspelheim',
        createOpponent(
            'flame-lord',
            'Eldur the Flame Lord',
            'Master of the eternal flames',
            'hard',
            ['fire-giant', 'inferno', 'eternal-flame', 'burning-rage', 'phoenix-fire'],
            {
                aggressiveness: 0.8,
                preferredElements: ['fire'],
                ragnarokStrategy: 'aggressive'
            }
        ),
        {
            cardIds: ['eternal-flame', 'phoenix-fire'],
            experience: 1350,
            unlocks: ['surtrs-challenge']
        },
        {
            playerLevel: 26,
            completedQuests: ['fire-realm'],
            specialConditions: ['master_fire']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'surtrs-challenge',
        'Surtr\'s Challenge',
        'Face Surtr, the lord of Muspelheim, in a final test of fire.',
        'muspelheim',
        createOpponent(
            'surtr',
            'Surtr the Fire Lord',
            'Lord of Muspelheim',
            'boss',
            ['surtr', 'eternal-flame', 'inferno', 'burning-rage', 'sword-of-doom'],
            {
                aggressiveness: 1.0,
                preferredElements: ['fire'],
                ragnarokStrategy: 'aggressive'
            }
        ),
        {
            cardIds: ['sword-of-doom', 'crown-of-flame'],
            experience: 1400,
            unlocks: ['ragnarok-prophecy']
        },
        {
            playerLevel: 27,
            completedQuests: ['eternal-flame'],
            specialConditions: ['survive_inferno']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    )
];

export const niflheimQuests = [
    createQuest(
        'niflheim-gate',
        'Gates of Mist',
        'Enter Niflheim, the primordial realm of ice and mist.',
        'niflheim',
        createOpponent(
            'frost-guardian',
            'Hrímthurs the Frost Guardian',
            'Ancient guardian of Niflheim',
            'hard',
            ['frost-giant', 'ice-magic', 'frozen-heart', 'winter-fury', 'mist-walker'],
            {
                aggressiveness: 0.6,
                preferredElements: ['ice'],
                ragnarokStrategy: 'defensive'
            }
        ),
        {
            cardIds: ['mist-walker', 'ice-magic'],
            experience: 1250,
            unlocks: ['primordial-ice']
        },
        {
            playerLevel: 23,
            completedQuests: ['frost-giant-pact']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'primordial-ice',
        'Heart of Winter',
        'Discover the secrets of primordial ice magic.',
        'niflheim',
        createOpponent(
            'ice-sage',
            'Ymir\'s Wisdom',
            'Ancient keeper of ice magic',
            'hard',
            ['frost-giant', 'ice-magic', 'primordial-ice', 'frozen-heart', 'winter-crown'],
            {
                aggressiveness: 0.5,
                preferredElements: ['ice'],
                ragnarokStrategy: 'balanced'
            }
        ),
        {
            cardIds: ['primordial-ice', 'winter-crown'],
            experience: 1300,
            unlocks: ['niflheim-mastery']
        },
        {
            playerLevel: 24,
            completedQuests: ['niflheim-gate'],
            specialConditions: ['master_ice']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'niflheim-mastery',
        'Mastery of Frost',
        'Prove your mastery over the powers of ice and winter.',
        'niflheim',
        createOpponent(
            'winter-lord',
            'Ymir\'s Echo',
            'Embodiment of winter\'s might',
            'boss',
            ['frost-giant', 'primordial-ice', 'winter-crown', 'frozen-heart', 'ice-throne'],
            {
                aggressiveness: 0.7,
                preferredElements: ['ice'],
                ragnarokStrategy: 'balanced'
            }
        ),
        {
            cardIds: ['ice-throne', 'winter-mastery'],
            experience: 1350,
            unlocks: ['fire-realm']
        },
        {
            playerLevel: 25,
            completedQuests: ['primordial-ice'],
            specialConditions: ['perfect_winter']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    )
];

export const helheimQuests = [
    createQuest(
        'helheim-gate',
        'Gates of the Dead',
        'Enter Helheim, the realm of the dishonored dead.',
        'helheim',
        createOpponent(
            'hel-guardian',
            'Modgud the Gatekeeper',
            'Guardian of Helheim\'s gates',
            'hard',
            ['draugr', 'hel-hound', 'soul-reaper', 'death-touch', 'gates-of-hel'],
            {
                aggressiveness: 0.7,
                preferredElements: ['ice', 'fire'],
                ragnarokStrategy: 'defensive'
            }
        ),
        {
            cardIds: ['draugr', 'hel-hound'],
            experience: 1400,
            unlocks: ['souls-path']
        },
        {
            playerLevel: 28,
            completedQuests: ['dark-alliance']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'souls-path',
        'Path of Lost Souls',
        'Navigate the treacherous paths of the dishonored dead.',
        'helheim',
        createOpponent(
            'soul-collector',
            'Nár the Soul Collector',
            'Keeper of lost souls',
            'hard',
            ['draugr', 'soul-reaper', 'death-touch', 'soul-cage', 'spirit-bind'],
            {
                aggressiveness: 0.6,
                preferredElements: ['ice'],
                ragnarokStrategy: 'balanced'
            }
        ),
        {
            cardIds: ['soul-reaper', 'spirit-bind'],
            experience: 1450,
            unlocks: ['hels-throne']
        },
        {
            playerLevel: 29,
            completedQuests: ['helheim-gate'],
            specialConditions: ['bind_souls']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'hels-throne',
        'The Queen of Death',
        'Face Hel herself in her dark domain.',
        'helheim',
        createOpponent(
            'hel',
            'Hel, Queen of the Dead',
            'Ruler of Helheim',
            'boss',
            ['hel', 'soul-reaper', 'death-touch', 'crown-of-death', 'helheim-gate'],
            {
                aggressiveness: 0.9,
                preferredElements: ['ice', 'fire'],
                ragnarokStrategy: 'aggressive'
            }
        ),
        {
            cardIds: ['crown-of-death', 'death-pact'],
            experience: 1500,
            unlocks: ['ragnarok-final']
        },
        {
            playerLevel: 30,
            completedQuests: ['souls-path', 'surtrs-challenge'],
            specialConditions: ['survive_death']
        },
        { same: true, plus: true, elements: true, ragnarok: true }
    )
];

// Combine all quest chains
export const allQuests = [
    ...midgardQuests,
    ...asgardQuests,
    ...vanaheimQuests,
    ...alfheimQuests,
    ...jotunheimQuests,
    ...nidavellirQuests,
    ...svartalfheimQuests,
    ...muspelheimQuests,
    ...niflheimQuests,
    ...helheimQuests
];

// Add quest condition checks to QuestService
export const questConditions = {
    win_without_fire: (gameState) => !gameState.playerHand.some(card => card.element === 'fire'),
    win_with_elemental_combo: (gameState) => {
        const elements = new Set(gameState.board.flat()
            .filter(card => card !== null)
            .map(card => card.element));
        return elements.size >= 3;
    },
    survive_three_elements: (gameState) => {
        const opponentElements = new Set(gameState.opponentHand.map(card => card.element));
        return opponentElements.size >= 3 && gameState.score.player > 0;
    },
    master_shadows: (gameState) => {
        const shadowCards = gameState.playerHand.filter(card => 
            card.id.includes('shadow') || card.id.includes('dark'));
        return shadowCards.length >= 3;
    },
    perfect_winter: (gameState) => {
        const iceCards = gameState.playerHand.filter(card => card.element === 'ice');
        return iceCards.length >= 4 && gameState.score.player > gameState.score.opponent;
    },
    survive_inferno: (gameState) => {
        const fireCards = gameState.opponentHand.filter(card => card.element === 'fire');
        return fireCards.length >= 4 && gameState.score.player > 0;
    },
    survive_death: (gameState) => {
        return gameState.turnCount >= 10 && gameState.score.player > 0;
    }
};

// Export quest-related types and interfaces
export type QuestId = string;
export type QuestCondition = (gameState: GameState) => boolean;

export interface QuestRequirements {
    playerLevel?: number;
    completedQuests?: QuestId[];
    specialConditions?: string[];
}

export interface QuestRewards {
    cardIds: string[];
    experience: number;
    unlocks?: QuestId[];
} 