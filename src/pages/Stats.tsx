const SAMPLE_STATS = [
  { day: 'Mon', wpm: 45, accuracy: 90 },
  { day: 'Tue', wpm: 52, accuracy: 92 },
  { day: 'Wed', wpm: 48, accuracy: 88 },
  { day: 'Thu', wpm: 55, accuracy: 94 },
  { day: 'Fri', wpm: 60, accuracy: 96 },
];

export default function Stats() {
  return (
    <div className="max-w-lg mx-auto py-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Your Statistics</h2>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md shadow-sm dark:shadow-none transition-colors">
        <table className="w-full text-left text-sm text-slate-700 dark:text-gray-300">
          <thead className="bg-slate-100 dark:bg-white/10 text-xs uppercase font-semibold text-slate-600 dark:text-gray-200">
            <tr>
              <th className="py-3 px-4">Session</th>
              <th className="py-3 px-4">WPM</th>
              <th className="py-3 px-4">Accuracy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5">
            {SAMPLE_STATS.map((row) => (
              <tr key={row.day} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{row.day}</td>
                <td className="py-3 px-4 font-mono text-blue-600 dark:text-blue-400 font-semibold">{row.wpm}</td>
                <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{row.accuracy}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
