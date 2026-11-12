import React from 'react';
import { LogEntry } from '../game/types';

interface MissionLogProps {
  entries: LogEntry[];
}

export const MissionLog: React.FC<MissionLogProps> = ({ entries }) => {
  return (
    <section
      className="paper-grain border border-[#0B1320]/25 rounded-[3px] p-5 font-mono"
      aria-label="Mission Log"
    >
      <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-[#0B1320]/20">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#0B1320]">
          FIELD NOTEBOOK · MISSION LOG
        </h2>
        <span className="text-[11px] text-[#0B1320]/65 tabular-nums">
          {entries.length} {entries.length === 1 ? 'ENTRY' : 'ENTRIES'}
        </span>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {entries.map((entry, idx) => {
          const badgeColor =
            entry.severity === 'critical'
              ? 'text-[#E8622C]'
              : entry.severity === 'warning'
              ? 'text-[#9A6700]'
              : 'text-[#2D6A62]';

          return (
            <article
              key={`${entry.sol}-${idx}`}
              className="bg-white/80 border border-[#0B1320]/15 p-3 rounded-[2px] text-xs text-[#0B1320]"
            >
              <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-[#0B1320]/10">
                <span className="font-semibold tabular-nums">
                  SOL {String(entry.sol).padStart(3, '0')} · {entry.title}
                </span>
                <span className={`uppercase text-[11px] font-semibold ${badgeColor}`}>
                  {entry.severity}
                </span>
              </div>

              <div className="space-y-1 leading-relaxed text-[#0B1320]/85">
                <p>
                  <span className="font-semibold text-[#0B1320]">CAUSE:</span> {entry.cause}
                </p>
                <p>
                  <span className="font-semibold text-[#0B1320]">EFFECT:</span> {entry.effect}
                </p>
                <p className="text-[#2D6A62] pt-0.5">{entry.crewResult}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
