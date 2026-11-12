import React from 'react';
import { MissionPatchSvg } from '../components/Icons';

export const AboutPage: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="paper-grain border border-[#0B1320]/20 rounded-[3px] p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <MissionPatchSvg className="w-10 h-10" />
          <div>
            <div className="font-mono text-xs text-[#E8622C] font-semibold uppercase">
              NASA SPACE APPS CHALLENGE 2026
            </div>
            <h1 className="font-display text-3xl font-bold text-[#0B1320]">
              About Sol One
            </h1>
          </div>
        </div>

        <p className="text-sm text-[#0B1320]/85 leading-relaxed mb-4">
          Sol One was built for the <strong>Build a Junior Astronaut Mission Trainer</strong>{' '}
          challenge. Our goal is to help students ages 9–14 experience the real
          engineering trade-offs of running a Moon or Mars outpost.
        </p>

        <h2 className="font-display text-xl font-bold text-[#0B1320] mb-2">
          NASA Open Data Sources
        </h2>
        <ul className="text-sm text-[#0B1320]/85 space-y-1.5 list-disc pl-5 mb-5">
          <li>NASA Astronomy Picture of the Day (APOD) API</li>
          <li>NASA Space Weather Database Of Notifications, Knowledge, Information (DONKI)</li>
          <li>NASA Mars InSight / Curiosity REMS Weather Archive</li>
          <li>NASA Environmental Control and Life Support System (ECLSS) Fact Sheets</li>
        </ul>

        <div className="p-3 bg-[#0B1320] text-[#EDE7DA] rounded-[3px] font-mono text-xs">
          Disclaimer: Game values are simplified for learning. Independent project,
          not an official NASA product.
        </div>
      </div>
    </main>
  );
};
