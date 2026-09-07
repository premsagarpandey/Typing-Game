export default function FingerPlacementTutorial() {
  return (
    <div className="w-full max-w-4xl mx-auto my-10 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3 border border-blue-200/50 dark:border-blue-800/50">
          🖐️ Standard Touch Typing Position
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Home Row Finger Placement
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Keep your wrists relaxed and rest your fingertips lightly on the glowing <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Home Row</strong> keys.
        </p>
      </div>

      {/* Main High-Res Image Container */}
      <div className="relative w-full overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] bg-slate-950 border border-slate-800 group">
        <img
          src="/tutorial-image.jpg"
          alt="Touch typing home row finger placement guide on keyboard"
          className="w-full h-auto object-cover rounded-2xl transition-transform duration-300 group-hover:scale-[1.01]"
          loading="eager"
        />
      </div>

      {/* Quick Visual Reference Row */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Left Hand</span>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">A</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">S</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">D</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">F</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Right Hand</span>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">J</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">K</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">L</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
