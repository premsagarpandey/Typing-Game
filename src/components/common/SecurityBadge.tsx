import { useState } from 'react';

export default function SecurityBadge() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[11px] font-medium text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer"
        title="Typlix Security Active"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-emerald-400" />
        </span>
        <span>Protected by Typlix Shield</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl shadow-2xl text-left z-50 animate-fade-in text-xs text-slate-700 dark:text-slate-300 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-1.5">
            <span className="font-bold text-slate-900 dark:text-white text-[11px] flex items-center gap-1">
              🛡️ Active Security Modules
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-[10px] cursor-pointer"
            >
              ✕
            </button>
          </div>
          <ul className="space-y-1 text-[11px]">
            <li className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span>✓</span> Cryptographic HMAC Storage
            </li>
            <li className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span>✓</span> Keystroke Anti-Cheat Engine
            </li>
            <li className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span>✓</span> Anti-Clickjack & Frameguard
            </li>
            <li className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span>✓</span> Content Security Policy (CSP)
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
