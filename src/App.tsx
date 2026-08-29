import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Game from './pages/Game';
import Stats from './pages/Stats';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import ErrorBoundary from './components/common/ErrorBoundary';
import SecurityBadge from './components/common/SecurityBadge';
import { initDevToolsSecurityWarning } from './utils/security';

export default function App() {
  useEffect(() => {
    initDevToolsSecurityWarning();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
          <Navbar />
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game" element={<Game />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between px-6 max-w-5xl mx-auto gap-3">
            <div>© {new Date().getFullYear()} Typlix. All rights reserved.</div>
            <SecurityBadge />
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

