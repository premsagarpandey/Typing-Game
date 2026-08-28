import { Link, useLocation } from 'react-router-dom';

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
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/logo.png"
          alt="Typlix Logo"
          className="h-9 w-auto object-contain bg-white/10 p-1 rounded-lg border border-white/10"
        />
        <span className="text-lg font-bold tracking-tight text-white hidden sm:inline">Typlix</span>
      </Link>

      <div className="flex items-center gap-1 sm:gap-2">
        {NAV_LINKS.map(({ path, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
