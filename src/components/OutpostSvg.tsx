import React from 'react';
import { Destination, EventType, ModuleLevels } from '../game/types';

interface OutpostSvgProps {
  destination: Destination;
  modules: ModuleLevels;
  crewSize: number;
  lastEvent: EventType;
  isNight: boolean;
}

export const OutpostSvg: React.FC<OutpostSvgProps> = ({
  destination,
  modules,
  crewSize,
  lastEvent,
  isNight,
}) => {
  const skyColor =
    destination === 'moon'
      ? '#070B12'
      : lastEvent === 'dust_storm'
      ? '#4A2C1D'
      : '#241814';
  const groundColor = destination === 'moon' ? '#363C45' : '#7A3E26';
  const ridgeColor = destination === 'moon' ? '#242930' : '#582B19';

  return (
    <div className="relative w-full border border-[#EDE7DA]/20 bg-[#0B1320] rounded-[3px] overflow-hidden">
      <svg
        viewBox="0 0 640 240"
        className="w-full h-auto block"
        role="img"
        aria-label={`${destination === 'moon' ? 'Lunar' : 'Mars'} outpost schematic`}
      >
        {/* Sky */}
        <rect width="640" height="240" fill={skyColor} />

        {/* Sun / Stars */}
        {!isNight && (
          <circle
            cx="560"
            cy="46"
            r={destination === 'moon' ? 16 : 12}
            fill={destination === 'moon' ? '#EDE7DA' : '#E8B87D'}
            opacity={lastEvent === 'dust_storm' ? 0.35 : 0.9}
          />
        )}
        {destination === 'moon' && (
          <g fill="#EDE7DA" opacity="0.5">
            <circle cx="80" cy="35" r="1.2" />
            <circle cx="190" cy="55" r="1" />
            <circle cx="310" cy="28" r="1.4" />
            <circle cx="440" cy="48" r="1" />
          </g>
        )}

        {/* Distant ridge */}
        <path
          d="M0 165 Q120 130 250 158 T490 148 T640 162 L640 240 L0 240 Z"
          fill={ridgeColor}
        />

        {/* Foreground ground */}
        <path
          d="M0 185 Q180 175 340 188 T640 180 L640 240 L0 240 Z"
          fill={groundColor}
        />

        {/* Regolith Shielding Dome */}
        {modules.regolith_shield > 0 && (
          <path
            d="M210 182 Q310 112 410 182 Z"
            fill="none"
            stroke="#EDE7DA"
            strokeWidth={1 + modules.regolith_shield * 0.8}
            strokeDasharray="6 3"
            opacity="0.7"
          />
        )}

        {/* Main Habitat Core */}
        <rect
          x="255"
          y="132"
          width="110"
          height="50"
          rx="4"
          fill="#EDE7DA"
          stroke="#0B1320"
          strokeWidth="2"
        />
        <rect x="270" y="146" width="22" height="14" rx="2" fill="#0B1320" />
        <rect x="302" y="146" width="22" height="14" rx="2" fill="#0B1320" />
        <rect x="334" y="146" width="18" height="24" rx="2" fill="#5E9C94" />

        {/* Solar Arrays */}
        {Array.from({ length: modules.solar_array }).map((_, i) => (
          <g key={`solar-${i}`} transform={`translate(${95 + i * 38}, 144)`}>
            <line x1="16" y1="20" x2="16" y2="40" stroke="#EDE7DA" strokeWidth="2" />
            <rect
              x="0"
              y="6"
              width="32"
              height="16"
              fill="#1E3A5F"
              stroke="#EDE7DA"
              strokeWidth="1.5"
            />
            <line x1="16" y1="6" x2="16" y2="22" stroke="#EDE7DA" strokeWidth="1" />
          </g>
        ))}

        {/* Greenhouse */}
        {modules.greenhouse > 0 && (
          <g transform="translate(382, 142)">
            <path
              d="M0 40 V16 Q28 -4 56 16 V40 Z"
              fill="#5E9C94"
              fillOpacity="0.35"
              stroke="#EDE7DA"
              strokeWidth="1.75"
            />
            <line x1="18" y1="8" x2="18" y2="40" stroke="#EDE7DA" strokeWidth="1" />
            <line x1="38" y1="8" x2="38" y2="40" stroke="#EDE7DA" strokeWidth="1" />
          </g>
        )}

        {/* Water Recycler & Oxygen Gen */}
        <g transform="translate(455, 148)">
          <rect x="0" y="6" width="26" height="28" rx="2" fill="#2A3B52" stroke="#EDE7DA" strokeWidth="1.5" />
          <circle cx="13" cy="20" r="6" fill="none" stroke="#5E9C94" strokeWidth="1.5" />
        </g>

        {/* Storm Shelter */}
        {modules.storm_shelter > 0 && (
          <g transform="translate(212, 152)">
            <rect x="0" y="6" width="32" height="24" rx="2" fill="#E8622C" stroke="#EDE7DA" strokeWidth="1.5" />
            <path d="M8 18 H24" stroke="#EDE7DA" strokeWidth="2" />
          </g>
        )}

        {/* Crew Silhouettes (Walking) */}
        {Array.from({ length: crewSize }).map((_, i) => (
          <g
            key={`crew-${i}`}
            className="crew-walk"
            style={{ animationDelay: `${i * 0.9}s` }}
          >
            <g transform={`translate(${250 + i * 26}, 196)`}>
              <circle cx="6" cy="4" r="3.5" fill="#EDE7DA" />
              <rect x="2" y="8" width="8" height="10" rx="2" fill="#EDE7DA" />
            </g>
          </g>
        ))}

        {/* Solar Flare Visual */}
        {lastEvent === 'solar_flare' && (
          <path
            d="M0 30 Q160 65 320 35 T640 50"
            fill="none"
            stroke="#E8622C"
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />
        )}
      </svg>

      {/* Stamped corner label */}
      <div className="px-3 py-1.5 border-t border-[#EDE7DA]/15 flex items-center justify-between font-mono text-[11px] text-[#EDE7DA]/75">
        <span>
          {destination === 'moon' ? 'LUNA · SHACKLETON RIM' : 'MARS · JEZERO CRATER'}
        </span>
        <span>
          {isNight ? 'LUNAR NIGHT' : lastEvent === 'dust_storm' ? 'DUST STORM' : 'CLEAR SKY'}
        </span>
      </div>
    </div>
  );
};
