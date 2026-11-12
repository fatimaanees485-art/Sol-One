import React, { useEffect, useState } from 'react';
import { calculateForecast, isLunarNight } from '../game/engine';
import { MODULE_INFO } from '../game/missions';
import { CrewAllocation, CrewTask, GameState, ModuleId } from '../game/types';
import { CREW_ROSTER } from '../data/crew';
import { ResourceGauge } from '../components/ResourceGauge';
import { OutpostSvg } from '../components/OutpostSvg';
import { Outpost3D } from '../components/Outpost3D';
import { MissionLog } from '../components/MissionLog';
import {
  AlertIcon,
  FoodIcon,
  LifeSupportIcon,
  PowerIcon,
  ShieldIcon,
} from '../components/Icons';

interface GamePageProps {
  state: GameState;
  onAdvanceSol: (allocation: CrewAllocation, buildModule: ModuleId | null) => void;
  onResetMission: () => void;
}

export const GamePage: React.FC<GamePageProps> = ({
  state,
  onAdvanceSol,
  onResetMission,
}) => {
  const [allocation, setAllocation] = useState<CrewAllocation>({
    engineering: 1,
    botany: 1,
    maintenance: Math.max(0, state.crewSize - 2),
    shelter: 0,
  });
  const [buildModule, setBuildModule] = useState<ModuleId | null>(null);
  const [speed, setSpeed] = useState<0 | 1 | 2 | 3>(0); // 0 = paused (turn-based)
  const [selectedInfoModule, setSelectedInfoModule] = useState<ModuleId>('solar_array');
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  const assignedCrew =
    allocation.engineering +
    allocation.botany +
    allocation.maintenance +
    allocation.shelter;
  const remainingCrew = state.crewSize - assignedCrew;

  const forecast = calculateForecast(state, allocation, buildModule);
  const nightActive = isLunarNight(state);

  // Auto-advance timer when speed 1x/2x/3x is active
  useEffect(() => {
    if (speed === 0 || state.status !== 'playing') return;
    const intervalMs = speed === 1 ? 4500 : speed === 2 ? 2500 : 1200;
    const timer = setInterval(() => {
      onAdvanceSol(allocation, buildModule);
      setBuildModule(null);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [speed, state.status, allocation, buildModule, onAdvanceSol]);

  const adjustTask = (task: CrewTask, delta: number) => {
    setAllocation((prev) => {
      const nextVal = prev[task] + delta;
      if (nextVal < 0) return prev;
      if (delta > 0 && remainingCrew <= 0) return prev;
      return { ...prev, [task]: nextVal };
    });
  };

  const handleManualAdvance = () => {
    onAdvanceSol(allocation, buildModule);
    setBuildModule(null);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Top Telemetry Ribbon */}
      <div className="border border-[#EDE7DA]/20 bg-[#0F1A2B] px-4 py-3 rounded-[3px] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-mono text-sm font-semibold text-[#E8622C] tabular-nums">
            SOL {String(state.sol).padStart(3, '0')} / {String(state.targetSols).padStart(3, '0')}
          </span>
          <span className="font-display text-xl font-bold text-[#EDE7DA]">
            {state.outpostName}
          </span>
          <span className="font-mono text-xs text-[#EDE7DA]/70">
            CREW: {state.crewSize} · {state.destination.toUpperCase()}
          </span>
        </div>

        {/* Speed / Pause Controls */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-[#EDE7DA]/60 uppercase mr-1">
            Sim Speed:
          </span>
          {([0, 1, 2, 3] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`px-2.5 py-1 font-mono text-xs rounded-[2px] border cursor-pointer transition-colors ${
                speed === s
                  ? 'bg-[#EDE7DA] text-[#0B1320] border-[#EDE7DA] font-semibold'
                  : 'bg-[#0B1320] text-[#EDE7DA]/80 border-[#EDE7DA]/25 hover:border-[#EDE7DA]/60'
              }`}
            >
              {s === 0 ? 'Pause' : `${s}x`}
            </button>
          ))}
          <button
            type="button"
            onClick={onResetMission}
            className="ml-2 px-2.5 py-1 font-mono text-xs rounded-[2px] border border-[#EDE7DA]/25 text-[#EDE7DA]/75 hover:text-[#EDE7DA] cursor-pointer"
          >
            Abort
          </button>
        </div>
      </div>

      {/* Incoming Event Warning */}
      {state.pendingWarning && (
        <div
          role="alert"
          className="border border-[#E8622C] bg-[#E8622C]/15 p-4 rounded-[3px] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            <AlertIcon className="w-5 h-5 text-[#E8622C] shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#E8622C]">
                WARNING · IMPACT NEXT SOL · {state.pendingWarning.nasaSource}
              </div>
              <div className="font-display text-lg font-bold text-[#EDE7DA]">
                {state.pendingWarning.title}
              </div>
              <p className="text-sm text-[#EDE7DA]/85">
                {state.pendingWarning.description}{' '}
                <span className="text-[#EDE7DA] font-medium">
                  {state.pendingWarning.advice}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4 Resource Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <ResourceGauge
          label="Power"
          value={state.resources.power}
          delta={forecast.deltas.power}
          icon={<PowerIcon />}
          whyItMatters="Powers oxygen, water recycling, and greenhouse lights."
          riskWarning="Low power! Heaters, oxygen generators, and grow lights may shut down."
        />
        <ResourceGauge
          label="Life Support"
          value={state.resources.lifeSupport}
          delta={forecast.deltas.lifeSupport}
          icon={<LifeSupportIcon />}
          whyItMatters="Breathable oxygen and recycled drinking water."
          riskWarning="Air & water critical! Assign Maintenance or upgrade Water Recycler."
        />
        <ResourceGauge
          label="Food"
          value={state.resources.food}
          delta={forecast.deltas.food}
          icon={<FoodIcon />}
          whyItMatters="Keeps the crew energized and healthy."
          riskWarning="Rations running low! Assign Botany or upgrade the Greenhouse."
        />
        <ResourceGauge
          label="Radiation Shielding"
          value={state.resources.shielding}
          delta={forecast.deltas.shielding}
          icon={<ShieldIcon />}
          whyItMatters="Blocks cosmic rays and solar flare particles."
          riskWarning="Shielding weak! Crew is exposed to solar radiation—use Storm Shelter."
        />
      </div>

      {/* Main 12-col Split: Outpost + Modules (7 cols) | Decision Panel (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#EDE7DA]/70">
              Outpost Viewport
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`px-2.5 py-1 font-mono text-xs rounded-[2px] border cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-[#EDE7DA] text-[#0B1320] border-[#EDE7DA] font-semibold'
                    : 'bg-[#0B1320] text-[#EDE7DA]/75 border-[#EDE7DA]/25'
                }`}
              >
                3D View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('2d')}
                className={`px-2.5 py-1 font-mono text-xs rounded-[2px] border cursor-pointer ${
                  viewMode === '2d'
                    ? 'bg-[#EDE7DA] text-[#0B1320] border-[#EDE7DA] font-semibold'
                    : 'bg-[#0B1320] text-[#EDE7DA]/75 border-[#EDE7DA]/25'
                }`}
              >
                2D Schematic
              </button>
            </div>
          </div>

          {viewMode === '3d' ? (
            <Outpost3D
              destination={state.destination}
              modules={state.modules}
              crewSize={state.crewSize}
              lastEvent={state.lastEvent}
              isNight={nightActive}
            />
          ) : (
            <OutpostSvg
              destination={state.destination}
              modules={state.modules}
              crewSize={state.crewSize}
              lastEvent={state.lastEvent}
              isNight={nightActive}
            />
          )}

          {/* Module Upgrade Grid */}
          <div className="border border-[#EDE7DA]/20 bg-[#0F1A2B] p-4 rounded-[3px]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-xl font-bold text-[#EDE7DA]">
                Outpost Modules (Select 1 to Upgrade This Sol)
              </h2>
              {buildModule && (
                <button
                  type="button"
                  onClick={() => setBuildModule(null)}
                  className="font-mono text-xs text-[#E8622C] hover:underline cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(Object.keys(MODULE_INFO) as ModuleId[]).map((modId) => {
                const info = MODULE_INFO[modId];
                const level = state.modules[modId];
                const isSelected = buildModule === modId;
                const maxed = level >= 4;
                return (
                  <button
                    key={modId}
                    type="button"
                    disabled={maxed}
                    onClick={() => {
                      setBuildModule(isSelected ? null : modId);
                      setSelectedInfoModule(modId);
                    }}
                    className={`text-left p-2.5 rounded-[3px] border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSelected
                        ? 'border-[#E8622C] bg-[#E8622C]/15'
                        : 'border-[#EDE7DA]/20 bg-[#0B1320] hover:border-[#EDE7DA]/45'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] text-[#5E9C94] mb-0.5">
                      <span>LVL {level}/4</span>
                      {isSelected && <span className="text-[#E8622C]">QUEUED</span>}
                    </div>
                    <div className="font-semibold text-sm text-[#EDE7DA] truncate">
                      {info.name}
                    </div>
                    <div className="text-[11px] text-[#EDE7DA]/70 truncate">
                      {info.shortEffect}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Why This Matters Card */}
            <div className="mt-3 p-3 bg-[#0B1320] border border-[#EDE7DA]/15 rounded-[3px]">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#5E9C94] mb-1">
                Why This Matters · {MODULE_INFO[selectedInfoModule].name}
              </div>
              <p className="text-xs text-[#EDE7DA]/85 leading-relaxed">
                {MODULE_INFO[selectedInfoModule].whyItMatters}{' '}
                <span className="text-[#EDE7DA]/60">
                  {MODULE_INFO[selectedInfoModule].nasaFact}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Crew Allocation + Forecast + Advance Sol */}
        <div className="lg:col-span-5 paper-grain border border-[#0B1320]/20 rounded-[3px] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-[#0B1320]/15">
              <h2 className="font-display text-2xl font-bold text-[#0B1320]">
                Crew Orders
              </h2>
              <span className="font-mono text-xs text-[#0B1320]/75">
                {remainingCrew} UNASSIGNED
              </span>
            </div>

            <div className="space-y-2.5 mb-5">
              {(
                [
                  { id: 'engineering', label: 'Engineering', hint: '+4% Power' },
                  { id: 'botany', label: 'Botany', hint: '+4% Food, +1% Life Support' },
                  { id: 'maintenance', label: 'Maintenance', hint: '+4% Life Support' },
                  { id: 'shelter', label: 'Storm Shelter', hint: '+3% Shielding' },
                ] as const
              ).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between bg-white border border-[#0B1320]/15 px-3 py-2 rounded-[3px]"
                >
                  <div>
                    <div className="font-semibold text-sm text-[#0B1320]">
                      {task.label}
                    </div>
                    <div className="font-mono text-[11px] text-[#0B1320]/65">
                      {task.hint}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Remove crew from ${task.label}`}
                      onClick={() => adjustTask(task.id, -1)}
                      className="w-8 h-8 border border-[#0B1320]/25 rounded-[2px] font-mono text-sm hover:bg-[#0B1320]/5 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-mono text-sm font-semibold tabular-nums">
                      {allocation[task.id]}
                    </span>
                    <button
                      type="button"
                      aria-label={`Assign crew to ${task.label}`}
                      onClick={() => adjustTask(task.id, 1)}
                      className="w-8 h-8 border border-[#0B1320]/25 rounded-[2px] font-mono text-sm hover:bg-[#0B1320]/5 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Forecast Summary */}
            <div className="p-3 bg-[#0B1320]/5 border border-[#0B1320]/15 rounded-[3px] mb-4">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#0B1320]/70 mb-1.5">
                Next-Sol Forecast
              </div>
              {forecast.notes.length > 0 ? (
                <ul className="text-xs text-[#0B1320]/85 space-y-1 list-disc pl-4">
                  {forecast.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[#0B1320]/80">
                  Nominal operations expected. Check gauge deltas above before
                  advancing.
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleManualAdvance}
            className="w-full py-3 bg-[#E8622C] text-[#0B1320] font-semibold text-sm rounded-[3px] hover:bg-[#f07340] transition-colors cursor-pointer"
          >
            Advance to Sol {state.sol + 1}
          </button>
        </div>
      </div>

      {/* Crew Roster: Humanizing the Outpost */}
      <section className="border border-[#EDE7DA]/20 bg-[#0F1A2B] p-4 rounded-[3px]">
        <div className="font-mono text-xs uppercase tracking-wider text-[#5E9C94] mb-3">
          CREW ON STATION ({state.crewSize} ASTRONAUTS)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CREW_ROSTER.slice(0, state.crewSize).map((member) => {
            const isTight =
              state.resources.power < 40 ||
              state.resources.lifeSupport < 40 ||
              state.resources.food < 40 ||
              state.resources.shielding < 40;
            return (
              <div
                key={member.id}
                className="p-3 bg-[#0B1320] border border-[#EDE7DA]/15 rounded-[3px] flex items-start gap-3"
              >
                <svg
                  viewBox="0 0 36 36"
                  className="w-9 h-9 shrink-0"
                  aria-hidden="true"
                >
                  <rect width="36" height="36" rx="3" fill="#132036" />
                  <circle cx="18" cy="14" r="7" fill="#EDE7DA" />
                  <rect x="13" y="11" width="10" height="5" rx="2" fill="#0B1320" />
                  <path d="M9 32 C9 24, 27 24, 27 32" fill={member.suitAccent} />
                </svg>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-[#EDE7DA] truncate">
                    {member.name}
                  </div>
                  <div className="font-mono text-[11px] text-[#5E9C94] mb-1">
                    {member.role}
                  </div>
                  <p className="text-xs text-[#EDE7DA]/80 leading-snug">
                    &ldquo;{isTight ? member.tightQuote : member.happyQuote}&rdquo;
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Field Notebook Mission Log */}
      <MissionLog entries={state.log} />
    </main>
  );
};
