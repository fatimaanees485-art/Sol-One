import React from 'react';
import { MISSIONS } from '../game/missions';

export const TeachersPage: React.FC = () => {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <div className="font-mono text-xs text-[#5E9C94] uppercase tracking-wider mb-1">
          EDUCATOR GUIDE · GRADES 4–8 (AGES 9–14)
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#EDE7DA]">
          For Teachers
        </h1>
        <p className="text-sm text-[#EDE7DA]/80 mt-1 max-w-2xl">
          Sol One is designed for 10–15 minute classroom sessions. Students learn
          that space habitats are engineered systems with real trade-offs.
        </p>
      </div>

      {/* Learning Goals & NGSS */}
      <section className="paper-grain border border-[#0B1320]/20 rounded-[3px] p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0B1320] mb-2">
            Learning Goals
          </h2>
          <ul className="text-sm text-[#0B1320]/85 space-y-2 list-disc pl-5">
            <li>Identify how power, life support, food, and shielding depend on each other.</li>
            <li>Use a next-turn forecast to plan ahead before solar flares or dust storms hit.</li>
            <li>Explain why closed-loop recycling (ISRU &amp; ECLSS) is essential for deep space.</li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0B1320] mb-2">
            NGSS Alignment
          </h2>
          <ul className="text-sm text-[#0B1320]/85 space-y-2">
            <li>
              <strong className="font-mono text-xs">MS-ETS1-2:</strong> Evaluate competing
              design solutions using a systematic process to determine how well they meet
              criteria and constraints.
            </li>
            <li>
              <strong className="font-mono text-xs">MS-ESS3-3:</strong> Apply scientific
              principles to design a method for monitoring and minimizing human impact on
              the environment.
            </li>
            <li>
              <strong className="font-mono text-xs">MS-PS3-3:</strong> Apply scientific
              principles to design, construct, and test a device that either minimizes or
              maximizes thermal energy transfer.
            </li>
          </ul>
        </div>
      </section>

      {/* Discussion Questions per Mission */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-[#EDE7DA]">
          Discussion Questions by Mission
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {MISSIONS.map((m) => (
            <div
              key={m.id}
              className="border border-[#EDE7DA]/20 bg-[#0F1A2B] p-5 rounded-[3px]"
            >
              <div className="font-mono text-xs text-[#E8622C] uppercase mb-1">
                Mission {m.number} · {m.destination.toUpperCase()} · {m.difficulty}
              </div>
              <h3 className="font-display text-xl font-bold text-[#EDE7DA] mb-2">
                {m.title}
              </h3>
              <ol className="text-sm text-[#EDE7DA]/85 space-y-1.5 list-decimal pl-5">
                {m.discussionQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
