import { useMemo, useState, useEffect } from 'react';
import { useUserProgress } from '../hooks/useUserProgress';
import { fetchTopPlayersFromFirestore, type LeaderboardPlayer } from '../services/cloudProgress';
import { Globe } from 'lucide-react';

const FALLBACK_PLAYERS: LeaderboardPlayer[] = [
  { rank: 1, name: 'SwiftFingers', wpm: 124, accuracy: 99 },
  { rank: 2, name: 'KeyMaster', wpm: 112, accuracy: 97 },
  { rank: 3, name: 'CyberTyper', wpm: 105, accuracy: 96 },
  { rank: 4, name: 'SpeedyGonzales', wpm: 98, accuracy: 95 },
  { rank: 5, name: 'TypeRacerX', wpm: 92, accuracy: 94 },
];

export default function Leaderboard() {
  const { stats } = useUserProgress();
  const [players, setPlayers] = useState<LeaderboardPlayer[]>(FALLBACK_PLAYERS);
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchTopPlayersFromFirestore(10).then((cloudPlayers) => {
      if (isMounted && cloudPlayers.length > 0) {
        setPlayers(cloudPlayers);
        setIsCloudLoaded(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const userBest = useMemo(() => {
    if (stats.length === 0) return null;
    const sorted = [...stats].sort((a, b) => b.wpm - a.wpm);
    return sorted[0];
  }, [stats]);

  return (
    <div className="max-w-lg mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Leaderboard</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
            Top typists from the community
          </p>
        </div>
        {isCloudLoaded && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <Globe className="w-3 h-3" /> Live Cloud
          </span>
        )}
      </div>

      {userBest && (
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/30">
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
        {players.map((player) => (
          <div
            key={player.rank}
            className={`flex items-center justify-between p-4 transition-colors ${
              player.isCurrentUser
                ? 'bg-blue-50/60 dark:bg-blue-950/20 border-l-2 border-l-blue-500'
                : 'bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-semibold rounded-full ${
                player.rank === 1
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  : player.rank === 2
                  ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                  : player.rank === 3
                  ? 'bg-amber-900/20 text-amber-900 dark:bg-amber-950 dark:text-amber-400'
                  : 'text-neutral-400 dark:text-neutral-500'
              }`}>
                {player.rank}
              </span>
              <div>
                <span className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                  {player.name} {player.isCurrentUser ? '(You)' : ''}
                </span>
                {typeof player.level === 'number' && player.level > 1 && (
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-mono">
                    Lvl {player.level}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm font-mono font-medium text-neutral-600 dark:text-neutral-400">
              <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{player.wpm} wpm</span>
              <span>{player.accuracy}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
