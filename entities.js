const player1 = {
    id: 'player1',
    name: 'Protagonista',
    symbol: '@',
    x: 4,
    y: 5,
    team: 'player',
    actions: { standard: true, move: true, swift: true, reaction: true },
    // NUEVO: Ranuras de equipamiento
    equipment: {
        mainHand: 'longsword', // Sostiene el ID del objeto en equipment.js
        offHand: null,
        body: null,
        ring1: null,
        ring2: null,
        cloak: null
    },
    abilityScores: { str: 12, dex: 12, con: 12, int: 12, wis: 12, cha: 12 },
    stats: {}
};

const player2 = {
    id: 'player2',
    name: 'Compañero',
    symbol: '#',
    x: 5,
    y: 5,
    team: 'player',
    actions: { standard: true, move: true, swift: true, reaction: true },
    equipment: {
        mainHand: 'battleaxe',
        offHand: null,
        body: null,
        ring1: null,
        ring2: null,
        cloak: null
    },
    abilityScores: { str: 14, dex: 10, con: 14, int: 8, wis: 10, cha: 10 },
    stats: {}
};

const enemy1 = {
    id: 'enemy1',
    name: 'Goblin',
    symbol: 'G',
    x: 10,
    y: 4,
    team: 'enemy',
    equipment: {
        mainHand: 'dagger',
        offHand: null,
        body: null,
        ring1: null,
        ring2: null,
        cloak: null
    },
    abilityScores: { str: 10, dex: 14, con: 11, int: 8, wis: 9, cha: 8 },
    stats: {}
};

let ALL_ENTITIES = [player1, player2, enemy1];