import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { secureStorage, type TypingSessionRecord } from '../utils/secureStorage';

export default function Stats() {
  const sessions = useMemo(() => {
    return secureStorage.getItem<TypingSessionRecord[]>('typlix_stats', []);
  }, []);

  const currentLevel = useMemo(() => {
    return secureStorage.getItem<number>('typingGameLevel', 1);
  }, []);

  const summary = useMemo(() => {
    if (sessions.length === 0) {
      return {
        total: 0,
        bestWpm: 0,
        avgAccuracy: 0,
      };
    }

    const total = sessions.length;
    const bestWpm = Math.max(...sessions.map((s) => s.wpm));
    const avgAccuracy = Math.round(
      sessions.reduce((acc, s) => acc + s.accuracy, 0) / total
    );

    return { total, bestWpm, avgAccuracy };
  }, [sessions]);

  // Sort sessions in reverse chronological order
  const recentSessions = useMemo(() => {
    return [...sessions].reverse();
  }, [sessions]);

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Typing Statistics</h2>
        <Link
          to="/game"
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
        >
          Practice Now →
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xs">
          <div className="text-xs text-slate-500 dark:text-gray-400 font-medium">Best Speed</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 font-mono">
            {summary.bestWpm} <span className="text-xs font-normal">WPM</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xs">
          <div className="text-xs text-slate-500 dark:text-gray-400 font-medium">Avg Accuracy</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {summary.avgAccuracy}%
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xs">
          <div className="text-xs text-slate-500 dark:text-gray-400 font-medium">Tests Completed</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono">
            {summary.total}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xs">
          <div className="text-xs text-slate-500 dark:text-gray-400 font-medium">Current Level</div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 font-mono">
            Lvl {currentLevel}
          </div>
        </div>
      </div>

      {/* Session History Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md shadow-sm dark:shadow-none transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Recent Typing Sessions</h3>
          <span className="text-xs text-slate-400 dark:text-gray-500">{recentSessions.length} recorded</span>
        </div>

        {recentSessions.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-gray-400 text-sm space-y-2">
            <p className="text-2xl">⌨️</p>
            <p className="font-medium">No sessions recorded yet.</p>
            <p className="text-xs text-slate-400 dark:text-gray-500">
              Complete your first lesson on the Play page to start tracking your progress!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-gray-300">
              <thead className="bg-slate-100/80 dark:bg-white/5 text-xs uppercase font-semibold text-slate-600 dark:text-gray-300 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Speed</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Combo</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {recentSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Level {session.level}
                    </td>
                    <td className="py-3 px-4 font-mono text-blue-600 dark:text-blue-400 font-bold">
                      {session.wpm} WPM
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {session.accuracy}%
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-600 dark:text-amber-400">
                      {session.maxCombo}x
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 dark:text-gray-400">
                      {session.date}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          session.passed
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30'
                        }`}
                      >
                        {session.passed ? 'PASSED' : 'PRACTICE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
