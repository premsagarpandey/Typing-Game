import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/game', label: 'Play' },
  { path: '/stats', label: 'Stats' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/settings', label: 'Settings' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50 transition-colors">
      <Link to="/" className="flex items-center gap-2 group">
        <img
          src="/logo.png"
          alt="Typlix Logo"
          className="h-9 w-auto object-contain bg-slate-100 dark:bg-white/10 p-1 rounded-lg border border-slate-200 dark:border-white/10 transition-transform group-hover:scale-105"
        />
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white hidden sm:inline">
          Typlix
        </span>
      </Link>

      <div className="flex items-center gap-1 sm:gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5">
          {NAV_LINKS.map(({ path, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="pl-1 sm:pl-2 ml-1 sm:ml-2 border-l border-slate-200 dark:border-white/10">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
