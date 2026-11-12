import React from 'react';
import { ApodData } from '../types/nasa';
import { MissionPatchSvg } from '../components/Icons';

interface HomePageProps {
  apod: ApodData | null;
  hasSavedGame: boolean;
  onStartMission: () => void;
  onResumeGame: () => void;
  onOpenTutorial: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  apod,
  hasSavedGame,
  onStartMission,
  onResumeGame,
  onOpenTutorial,
}) => {
  const heroImage =
    apod && !apod.isFallback
      ? apod.url
      : '/src/assets/images/nasa_spacewalk_earth_1794411651165.jpg';

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left 7 cols: Editorial Briefing */}
        <div className="lg:col-span-7 flex flex-col justify-between border border-[#EDE7DA]/20 bg-[#0F1A2B] p-6 sm:p-8 rounded-[3px]">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <MissionPatchSvg className="w-10 h-10 shrink-0" />
              <div className="font-mono text-xs text-[#EDE7DA]/75">
                SOL ONE · JUNIOR ASTRONAUT MISSION TRAINER
              </div>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#EDE7DA] leading-[1.05] mb-4">
              A space habitat is a balancing act, not just a shelter.
            </h1>

            <p className="text-base text-[#EDE7DA]/85 leading-relaxed max-w-xl mb-6">
              Command a Moon or Mars outpost for 8 to 15 sols. Every module you
              build trades one resource for another: greenhouses grow food, but
              drink water and draw power. Solar flares test your shielding.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#EDE7DA]/15">
            <button
              type="button"
              data-start="true"
              onClick={onStartMission}
              className="px-5 py-2.5 bg-[#E8622C] text-[#0B1320] font-semibold text-sm rounded-[3px] hover:bg-[#f07340] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EDE7DA] cursor-pointer"
            >
              Select Mission
            </button>

            <button
              type="button"
              onClick={onOpenTutorial}
              className="px-4 py-2.5 border border-[#EDE7DA]/30 text-[#EDE7DA] text-sm rounded-[3px] hover:bg-[#EDE7DA]/10 transition-colors cursor-pointer"
            >
              60-Second Briefing
            </button>
          </div>
        </div>

        {/* Right 5 cols: NASA APOD Daily Space Image */}
        <div className="lg:col-span-5 border border-[#EDE7DA]/20 bg-[#0F1A2B] rounded-[3px] overflow-hidden flex flex-col">
          <div className="relative h-60 sm:h-72 bg-[#070B12] overflow-hidden">
            <img
              src={heroImage}
              alt={apod?.title || 'Lunar South Pole Outpost'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover nasa-ken-burns"
            />
          </div>
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[11px] text-[#5E9C94] uppercase tracking-wider mb-1">
                NASA Astronomy Picture of the Day · {apod?.date || 'Sample'}
              </div>
              <h2 className="font-display text-xl font-bold text-[#EDE7DA] mb-2">
                {apod?.title || 'Tycho Crater and the Lunar South Highlands'}
              </h2>
              <p className="text-xs text-[#EDE7DA]/75 leading-relaxed line-clamp-4">
                {apod?.explanation ||
                  'Real NASA imagery powers the Sol One briefing room. When live APIs are offline, curated NASA archive data keeps the trainer running.'}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#EDE7DA]/10 font-mono text-[11px] text-[#EDE7DA]/60">
              Credit: {apod?.copyright || 'NASA / Public Domain'}
            </div>
          </div>
        </div>
      </div>

      {/* 4-System Overview Strip (Field Engineer's Notebook style) */}
      <section className="mt-8 paper-grain border border-[#0B1320]/20 rounded-[3px] p-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4 pb-3 border-b border-[#0B1320]/15">
          <h2 className="font-display text-2xl font-bold text-[#0B1320]">
            Four Connected Systems
          </h2>
          <span className="font-mono text-xs text-[#0B1320]/70">
            ENGINEER&apos;S NOTEBOOK · GAME VALUES SIMPLIFIED FOR LEARNING
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-[#0B1320]">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#E8622C] mb-1">
              01. Power
            </div>
            <p className="text-[#0B1320]/85 leading-relaxed">
              Generated by solar arrays. Drained by oxygen generators, greenhouses,
              and lunar nights or Mars dust storms.
            </p>
          </div>
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#E8622C] mb-1">
              02. Life Support
            </div>
            <p className="text-[#0B1320]/85 leading-relaxed">
              Oxygen and recycled water. Kept healthy by the Oxygen Generator,
              Water Recycler, and crew maintenance.
            </p>
          </div>
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#E8622C] mb-1">
              03. Food
            </div>
            <p className="text-[#0B1320]/85 leading-relaxed">
              Grown in the Hydroponic Greenhouse. More plants feed larger crews
              but require extra power and water.
            </p>
          </div>
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#E8622C] mb-1">
              04. Radiation Shielding
            </div>
            <p className="text-[#0B1320]/85 leading-relaxed">
              Protects astronauts from cosmic rays and solar flares using
              compacted regolith and a water-lined storm shelter.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
