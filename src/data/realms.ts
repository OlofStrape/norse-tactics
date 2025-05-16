import { Realm } from '../types/game';

export const realms: Realm[] = [
    {
        id: 'midgard',
        name: 'Midgard',
        description: 'The realm of humans, where your journey begins.',
        position: { x: 44, y: 55 },
        connections: ['asgard', 'vanaheim', 'alfheim'],
        unlocked: true,
        completed: false
    },
    {
        id: 'asgard',
        name: 'Asgard',
        description: 'Home of the Æsir gods.',
        position: { x: 44, y: 15 },
        connections: ['midgard', 'vanaheim', 'jotunheim'],
        unlocked: true,
        completed: false
    },
    {
        id: 'vanaheim',
        name: 'Vanaheim',
        description: 'Realm of the Vanir gods.',
        position: { x: 69, y: 28 },
        connections: ['midgard', 'asgard', 'alfheim'],
        unlocked: true,
        completed: false
    },
    {
        id: 'alfheim',
        name: 'Alfheim',
        description: 'Home of the Light Elves.',
        position: { x: 79, y: 50 },
        connections: ['midgard', 'vanaheim'],
        unlocked: true,
        completed: false
    },
    {
        id: 'jotunheim',
        name: 'Jötunheim',
        description: 'Land of the giants.',
        position: { x: 19, y: 28 },
        connections: ['asgard', 'niflheim', 'midgard'],
        unlocked: true,
        completed: false
    },
    {
        id: 'nidavellir',
        name: 'Nidavellir',
        description: 'Underground realm of the dwarves.',
        position: { x: 9, y: 50 },
        connections: ['midgard'],
        unlocked: true,
        completed: false
    },
    {
        id: 'muspelheim',
        name: 'Muspelheim',
        description: 'Realm of fire and home of the fire giants.',
        position: { x: 64, y: 72 },
        connections: ['helheim', 'niflheim'],
        unlocked: true,
        completed: false
    },
    {
        id: 'niflheim',
        name: 'Niflheim',
        description: 'The primordial realm of ice and mist.',
        position: { x: 24, y: 72 },
        connections: ['helheim', 'muspelheim', 'jotunheim'],
        unlocked: true,
        completed: false
    },
    {
        id: 'helheim',
        name: 'Helheim',
        description: 'Realm of the dead.',
        position: { x: 44, y: 82 },
        connections: ['niflheim', 'muspelheim', 'nidavellir'],
        unlocked: true,
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