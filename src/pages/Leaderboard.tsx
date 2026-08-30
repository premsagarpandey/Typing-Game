const TOP_PLAYERS = [
  { rank: 1, name: 'SwiftFingers', wpm: 124, accuracy: 99 },
  { rank: 2, name: 'KeyMaster', wpm: 112, accuracy: 97 },
  { rank: 3, name: 'CyberTyper', wpm: 105, accuracy: 96 },
  { rank: 4, name: 'SpeedyGonzales', wpm: 98, accuracy: 95 },
  { rank: 5, name: 'TypeRacerX', wpm: 92, accuracy: 94 },
];

export default function Leaderboard() {
  return (
    <div className="max-w-lg mx-auto py-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Global Leaderboard</h2>

      <div className="space-y-3">
        {TOP_PLAYERS.map((player) => (
          <div
            key={player.rank}
            className="flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm dark:shadow-none transition-colors"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${
                  player.rank === 1
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40'
                    : player.rank === 2
                    ? 'bg-slate-300/40 dark:bg-gray-400/20 text-slate-700 dark:text-gray-200 border border-slate-400/40 dark:border-gray-400/40'
                    : player.rank === 3
                    ? 'bg-amber-700/20 text-amber-700 dark:text-amber-500 border border-amber-700/40'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400'
                }`}
              >
                {player.rank}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{player.name}</span>
            </div>

            <div className="flex items-center gap-4 text-sm font-mono font-semibold">
              <span className="text-blue-600 dark:text-blue-400">{player.wpm} WPM</span>
              <span className="text-emerald-600 dark:text-emerald-400">{player.accuracy}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
