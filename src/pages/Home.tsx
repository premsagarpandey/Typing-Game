import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Keyboard, Timer, ShieldCheck } from 'lucide-react';
import FingerPlacementModal from '../components/common/FingerPlacementModal';
import FingerPlacementTutorial from '../components/common/FingerPlacementTutorial';
import { secureStorage } from '../utils/secureStorage';

export default function Home() {
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const currentLevel = secureStorage.getItem<number>('typingGameLevel', 1);

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-16 sm:py-24 animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4 leading-tight">
        Master Touch Typing
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400 text-base sm:text-lg mb-10 max-w-lg leading-relaxed">
        50 progressive lessons, timed speed tests, and custom practice.
        Build real muscle memory with precise metrics.
      </p>

      {/* Mode CTA Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-16 max-w-2xl mx-auto">
        {/* 1. Lessons Mode (Primary CTA) */}
        <button
          onClick={() => {
            try {
              localStorage.setItem('typlix_game_mode', JSON.stringify('lesson'));
            } catch {}
            setShowPlacementModal(true);
          }}
          className="px-5 sm:px-6 py-3 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all text-white dark:text-neutral-900 text-sm font-semibold rounded-lg cursor-pointer flex items-center gap-2 shadow-xs"
        >
          <span className="text-base leading-none">📖</span>
          <span>{currentLevel > 1 ? `Continue Lesson ${currentLevel}` : 'Start Lesson 1'}</span>
        </button>

        {/* 2. Speed Test (Timed Mode) */}
        <Link
          to="/game?mode=timed"
          onClick={() => {
            try {
              localStorage.setItem('typlix_game_mode', JSON.stringify('timed'));
            } catch {}
          }}
          className="px-4 sm:px-5 py-3 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/70 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center gap-2"
        >
          <span className="text-base leading-none">⏱</span>
          <span>Speed Test</span>
        </Link>

        {/* 3. Quotes Mode */}
        <Link
          to="/game?mode=quotes"
          onClick={() => {
            try {
              localStorage.setItem('typlix_game_mode', JSON.stringify('quotes'));
            } catch {}
          }}
          className="px-4 sm:px-5 py-3 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/70 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center gap-2"
        >
          <span className="text-base leading-none">💬</span>
          <span>Quotes</span>
        </Link>

        {/* 4. Code Snippets Mode */}
        <Link
          to="/game?mode=code"
          onClick={() => {
            try {
              localStorage.setItem('typlix_game_mode', JSON.stringify('code'));
            } catch {}
          }}
          className="px-4 sm:px-5 py-3 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/70 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center gap-2"
        >
          <span className="text-base leading-none">⌨</span>
          <span>Code</span>
        </Link>

        {/* 5. Custom Text Mode */}
        <Link
          to="/game?mode=custom"
          onClick={() => {
            try {
              localStorage.setItem('typlix_game_mode', JSON.stringify('custom'));
            } catch {}
          }}
          className="px-4 sm:px-5 py-3 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/70 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center gap-2"
        >
          <span className="text-base leading-none">✏</span>
          <span>Custom</span>
        </Link>
      </div>

      {/* 2-Second Finger Placement Countdown Modal */}
      <FingerPlacementModal
        isOpen={showPlacementModal}
        onClose={() => setShowPlacementModal(false)}
        targetPath="/game?mode=lesson"
        durationSeconds={2}
      />

      {/* Feature Highlights Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <div className="p-5 bg-neutral-50 dark:bg-neutral-950 text-left">
          <Keyboard className="w-4 h-4 text-neutral-400 dark:text-neutral-500 mb-3" strokeWidth={1.5} />
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1">Finger Guides</h3>
          <p className="text-neutral-500 dark:text-neutral-500 text-xs leading-relaxed">Real-time hints for every keypress position.</p>
        </div>

        <div className="p-5 bg-neutral-50 dark:bg-neutral-950 text-left">
          <Timer className="w-4 h-4 text-neutral-400 dark:text-neutral-500 mb-3" strokeWidth={1.5} />
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1">Multiple Modes</h3>
          <p className="text-neutral-500 dark:text-neutral-500 text-xs leading-relaxed">Lessons, speed tests, quotes, code, and custom text.</p>
        </div>

        <div className="p-5 bg-neutral-50 dark:bg-neutral-950 text-left">
          <ShieldCheck className="w-4 h-4 text-neutral-400 dark:text-neutral-500 mb-3" strokeWidth={1.5} />
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1">Verified Metrics</h3>
          <p className="text-neutral-500 dark:text-neutral-500 text-xs leading-relaxed">Anti-cheat ensures genuine WPM and accuracy.</p>
        </div>
      </div>

      {/* Finger Placement Tutorial */}
      <FingerPlacementTutorial />
    </div>
  );
}
