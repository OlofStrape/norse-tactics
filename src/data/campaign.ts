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
    storyFields: {
        storyIntro?: string;
        storyOutro?: string;
        storyImages?: string[];
        dialogue?: import('../services/campaignService').DialogueLine[];
        choices?: import('../services/campaignService').StoryChoice[];
    },
    isSideQuest?: boolean,
    isRepeatable?: boolean,
    bonusXP?: number
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
    ...storyFields,
    isSideQuest,
    isRepeatable,
    bonusXP
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
        cards: ['forseti', 'nanna', 'hodr', 'syn', 'tyr']
    },
    mystic: {
        name: "Mystic's Way",
        description: "Harness elemental powers",
        cards: ['fjolnir', 'forseti', 'hodr', 'muspelheim', 'niflheim']
    },
    strategist: {
        name: "Strategist's Mind",
        description: "Utilize tactical advantages",
        cards: ['hodr', 'forseti', 'yggdrasil', 'asgard', 'vanaheim']
    }
};

// Define the actual quests for each realm
export const midgardQuests = [
    createQuest('training-grounds', 'The Art of Combat', 'Learn the basics of card combat from Astrid the Shield-Maiden.', 'midgard', createOpponent('shield-trainer', 'Astrid the Shield-Maiden', 'A patient but demanding teacher', 'easy', ['hodr', 'forseti', 'forseti', 'nanna', 'syn'], { aggressiveness: 0.5 }), { cardIds: ['hodr'], experience: 1000, unlocks: ['village-defense'] }, { playerLevel: 1 }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: false, elements: false, ragnarok: false }, {}),
    createQuest('village-defense', 'Defend the Village', 'Put your training to the test against raiders.', 'midgard', createOpponent('raider-chief', 'Bjorn the Raider', 'A fierce but unrefined opponent', 'easy', ['nanna', 'forseti', 'forseti', 'fjolnir', 'fjolnir'], { aggressiveness: 0.7 }), { cardIds: ['nanna'], experience: 1000, unlocks: ['elemental-wisdom'] }, { playerLevel: 2, completedQuests: ['training-grounds'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: false, elements: false, ragnarok: false }, {}),
    createQuest('elemental-wisdom', 'The Elements Awaken', 'A mystic teaches you about elemental affinities.', 'midgard', createOpponent('mystic-teacher', 'Grida the Wise', 'A mysterious woman with knowledge of the elements', 'medium', ['muspelheim', 'niflheim', 'light-elf-archer', 'alfheim-mystic', 'fjolnir'], { aggressiveness: 0.6, preferredElements: ['fire', 'ice'] }), { cardIds: ['muspelheim', 'niflheim'], experience: 1000, unlocks: ['raider-revenge'] }, { playerLevel: 3, completedQuests: ['village-defense'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: false, elements: true, ragnarok: false }, {}),
    createQuest('raider-revenge', 'Return of the Raiders', 'The raiders return, now led by a cunning new chief.', 'midgard', createOpponent('raider-witch', 'Svala the Witch-Chief', 'A raider chief who has learned dark magic', 'medium', ['fjolnir', 'muspelheim', 'niflheim', 'nanna', 'hodr'], { aggressiveness: 0.8, preferredElements: ['fire', 'ice'] }), { cardIds: ['fjolnir'], experience: 1000, unlocks: ['valkyrie-test'] }, { playerLevel: 4, completedQuests: ['elemental-wisdom'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest('valkyrie-test', "The Valkyrie's Test", 'A Valkyrie descends to test your worth.', 'midgard', createOpponent('valkyrie', 'Sigrdrífa the Valkyrie', 'A valkyrie testing your worth', 'hard', ['sigrdriva', 'syn', 'valhalla', 'odroerir', 'gungnir'], { aggressiveness: 0.7, preferredElements: ['lightning'], ragnarokStrategy: 'balanced' }), { cardIds: ['bifrost'], experience: 1000, unlocks: ['midgard-ritual'] }, { playerLevel: 5, completedQuests: ['raider-revenge'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest('midgard-ritual', 'The Ritual of Strength', 'Prove yourself in a sacred Norse ritual.', 'midgard', createOpponent('ritual-master', 'Elder Skald', 'A wise elder overseeing the ritual', 'medium', ['forseti', 'nanna', 'hodr', 'syn', 'tyr'], { aggressiveness: 0.6 }), { cardIds: ['tyr'], experience: 1000, unlocks: ['midgard-ambush'] }, { playerLevel: 6, completedQuests: ['valkyrie-test'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: false, elements: false, ragnarok: false }, {}),
    createQuest('midgard-ambush', 'Ambush at the River', 'Defend the village from a surprise attack.', 'midgard', createOpponent('raider-ambush', 'Raider Ambush Leader', 'A cunning raider leader', 'medium', ['nanna', 'fjolnir', 'forseti', 'hodr', 'tyr'], { aggressiveness: 0.8 }), { cardIds: ['nanna'], experience: 1000, unlocks: ['midgard-boss'] }, { playerLevel: 7, completedQuests: ['midgard-ritual'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: false, elements: false, ragnarok: false }, {}),
    createQuest('midgard-boss', 'Champion of Midgard', 'Face the legendary champion of Midgard.', 'midgard', createOpponent('midgard-champion', 'Eirik the Unbreakable', 'The legendary champion of Midgard', 'boss', ['syn', 'nanna', 'hodr', 'fjolnir', 'valhalla'], { aggressiveness: 1.0, preferredElements: ['none'], ragnarokStrategy: 'aggressive' }), { cardIds: ['valhalla'], specialAbilities: ['Berserker Rage'], experience: 1000, unlocks: ['asgard-arrival'] }, { playerLevel: 8, completedQuests: ['midgard-ambush'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest('midgard-side-1', 'Village Errand', 'Help a villager with a simple task.', 'midgard', createOpponent('villager', 'Helpful Villager', 'A villager in need of assistance', 'easy', ['hodr', 'forseti'], { aggressiveness: 0.2 }), { experience: 200 }, { playerLevel: 1 }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: false, plus: false, elements: false, ragnarok: false }, { storyIntro: 'A villager asks for your help gathering supplies.', storyOutro: 'The villager thanks you and gives you a small reward.' }, true, false, 100),
    createQuest('midgard-repeat-1', 'Training Spar', 'Spar with a local warrior for practice.', 'midgard', createOpponent('sparring-partner', 'Sparring Partner', 'A friendly sparring partner', 'easy', ['forseti', 'hodr'], { aggressiveness: 0.3 }), { experience: 100 }, { playerLevel: 1 }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: false, plus: false, elements: false, ragnarok: false }, { storyIntro: 'You challenge a local warrior to a friendly spar.', storyOutro: 'You both learn from the experience.' }, false, true, 50),
];

// Define quest chains for other realms
export const asgardQuests = [
    createQuest("asgard-arrival", "Welcome to the Realm Eternal", "Your first steps in Asgard.", "asgard", createOpponent("einherjar-captain", "Captain of the Einherjar", "A seasoned warrior of Valhalla", "medium", ["einherjar", "valhalla"], { aggressiveness: 0.5 }), { cardIds: ["einherjar"], experience: 1000, unlocks: ["asgard-trial"] }, { playerLevel: 9, completedQuests: ["midgard-boss"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest("asgard-trial", "Trial of the Gods", "Prove your worth to the gods of Asgard.", "asgard", createOpponent("asgard-trial", "Heimdall", "Guardian of the Bifrost", "medium", ["heimdall", "valhalla"], { aggressiveness: 0.5 }), { cardIds: ["heimdall"], experience: 1000, unlocks: ["asgard-feast"] }, { playerLevel: 10, completedQuests: ["asgard-arrival"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest("asgard-feast", "Feast of the Einherjar", "Join the warriors in a legendary feast.", "asgard", createOpponent("asgard-feast", "Bragi", "God of poetry and music", "easy", ["bragi", "einherjar"], { aggressiveness: 0.5 }), { cardIds: ["bragi"], experience: 1000, unlocks: ["asgard-quest4"] }, { playerLevel: 11, completedQuests: ["asgard-trial"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest("asgard-quest4", "The Valkyrie's Challenge", "Face a Valkyrie in a test of skill.", "asgard", createOpponent("asgard-valkyrie", "Brynhildr", "A fierce Valkyrie", "medium", ["brynhildr", "einherjar"], { aggressiveness: 0.8 }), { cardIds: ["brynhildr"], experience: 1000, unlocks: ["asgard-quest5"] }, { playerLevel: 12, completedQuests: ["asgard-feast"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest("asgard-quest5", "The Allfather's Wisdom", "Seek Odin's guidance.", "asgard", createOpponent("asgard-odin", "Odin", "The Allfather", "hard", ["odin", "valhalla"], { aggressiveness: 1.0 }), { cardIds: ["odin"], experience: 1000, unlocks: ["asgard-quest6"] }, { playerLevel: 13, completedQuests: ["asgard-quest4"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest("asgard-quest6", "The Trickster's Game", "Outwit Loki in a battle of wits.", "asgard", createOpponent("asgard-loki", "Loki", "The Trickster", "medium", ["loki", "einherjar"], { aggressiveness: 0.9 }), { cardIds: ["loki"], experience: 1000, unlocks: ["asgard-quest7"] }, { playerLevel: 14, completedQuests: ["asgard-quest5"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest("asgard-quest7", "The Bifrost Bridge", "Defend the Bifrost from invaders.", "asgard", createOpponent("asgard-bifrost", "Heimdall", "Guardian of the Bifrost", "hard", ["heimdall", "valhalla"], { aggressiveness: 1.0 }), { cardIds: ["bifrost"], experience: 1000, unlocks: ["asgard-boss"] }, { playerLevel: 15, completedQuests: ["asgard-quest6"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest("asgard-boss", "Champion of Asgard", "Face Odin in a final test.", "asgard", createOpponent("odin", "Odin", "The Allfather", "boss", ["odin", "valhalla"], { aggressiveness: 1.0 }), { cardIds: ["odin"], experience: 1000, unlocks: ["vanaheim-arrival"] }, { playerLevel: 16, completedQuests: ["asgard-quest7"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest('asgard-side-1', "Odin's Riddle", 'Solve a riddle posed by Odin for a bonus.', 'asgard', createOpponent('odin', 'Odin', 'The Allfather, testing your wits', 'medium', ['odin', 'valhalla'], { aggressiveness: 0.5 }), { experience: 300 }, { playerLevel: 9 }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: false, plus: false, elements: false, ragnarok: false }, { storyIntro: 'Odin challenges you with a riddle.', storyOutro: 'You impress Odin with your cleverness.' }, true, false, 200),
    createQuest('asgard-repeat-1', 'Einherjar Sparring', 'Practice with the Einherjar for extra XP.', 'asgard', createOpponent('einherjar-spar', 'Einherjar Sparring Partner', 'A warrior eager to train', 'easy', ['einherjar', 'valhalla'], { aggressiveness: 0.4 }), { experience: 150 }, { playerLevel: 9 }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: false, plus: false, elements: false, ragnarok: false }, { storyIntro: 'You join the Einherjar for a sparring match.', storyOutro: 'You both gain valuable experience.' }, false, true, 75),
];

export const vanaheimQuests = [
    createQuest('vanaheim-arrival', 'Arrival in Vanaheim', 'Step into the mystical lands of the Vanir.', 'vanaheim', createOpponent('vanaheim-apprentice', 'Vanir Apprentice', 'A young Vanir learning the ways of magic', 'medium', ['freyr', 'vanaheim'], { aggressiveness: 0.6 }), { cardIds: ['freyr'], experience: 1000, unlocks: ['vanaheim-quest2'] }, { playerLevel: 17, completedQuests: ['asgard-boss'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest('vanaheim-quest2', 'Seidr Secrets', 'Learn the secrets of seidr magic.', 'vanaheim', createOpponent('vanaheim-mystic', 'Vanir Mystic', 'A master of seidr', 'medium', ['freya', 'vanaheim'], { aggressiveness: 0.7 }), { cardIds: ['freya'], experience: 1000, unlocks: ['vanaheim-quest3'] }, { playerLevel: 18, completedQuests: ['vanaheim-arrival'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest('vanaheim-quest3', 'The Vanir Council', 'Impress the Vanir council with your skills.', 'vanaheim', createOpponent('vanaheim-council', 'Vanir Council', 'The ruling council of Vanaheim', 'hard', ['freyr', 'freya'], { aggressiveness: 0.8 }), { cardIds: ['audhumbla'], experience: 1000, unlocks: ['vanaheim-quest4'] }, { playerLevel: 19, completedQuests: ['vanaheim-quest2'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest('vanaheim-quest4', 'Blessing of the Vanir', 'Receive a blessing from the Vanir gods.', 'vanaheim', createOpponent('vanaheim-blesser', 'Vanir Blesser', 'A priest of the Vanir', 'easy', ['freyr', 'freya'], { aggressiveness: 0.5 }), { cardIds: ['folkvangr'], experience: 1000, unlocks: ['vanaheim-quest5'] }, { playerLevel: 20, completedQuests: ['vanaheim-quest3'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest('vanaheim-quest5', 'The Sacred Grove', 'Defend the sacred grove from intruders.', 'vanaheim', createOpponent('vanaheim-grove', 'Grove Guardian', 'Protector of the sacred grove', 'medium', ['freyr', 'freya'], { aggressiveness: 0.7 }), { cardIds: ['yggdrasil'], experience: 1000, unlocks: ['vanaheim-quest6'] }, { playerLevel: 21, completedQuests: ['vanaheim-quest4'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest('vanaheim-quest6', 'The Vanir Duel', 'Duel a Vanir champion.', 'vanaheim', createOpponent('vanaheim-champion', 'Vanir Champion', 'A mighty Vanir duelist', 'hard', ['freyr', 'freya'], { aggressiveness: 0.9 }), { cardIds: ['brisingamen'], experience: 1000, unlocks: ['vanaheim-quest7'] }, { playerLevel: 22, completedQuests: ['vanaheim-quest5'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest('vanaheim-quest7', 'The Vanir Festival', 'Celebrate with the Vanir in a grand festival.', 'vanaheim', createOpponent('vanaheim-festival', 'Festival Host', 'Host of the Vanir festival', 'easy', ['freyr', 'freya'], { aggressiveness: 0.4 }), { cardIds: ['folkvangr'], experience: 1000, unlocks: ['vanaheim-boss'] }, { playerLevel: 23, completedQuests: ['vanaheim-quest6'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest('vanaheim-boss', 'Master of Vanaheim', 'Defeat the Vanir champion in a final duel.', 'vanaheim', createOpponent('vanaheim-boss', 'Vanir Champion', 'The greatest Vanir duelist', 'boss', ['freyr', 'freya'], { aggressiveness: 1.0 }), { cardIds: ['freyr'], experience: 1000, unlocks: ['alfheim-arrival'] }, { playerLevel: 24, completedQuests: ['vanaheim-quest7'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }, {}),
];

export const alfheimQuests = [
    createQuest("alfheim-arrival", "Arrival in Alfheim", "Step into the radiant lands of the Light Elves.", "alfheim", createOpponent("light-elf-archer", "Light Elf Archer", "A vigilant guardian of Alfheim", "medium", ["light-elf-archer", "alfheim-mystic", "yggdrasil", "hodr", "forseti"], { aggressiveness: 0.7 }), { cardIds: ["alfheim-mystic"], experience: 1000, unlocks: ["alfheim-quest2"] }, { playerLevel: 25, completedQuests: ["vanaheim-boss"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("alfheim-quest2", "Blessing of Freyr", "Earn the blessing of Freyr by defeating his chosen champion.", "alfheim", createOpponent("freyr-chosen", "Freyr's Chosen", "A champion selected by Freyr", "hard", ["freyr", "alfheim-mystic", "light-elf-archer", "yggdrasil", "folkvangr"], { aggressiveness: 0.8 }), { cardIds: ["freyr"], experience: 1000, unlocks: ["alfheim-quest3"] }, { playerLevel: 26, completedQuests: ["alfheim-arrival"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("alfheim-quest3", "Radiant Convergence", "Face the council of Light Elves in a test of wisdom.", "alfheim", createOpponent("council-of-light", "Council of Light", "The ruling council of Alfheim", "boss", ["alfheim-mystic", "light-elf-archer", "freyr", "yggdrasil", "odroerir"], { aggressiveness: 0.9 }), { cardIds: ["odroerir"], experience: 1000, unlocks: ["alfheim-quest4"] }, { playerLevel: 27, completedQuests: ["alfheim-quest2"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("alfheim-quest4", "Elven Duel", "Duel a master swordsman of the Light Elves.", "alfheim", createOpponent("elven-duelist", "Elven Duelist", "A master of the blade", "medium", ["light-elf-archer", "alfheim-mystic", "yggdrasil", "hodr", "forseti"], { aggressiveness: 0.8 }), { cardIds: ["light-elf-archer"], experience: 1000, unlocks: ["alfheim-quest5"] }, { playerLevel: 28, completedQuests: ["alfheim-quest3"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("alfheim-quest5", "Forest Guardians", "Help defend the sacred groves from invaders.", "alfheim", createOpponent("forest-guardian", "Forest Guardian", "Protector of Alfheim's woods", "medium", ["light-elf-archer", "alfheim-mystic", "yggdrasil", "hodr", "forseti"], { aggressiveness: 0.7 }), { cardIds: ["yggdrasil"], experience: 1000, unlocks: ["alfheim-quest6"] }, { playerLevel: 29, completedQuests: ["alfheim-quest4"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("alfheim-quest6", "Light's Test", "Pass the test of the Light Elves' elders.", "alfheim", createOpponent("light-elder", "Light Elder", "An ancient elf of great wisdom", "hard", ["alfheim-mystic", "light-elf-archer", "yggdrasil", "folkvangr", "odroerir"], { aggressiveness: 0.9 }), { cardIds: ["folkvangr"], experience: 1000, unlocks: ["alfheim-quest7"] }, { playerLevel: 30, completedQuests: ["alfheim-quest5"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("alfheim-quest7", "Festival of Light", "Celebrate with the elves in a grand festival.", "alfheim", createOpponent("festival-host", "Festival Host", "Host of the Alfheim festival", "easy", ["light-elf-archer", "alfheim-mystic", "yggdrasil", "hodr", "forseti"], { aggressiveness: 0.4 }), { cardIds: ["alfheim-mystic"], experience: 1000, unlocks: ["alfheim-boss"] }, { playerLevel: 31, completedQuests: ["alfheim-quest6"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("alfheim-boss", "Master of Alfheim", "Defeat the Light Elf champion in a final duel.", "alfheim", createOpponent("alfheim-boss", "Light Elf Champion", "The greatest duelist of Alfheim", "boss", ["alfheim-mystic", "light-elf-archer", "yggdrasil", "folkvangr", "odroerir"], { aggressiveness: 1.0 }), { cardIds: ["odroerir"], experience: 1000, unlocks: ["jotunheim-arrival"] }, { playerLevel: 32, completedQuests: ["alfheim-quest7"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }, {}),
];

export const jotunheimQuests = [
    createQuest("jotunheim-arrival", "Arrival in Jotunheim", "Enter the land of the giants.", "jotunheim", createOpponent("frost-giant-scout", "Frost Giant Scout", "A wary scout testing your right to enter Jotunheim", "medium", ["jotun-warrior", "draugr", "niflheim", "nanna", "hodr"], { aggressiveness: 0.7 }), { cardIds: ["jotun-warrior"], experience: 1000, unlocks: ["jotunheim-quest2"] }, { playerLevel: 33, completedQuests: ["alfheim-boss"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("jotunheim-quest2", "Ice Bridge Crossing", "Cross the treacherous ice bridge guarded by giants.", "jotunheim", createOpponent("bridge-guardian", "Hrímgrímnir", "A giant who controls the icy bridge", "hard", ["jotun-warrior", "niflheim", "draugr", "muspelheim", "hodr"], { aggressiveness: 0.8 }), { cardIds: ["ice-bridge"], experience: 1000, unlocks: ["jotunheim-quest3"] }, { playerLevel: 34, completedQuests: ["jotunheim-arrival"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("jotunheim-quest3", "Utgard's Challenge", "Face the challenges of Utgard, the stronghold of the giants.", "jotunheim", createOpponent("utgard-loki", "Utgard-Loki", "The trickster king of the giants", "hard", ["utgard-loki", "jotun-warrior", "draugr", "niflheim", "muspelheim"], { aggressiveness: 0.9 }), { cardIds: ["utgard-loki"], experience: 1000, unlocks: ["jotunheim-quest4"] }, { playerLevel: 35, completedQuests: ["jotunheim-quest2"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("jotunheim-quest4", "Frost Giant Duel", "Duel a mighty frost giant champion.", "jotunheim", createOpponent("frost-giant-champion", "Frost Giant Champion", "A mighty champion of the frost giants", "medium", ["jotun-warrior", "niflheim", "draugr", "nanna", "hodr"], { aggressiveness: 0.8 }), { cardIds: ["frost-giant"], experience: 1000, unlocks: ["jotunheim-quest5"] }, { playerLevel: 36, completedQuests: ["jotunheim-quest3"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("jotunheim-quest5", "Frozen Caverns", "Explore the frozen caverns beneath Jotunheim.", "jotunheim", createOpponent("cavern-guardian", "Cavern Guardian", "Protector of the frozen depths", "medium", ["jotun-warrior", "niflheim", "draugr", "nanna", "hodr"], { aggressiveness: 0.7 }), { cardIds: ["draugr"], experience: 1000, unlocks: ["jotunheim-quest6"] }, { playerLevel: 37, completedQuests: ["jotunheim-quest4"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("jotunheim-quest6", "Giant's Feast", "Join the giants in a feast and prove your worth.", "jotunheim", createOpponent("giant-feaster", "Feasting Giant", "A jovial but strong giant", "easy", ["jotun-warrior", "draugr", "niflheim", "nanna", "hodr"], { aggressiveness: 0.5 }), { cardIds: ["jotun-warrior"], experience: 1000, unlocks: ["jotunheim-quest7"] }, { playerLevel: 38, completedQuests: ["jotunheim-quest5"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("jotunheim-quest7", "Thrym's Test", "Face King Thrym in a test of strength.", "jotunheim", createOpponent("king-thrym", "King Thrym", "The colossal king of the frost giants", "hard", ["king-thrym", "utgard-loki", "jotun-warrior", "niflheim", "draugr"], { aggressiveness: 1.0 }), { cardIds: ["thryms-hammer"], experience: 1000, unlocks: ["jotunheim-boss"] }, { playerLevel: 39, completedQuests: ["jotunheim-quest6"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("jotunheim-boss", "King of the Giants", "Battle the mighty King Thrym in a legendary duel.", "jotunheim", createOpponent("king-thrym", "King Thrym", "The colossal and cunning king of the frost giants", "boss", ["king-thrym", "utgard-loki", "jotun-warrior", "niflheim", "draugr"], { aggressiveness: 1.0 }), { cardIds: ["thryms-hammer"], experience: 1000, unlocks: ["nidavellir-arrival"] }, { playerLevel: 40, completedQuests: ["jotunheim-quest7"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }, {}),
];

export const nidavellirQuests = [
    createQuest("nidavellir-arrival", "Arrival in Nidavellir", "Enter the forges of the dwarves.", "nidavellir", createOpponent("dvalin-apprentice", "Dvalin the Apprentice", "A young but skilled dwarven smith", "medium", ["dwarf-smith", "hodr", "forseti", "yggdrasil", "draugr"], { aggressiveness: 0.6 }), { cardIds: ["dwarf-smith"], experience: 1000, unlocks: ["nidavellir-quest2"] }, { playerLevel: 41, completedQuests: ["jotunheim-boss"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: false, ragnarok: false }, {}),
    createQuest("nidavellir-quest2", "Trial by Fire", "Survive the heat of the forges and impress the dwarven masters.", "nidavellir", createOpponent("brokkr", "Brokkr the Forge-Master", "A master smith with a fiery temper", "hard", ["brokkr", "dwarf-smith", "muspelheim", "hodr", "draugr"], { aggressiveness: 0.8 }), { cardIds: ["brokkr"], experience: 1000, unlocks: ["nidavellir-quest3"] }, { playerLevel: 42, completedQuests: ["nidavellir-arrival"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("nidavellir-quest3", "Dark Elf Invasion", "Defend the forges from a sudden attack by the dark elves.", "nidavellir", createOpponent("dark-elf-lord", "Svartálfar Lord", "A cunning leader of the dark elves", "hard", ["dark-elf", "dwarf-smith", "muspelheim", "yggdrasil", "draugr"], { aggressiveness: 0.9 }), { cardIds: ["dark-elf"], experience: 1000, unlocks: ["nidavellir-quest4"] }, { playerLevel: 43, completedQuests: ["nidavellir-quest2"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("nidavellir-quest4", "Dwarven Duel", "Duel a master craftsman of Nidavellir.", "nidavellir", createOpponent("dwarf-champion", "Dwarven Champion", "A master of the forge and the blade", "medium", ["dwarf-smith", "brokkr", "muspelheim", "hodr", "draugr"], { aggressiveness: 0.7 }), { cardIds: ["dwarf-smith"], experience: 1000, unlocks: ["nidavellir-quest5"] }, { playerLevel: 44, completedQuests: ["nidavellir-quest3"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: false, ragnarok: false }, {}),
    createQuest("nidavellir-quest5", "Forge Guardians", "Help defend the legendary forges from invaders.", "nidavellir", createOpponent("forge-guardian", "Forge Guardian", "Protector of Nidavellir's forges", "medium", ["dwarf-smith", "brokkr", "muspelheim", "hodr", "draugr"], { aggressiveness: 0.7 }), { cardIds: ["brokkr"], experience: 1000, unlocks: ["nidavellir-quest6"] }, { playerLevel: 45, completedQuests: ["nidavellir-quest4"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: false, ragnarok: false }, {}),
    createQuest("nidavellir-quest6", "Smith's Test", "Pass the test of the dwarven elders.", "nidavellir", createOpponent("dwarf-elder", "Dwarf Elder", "An ancient dwarf of great wisdom", "hard", ["dwarf-smith", "brokkr", "muspelheim", "hodr", "draugr"], { aggressiveness: 0.9 }), { cardIds: ["brokkr"], experience: 1000, unlocks: ["nidavellir-quest7"] }, { playerLevel: 46, completedQuests: ["nidavellir-quest5"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: false, ragnarok: false }, {}),
    createQuest("nidavellir-quest7", "Festival of Forges", "Celebrate with the dwarves in a grand festival.", "nidavellir", createOpponent("festival-host", "Festival Host", "Host of the Nidavellir festival", "easy", ["dwarf-smith", "brokkr", "muspelheim", "hodr", "draugr"], { aggressiveness: 0.4 }), { cardIds: ["dwarf-smith"], experience: 1000, unlocks: ["nidavellir-boss"] }, { playerLevel: 47, completedQuests: ["nidavellir-quest6"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: false, ragnarok: false }, {}),
    createQuest("nidavellir-boss", "King of the Forge", "Face Sindri, the legendary king of the dwarves, in a final test of skill and wit.", "nidavellir", createOpponent("sindri", "Sindri the King", "The legendary king of the dwarves", "boss", ["sindri", "brokkr", "dwarf-smith", "dark-elf", "yggdrasil"], { aggressiveness: 1.0 }), { cardIds: ["sindri"], experience: 1000, unlocks: ["muspelheim-arrival"] }, { playerLevel: 48, completedQuests: ["nidavellir-quest7"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }, {}),
];

export const muspelheimQuests = [
    createQuest("muspelheim-arrival", "Arrival in Muspelheim", "Enter the realm of fire and chaos.", "muspelheim", createOpponent("fire-giant-scout", "Fire Giant Scout", "A scout of Surtr's fiery legions", "medium", ["fire-giant", "muspelheim", "draugr", "nanna", "hodr"], { aggressiveness: 0.7 }), { cardIds: ["fire-giant"], experience: 1000, unlocks: ["muspelheim-quest2"] }, { playerLevel: 49, completedQuests: ["nidavellir-boss"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("muspelheim-quest2", "Surtr's Challenge", "Face Surtr's champion in a battle of fire and fury.", "muspelheim", createOpponent("surtr-champion", "Surtr's Champion", "A mighty warrior wielding the power of Muspelheim", "hard", ["surtr", "fire-giant", "muspelheim", "draugr", "nanna"], { aggressiveness: 0.9 }), { cardIds: ["surtr"], experience: 1000, unlocks: ["muspelheim-quest3"] }, { playerLevel: 50, completedQuests: ["muspelheim-arrival"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("muspelheim-quest3", "Lava Fields", "Navigate the dangerous lava fields of Muspelheim.", "muspelheim", createOpponent("lava-guardian", "Lava Guardian", "Protector of the molten lands", "medium", ["fire-giant", "muspelheim", "draugr", "nanna", "hodr"], { aggressiveness: 0.8 }), { cardIds: ["muspelheim"], experience: 1000, unlocks: ["muspelheim-quest4"] }, { playerLevel: 51, completedQuests: ["muspelheim-quest2"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("muspelheim-quest4", "Fire Giant Duel", "Duel a mighty fire giant champion.", "muspelheim", createOpponent("fire-giant-champion", "Fire Giant Champion", "A mighty champion of the fire giants", "medium", ["fire-giant", "muspelheim", "draugr", "nanna", "hodr"], { aggressiveness: 0.8 }), { cardIds: ["fire-giant"], experience: 1000, unlocks: ["muspelheim-quest5"] }, { playerLevel: 52, completedQuests: ["muspelheim-quest3"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("muspelheim-quest5", "Inferno Guardians", "Help defend the inferno from invaders.", "muspelheim", createOpponent("inferno-guardian", "Inferno Guardian", "Protector of Muspelheim's inferno", "medium", ["fire-giant", "muspelheim", "draugr", "nanna", "hodr"], { aggressiveness: 0.7 }), { cardIds: ["muspelheim"], experience: 1000, unlocks: ["muspelheim-quest6"] }, { playerLevel: 53, completedQuests: ["muspelheim-quest4"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("muspelheim-quest6", "Smith's Fire", "Pass the test of the fire smiths.", "muspelheim", createOpponent("fire-smith", "Fire Smith", "A master of the forge and flame", "hard", ["fire-giant", "muspelheim", "draugr", "nanna", "hodr"], { aggressiveness: 0.9 }), { cardIds: ["muspelheim"], experience: 1000, unlocks: ["muspelheim-quest7"] }, { playerLevel: 54, completedQuests: ["muspelheim-quest5"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("muspelheim-quest7", "Festival of Fire", "Celebrate with the fire giants in a grand festival.", "muspelheim", createOpponent("festival-host", "Festival Host", "Host of the Muspelheim festival", "easy", ["fire-giant", "muspelheim", "draugr", "nanna", "hodr"], { aggressiveness: 0.4 }), { cardIds: ["fire-giant"], experience: 1000, unlocks: ["muspelheim-boss"] }, { playerLevel: 55, completedQuests: ["muspelheim-quest6"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("muspelheim-boss", "Surtr, Lord of Fire", "Face Surtr himself in a battle that will decide the fate of the realms.", "muspelheim", createOpponent("surtr", "Surtr", "The lord of Muspelheim, bringer of Ragnarök", "boss", ["surtr", "fire-giant", "muspelheim", "draugr", "nanna"], { aggressiveness: 1.0 }), { cardIds: ["surtr"], experience: 1000, unlocks: ["niflheim-arrival"] }, { playerLevel: 56, completedQuests: ["muspelheim-quest7"] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }, {}),
];

export const niflheimQuests = [
    createQuest("niflheim-arrival", "Realm of Ice", "Enter Niflheim, the land of primordial ice and mist.", "niflheim", createOpponent("ice-wraith", "Ice Wraith", "A spirit of the frozen wastes", "medium", ["ice-wraith", "niflheim", "draugr", "hodr", "forseti"], { aggressiveness: 0.7, preferredElements: ['ice'], ragnarokStrategy: 'defensive' }), { cardIds: ['ice-wraith'], experience: 700, unlocks: ['frost-giant-challenge'] }, { playerLevel: 26, completedQuests: ['muspelheim-boss'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("frost-giant-challenge", "Frost Giant's Challenge", "Face a mighty frost giant in the heart of Niflheim.", "niflheim", createOpponent("frost-giant", "Frost Giant", "A giant born of ice and ancient magic", "hard", ["frost-giant", "niflheim", "draugr", "ice-wraith", "nanna"], { aggressiveness: 0.9, preferredElements: ['ice'], ragnarokStrategy: 'aggressive' }), { cardIds: ['frost-giant'], experience: 800, unlocks: ['niflheim-boss'] }, { playerLevel: 27, completedQuests: ['niflheim-arrival'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest("niflheim-boss", "Mistress of the Mists", "Face the ancient goddess Hel in her icy domain.", "niflheim", createOpponent("hel", "Hel", "Goddess of the dead and ruler of Niflheim", "boss", ['hel', 'frost-giant', 'ice-wraith', 'niflheim', 'draugr'], { aggressiveness: 1.0, preferredElements: ['ice'], ragnarokStrategy: 'aggressive' }), { cardIds: ['hel'], specialAbilities: ["Mist Veil"], experience: 1100, unlocks: ['helheim-gate'] }, { playerLevel: 28, completedQuests: ['frost-giant-challenge'], specialConditions: ['win_with_ice_combo'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }, {}),
];

export const helheimQuests = [
    createQuest("helheim-arrival", "Land of the Dead", "Descend into Helheim and face the spirits of the dead.", "helheim", createOpponent("restless-spirit", "Restless Spirit", "A tormented soul seeking release", "medium", ["restless-spirit", "draugr", "hel", "niflheim", "hodr"], { aggressiveness: 0.7, preferredElements: ['none'], ragnarokStrategy: 'defensive' }), { cardIds: ['restless-spirit'], experience: 800, unlocks: ['helheim-challenge'] }, { playerLevel: 29, completedQuests: ['niflheim-boss'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: false, same: true, plus: true, elements: true, ragnarok: false }, {}),
    createQuest("helheim-challenge", "Hel's Judgment", "Face Hel's chosen champion in a battle for your soul.", "helheim", createOpponent("hel-champion", "Hel's Champion", "A mighty spirit loyal to Hel", "hard", ["hel-champion", "hel", "draugr", "niflheim", "restless-spirit"], { aggressiveness: 0.9, preferredElements: ['none'], ragnarokStrategy: 'aggressive' }), { cardIds: ['hel-champion'], experience: 900, unlocks: ['helheim-boss'] }, { playerLevel: 30, completedQuests: ['helheim-arrival'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }, {}),
    createQuest("helheim-boss", "Hel, Queen of the Dead", "Face Hel herself in a final battle for your fate.", "helheim", createOpponent("hel", "Hel", "Queen of the Dead", "boss", ['hel', 'hel-champion', 'restless-spirit', 'draugr', 'niflheim'], { aggressiveness: 1.0, preferredElements: ['none'], ragnarokStrategy: 'aggressive' }), { cardIds: ['hel'], specialAbilities: ["Soul Harvest"], experience: 1200, unlocks: ['svartalfheim-gate'] }, { playerLevel: 31, completedQuests: ['helheim-challenge'], specialConditions: ['win_with_no_deaths'] }, { captureRules: { sameElement: false, higherValue: false, adjacent: false }, chainReaction: true, same: true, plus: true, elements: true, ragnarok: true }, {}),
];

// Combine all quest chains
export const allQuests = [
    ...midgardQuests,
    ...asgardQuests,
    ...vanaheimQuests,
    ...alfheimQuests,
    ...jotunheimQuests,
    ...nidavellirQuests,
    ...muspelheimQuests,
    ...niflheimQuests,
    ...helheimQuests
]; 