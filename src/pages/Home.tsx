import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto py-10">
      <img
        src="/logo.png"
        alt="Typlix Logo"
        className="w-28 h-auto mb-6 drop-shadow-xl"
      />
      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
        Welcome to Typlix
      </h1>
      <p className="text-gray-400 text-lg mb-8">
        Test and improve your typing speed, accuracy, and muscle memory with progressive levels.
      </p>

      <button
        onClick={() => navigate('/game')}
        className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/25 cursor-pointer"
      >
        Start Game →
      </button>

      <div className="w-full mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-xl mb-1">⚡</div>
          <h3 className="font-semibold text-white text-sm">Speed (WPM)</h3>
          <p className="text-gray-400 text-xs mt-1">Real-time Words Per Minute calculation as you type.</p>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-xl mb-1">🎯</div>
          <h3 className="font-semibold text-white text-sm">Accuracy</h3>
          <p className="text-gray-400 text-xs mt-1">Track precision and minimize typos with instant visual feedback.</p>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-xl mb-1">🏆</div>
          <h3 className="font-semibold text-white text-sm">50 Levels</h3>
          <p className="text-gray-400 text-xs mt-1">Progressive difficulty scaling from beginner words to complex vocab.</p>
        </div>
      </div>
    </div>
  );
}
