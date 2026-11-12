import React from 'react';
import { DonkiFlare, MarsWeatherData } from '../types/nasa';

interface LearnPageProps {
  donkiFlares: DonkiFlare[];
  marsWeather: MarsWeatherData | null;
}

const GLOSSARY = [
  {
    term: 'Radiation',
    def: 'High-energy particles and rays from the Sun and deep space. Outside Earth’s magnetic field, astronauts need regolith or water shielding.',
  },
  {
    term: 'Solar Flare',
    def: 'A sudden flash of energy on the Sun that can send charged particles toward the Moon or Mars, disrupting power and raising radiation.',
  },
  {
    term: 'Regolith',
    def: 'Loose, dusty rock and soil covering the Moon and Mars. Packing it over habitats provides heavy, local radiation protection.',
  },
  {
    term: 'ISRU (In-Situ Resource Utilization)',
    def: 'Living off the land in space—like mining lunar polar ice for drinking water and oxygen instead of shipping everything from Earth.',
  },
  {
    term: 'ECLSS',
    def: 'Environmental Control and Life Support System—the hardware that recycles air and water inside a spacecraft or outpost.',
  },
  {
    term: 'Sol',
    def: 'One solar day on Mars (24 hours, 39 minutes). In Sol One, each turn represents one sol of outpost operations.',
  },
];

export const LearnPage: React.FC<LearnPageProps> = ({ donkiFlares, marsWeather }) => {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <div className="font-mono text-xs text-[#5E9C94] uppercase tracking-wider mb-1">
          FIELD GUIDE · GLOSSARY &amp; NASA DATA
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#EDE7DA]">
          How Space Habitats Work
        </h1>
        <p className="text-sm text-[#EDE7DA]/75 mt-1">
          Game values are simplified for learning. Real NASA telemetry is labeled
          with its source below.
        </p>
      </div>

      {/* Glossary */}
      <section className="paper-grain border border-[#0B1320]/20 rounded-[3px] p-6">
        <h2 className="font-display text-2xl font-bold text-[#0B1320] mb-4">
          Mission Glossary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GLOSSARY.map((item) => (
            <div
              key={item.term}
              className="bg-white border border-[#0B1320]/15 p-4 rounded-[3px]"
            >
              <div className="font-mono text-xs font-semibold uppercase text-[#E8622C] mb-1">
                {item.term}
              </div>
              <p className="text-sm text-[#0B1320]/85 leading-relaxed">{item.def}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live / Sample NASA Data Stories */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#EDE7DA]/20 bg-[#0F1A2B] p-5 rounded-[3px]">
          <div className="font-mono text-xs text-[#5E9C94] uppercase tracking-wider mb-1">
            NASA DONKI · SOLAR FLARE TELEMETRY
          </div>
          <h2 className="font-display text-2xl font-bold text-[#EDE7DA] mb-3">
            Recent Solar Flares
          </h2>
          <div className="space-y-2.5">
            {donkiFlares.slice(0, 3).map((flare) => (
              <div
                key={flare.flrID}
                className="p-3 bg-[#0B1320] border border-[#EDE7DA]/15 rounded-[3px]"
              >
                <div className="flex items-center justify-between font-mono text-xs text-[#E8622C] mb-1">
                  <span>CLASS {flare.classType}</span>
                  <span>{flare.beginTime.slice(0, 10)}</span>
                </div>
                <p className="text-xs text-[#EDE7DA]/80">{flare.note}</p>
                <div className="font-mono text-[10px] text-[#EDE7DA]/55 mt-1">
                  Source: {flare.isFallback ? 'NASA DONKI Archive (Sample)' : 'NASA DONKI Live API'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#EDE7DA]/20 bg-[#0F1A2B] p-5 rounded-[3px]">
          <div className="font-mono text-xs text-[#5E9C94] uppercase tracking-wider mb-1">
            NASA MARS WEATHER · CURIOSITY / INSIGHT
          </div>
          <h2 className="font-display text-2xl font-bold text-[#EDE7DA] mb-3">
            Martian Surface Conditions
          </h2>
          {marsWeather ? (
            <div className="p-4 bg-[#0B1320] border border-[#EDE7DA]/15 rounded-[3px] space-y-2">
              <div className="font-mono text-xs text-[#EDE7DA]/70">
                SOL {marsWeather.sol} · {marsWeather.terrestrial_date}
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <div className="font-mono text-[11px] text-[#EDE7DA]/60">MIN TEMP</div>
                  <div className="font-mono text-xl font-semibold tabular-nums text-[#EDE7DA]">
                    {marsWeather.min_temp_c}°C
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[11px] text-[#EDE7DA]/60">MAX TEMP</div>
                  <div className="font-mono text-xl font-semibold tabular-nums text-[#EDE7DA]">
                    {marsWeather.max_temp_c}°C
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[11px] text-[#EDE7DA]/60">PRESSURE</div>
                  <div className="font-mono text-xl font-semibold tabular-nums text-[#EDE7DA]">
                    {marsWeather.pressure_pa} Pa
                  </div>
                </div>
              </div>
              <div className="font-mono text-[10px] text-[#EDE7DA]/55 pt-2 border-t border-[#EDE7DA]/10">
                Source: {marsWeather.source}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#EDE7DA]/75">Loading Mars weather...</p>
          )}
        </div>
      </section>

      {/* Animated NASA Mission Gallery */}
      <section className="space-y-4">
        <div>
          <div className="font-mono text-xs text-[#5E9C94] uppercase tracking-wider mb-1">
            NASA MISSION GALLERY
          </div>
          <h2 className="font-display text-2xl font-bold text-[#EDE7DA]">
            Real Missions That Inspired Sol One
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'ISS Spacewalk (EVA)',
              caption: 'Astronauts work outside the International Space Station above Earth.',
              src: '/assets/images/nasa_spacewalk_earth_1794411651165.jpg',
            },
            {
              title: 'Artemis SLS Launch',
              caption: 'NASA’s Space Launch System carries crew toward the Moon.',
              src: '/assets/images/nasa_artemis_launch_1794411651374.jpg',
            },
            {
              title: 'Mars Rover Curiosity',
              caption: 'Exploring Gale Crater and measuring Martian weather every sol.',
              src: '/assets/images/nasa_mars_rover_1794411652013.jpg',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="border border-[#EDE7DA]/20 bg-[#0F1A2B] rounded-[3px] overflow-hidden group"
            >
              <div className="h-44 overflow-hidden bg-[#070B12]">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover nasa-ken-burns group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3.5">
                <div className="font-display text-lg font-bold text-[#EDE7DA]">
                  {item.title}
                </div>
                <p className="text-xs text-[#EDE7DA]/75 mt-1">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
