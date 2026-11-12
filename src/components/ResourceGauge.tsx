import React from 'react';
import { AlertIcon, CheckIcon } from './Icons';

interface ResourceGaugeProps {
  label: string;
  value: number;
  delta: number;
  icon: React.ReactNode;
  whyItMatters: string;
  riskWarning?: string;
}

export const ResourceGauge: React.FC<ResourceGaugeProps> = ({
  label,
  value,
  delta,
  icon,
  whyItMatters,
  riskWarning,
}) => {
  const isCritical = value < 20;
  const status =
    isCritical ? 'CRITICAL' : value <= 45 ? 'CAUTION' : 'NOMINAL';

  const statusColor =
    status === 'CRITICAL'
      ? 'text-[#E8622C]'
      : status === 'CAUTION'
      ? 'text-[#D99B26]'
      : 'text-[#5E9C94]';

  const barColor =
    status === 'CRITICAL'
      ? 'bg-[#E8622C]'
      : status === 'CAUTION'
      ? 'bg-[#D99B26]'
      : 'bg-[#5E9C94]';

  const segments = 10;
  const filledSegments = Math.round((value / 100) * segments);

  return (
    <div
      className={`p-3.5 rounded-[3px] flex flex-col justify-between transition-colors ${
        isCritical
          ? 'border-2 border-[#E8622C] bg-[#2D1A1E]'
          : 'border border-[#EDE7DA]/20 bg-[#0F1A2B]'
      }`}
      title={whyItMatters}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-[#EDE7DA]">
          <span className="text-[#EDE7DA]/70">{icon}</span>
          <span className="font-mono text-xs uppercase tracking-wider">{label}</span>
        </div>
        <div className={`flex items-center gap-1 font-mono text-[11px] font-medium ${statusColor}`}>
          {status === 'NOMINAL' ? (
            <CheckIcon className="w-3.5 h-3.5" />
          ) : (
            <AlertIcon className="w-3.5 h-3.5" />
          )}
          <span>{status}</span>
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <span className="font-mono text-2xl font-semibold tabular-nums text-[#EDE7DA]">
          {value}%
        </span>
        <span
          className={`font-mono text-xs tabular-nums ${
            delta > 0
              ? 'text-[#5E9C94]'
              : delta < 0
              ? 'text-[#E8622C]'
              : 'text-[#EDE7DA]/60'
          }`}
        >
          Forecast: {delta > 0 ? `+${delta}` : delta}%
        </span>
      </div>

      {/* Segmented instrument bar with tick marks */}
      <div className="grid grid-cols-10 gap-1" role="meter" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        {Array.from({ length: segments }).map((_, idx) => (
          <div
            key={idx}
            className={`h-2.5 rounded-[1px] border border-[#EDE7DA]/15 ${
              idx < filledSegments ? barColor : 'bg-[#0B1320]'
            }`}
          />
        ))}
      </div>

      {isCritical && riskWarning && (
        <p className="mt-2.5 text-[11px] leading-snug text-[#FFD6C4] font-medium">
          {riskWarning}
        </p>
      )}
    </div>
  );
};
