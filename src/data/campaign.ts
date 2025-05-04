import { Quest, Opponent } from '../services/campaignService';
import { cards } from './cards';
import { GameRules } from '../types/game';
import { GameState } from '../types/game';

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
    specialRules: GameRules,
    storyFields?: {
        storyIntro?: string;
        storyOutro?: string;
        storyImages?: string[];
        dialogue?: import('../services/campaignService').DialogueLine[];
        choices?: import('../services/campaignService').StoryChoice[];
    }
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
    specialRules,
    ...(storyFields || {})
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
        'Learn the basics of card combat from Astrid the Shield-Maiden, a patient but demanding teacher.',
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
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: false, elements: false, ragnarok: false },
        {
            storyIntro: "As dawn breaks over Midgard, Astrid the Shield-Maiden greets you at the training grounds. 'To survive the coming storm, you must master the art of combat.'",
            storyOutro: "With Astrid's approval, you feel the first spark of destiny. The path to legend has begun.",
            storyImages: ["/images/story/astrid_intro.jpg"],
            dialogue: [
                { speaker: "Astrid", text: "Welcome, young warrior. Are you ready to begin your training?", portraitUrl: "/images/portraits/astrid.png" },
                { speaker: "You", text: "I am ready, Shield-Maiden." }
            ],
            choices: [
                { text: "Ask about the coming storm", result: "Astrid's eyes darken. 'Ragnarök is coming. Only the strong will endure.'" },
                { text: "Begin training", result: "Astrid nods. 'Let us begin!'" }
            ]
        }
    ),
    createQuest(
        'village-defense',
        'Defend the Village',
        'Put your training to the test against raiders threatening your home. Prove your worth to the elders.',
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
            experience: 200,
            unlocks: ['elemental-wisdom']
        },
        { playerLevel: 2, completedQuests: ['training-grounds'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: false, elements: false, ragnarok: false }
    ),
    createQuest(
        'elemental-wisdom',
        'The Elements Awaken',
        'A wandering mystic teaches you about elemental affinities and the power of fire and ice.',
        'midgard',
        createOpponent(
            'mystic-teacher',
            'Grida the Wise',
            'A mysterious woman with knowledge of the elements',
            'medium',
            ['muspelheim', 'niflheim', 'light-elf-archer', 'alfheim-mystic', 'draugr'],
            { aggressiveness: 0.4, preferredElements: ['fire', 'ice'] }
        ),
        {
            cardIds: ['muspelheim', 'niflheim'],
            experience: 200,
            unlocks: ['raider-revenge']
        },
        { playerLevel: 3, completedQuests: ['village-defense'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: false, elements: true, ragnarok: false }
    ),
    createQuest(
        'raider-revenge',
        'Return of the Raiders',
        'The raiders return, now led by a cunning new chief. Use your elemental knowledge to defend Midgard.',
        'midgard',
        createOpponent(
            'raider-witch',
            'Svala the Witch-Chief',
            'A raider chief who has learned dark magic',
            'medium',
            ['draugr', 'muspelheim', 'niflheim', 'berserker', 'shield-maiden'],
            { aggressiveness: 0.6, preferredElements: ['fire', 'ice'] }
        ),
        {
            cardIds: ['draugr'],
            experience: 250,
            unlocks: ['valkyrie-test']
        },
        { playerLevel: 4, completedQuests: ['elemental-wisdom'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }
    ),
    createQuest(
        'valkyrie-test',
        "The Valkyrie's Test",
        'A Valkyrie descends to test your worth. Only the bravest may ascend to Asgard.',
        'midgard',
        createOpponent(
            'valkyrie',
            'Sigrdrífa the Valkyrie',
            'A valkyrie testing your worth',
            'hard',
            ['sigrdriva', 'einherjar', 'valhalla', 'odroerir', 'gungnir'],
            { aggressiveness: 0.5, preferredElements: ['lightning'], ragnarokStrategy: 'balanced' }
        ),
        {
            cardIds: ['bifrost'],
            experience: 300,
            unlocks: ['midgard-boss']
        },
        { playerLevel: 5, completedQuests: ['raider-revenge'], specialConditions: ['win_with_elemental_combo'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'midgard-boss',
        'Champion of Midgard',
        'Face the legendary champion of Midgard in a final test before you may ascend to Asgard.',
        'midgard',
        createOpponent(
            'midgard-champion',
            'Eirik the Unbreakable',
            'The legendary champion of Midgard',
            'boss',
            ['einherjar', 'berserker', 'shield-maiden', 'draugr', 'valhalla'],
            { aggressiveness: 0.8, preferredElements: ['none'], ragnarokStrategy: 'aggressive' }
        ),
        {
            cardIds: ['valhalla'],
            specialAbilities: ['Berserker Rage'],
            experience: 400,
            unlocks: ['asgard-arrival']
        },
        { playerLevel: 6, completedQuests: ['valkyrie-test'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }
    ),
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
            specialAbilities: ["Allfather's Wisdom"],
            experience: 350,
            unlocks: ['thor-challenge']
        },
        {
            playerLevel: 6,
            completedQuests: ['the-calling']
        },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }
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
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }
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
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }
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
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'njords-test',
        'Trial of the Sea',
        "Face Njörðr's challenge to master the powers of wind and waves.",
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
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }
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
            specialAbilities: ['Seidr Magic'],
            experience: 600,
            unlocks: ['alfheim-gate']
        },
        {
            playerLevel: 11,
            completedQuests: ['njords-test'],
            requiredCards: ['freya', 'freyr', 'njord'],
            specialConditions: ['win_with_vanir_combo']
        },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }
    )
];

// Add and export empty quest arrays for missing realms
export const alfheimQuests = [
    createQuest(
        'light-challenge',
        "The Light's Challenge",
        "Prove your worth to the Light Elves by mastering the art of illumination in battle.",
        'alfheim',
        createOpponent(
            'eirlys',
            'Eirlys, Light Elf Duelist',
            'A skilled duelist among the Light Elves',
            'medium',
            ['light-elf-archer', 'alfheim-mystic', 'yggdrasil', 'shield-maiden', 'viking-warrior'],
            { aggressiveness: 0.5, preferredElements: ['lightning'], ragnarokStrategy: 'balanced' }
        ),
        {
            cardIds: ['alfheim-mystic'],
            experience: 400,
            unlocks: ['blessing-of-freyr']
        },
        {
            playerLevel: 12,
            completedQuests: ['vanir-mastery']
        },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: false, plus: false, elements: true, ragnarok: false }
    ),
    createQuest(
        'blessing-of-freyr',
        'Blessing of Freyr',
        'Earn the blessing of Freyr by defeating his chosen champion in Alfheim.',
        'alfheim',
        createOpponent(
            'freyr-chosen',
            "Freyr's Chosen",
            'A champion selected by Freyr himself',
            'hard',
            ['freyr', 'alfheim-mystic', 'light-elf-archer', 'yggdrasil', 'folkvangr'],
            { aggressiveness: 0.6, preferredElements: ['fire', 'lightning'], ragnarokStrategy: 'aggressive' }
        ),
        {
            cardIds: ['freyr'],
            experience: 500,
            unlocks: ['radiant-convergence']
        },
        {
            playerLevel: 13,
            completedQuests: ['light-challenge']
        },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: false, plus: true, elements: true, ragnarok: false }
    ),
    createQuest(
        'radiant-convergence',
        'Radiant Convergence',
        'Face the council of Light Elves in a final test of wisdom and power.',
        'alfheim',
        createOpponent(
            'council-of-light',
            'Council of Light',
            'The ruling council of Alfheim',
            'boss',
            ['alfheim-mystic', 'light-elf-archer', 'freyr', 'yggdrasil', 'odroerir'],
            { aggressiveness: 0.7, preferredElements: ['lightning', 'ice'], ragnarokStrategy: 'balanced' }
        ),
        {
            cardIds: ['odroerir'],
            specialAbilities: ["Light's Blessing"],
            experience: 600
        },
        {
            playerLevel: 14,
            completedQuests: ['blessing-of-freyr']
        },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }
    )
];

export const jotunheimQuests = [
    createQuest(
        'jotunheim-arrival',
        'Land of the Frost Giants',
        'You arrive in Jotunheim, home of the mighty Jotnar. The air is thick with challenge and ancient magic.',
        'jotunheim',
        createOpponent(
            'frost-giant-scout',
            'Frost Giant Scout',
            'A wary scout testing your right to enter Jotunheim',
            'medium',
            ['jotun-warrior', 'draugr', 'niflheim', 'berserker', 'shield-maiden'],
            { aggressiveness: 0.5, preferredElements: ['ice'], ragnarokStrategy: 'defensive' }
        ),
        {
            cardIds: ['jotun-warrior'],
            experience: 500,
            unlocks: ['ice-bridge']
        },
        { playerLevel: 15, completedQuests: ['radiant-convergence'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }
    ),
    createQuest(
        'ice-bridge',
        'Crossing the Ice Bridge',
        'To reach the heart of Jotunheim, you must cross a treacherous bridge guarded by a cunning giant.',
        'jotunheim',
        createOpponent(
            'bridge-guardian',
            'Hrímgrímnir',
            'A giant who controls the icy bridge',
            'hard',
            ['jotun-warrior', 'niflheim', 'draugr', 'muspelheim', 'shield-maiden'],
            { aggressiveness: 0.6, preferredElements: ['ice'], ragnarokStrategy: 'balanced' }
        ),
        {
            cardIds: ['ice-bridge'],
            experience: 600,
            unlocks: ['utgard-trial']
        },
        { playerLevel: 16, completedQuests: ['jotunheim-arrival'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }
    ),
    createQuest(
        'utgard-trial',
        'Trial of Utgard',
        'Face the challenges of Utgard, the stronghold of the giants. Outsiders rarely survive.',
        'jotunheim',
        createOpponent(
            'utgard-loki',
            'Utgard-Loki',
            'The trickster king of the giants',
            'hard',
            ['utgard-loki', 'jotun-warrior', 'draugr', 'niflheim', 'muspelheim'],
            { aggressiveness: 0.7, preferredElements: ['ice', 'fire'], ragnarokStrategy: 'aggressive' }
        ),
        {
            cardIds: ['utgard-loki'],
            experience: 700,
            unlocks: ['jotunheim-boss']
        },
        { playerLevel: 17, completedQuests: ['ice-bridge'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'jotunheim-boss',
        'King of the Giants',
        'Battle the mighty King Thrym in a legendary duel. Only victory will grant you passage onward.',
        'jotunheim',
        createOpponent(
            'king-thrym',
            'King Thrym',
            'The colossal and cunning king of the frost giants',
            'boss',
            ['king-thrym', 'utgard-loki', 'jotun-warrior', 'niflheim', 'draugr'],
            { aggressiveness: 0.9, preferredElements: ['ice'], ragnarokStrategy: 'aggressive' }
        ),
        {
            cardIds: ['thryms-hammer'],
            specialAbilities: ["Giant's Strength"],
            experience: 900,
            unlocks: ['nidavellir-gate']
        },
        { playerLevel: 18, completedQuests: ['utgard-trial'], specialConditions: ['win_with_ice_combo'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }
    )
];

export const nidavellirQuests = [
    createQuest(
        'nidavellir-arrival',
        'The Dwarven Forges',
        'Enter Nidavellir and prove your worth to the master smiths.',
        'nidavellir',
        createOpponent(
            'dvalin-apprentice',
            'Dvalin the Apprentice',
            'A young but skilled dwarven smith',
            'medium',
            ['dwarf-smith', 'shield-maiden', 'viking-warrior', 'yggdrasil', 'draugr'],
            { aggressiveness: 0.4, preferredElements: ['none'], ragnarokStrategy: 'defensive' }
        ),
        {
            cardIds: ['dwarf-smith'],
            experience: 500,
            unlocks: ['forge-trial']
        },
        { playerLevel: 19, completedQuests: ['jotunheim-boss'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: false, ragnarok: false }
    ),
    createQuest(
        'forge-trial',
        'Trial by Fire',
        'Survive the heat of the forges and impress the dwarven masters.',
        'nidavellir',
        createOpponent(
            'brokkr',
            'Brokkr the Forge-Master',
            'A master smith with a fiery temper',
            'hard',
            ['brokkr', 'dwarf-smith', 'muspelheim', 'shield-maiden', 'draugr'],
            { aggressiveness: 0.6, preferredElements: ['fire'], ragnarokStrategy: 'balanced' }
        ),
        {
            cardIds: ['brokkr'],
            experience: 600,
            unlocks: ['dark-elf-invasion']
        },
        { playerLevel: 20, completedQuests: ['nidavellir-arrival'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }
    ),
    createQuest(
        'dark-elf-invasion',
        'The Dark Elf Invasion',
        'Defend the forges from a sudden attack by the dark elves of Svartalfheim.',
        'nidavellir',
        createOpponent(
            'dark-elf-lord',
            'Svartálfar Lord',
            'A cunning leader of the dark elves',
            'hard',
            ['dark-elf', 'dwarf-smith', 'muspelheim', 'niflheim', 'draugr'],
            { aggressiveness: 0.7, preferredElements: ['ice', 'fire'], ragnarokStrategy: 'aggressive' }
        ),
        {
            cardIds: ['dark-elf'],
            experience: 700,
            unlocks: ['nidavellir-boss']
        },
        { playerLevel: 21, completedQuests: ['forge-trial'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'nidavellir-boss',
        'King of the Forge',
        'Face Sindri, the legendary king of the dwarves, in a final test of skill and wit.',
        'nidavellir',
        createOpponent(
            'sindri',
            'Sindri the King',
            'The legendary king of the dwarves',
            'boss',
            ['sindri', 'brokkr', 'dwarf-smith', 'dark-elf', 'yggdrasil'],
            { aggressiveness: 0.9, preferredElements: ['none'], ragnarokStrategy: 'aggressive' }
        ),
        {
            cardIds: ['sindri'],
            specialAbilities: ["Forge Mastery"],
            experience: 900,
            unlocks: ['muspelheim-gate']
        },
        { playerLevel: 22, completedQuests: ['dark-elf-invasion'], specialConditions: ['win_with_fire_combo'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }
    )
];

export const svartalfheimQuests = [
    createQuest(
        'svartalfheim-arrival',
        'Realm of Shadows',
        'Enter Svartalfheim, the land of the dark elves.',
        'svartalfheim',
        createOpponent(
            'dark-elf-scout',
            'Dark Elf Scout',
            'A scout of the shadowy Svartálfar',
            'medium',
            ['dark-elf', 'draugr', 'niflheim', 'muspelheim', 'shield-maiden'],
            { aggressiveness: 0.5, preferredElements: ['none'], ragnarokStrategy: 'defensive' }
        ),
        {
            cardIds: ['dark-elf'],
            experience: 900,
            unlocks: ['shadow-ambush']
        },
        { playerLevel: 32, completedQuests: ['helheim-boss'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }
    ),
    createQuest(
        'shadow-ambush',
        'Shadow Ambush',
        'Survive an ambush by the dark elves in the twisting tunnels.',
        'svartalfheim',
        createOpponent(
            'dark-elf-ambusher',
            'Dark Elf Ambusher',
            'A master of stealth and shadow',
            'hard',
            ['dark-elf', 'dark-elf', 'draugr', 'niflheim', 'muspelheim'],
            { aggressiveness: 0.7, preferredElements: ['none'], ragnarokStrategy: 'aggressive' }
        ),
        {
            cardIds: ['dark-elf'],
            experience: 1000,
            unlocks: ['svartalfheim-boss']
        },
        { playerLevel: 33, completedQuests: ['svartalfheim-arrival'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'svartalfheim-boss',
        'Lord of Shadows',
        'Face the Lord of the Dark Elves in a final battle for control of the realm.',
        'svartalfheim',
        createOpponent(
            'dark-elf-lord',
            'Lord of Shadows',
            'The supreme ruler of the Svartálfar',
            'boss',
            ['dark-elf-lord', 'dark-elf', 'draugr', 'niflheim', 'muspelheim'],
            { aggressiveness: 1.0, preferredElements: ['none'], ragnarokStrategy: 'aggressive' }
        ),
        {
            cardIds: ['dark-elf-lord'],
            specialAbilities: ["Shadowmeld"],
            experience: 1300,
            unlocks: ['finale-gate']
        },
        { playerLevel: 34, completedQuests: ['shadow-ambush'], specialConditions: ['win_with_shadow_combo'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }
    )
];

export const muspelheimQuests = [
    createQuest(
        'muspelheim-arrival',
        'Land of Fire',
        "Enter Muspelheim, realm of fire and chaos, and face Surtr's minions.",
        'muspelheim',
        createOpponent(
            'fire-giant-scout',
            'Fire Giant Scout',
            "A scout of Surtr's fiery legions",
            'medium',
            ['fire-giant', 'muspelheim', 'draugr', 'berserker', 'shield-maiden'],
            { aggressiveness: 0.5, preferredElements: ['fire'], ragnarokStrategy: 'aggressive' }
        ),
        {
            cardIds: ['fire-giant'],
            experience: 600,
            unlocks: ['surtrs-challenge']
        },
        { playerLevel: 23, completedQuests: ['nidavellir-boss'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }
    ),
    createQuest(
        'surtrs-challenge',
        "Surtr's Challenge",
        "Face Surtr's champion in a battle of fire and fury.",
        'muspelheim',
        createOpponent(
            'surtr-champion',
            "Surtr's Champion",
            'A mighty warrior wielding the power of Muspelheim',
            'hard',
            ['surtr', 'fire-giant', 'muspelheim', 'draugr', 'berserker'],
            { aggressiveness: 0.7, preferredElements: ['fire'], ragnarokStrategy: 'aggressive' }
        ),
        {
            cardIds: ['surtr'],
            experience: 700,
            unlocks: ['muspelheim-boss']
        },
        { playerLevel: 24, completedQuests: ['muspelheim-arrival'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'muspelheim-boss',
        'Surtr, Lord of Fire',
        'Face Surtr himself in a battle that will decide the fate of the realms.',
        'muspelheim',
        createOpponent(
            'surtr',
            'Surtr',
            'The lord of Muspelheim, bringer of Ragnarök',
            'boss',
            ['surtr', 'fire-giant', 'muspelheim', 'draugr', 'berserker'],
            { aggressiveness: 1.0, preferredElements: ['fire'], ragnarokStrategy: 'aggressive' }
        ),
        {
            cardIds: ['surtr'],
            specialAbilities: ["Inferno"],
            experience: 1000,
            unlocks: ['niflheim-gate']
        },
        { playerLevel: 25, completedQuests: ['surtrs-challenge'], specialConditions: ['win_with_fire_combo'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }
    )
];

export const niflheimQuests = [
    createQuest(
        'niflheim-arrival',
        'Realm of Ice',
        'Enter Niflheim, the land of primordial ice and mist.',
        'niflheim',
        createOpponent(
            'ice-wraith',
            'Ice Wraith',
            'A spirit of the frozen wastes',
            'medium',
            ['ice-wraith', 'niflheim', 'draugr', 'shield-maiden', 'viking-warrior'],
            { aggressiveness: 0.5, preferredElements: ['ice'], ragnarokStrategy: 'defensive' }
        ),
        {
            cardIds: ['ice-wraith'],
            experience: 700,
            unlocks: ['frost-giant-challenge']
        },
        { playerLevel: 26, completedQuests: ['muspelheim-boss'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }
    ),
    createQuest(
        'frost-giant-challenge',
        "Frost Giant's Challenge",
        'Face a mighty frost giant in the heart of Niflheim.',
        'niflheim',
        createOpponent(
            'frost-giant',
            'Frost Giant',
            'A giant born of ice and ancient magic',
            'hard',
            ['frost-giant', 'niflheim', 'draugr', 'ice-wraith', 'berserker'],
            { aggressiveness: 0.7, preferredElements: ['ice'], ragnarokStrategy: 'aggressive' }
        ),
        {
            cardIds: ['frost-giant'],
            experience: 800,
            unlocks: ['niflheim-boss']
        },
        { playerLevel: 27, completedQuests: ['niflheim-arrival'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'niflheim-boss',
        'Mistress of the Mists',
        'Face the ancient goddess Hel in her icy domain.',
        'niflheim',
        createOpponent(
            'hel',
            'Hel',
            'Goddess of the dead and ruler of Niflheim',
            'boss',
            ['hel', 'frost-giant', 'ice-wraith', 'niflheim', 'draugr'],
            { aggressiveness: 1.0, preferredElements: ['ice'], ragnarokStrategy: 'aggressive' }
        ),
        {
            cardIds: ['hel'],
            specialAbilities: ["Mist Veil"],
            experience: 1100,
            unlocks: ['helheim-gate']
        },
        { playerLevel: 28, completedQuests: ['frost-giant-challenge'], specialConditions: ['win_with_ice_combo'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }
    )
];

export const helheimQuests = [
    createQuest(
        'helheim-arrival',
        'Land of the Dead',
        'Descend into Helheim and face the spirits of the dead.',
        'helheim',
        createOpponent(
            'restless-spirit',
            'Restless Spirit',
            'A tormented soul seeking release',
            'medium',
            ['restless-spirit', 'draugr', 'hel', 'niflheim', 'shield-maiden'],
            { aggressiveness: 0.5, preferredElements: ['none'], ragnarokStrategy: 'defensive' }
        ),
        {
            cardIds: ['restless-spirit'],
            experience: 800,
            unlocks: ['helheim-challenge']
        },
        { playerLevel: 29, completedQuests: ['niflheim-boss'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }
    ),
    createQuest(
        'helheim-challenge',
        "Hel's Judgment",
        "Face Hel's chosen champion in a battle for your soul.",
        'helheim',
        createOpponent(
            'hel-champion',
            "Hel's Champion",
            'A mighty spirit loyal to Hel',
            'hard',
            ['hel-champion', 'hel', 'draugr', 'niflheim', 'restless-spirit'],
            { aggressiveness: 0.7, preferredElements: ['none'], ragnarokStrategy: 'aggressive' }
        ),
        {
            cardIds: ['hel-champion'],
            experience: 900,
            unlocks: ['helheim-boss']
        },
        { playerLevel: 30, completedQuests: ['helheim-arrival'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }
    ),
    createQuest(
        'helheim-boss',
        'Hel, Queen of the Dead',
        'Face Hel herself in a final battle for your fate.',
        'helheim',
        createOpponent(
            'hel',
            'Hel',
            'Queen of the Dead',
            'boss',
            ['hel', 'hel-champion', 'restless-spirit', 'draugr', 'niflheim'],
            { aggressiveness: 1.0, preferredElements: ['none'], ragnarokStrategy: 'aggressive' }
        ),
        {
            cardIds: ['hel'],
            specialAbilities: ["Soul Harvest"],
            experience: 1200,
            unlocks: ['svartalfheim-gate']
        },
        { playerLevel: 31, completedQuests: ['helheim-challenge'], specialConditions: ['win_with_no_deaths'] },
        { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }
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