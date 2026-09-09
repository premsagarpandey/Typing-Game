import { useState } from 'react';
import { Link } from 'react-router-dom';
import FingerPlacementTutorial from '../components/common/FingerPlacementTutorial';
import FingerPlacementModal from '../components/common/FingerPlacementModal';

export default function Home() {
  const [showPlacementModal, setShowPlacementModal] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-8 sm:py-12 animate-fade-in">
      {/* Brand Logo & Pill */}
      <div className="mb-4">
        <img
          src="/logo.png"
          alt="Typlix Logo"
          className="w-24 h-auto drop-shadow-xl inline-block"
        />
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4">
        <span>⚡ 50 Lessons • Timed Speed Tests • Custom Practice</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
        Master Touch Typing with Precision
      </h1>
      <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg mb-8 max-w-2xl leading-relaxed">
        From beginner <strong>Home Row keys (F & J)</strong> to pro speed tests and custom code typing. Build muscle memory with real-time finger placement guides, smooth animations, and anti-cheat verified metrics.
      </p>

      {/* CTA Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <button
          onClick={() => setShowPlacementModal(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-blue-500/25 cursor-pointer flex items-center gap-2"
        >
          <span>Start Lesson 1 (Home Row)</span>
          <span>→</span>
        </button>

        <Link
          to="/game"
          className="px-5 py-3 bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-sm sm:text-base font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
        >
          <span>⏱️ Speed Test (Timed)</span>
        </Link>
      </div>

      {/* 2-Second Finger Placement Countdown Modal */}
      <FingerPlacementModal
        isOpen={showPlacementModal}
        onClose={() => setShowPlacementModal(false)}
        targetPath="/game"
        durationSeconds={2}
      />

      {/* Interactive Visual Tutorial */}
      <FingerPlacementTutorial />

      {/* Feature Highlights Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mt-8">
        <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none transition-colors">
          <div className="text-2xl mb-1.5">🖐️</div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Finger Placement Guides</h3>
          <p className="text-slate-600 dark:text-gray-400 text-xs mt-1">Real-time hints highlight the exact finger and hand position for every keypress.</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none transition-colors">
          <div className="text-2xl mb-1.5">⏱️</div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Multiple Game Modes</h3>
          <p className="text-slate-600 dark:text-gray-400 text-xs mt-1">Switch seamlessly between 50 progressive lessons, rapid 15s-120s timed tests, or custom text.</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none transition-colors">
          <div className="text-2xl mb-1.5">🛡️</div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Verified Progress</h3>
          <p className="text-slate-600 dark:text-gray-400 text-xs mt-1">Tamper-proof storage and anti-cheat algorithms ensure your personal best WPM and accuracy are 100% genuine.</p>
        </div>
      </div>
    </div>
  );
}
