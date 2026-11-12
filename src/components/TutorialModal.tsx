import React, { useState } from 'react';

interface TutorialModalProps {
  onClose: () => void;
}

const STEPS = [
  {
    title: '1. Four Connected Systems',
    body: 'Your outpost relies on Power, Life Support (oxygen & water), Food, and Radiation Shielding. Changing one affects the others—for example, a Greenhouse grows Food but uses Power and Water.',
  },
  {
    title: '2. Read the Forecast First',
    body: 'Before you advance each sol, check the Forecast deltas on every gauge and any incoming Solar Flare or Dust Storm warning. You always get a warning one sol before impact.',
  },
  {
    title: '3. Assign Crew & Upgrade Modules',
    body: 'Assign your astronauts to Engineering, Botany, Maintenance, or Storm Shelter, and optionally upgrade one module per sol. Keep all four gauges above 0% to bring your crew home safely.',
  },
];

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0B1320]/85 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
    >
      <div className="paper-grain border border-[#0B1320] rounded-[3px] max-w-lg w-full p-6">
        <div className="flex items-center justify-between font-mono text-xs text-[#E8622C] font-semibold mb-2">
          <span>60-SECOND BRIEFING · STEP {step + 1} OF {STEPS.length}</span>
          <button
            type="button"
            onClick={onClose}
            className="text-[#0B1320]/70 hover:text-[#0B1320] underline cursor-pointer"
          >
            Skip
          </button>
        </div>

        <h2 id="tutorial-title" className="font-display text-2xl font-bold text-[#0B1320] mb-2">
          {current.title}
        </h2>
        <p className="text-sm text-[#0B1320]/85 leading-relaxed mb-6">
          {current.body}
        </p>

        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className="px-4 py-2 border border-[#0B1320]/30 text-sm rounded-[3px] disabled:opacity-40 cursor-pointer"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-5 py-2 bg-[#E8622C] text-[#0B1320] font-semibold text-sm rounded-[3px] cursor-pointer"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#0B1320] text-[#EDE7DA] font-semibold text-sm rounded-[3px] cursor-pointer"
            >
              Ready to Command
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
