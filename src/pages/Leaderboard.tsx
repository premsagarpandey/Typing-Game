import { useMemo } from 'react';
import { secureStorage, type TypingSessionRecord } from '../utils/secureStorage';

const TOP_PLAYERS = [
  { rank: 1, name: 'SwiftFingers', wpm: 124, accuracy: 99 },
  { rank: 2, name: 'KeyMaster', wpm: 112, accuracy: 97 },
  { rank: 3, name: 'CyberTyper', wpm: 105, accuracy: 96 },
  { rank: 4, name: 'SpeedyGonzales', wpm: 98, accuracy: 95 },
  { rank: 5, name: 'TypeRacerX', wpm: 92, accuracy: 94 },
];

export default function Leaderboard() {
  const userBest = useMemo(() => {
    const stats = secureStorage.getItem<TypingSessionRecord[]>('typlix_stats', []);
    if (stats.length === 0) return null;
    const sorted = [...stats].sort((a, b) => b.wpm - a.wpm);
    return sorted[0];
  }, []);

  return (
    <div className="max-w-lg mx-auto py-8 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Leaderboard</h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
          Top typists from the community
        </p>
      </div>

      {userBest && (
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-[10px] flex items-center justify-center">
              YOU
            </span>
            <div>
              <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Your Best</div>
              <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
                {userBest.modeLabel || (userBest.level > 0 ? `Level ${userBest.level}` : 'Practice')} · {userBest.date}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-mono font-medium text-neutral-700 dark:text-neutral-300">
            <span>{userBest.wpm} wpm</span>
            <span>{userBest.accuracy}%</span>
          </div>
        </div>
      )}

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-800/60">
        {TOP_PLAYERS.map((player) => (
          <div
            key={player.rank}
            className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 flex items-center justify-center text-xs font-mono font-medium text-neutral-400 dark:text-neutral-500">
                {player.rank}
              </span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">{player.name}</span>
            </div>

            <div className="flex items-center gap-4 text-sm font-mono font-medium text-neutral-600 dark:text-neutral-400">
              <span>{player.wpm} wpm</span>
              <span>{player.accuracy}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
