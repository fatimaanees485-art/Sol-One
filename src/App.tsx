import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { advanceSol, createInitialState } from './game/engine';
import { CrewAllocation, GameState, ModuleId } from './game/types';
import { ApodData, DonkiFlare, MarsWeatherData } from './types/nasa';
import { playTone } from './utils/sound';
import { HomePage } from './pages/HomePage';
import { MissionSelectPage } from './pages/MissionSelectPage';
import { GamePage } from './pages/GamePage';
import { DebriefPage } from './pages/DebriefPage';
import { LearnPage } from './pages/LearnPage';
import { TeachersPage } from './pages/TeachersPage';
import { AboutPage } from './pages/AboutPage';
import { TutorialModal } from './components/TutorialModal';

type Route = 'home' | 'missions' | 'play' | 'debrief' | 'learn' | 'teachers' | 'about' | '404';

const STORAGE_KEY = 'sol_one_saved_state_v1';

export default function App() {
  const [route, setRoute] = useState<Route>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') return 'play';
    const path = window.location.pathname;
    if (path === '/' || path === '') return 'home';
    if (path === '/missions') return 'missions';
    if (path === '/play') return 'play';
    if (path === '/debrief') return 'debrief';
    if (path === '/learn') return 'learn';
    if (path === '/teachers') return 'teachers';
    if (path === '/about') return 'about';
    return '404';
  });

  const [gameState, setGameState] = useState<GameState | null>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      return createInitialState('moon-basics', 3, 'Sol One');
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as GameState) : null;
    } catch {
      return null;
    }
  });

  const [showTutorial, setShowTutorial] = useState(false);
  const [showPlayModal, setShowPlayModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const [apod, setApod] = useState<ApodData | null>(null);
  const [donkiFlares, setDonkiFlares] = useState<DonkiFlare[]>([]);
  const [marsWeather, setMarsWeather] = useState<MarsWeatherData | null>(null);

  // Fetch NASA data via server proxy
  useEffect(() => {
    fetch('/api/nasa/apod')
      .then((r) => r.json())
      .then((d) => setApod(d))
      .catch(() => {});
    fetch('/api/nasa/donki')
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setDonkiFlares(d))
      .catch(() => {});
    fetch('/api/nasa/mars-weather')
      .then((r) => r.json())
      .then((d) => setMarsWeather(d))
      .catch(() => {});
  }, []);

  // Persist game state
  useEffect(() => {
    if (gameState) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
      } catch {
        // Ignore storage quota errors
      }
    }
  }, [gameState]);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const handleLaunchMission = (missionId: string, crewSize: number, outpostName: string) => {
    playTone('advance', soundEnabled);
    const initial = createInitialState(missionId, crewSize, outpostName);
    setGameState(initial);
    setShowPlayModal(true);
  };

  const handleAdvanceSol = useCallback(
    (allocation: CrewAllocation, buildModule: ModuleId | null) => {
      setGameState((prev) => {
        if (!prev || prev.status !== 'playing') return prev;
        const next = advanceSol(prev, allocation, buildModule, donkiFlares, marsWeather);
        if (next.status === 'won') {
          playTone('win', soundEnabled);
          setTimeout(() => scrollToSection('section-play'), 150);
        } else if (next.status === 'lost') {
          playTone('loss', soundEnabled);
          setTimeout(() => scrollToSection('section-play'), 150);
        } else if (next.pendingWarning) {
          playTone('warning', soundEnabled);
        } else {
          playTone('advance', soundEnabled);
        }
        return next;
      });
    },
    [donkiFlares, marsWeather, soundEnabled]
  );

  return (
    <div className={`relative min-h-screen flex flex-col text-[#EDE7DA] ${reducedMotion ? 'reduced-motion' : ''}`}>
      {/* Full-webpage animated NASA background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/src/assets/images/nasa_artemis_launch_1794411651374.jpg"
          alt="NASA Artemis SLS Launch"
          aria-hidden="true"
          className="w-full h-full object-cover opacity-55 nasa-ken-burns"
        />
        <div className="absolute inset-0 bg-[#0B1320]/45" />
      </div>

      {/* Sticky Top Bar Contract: Brand | 4-5 Nav Links | 1 Primary Action */}
      <header className="sticky top-0 z-40 border-b border-[#EDE7DA]/15 bg-[#0B1320]/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => scrollToSection('section-home')}
            className="font-display text-2xl font-bold tracking-tight text-[#EDE7DA] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Sol One
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm text-[#EDE7DA]/80">
            <button
              type="button"
              onClick={() => scrollToSection('section-missions')}
              className="hover:text-[#EDE7DA] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Missions
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('section-learn')}
              className="hover:text-[#EDE7DA] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Learn
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('section-teachers')}
              className="hover:text-[#EDE7DA] whitespace-nowrap shrink-0 cursor-pointer"
            >
              For Teachers
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('section-about')}
              className="hover:text-[#EDE7DA] whitespace-nowrap shrink-0 cursor-pointer"
            >
              About
            </button>
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() =>
                gameState?.status === 'playing'
                  ? setShowPlayModal(true)
                  : scrollToSection('section-missions')
              }
              className="px-4 py-2 bg-[#E8622C] text-[#0B1320] font-semibold text-xs rounded-[3px] hover:bg-[#f07340] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {gameState?.status === 'playing' ? 'Active Outpost' : 'Start Mission'}
            </button>
          </div>
        </div>
      </header>

      {/* Single-Page Scrollable Content */}
      <div className="relative z-10 flex-1 divide-y divide-[#EDE7DA]/10">
        <section id="section-home" className="scroll-mt-16">
          <HomePage
            apod={apod}
            hasSavedGame={false}
            onStartMission={() => scrollToSection('section-missions')}
            onResumeGame={() => setShowPlayModal(true)}
            onOpenTutorial={() => setShowTutorial(true)}
          />
        </section>

        <section id="section-missions" className="scroll-mt-16">
          <MissionSelectPage onLaunch={handleLaunchMission} />
        </section>

        <section id="section-learn" className="scroll-mt-16">
          <LearnPage donkiFlares={donkiFlares} marsWeather={marsWeather} />
        </section>

        <section id="section-teachers" className="scroll-mt-16">
          <TeachersPage />
        </section>

        <section id="section-about" className="scroll-mt-16">
          <AboutPage />
        </section>
      </div>

      {/* Footer with Accessibility Controls & Space Apps Credit */}
      <footer className="border-t border-[#EDE7DA]/15 bg-[#0B1320] py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EDE7DA]/65">
          <div className="font-mono">
            Sol One · Made at NASA Space Apps 2026 · Build v1.0 · Independent project, not an official NASA product.
          </div>
          <div className="flex items-center gap-4 font-mono">
            <button
              type="button"
              onClick={() => setSoundEnabled((s) => !s)}
              className="hover:text-[#EDE7DA] cursor-pointer"
            >
              Sound: {soundEnabled ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => setReducedMotion((r) => !r)}
              className="hover:text-[#EDE7DA] cursor-pointer"
            >
              Reduced Motion: {reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </footer>

      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}

      {showPlayModal && gameState && (
        <div
          className="fixed inset-0 z-50 bg-[#0B1320]/95 overflow-y-auto p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Outpost Command"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setShowPlayModal(false)}
                className="px-3 py-1.5 border border-[#EDE7DA]/30 text-xs font-mono text-[#EDE7DA] rounded-[3px] hover:bg-[#EDE7DA]/10 cursor-pointer"
              >
                Close Outpost
              </button>
            </div>
            {gameState.status === 'playing' ? (
              <GamePage
                state={gameState}
                onAdvanceSol={handleAdvanceSol}
                onResetMission={() => setShowPlayModal(false)}
              />
            ) : (
              <DebriefPage
                state={gameState}
                onPlayAgain={() =>
                  handleLaunchMission(gameState.missionId, gameState.crewSize, gameState.outpostName)
                }
                onSelectMission={() => setShowPlayModal(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
