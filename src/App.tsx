import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Game from './pages/Game';
import Stats from './pages/Stats';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';

function AppLayout() {
  const location = useLocation();
  const isGamePage = location.pathname === '/game';

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors duration-200">
      <Navbar />
      <main className={`flex-1 w-full ${isGamePage ? 'px-2 sm:px-4 py-2 h-[calc(100vh-50px)] overflow-hidden' : 'px-4 sm:px-6 md:px-8 py-4'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isGamePage && (
        <footer className="w-full py-5 text-center text-xs text-neutral-500 dark:text-neutral-600 border-t border-neutral-200 dark:border-neutral-800/60 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">Typlix</span>
          <span>© {new Date().getFullYear()} Typlix · Minimalist & Fast Touch Typing</span>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AppLayout />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
