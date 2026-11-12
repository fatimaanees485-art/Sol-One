export type Destination = 'moon' | 'mars';

export type ResourceKey = 'power' | 'lifeSupport' | 'food' | 'shielding';

export interface Resources {
  power: number;       // 0-100 %
  lifeSupport: number; // 0-100 % (oxygen + water)
  food: number;        // 0-100 %
  shielding: number;   // 0-100 % (radiation protection)
}

export type ModuleId =
  | 'solar_array'
  | 'oxygen_gen'
  | 'greenhouse'
  | 'water_recycler'
  | 'regolith_shield'
  | 'storm_shelter';

export interface ModuleLevels {
  solar_array: number;
  oxygen_gen: number;
  greenhouse: number;
  water_recycler: number;
  regolith_shield: number;
  storm_shelter: number;
}

export type CrewTask = 'engineering' | 'botany' | 'maintenance' | 'shelter';

export interface CrewAllocation {
  engineering: number; // boosts power & repairs
  botany: number;      // boosts food & O2
  maintenance: number; // boosts lifeSupport & prevents failures
  shelter: number;     // reduces radiation impact during storms
}

export type EventType = 'solar_flare' | 'dust_storm' | 'equipment_failure' | 'cargo_delay' | 'nominal';

export interface PendingWarning {
  type: EventType;
  title: string;
  description: string;
  advice: string;
  nasaSource: string;
  solsUntilImpact: number;
}

export interface LogEntry {
  sol: number;
  title: string;
  cause: string;
  effect: string;
  crewResult: string;
  severity: 'nominal' | 'warning' | 'critical';
  nasaFact?: string;
}

export interface MissionConfig {
  id: string;
  number: string;
  title: string;
  destination: Destination;
  difficulty: 'Cadet' | 'Flight' | 'Commander';
  targetSols: number;
  briefing: string;
  realNasaContext: string;
  startingResources: Resources;
  startingModules: ModuleLevels;
  lunarNightInterval?: number; // Moon night every N sols
  dustStormChance: number;
  flareChance: number;
  discussionQuestions: [string, string, string];
}

export interface Forecast {
  deltas: Resources;
  notes: string[];
}

export interface GameState {
  missionId: string;
  outpostName: string;
  destination: Destination;
  crewSize: number;
  sol: number;
  targetSols: number;
  resources: Resources;
  modules: ModuleLevels;
  zeroCounters: Resources; // consecutive sols at 0
  pendingWarning: PendingWarning | null;
  lastEvent: EventType;
  log: LogEntry[];
  status: 'playing' | 'won' | 'lost';
  endReason: string;
  whatIfHint: string;
  history: { sol: number; resources: Resources }[];
}
