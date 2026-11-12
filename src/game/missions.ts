import { MissionConfig } from './types';

export const MISSIONS: MissionConfig[] = [
  {
    id: 'moon-basics',
    number: '01',
    title: 'Moon Basics: Shackleton Rim',
    destination: 'moon',
    difficulty: 'Cadet',
    targetSols: 4,
    briefing:
      'Establish a starter outpost on the lunar south pole. Keep Power, Life Support, Food, and Radiation Shielding above zero for 4 sols while testing your solar array and greenhouse.',
    realNasaContext:
      'NASA Artemis III targets the lunar south pole because crater rims receive near-continuous sunlight while nearby shadowed craters hold water ice.',
    startingResources: { power: 75, lifeSupport: 80, food: 75, shielding: 70 },
    startingModules: {
      solar_array: 1,
      oxygen_gen: 1,
      greenhouse: 1,
      water_recycler: 1,
      regolith_shield: 1,
      storm_shelter: 0,
    },
    dustStormChance: 0,
    flareChance: 0.15,
    discussionQuestions: [
      'Why does adding a greenhouse module increase food, yet also increase power and water demand?',
      'Why is the lunar south pole a better site for solar power than the lunar equator?',
      'If you could only upgrade one module on Sol 1, which one protects the crew best and why?',
    ],
  },
  {
    id: 'moon-night',
    number: '02',
    title: 'Lunar Night Survival',
    destination: 'moon',
    difficulty: 'Flight',
    targetSols: 5,
    briefing:
      'Survive a 5-sol cycle including a lunar night where solar power drops sharply. Build battery/solar capacity early and manage life support carefully.',
    realNasaContext:
      'A full lunar night lasts about 14 Earth days, dropping surface temperatures to -130°C (NASA LRO Diviner data).',
    startingResources: { power: 68, lifeSupport: 72, food: 70, shielding: 65 },
    startingModules: {
      solar_array: 1,
      oxygen_gen: 1,
      greenhouse: 1,
      water_recycler: 1,
      regolith_shield: 1,
      storm_shelter: 0,
    },
    lunarNightInterval: 3,
    dustStormChance: 0,
    flareChance: 0.2,
    discussionQuestions: [
      'How did you prepare your power reserves before the lunar night began?',
      'Why is water recycling critical when power is too low to run full oxygen generation?',
      'What trade-off did you make between growing food and conserving power during the dark period?',
    ],
  },
  {
    id: 'mars-landing',
    number: '03',
    title: 'Mars Landing: Jezero Outpost',
    destination: 'mars',
    difficulty: 'Flight',
    targetSols: 5,
    briefing:
      'Touch down in Jezero Crater. Mars receives only 43% of Earth’s sunlight, so solar arrays produce less power. Balance ISRU water recycling and greenhouse output.',
    realNasaContext:
      'Mars averages -63°C and 610 Pa atmospheric pressure—less than 1% of Earth’s sea-level pressure (NASA Mars Fact Sheet).',
    startingResources: { power: 65, lifeSupport: 70, food: 65, shielding: 60 },
    startingModules: {
      solar_array: 1,
      oxygen_gen: 1,
      greenhouse: 1,
      water_recycler: 1,
      regolith_shield: 1,
      storm_shelter: 0,
    },
    dustStormChance: 0.18,
    flareChance: 0.2,
    discussionQuestions: [
      'Why do solar panels on Mars generate less electricity than the same panels on the Moon?',
      'How does the thin Martian atmosphere affect radiation compared to Earth?',
      'When cargo resupply is delayed, which module helps an outpost become self-reliant?',
    ],
  },
  {
    id: 'mars-dust-storm',
    number: '04',
    title: 'Mars Dust Storm',
    destination: 'mars',
    difficulty: 'Commander',
    targetSols: 6,
    briefing:
      'Regional dust storms are sweeping Jezero Crater. Dust coats solar panels and blocks sunlight. Keep your crew fed and shielded until the skies clear.',
    realNasaContext:
      'In 2018, a planet-encircling dust storm on Mars blocked 99% of sunlight at Opportunity’s location, ending its 15-year mission (NASA JPL).',
    startingResources: { power: 60, lifeSupport: 68, food: 65, shielding: 62 },
    startingModules: {
      solar_array: 2,
      oxygen_gen: 1,
      greenhouse: 1,
      water_recycler: 1,
      regolith_shield: 1,
      storm_shelter: 0,
    },
    dustStormChance: 0.35,
    flareChance: 0.2,
    discussionQuestions: [
      'How did dust storms change your priority between engineering maintenance and botany?',
      'Why did NASA’s Opportunity rover fail during a global dust storm, and how can a human outpost survive one?',
      'What happens to crew morale and food supply if you shut down the greenhouse to save power?',
    ],
  },
  {
    id: 'long-duration',
    number: '05',
    title: 'Long-Duration Outpost',
    destination: 'mars',
    difficulty: 'Commander',
    targetSols: 6,
    briefing:
      'Command a 6-sol deep-space expedition. Face solar flares, dust storms, and equipment wear with no guaranteed resupply. Every system is connected.',
    realNasaContext:
      'A round-trip human mission to Mars is projected to last 500–900 days, requiring closed-loop life support recycling over 95% of water and air (NASA ECLSS).',
    startingResources: { power: 62, lifeSupport: 65, food: 60, shielding: 58 },
    startingModules: {
      solar_array: 1,
      oxygen_gen: 1,
      greenhouse: 1,
      water_recycler: 1,
      regolith_shield: 1,
      storm_shelter: 0,
    },
    dustStormChance: 0.28,
    flareChance: 0.28,
    discussionQuestions: [
      'Which two resources were hardest to keep in balance over 15 sols, and why?',
      'How did early investments in shielding or water recycling pay off later in the mission?',
      'If you were briefing the next junior commander, what is your #1 rule for running Sol One?',
    ],
  },
];

export const MODULE_INFO: Record<
  keyof MissionConfig['startingModules'],
  {
    name: string;
    shortEffect: string;
    whyItMatters: string;
    nasaFact: string;
    powerCost: number;
  }
> = {
  solar_array: {
    name: 'Solar Array',
    shortEffect: '+Power each sol',
    whyItMatters: 'Every life-support pump, heater, and grow-light depends on electricity.',
    nasaFact: 'The ISS solar arrays span 73 meters and generate up to 120 kilowatts of power (NASA).',
    powerCost: 0,
  },
  oxygen_gen: {
    name: 'Oxygen Generator',
    shortEffect: '+Life Support, -Power',
    whyItMatters: 'Splits recycled water into breathable oxygen using electrolysis.',
    nasaFact: 'On the ISS, the Oxygen Generation System produces about 5.4 kg of oxygen per day (NASA ECLSS).',
    powerCost: 4,
  },
  greenhouse: {
    name: 'Hydroponic Greenhouse',
    shortEffect: '+Food, -Power & -Water',
    whyItMatters: 'Fresh plants feed the crew and absorb CO2, but grow lights and roots use power and water.',
    nasaFact: 'NASA’s Veggie experiment aboard the ISS has grown red romaine lettuce and zinnias in microgravity.',
    powerCost: 5,
  },
  water_recycler: {
    name: 'Water Recycler',
    shortEffect: '+Life Support efficiency',
    whyItMatters: 'Recovers moisture from air and wastewater so the outpost needs fewer resupply shipments.',
    nasaFact: 'The ISS Environmental Control and Life Support System recycles about 98% of crew water (NASA).',
    powerCost: 3,
  },
  regolith_shield: {
    name: 'Regolith Shielding',
    shortEffect: '+Radiation protection',
    whyItMatters: 'Packing local Moon or Mars soil over the habitat blocks cosmic rays and solar particles.',
    nasaFact: 'A 1-meter layer of compacted lunar regolith can cut radiation dose by more than half (NASA).',
    powerCost: 0,
  },
  storm_shelter: {
    name: 'Storm Shelter',
    shortEffect: 'Protects crew during Solar Flares',
    whyItMatters: 'A dense inner bay surrounded by water tanks shields astronauts during sudden solar storms.',
    nasaFact: 'Water is rich in hydrogen, making it one of the best lightweight shields against solar particle events (NASA).',
    powerCost: 2,
  },
};
