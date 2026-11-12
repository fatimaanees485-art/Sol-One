import React, { useState } from 'react';
import { MISSIONS } from '../game/missions';

interface MissionSelectPageProps {
  onLaunch: (missionId: string, crewSize: number, outpostName: string) => void;
}

export const MissionSelectPage: React.FC<MissionSelectPageProps> = ({ onLaunch }) => {
  const [selectedId, setSelectedId] = useState(MISSIONS[0].id);
  const [crewSize, setCrewSize] = useState(3);
  const [outpostName, setOutpostName] = useState('Sol One');

  const selectedMission = MISSIONS.find((m) => m.id === selectedId) || MISSIONS[0];
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <div className="font-mono text-xs text-[#5E9C94] uppercase tracking-wider mb-1">
          FLIGHT OPERATIONS · MISSION SELECT
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#EDE7DA]">
          Choose Your Destination &amp; Crew
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Mission List */}
        <div className="lg:col-span-7 space-y-3">
          {MISSIONS.map((m) => {
            const active = m.id === selectedId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedId(m.id)}
                className={`w-full text-left p-4 rounded-[3px] border transition-colors cursor-pointer ${
                  active
                    ? 'border-[#E8622C] bg-[#132036]'
                    : 'border-[#EDE7DA]/20 bg-[#0F1A2B] hover:border-[#EDE7DA]/40'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className="font-display text-xl font-bold text-[#EDE7DA]">
                    {m.number}. {m.title}
                  </span>
                  <span className="font-mono text-xs text-[#EDE7DA]/75 shrink-0">
                    {m.destination.toUpperCase()} · {m.targetSols} SOLS · {m.difficulty}
                  </span>
                </div>
                <p className="text-sm text-[#EDE7DA]/80 leading-relaxed">
                  {m.briefing}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right 5 cols: Outpost Configuration */}
        <div className="lg:col-span-5 paper-grain border border-[#0B1320]/20 rounded-[3px] p-6 flex flex-col justify-between">
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#E8622C] font-semibold mb-1">
              OUTPOST CONFIGURATION
            </div>
            <h2 className="font-display text-2xl font-bold text-[#0B1320] mb-4">
              {selectedMission.title}
            </h2>

            <div className="mb-4">
              <label
                htmlFor="outpost-name"
                className="block font-mono text-xs uppercase tracking-wider text-[#0B1320]/80 mb-1.5"
              >
                Outpost Name
              </label>
              <input
                id="outpost-name"
                type="text"
                maxLength={24}
                value={outpostName}
                onChange={(e) => setOutpostName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#0B1320]/30 rounded-[3px] text-[#0B1320] font-mono text-sm focus:outline-none focus:border-[#E8622C]"
              />
            </div>

            <div className="mb-5">
              <div className="font-mono text-xs uppercase tracking-wider text-[#0B1320]/80 mb-1.5">
                Crew Size ({crewSize} Astronauts)
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 4].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setCrewSize(size)}
                    className={`py-2 font-mono text-sm rounded-[3px] border cursor-pointer transition-colors ${
                      crewSize === size
                        ? 'bg-[#0B1320] text-[#EDE7DA] border-[#0B1320]'
                        : 'bg-white text-[#0B1320] border-[#0B1320]/25 hover:border-[#0B1320]'
                    }`}
                  >
                    {size} Crew
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#0B1320]/70 mt-1.5">
                Larger crews can run more tasks at once, but consume more oxygen,
                water, and food each sol.
              </p>
            </div>

            <div className="p-3 bg-[#0B1320]/5 border border-[#0B1320]/15 rounded-[3px] mb-6">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#0B1320]/70 mb-1">
                Real NASA Context
              </div>
              <p className="text-xs text-[#0B1320]/90 leading-relaxed">
                {selectedMission.realNasaContext}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onLaunch(selectedMission.id, crewSize, outpostName)}
            className="w-full py-3 bg-[#E8622C] text-[#0B1320] font-semibold text-sm rounded-[3px] hover:bg-[#f07340] transition-colors cursor-pointer"
          >
            Launch Outpost
          </button>
        </div>
      </div>
    </main>
  );
};
