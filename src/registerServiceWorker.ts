/**
 * Service Worker Registration Helper
 */

export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[Typlix PWA] Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.warn('[Typlix PWA] Service Worker registration failed:', error);
      });
  });
}
