import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-8 sm:py-12">
      <div className="mb-6">
        <img
          src="/logo.png"
          alt="Typlix Logo"
          className="w-28 h-auto drop-shadow-xl"
        />
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
        Master Touch Typing from Scratch
      </h1>
      <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg mb-8 max-w-xl">
        Designed for absolute beginners! Learn step-by-step with <strong>Home Row keys (F & J)</strong>, visual finger placement guides, gentle difficulty, and 50 progressive lessons.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <button
          onClick={() => navigate('/game')}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/25 cursor-pointer"
        >
          Start Lesson 1 (Home Row) →
        </button>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none transition-colors">
          <div className="text-2xl mb-1.5">🖐️</div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Finger Placement Guides</h3>
          <p className="text-slate-600 dark:text-gray-400 text-xs mt-1">Real-time hints show exactly which hand and finger to use for every single key.</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none transition-colors">
          <div className="text-2xl mb-1.5">🌱</div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Gentle Progression</h3>
          <p className="text-slate-600 dark:text-gray-400 text-xs mt-1">Starts at just 5 WPM with 2 keys, gradually unlocking rows as your muscle memory builds.</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none transition-colors">
          <div className="text-2xl mb-1.5">🎯</div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">50 Guided Lessons</h3>
          <p className="text-slate-600 dark:text-gray-400 text-xs mt-1">From Home Row basics to full words, sentences, punctuation, and speed mastery.</p>
        </div>
      </div>
    </div>
  );
}
