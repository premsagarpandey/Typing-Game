import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { LogIn, LogOut } from 'lucide-react';
import AuthModal from '../common/AuthModal';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/game', label: 'Practice' },
  { path: '/stats', label: 'Stats' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/settings', label: 'Settings' },
];

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <nav className="border-b border-neutral-200 dark:border-neutral-800/80 px-4 sm:px-8 py-2.5 flex items-center justify-between sticky top-0 z-50 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-md transition-colors">
        <Link
          to="/"
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-extrabold text-xs flex items-center justify-center font-mono shadow-xs group-hover:scale-105 transition-transform">
            T
          </div>
          <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Typlix
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-0.5 sm:gap-1">
            {NAV_LINKS.map(({ path, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                    isActive
                      ? 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900/60'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="pl-1.5 sm:pl-2 ml-1 sm:ml-2 border-l border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email || 'User'}`}
                  alt="Avatar"
                  className="w-7 h-7 rounded-full border border-neutral-300 dark:border-neutral-700 shadow-sm"
                />
                <button
                  onClick={logout}
                  title="Log Out"
                  className="p-1.5 rounded-md text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-xs transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
            
            <div className="border-l border-neutral-200 dark:border-neutral-800 h-5 mx-1" />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}

