import { Realm } from '../types/game';

export const realms: Realm[] = [
    {
        id: 'midgard',
        name: 'Midgard',
        description: 'The realm of humans, where your journey begins.',
        position: { x: 50, y: 50 }, // Center
        connections: ['asgard', 'vanaheim', 'alfheim'],
        unlocked: true,
        completed: false
    },
    {
        id: 'asgard',
        name: 'Asgard',
        description: 'Home of the Æsir gods.',
        position: { x: 50, y: 20 }, // Top center
        connections: ['midgard', 'vanaheim', 'jotunheim'],
        unlocked: false,
        completed: false
    },
    {
        id: 'vanaheim',
        name: 'Vanaheim',
        description: 'Realm of the Vanir gods.',
        position: { x: 75, y: 35 }, // Top right
        connections: ['midgard', 'asgard', 'alfheim'],
        unlocked: false,
        completed: false
    },
    {
        id: 'alfheim',
        name: 'Alfheim',
        description: 'Home of the Light Elves.',
        position: { x: 80, y: 65 }, // Right
        connections: ['midgard', 'vanaheim'],
        unlocked: false,
        completed: false
    },
    {
        id: 'jotunheim',
        name: 'Jötunheim',
        description: 'Land of the giants.',
        position: { x: 25, y: 35 }, // Top left
        connections: ['asgard', 'niflheim', 'midgard'],
        unlocked: false,
        completed: false
    },
    {
        id: 'nidavellir',
        name: 'Nidavellir',
        description: 'Underground realm of the dwarves.',
        position: { x: 20, y: 65 }, // Left
        connections: ['midgard'],
        unlocked: false,
        completed: false
    },
    {
        id: 'muspelheim',
        name: 'Muspelheim',
        description: 'Realm of fire and home of the fire giants.',
        position: { x: 75, y: 80 }, // Bottom right
        connections: ['helheim', 'niflheim'],
        unlocked: false,
        completed: false
    },
    {
        id: 'niflheim',
        name: 'Niflheim',
        description: 'The primordial realm of ice and mist.',
        position: { x: 65, y: 85 }, // Bottom
        connections: ['helheim', 'muspelheim', 'jotunheim'],
        unlocked: false,
        completed: false
    },
    {
        id: 'helheim',
        name: 'Helheim',
        description: 'Realm of the dead.',
        position: { x: 80, y: 90 }, // Far bottom right (moved)
        connections: ['niflheim', 'muspelheim', 'nidavellir'],
        unlocked: false,
        completed: false
    }
];

export const realmProgression = {
    'midgard': {
        requiredLevel: 1,
        requiredQuests: [],
        unlocksRealms: ['asgard', 'vanaheim']
    },
    'asgard': {
        requiredLevel: 5,
        requiredQuests: ['the-calling'],
        unlocksRealms: ['jotunheim']
    },
    'vanaheim': {
        requiredLevel: 7,
        requiredQuests: ['asgard-arrival'],
        unlocksRealms: ['alfheim']
    },
    'alfheim': {
        requiredLevel: 12,
        requiredQuests: ['vanir-mastery'],
        unlocksRealms: ['nidavellir']
    },
    'jotunheim': {
        requiredLevel: 15,
        requiredQuests: ['thor-challenge'],
        unlocksRealms: ['niflheim']
    },
    'nidavellir': {
        requiredLevel: 18,
        requiredQuests: ['light-dark-balance'],
        unlocksRealms: []
    },
    'muspelheim': {
        requiredLevel: 25,
        requiredQuests: ['niflheim-mastery'],
        unlocksRealms: []
    },
    'niflheim': {
        requiredLevel: 23,
        requiredQuests: ['frost-giant-pact'],
        unlocksRealms: ['muspelheim']
    },
    'helheim': {
        requiredLevel: 30,
        requiredQuests: ['dark-elf-alliance'],
        unlocksRealms: []
    }
}; 