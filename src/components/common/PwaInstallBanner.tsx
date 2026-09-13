import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

function checkIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // @ts-expect-error navigator.standalone is an iOS Safari property
    window.navigator.standalone === true
  );
}

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(checkIsStandalone);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || !deferredPrompt || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 p-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-lg animate-fade-in flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Typlix App" className="w-9 h-9 rounded-lg border border-neutral-200 dark:border-neutral-800 object-cover" />
          <div>
            <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              Install Typlix App
            </h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Practice typing offline on desktop & mobile
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer text-xs"
          aria-label="Dismiss install prompt"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleInstallClick}
          className="flex-1 py-1.5 px-3 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
        >
          <span>📲</span> Install Now
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="py-1.5 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition-colors cursor-pointer"
        >
          Later
        </button>
      </div>
    </div>
  );
}
