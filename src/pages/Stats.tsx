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
      <h2 className="text-2xl font-bold text-white mb-6">Your Statistics</h2>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-white/10 text-xs uppercase font-semibold text-gray-200">
            <tr>
              <th className="py-3 px-4">Session</th>
              <th className="py-3 px-4">WPM</th>
              <th className="py-3 px-4">Accuracy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {SAMPLE_STATS.map((row) => (
              <tr key={row.day} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 font-medium text-white">{row.day}</td>
                <td className="py-3 px-4 font-mono text-blue-400">{row.wpm}</td>
                <td className="py-3 px-4 font-mono text-emerald-400">{row.accuracy}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
