import React from 'react';

export const MissionPatchSvg: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <rect x="4" y="4" width="56" height="56" rx="4" fill="#0B1320" stroke="#EDE7DA" strokeWidth="2" />
    <circle cx="32" cy="32" r="18" stroke="#EDE7DA" strokeWidth="1.5" strokeDasharray="3 3" />
    <path d="M14 42 C24 34, 40 34, 50 42" stroke="#5E9C94" strokeWidth="2" />
    <circle cx="32" cy="24" r="6" fill="#E8622C" />
    <path d="M32 10 V14 M32 34 V38 M18 24 H22 M42 24 H46" stroke="#EDE7DA" strokeWidth="1.5" />
  </svg>
);

export const PowerIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" strokeLinejoin="round" />
  </svg>
);

export const LifeSupportIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
    <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z" strokeLinejoin="round" />
    <path d="M9.5 15.5a2.5 2.5 0 0 0 2.5 2.5" strokeLinecap="round" />
  </svg>
);

export const FoodIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
    <path d="M12 21V11" strokeLinecap="round" />
    <path d="M12 11C12 6 16 4 20 4c0 4-2 7-8 7z" strokeLinejoin="round" />
    <path d="M12 14C12 9 8 7 4 7c0 4 2 7 8 7z" strokeLinejoin="round" />
  </svg>
);

export const ShieldIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
    <path d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" strokeLinejoin="round" />
  </svg>
);

export const AlertIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
    <path d="M12 3L2 20h20L12 3z" strokeLinejoin="round" />
    <path d="M12 9v5M12 17h.01" strokeLinecap="round" />
  </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
