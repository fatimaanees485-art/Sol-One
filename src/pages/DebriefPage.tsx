import React from 'react';
import { GameState } from '../game/types';

interface DebriefPageProps {
  state: GameState;
  onPlayAgain: () => void;
  onSelectMission: () => void;
}

export const DebriefPage: React.FC<DebriefPageProps> = ({
  state,
  onPlayAgain,
  onSelectMission,
}) => {
  const won = state.status === 'won';

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="paper-grain border border-[#0B1320]/20 rounded-[3px] p-6 sm:p-8">
        <div className="font-mono text-xs uppercase tracking-wider text-[#E8622C] font-semibold mb-1">
          MISSION DEBRIEF · {state.outpostName.toUpperCase()}
        </div>
        <h1 className="font-display text-4xl font-bold text-[#0B1320] mb-3">
          {won ? 'Mission Accomplished' : 'Safe Crew Return Ordered'}
        </h1>
        <p className="text-base text-[#0B1320]/85 leading-relaxed mb-6">
          {state.endReason}
        </p>

        {/* Final Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {(
            [
              { label: 'Power', val: state.resources.power },
              { label: 'Life Support', val: state.resources.lifeSupport },
              { label: 'Food', val: state.resources.food },
              { label: 'Shielding', val: state.resources.shielding },
            ] as const
          ).map((item) => (
            <div
              key={item.label}
              className="bg-white border border-[#0B1320]/15 p-3 rounded-[3px]"
            >
              <div className="font-mono text-[11px] uppercase text-[#0B1320]/65">
                {item.label}
              </div>
              <div className="font-mono text-2xl font-semibold tabular-nums text-[#0B1320]">
                {item.val}%
              </div>
            </div>
          ))}
        </div>

        {/* What-If Hint */}
        <div className="p-4 bg-[#0B1320] text-[#EDE7DA] rounded-[3px] mb-6">
          <div className="font-mono text-xs uppercase tracking-wider text-[#5E9C94] mb-1">
            What If You Had Chosen Differently?
          </div>
          <p className="text-sm text-[#EDE7DA]/90 leading-relaxed">
            {state.whatIfHint}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="px-5 py-2.5 bg-[#E8622C] text-[#0B1320] font-semibold text-sm rounded-[3px] hover:bg-[#f07340] transition-colors cursor-pointer"
          >
            Replay This Mission
          </button>
          <button
            type="button"
            onClick={onSelectMission}
            className="px-5 py-2.5 border border-[#0B1320] text-[#0B1320] font-semibold text-sm rounded-[3px] hover:bg-[#0B1320]/5 transition-colors cursor-pointer"
          >
            Choose Another Mission
          </button>
        </div>
      </div>
    </main>
  );
};
