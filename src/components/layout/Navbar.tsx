import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/game', label: 'Play' },
  { path: '/stats', label: 'Stats' },
  { path: '/leaderboard', label: 'Board' },
  { path: '/settings', label: 'Settings' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="border-b border-neutral-200 dark:border-neutral-800/60 px-5 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-50 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-sm transition-colors">
      <Link to="/" className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 hover:opacity-70 transition-opacity">
        Typlix
      </Link>

      <div className="flex items-center gap-1">
        <div className="flex items-center">
          {NAV_LINKS.map(({ path, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-neutral-900 dark:text-neutral-100'
                    : 'text-neutral-500 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="pl-2 ml-2 border-l border-neutral-200 dark:border-neutral-800">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
