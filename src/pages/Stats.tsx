import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { exportStatsAsCSV, exportDataAsJSON } from '../utils/dataBackup';
import WpmProgressChart from '../components/stats/WpmProgressChart';
import { useUserProgress } from '../hooks/useUserProgress';

export default function Stats() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const { level: currentLevel, stats: sessions, summary } = useUserProgress();

  // Sort sessions in reverse chronological order
  const recentSessions = useMemo(() => {
    return [...sessions].reverse();
  }, [sessions]);

  const handleExportCSV = () => {
    try {
      exportStatsAsCSV();
      setFeedback('Stats exported to CSV!');
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback((e as Error).message);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleExportJSON = () => {
    try {
      exportDataAsJSON();
      setFeedback('Full backup exported to JSON!');
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback((e as Error).message);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Statistics</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-500">Track your typing velocity and accuracy trends</p>
        </div>

        <div className="flex items-center gap-2">
          {sessions.length > 0 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleExportCSV}
                className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Export session data as CSV"
              >
                CSV Export
              </button>
              <button
                onClick={handleExportJSON}
                className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Export full JSON backup"
              >
                JSON Backup
              </button>
            </div>
          )}
          <Link
            to="/game"
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
          >
            Practice
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="p-2.5 text-xs rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium animate-fade-in flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="cursor-pointer opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <div className="p-4 bg-neutral-50 dark:bg-neutral-950">
          <div className="text-xs text-neutral-500 dark:text-neutral-500 font-medium">Best Speed</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1 font-mono">
            {summary.bestWpm} <span className="text-xs font-normal text-neutral-400">wpm</span>
          </div>
        </div>

        <div className="p-4 bg-neutral-50 dark:bg-neutral-950">
          <div className="text-xs text-neutral-500 dark:text-neutral-500 font-medium">Avg Accuracy</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1 font-mono">
            {summary.avgAccuracy}<span className="text-xs font-normal text-neutral-400">%</span>
          </div>
        </div>

        <div className="p-4 bg-neutral-50 dark:bg-neutral-950">
          <div className="text-xs text-neutral-500 dark:text-neutral-500 font-medium">Tests Done</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1 font-mono">
            {summary.total}
          </div>
        </div>

        <div className="p-4 bg-neutral-50 dark:bg-neutral-950">
          <div className="text-xs text-neutral-500 dark:text-neutral-500 font-medium">Level</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1 font-mono">
            {currentLevel}
          </div>
        </div>
      </div>

      {/* WPM Progress Chart */}
      <WpmProgressChart sessions={sessions} />

      {/* Session History Table */}
      <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Recent Sessions</h3>
          <span className="text-xs text-neutral-400 dark:text-neutral-600">{recentSessions.length} recorded</span>
        </div>

        {recentSessions.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 dark:text-neutral-500 text-sm space-y-1">
            <p className="font-medium">No sessions yet.</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-600">
              Complete a lesson to start tracking progress.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-100/80 dark:bg-neutral-900/80 text-xs uppercase font-medium text-neutral-500 dark:text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Speed</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Combo</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/60">
                {recentSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs">
                      {session.modeLabel || (session.level > 0 ? `Level ${session.level}` : 'Practice')}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-700 dark:text-neutral-300 text-xs">
                      {session.wpm} wpm
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-700 dark:text-neutral-300 text-xs">
                      {session.accuracy}%
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-700 dark:text-neutral-300 text-xs">
                      {session.maxCombo}x
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-400 dark:text-neutral-500">
                      {session.date}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          session.passed
                            ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                            : 'bg-neutral-100 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-500'
                        }`}
                      >
                        {session.passed ? 'Passed' : 'Practice'}
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
