// Friends TV Show data for the script generator interface

const FRIENDS_CHARACTERS = [
    'Rachel', 'Monica', 'Phoebe', 'Ross', 'Chandler', 'Joey'
];

const FRIENDS_LOCATIONS = [
    'Central Perk',
    'Monica and Rachel\'s apartment',
    'Chandler and Joey\'s apartment',
    'Ross\'s apartment',
    'The Museum',
    'Bloomingdale\'s',
    'Restaurant',
    'Coffee shop',
    'Park',
    'Wedding venue',
    'Hospital',
    'Office building',
    'Airport',
    'Beach house',
    'Hotel lobby'
];

const SCENARIO_SUGGESTIONS = [
    'having coffee and discussing relationships',
    'planning a surprise party',
    'dealing with a dating disaster',
    'arguing about trivial things',
    'sharing embarrassing stories',
    'trying to solve someone\'s problem',
    'celebrating good news',
    'dealing with work drama',
    'planning a vacation',
    'having a game night',
    'cooking dinner together',
    'getting ready for a date',
    'dealing with family issues',
    'moving apartments',
    'attending a wedding'
];

const PRESET_COMBINATIONS = [
    {
        name: 'Classic Coffee Shop',
        characters: ['Rachel', 'Monica', 'Phoebe'],
        location: 'Central Perk',
        scenario: 'having coffee and discussing their latest dating adventures',
        seedDialogue: {
            'Rachel': 'You guys, I have to tell you what happened on my date last night...',
            'Monica': 'Oh no, what did he do this time?'
        }
    },
    {
        name: 'Apartment Chaos',
        characters: ['Chandler', 'Joey', 'Ross'],
        location: 'Chandler and Joey\'s apartment',
        scenario: 'dealing with a household emergency',
        seedDialogue: {
            'Joey': 'Dude, I think I broke something important.',
            'Chandler': 'Could this BE any worse?'
        }
    },
    {
        name: 'Group Gathering',
        characters: ['Rachel', 'Monica', 'Phoebe', 'Ross', 'Chandler', 'Joey'],
        location: 'Monica and Rachel\'s apartment',
        scenario: 'having dinner and sharing news',
        seedDialogue: {
            'Monica': 'Okay everyone, I have an announcement to make.',
            'Chandler': 'Please tell me it\'s not about your new organizational system.'
        }
    },
    {
        name: 'Ross\'s Dilemma',
        characters: ['Ross', 'Rachel', 'Monica'],
        location: 'The Museum',
        scenario: 'dealing with work and personal life conflicts',
        seedDialogue: {
            'Ross': 'I can\'t believe this is happening to me again.',
            'Rachel': 'What happened now, Ross?'
        }
    }
];

const CHARACTER_TRAITS = {
    'Rachel': 'Fashion-conscious, sometimes spoiled, but caring and loyal',
    'Monica': 'Perfectionist, competitive, excellent cook, very organized',
    'Phoebe': 'Quirky, free-spirited, believes in alternative medicine and theories',
    'Ross': 'Intellectual, paleontologist, often neurotic, loves dinosaurs',
    'Chandler': 'Sarcastic, uses humor to deflect emotions, statistical analysis',
    'Joey': 'Actor, loves food, simple but loyal, charming with women'
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FRIENDS_CHARACTERS,
        FRIENDS_LOCATIONS,
        SCENARIO_SUGGESTIONS,
        PRESET_COMBINATIONS,
        CHARACTER_TRAITS
    };
}

