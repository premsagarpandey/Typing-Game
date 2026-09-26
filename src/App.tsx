import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Game from './pages/Game';
import ErrorBoundary from './components/common/ErrorBoundary';
import GlobalToast from './components/common/GlobalToast';
import CookieConsent from './components/common/CookieConsent';
import { openCookieConsentModal } from './utils/cookieConsent';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

const Stats = lazy(() => import('./pages/Stats'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiesPolicy = lazy(() => import('./pages/CookiesPolicy'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-5 h-5 border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-neutral-100 rounded-full animate-spin" />
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const isGamePage = location.pathname === '/game';

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors duration-200">
      <Navbar />
      <main className={`flex-1 w-full ${isGamePage ? 'px-2 sm:px-4 py-2 h-[calc(100vh-50px)] overflow-hidden' : 'px-4 sm:px-6 md:px-8 py-4'}`}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiesPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {!isGamePage && (
        <footer className="w-full py-6 text-xs text-neutral-500 dark:text-neutral-500 border-t border-neutral-200 dark:border-neutral-800/80 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">Typlix</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Data Minimization
              </span>
            </div>
            <p className="text-neutral-500 text-[11px]">
              Minimalist touch typing practice · We strictly collect only necessary data.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 pt-2 border-t border-neutral-200/60 dark:border-neutral-800/50">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px]">
              <Link to="/privacy" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                Cookie Policy
              </Link>
              <Link to="/refund" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                Refund Policy
              </Link>
              <button
                type="button"
                onClick={openCookieConsentModal}
                className="hover:text-neutral-900 dark:hover:text-neutral-200 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Cookie Preferences
              </button>
            </div>
            <div className="text-[11px] text-neutral-400 dark:text-neutral-600">
              © {new Date().getFullYear()} Typlix. All rights reserved.
            </div>
          </div>
        </footer>
      )}
      <GlobalToast />
      <CookieConsent />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <AppLayout />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
