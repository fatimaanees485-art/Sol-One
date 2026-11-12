import { MISSIONS } from './missions';
import {
  CrewAllocation,
  EventType,
  Forecast,
  GameState,
  ModuleId,
  PendingWarning,
  Resources,
} from './types';
import { DonkiFlare, MarsWeatherData } from '../types/nasa';

const clamp = (val: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(val)));

export function getMissionById(id: string) {
  return MISSIONS.find((m) => m.id === id) || MISSIONS[0];
}

export function createInitialState(
  missionId: string,
  crewSize: number,
  outpostName: string
): GameState {
  const mission = getMissionById(missionId);
  const safeCrew = Math.max(2, Math.min(4, crewSize));
  const cleanName = outpostName.trim() || 'Sol One';

  return {
    missionId: mission.id,
    outpostName: cleanName,
    destination: mission.destination,
    crewSize: safeCrew,
    sol: 1,
    targetSols: mission.targetSols,
    resources: { ...mission.startingResources },
    modules: { ...mission.startingModules },
    zeroCounters: { power: 0, lifeSupport: 0, food: 0, shielding: 0 },
    pendingWarning: null,
    lastEvent: 'nominal',
    log: [
      {
        sol: 1,
        title: 'Outpost Touchdown',
        cause: `${cleanName} deployed on ${mission.destination === 'moon' ? 'Lunar South Pole' : 'Jezero Crater, Mars'} with ${safeCrew} crew.`,
        effect: 'All 4 core systems initialized at nominal baseline.',
        crewResult: 'CAPCOM: "Welcome to Sol 1, Commander. Keep an eye on the forecast before you commit."',
        severity: 'nominal',
        nasaFact: mission.realNasaContext,
      },
    ],
    status: 'playing',
    endReason: '',
    whatIfHint: '',
    history: [{ sol: 1, resources: { ...mission.startingResources } }],
  };
}

export function isLunarNight(state: GameState): boolean {
  const mission = getMissionById(state.missionId);
  if (!mission.lunarNightInterval) return false;
  const cyclePos = state.sol % (mission.lunarNightInterval + 3);
  return cyclePos >= mission.lunarNightInterval || cyclePos === 0;
}

export function calculateForecast(
  state: GameState,
  allocation: CrewAllocation,
  buildModule: ModuleId | null
): Forecast {
  const mission = getMissionById(state.missionId);
  const mods = { ...state.modules };
  if (buildModule) {
    mods[buildModule] = Math.min(4, mods[buildModule] + 1);
  }

  const solarMultiplier = mission.destination === 'mars' ? 0.65 : 1.0;
  const nightPenalty = isLunarNight(state) ? 0.25 : 1.0;
  const dustPenalty = state.pendingWarning?.type === 'dust_storm' ? 0.45 : 1.0;

  // Power: Solar Array + Engineering crew - module power draw - crew base draw
  const powerGen = Math.round(mods.solar_array * 10 * solarMultiplier * nightPenalty * dustPenalty) + allocation.engineering * 4;
  const powerUse =
    state.crewSize * 2 +
    mods.oxygen_gen * 3 +
    mods.greenhouse * 4 +
    mods.water_recycler * 2 +
    mods.storm_shelter * 1 +
    (buildModule ? 6 : 0);
  let dPower = powerGen - powerUse;

  // Life Support: Oxygen Gen + Water Recycler + Maintenance crew - crew breathing/water - greenhouse water
  const lsGen = mods.oxygen_gen * 5 + mods.water_recycler * 4 + allocation.maintenance * 4 + allocation.botany * 1;
  const lsUse = state.crewSize * 3 + mods.greenhouse * 2;
  let dLifeSupport = lsGen - lsUse;

  // Food: Greenhouse + Botany crew - crew consumption
  const foodGen = mods.greenhouse * 6 + allocation.botany * 4;
  const foodUse = state.crewSize * 3;
  let dFood = foodGen - foodUse;

  // Shielding: Regolith Shield + Shelter crew - ambient cosmic radiation
  const shieldGen = mods.regolith_shield * 2 + allocation.shelter * 3;
  const ambientRad = mission.destination === 'mars' ? 4 : 3;
  let dShielding = shieldGen - ambientRad;

  const notes: string[] = [];
  if (isLunarNight(state)) {
    notes.push('Lunar Night active: solar output reduced to 25%.');
  }
  if (buildModule) {
    notes.push(`Upgrading ${buildModule.replace('_', ' ')} costs 6% Power this sol.`);
  }
  if (state.pendingWarning) {
    if (state.pendingWarning.type === 'solar_flare') {
      const shelterBonus = mods.storm_shelter * 5 + allocation.shelter * 4;
      dPower -= 12;
      dShielding -= Math.max(4, 18 - shelterBonus);
      notes.push('Incoming Solar Flare: Power & Shielding will take a hit.');
    } else if (state.pendingWarning.type === 'dust_storm') {
      notes.push('Incoming Dust Storm: Solar output cut by 55%.');
    } else if (state.pendingWarning.type === 'equipment_failure') {
      dLifeSupport -= 10;
      notes.push('Equipment Wear: Life Support will drop unless Maintenance is assigned.');
    } else if (state.pendingWarning.type === 'cargo_delay') {
      dFood -= 6;
      notes.push('Cargo Delay: No resupply buffer this sol.');
    }
  }

  return {
    deltas: {
      power: dPower,
      lifeSupport: dLifeSupport,
      food: dFood,
      shielding: dShielding,
    },
    notes,
  };
}

function pickNextWarning(
  state: GameState,
  donkiFlares: DonkiFlare[],
  marsWeather: MarsWeatherData | null,
  rng: () => number
): PendingWarning | null {
  const mission = getMissionById(state.missionId);
  if (state.sol >= state.targetSols - 1) return null;

  const roll = rng();
  if (roll < mission.flareChance) {
    const flare = donkiFlares[Math.floor(rng() * donkiFlares.length)];
    const classLabel = flare?.classType || 'M4.2';
    return {
      type: 'solar_flare',
      title: `Solar Flare Alert (Class ${classLabel})`,
      description: `NASA DONKI telemetry detected a ${classLabel} solar flare. Energetic particles arrive next sol.`,
      advice: 'Assign crew to Storm Shelter or upgrade Regolith Shielding.',
      nasaSource: flare?.isFallback
        ? 'NASA DONKI Space Weather Archive (Sample)'
        : 'NASA DONKI Live Space Weather API',
      solsUntilImpact: 1,
    };
  }

  if (mission.destination === 'mars' && roll < mission.flareChance + mission.dustStormChance) {
    const temp = marsWeather ? `${marsWeather.min_temp_c}°C to ${marsWeather.max_temp_c}°C` : '-73°C to -11°C';
    return {
      type: 'dust_storm',
      title: 'Regional Dust Storm Approaching',
      description: `Barometric drop on Mars (${temp}). Airborne dust will dim solar arrays next sol.`,
      advice: 'Assign Engineering crew to clear panels or conserve Power.',
      nasaSource: marsWeather?.isFallback
        ? 'NASA MSL Curiosity / InSight Archive (Sample)'
        : 'NASA InSight Weather API',
      solsUntilImpact: 1,
    };
  }

  if (roll > 0.82) {
    return {
      type: 'equipment_failure',
      title: 'CO2 Scrubber Pressure Drift',
      description: 'Sensors show valve wear in the life-support loop. Needs attention next sol.',
      advice: 'Assign crew to Maintenance to prevent a Life Support drop.',
      nasaSource: 'NASA ECLSS Maintenance Protocol',
      solsUntilImpact: 1,
    };
  }

  return null;
}

export function advanceSol(
  state: GameState,
  allocation: CrewAllocation,
  buildModule: ModuleId | null,
  donkiFlares: DonkiFlare[] = [],
  marsWeather: MarsWeatherData | null = null,
  rng: () => number = Math.random
): GameState {
  if (state.status !== 'playing') return state;

  const forecast = calculateForecast(state, allocation, buildModule);
  const nextModules = { ...state.modules };
  if (buildModule) {
    nextModules[buildModule] = Math.min(4, nextModules[buildModule] + 1);
  }

  const nextResources: Resources = {
    power: clamp(state.resources.power + forecast.deltas.power),
    lifeSupport: clamp(state.resources.lifeSupport + forecast.deltas.lifeSupport),
    food: clamp(state.resources.food + forecast.deltas.food),
    shielding: clamp(state.resources.shielding + forecast.deltas.shielding),
  };

  const nextZeroCounters: Resources = {
    power: nextResources.power === 0 ? state.zeroCounters.power + 1 : 0,
    lifeSupport: nextResources.lifeSupport === 0 ? state.zeroCounters.lifeSupport + 1 : 0,
    food: nextResources.food === 0 ? state.zeroCounters.food + 1 : 0,
    shielding: nextResources.shielding === 0 ? state.zeroCounters.shielding + 1 : 0,
  };

  const resolvedEvent: EventType = state.pendingWarning ? state.pendingWarning.type : 'nominal';
  let severity: 'nominal' | 'warning' | 'critical' = 'nominal';
  if (
    nextResources.power < 25 ||
    nextResources.lifeSupport < 25 ||
    nextResources.food < 25 ||
    nextResources.shielding < 25
  ) {
    severity = 'warning';
  }
  if (
    nextResources.power === 0 ||
    nextResources.lifeSupport === 0 ||
    nextResources.food === 0 ||
    nextResources.shielding === 0
  ) {
    severity = 'critical';
  }

  const causeText = state.pendingWarning
    ? state.pendingWarning.title
    : buildModule
    ? `Upgraded ${buildModule.replace('_', ' ')} to Level ${nextModules[buildModule]}.`
    : 'Standard daily operations and crew rotation.';

  const effectText = `Power ${forecast.deltas.power >= 0 ? '+' : ''}${forecast.deltas.power}%, Life Support ${
    forecast.deltas.lifeSupport >= 0 ? '+' : ''
  }${forecast.deltas.lifeSupport}%, Food ${forecast.deltas.food >= 0 ? '+' : ''}${
    forecast.deltas.food
  }%, Shielding ${forecast.deltas.shielding >= 0 ? '+' : ''}${forecast.deltas.shielding}%.`;

  const crewResult =
    severity === 'critical'
      ? 'CAPCOM: "One system hit 0%! Fix it this sol or we must abort for crew safety."'
      : severity === 'warning'
      ? 'CAPCOM: "Margins are tight, Commander. Check which module is draining your reserves."'
      : 'CAPCOM: "Systems nominal. Crew completed all scheduled tasks."';

  const nextSol = state.sol + 1;
  const newLogEntry = {
    sol: state.sol,
    title: state.pendingWarning ? state.pendingWarning.title : `Sol ${String(state.sol).padStart(3, '0')} Report`,
    cause: causeText,
    effect: effectText,
    crewResult,
    severity,
  };

  // Check loss: any resource at 0 for 2 consecutive sols
  let status: 'playing' | 'won' | 'lost' = 'playing';
  let endReason = '';
  let whatIfHint = '';

  const failedKey = (Object.keys(nextZeroCounters) as (keyof Resources)[]).find(
    (k) => nextZeroCounters[k] >= 2
  );

  if (failedKey) {
    status = 'lost';
    const labels: Record<keyof Resources, string> = {
      power: 'Power reserves',
      lifeSupport: 'Life Support (oxygen & water)',
      food: 'Food supply',
      shielding: 'Radiation Shielding',
    };
    endReason = `${labels[failedKey]} stayed at 0% for two consecutive sols. CAPCOM ordered a safe crew return.`;
    whatIfHint =
      failedKey === 'power'
        ? 'What if you had upgraded the Solar Array earlier or paused the Greenhouse during low-light sols?'
        : failedKey === 'lifeSupport'
        ? 'What if you had assigned more crew to Maintenance or upgraded the Water Recycler?'
        : failedKey === 'food'
        ? 'What if you had expanded the Greenhouse and assigned a crew member to Botany?'
        : 'What if you had built a Storm Shelter or added Regolith Shielding before the solar flare?';
  } else if (nextSol > state.targetSols) {
    status = 'won';
    endReason = `Outpost ${state.outpostName} completed all ${state.targetSols} sols with the crew healthy!`;
    whatIfHint =
      'Try the next mission with a larger crew or fewer starting reserves to test your systems thinking.';
  }

  const nextWarning = status === 'playing' ? pickNextWarning(state, donkiFlares, marsWeather, rng) : null;

  return {
    ...state,
    sol: status === 'won' ? state.targetSols : nextSol,
    resources: nextResources,
    modules: nextModules,
    zeroCounters: nextZeroCounters,
    pendingWarning: nextWarning,
    lastEvent: resolvedEvent,
    log: [newLogEntry, ...state.log].slice(0, 20),
    status,
    endReason,
    whatIfHint,
    history: [...state.history, { sol: nextSol, resources: nextResources }],
  };
}
