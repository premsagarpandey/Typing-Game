export interface CookieConsentPreferences {
  necessary: boolean; // Always true
  functional: boolean; // Theme, sounds, layout preferences
  analytics: boolean; // Typing stats, speed benchmarks, accuracy metrics
  timestamp: string;
  version: string;
}

const STORAGE_KEY = 'typlix_cookie_consent';
const CONSENT_VERSION = '1.0';

export const DEFAULT_CONSENT: CookieConsentPreferences = {
  necessary: true,
  functional: true,
  analytics: true,
  timestamp: new Date().toISOString(),
  version: CONSENT_VERSION,
};

export const NECESSARY_ONLY_CONSENT: CookieConsentPreferences = {
  necessary: true,
  functional: false,
  analytics: false,
  timestamp: new Date().toISOString(),
  version: CONSENT_VERSION,
};

export function getCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentPreferences;
    return parsed;
  } catch (err) {
    console.error('Failed to parse cookie consent', err);
    return null;
  }
}

export function saveCookieConsent(preferences: Partial<CookieConsentPreferences>): CookieConsentPreferences {
  const current = getCookieConsent() || DEFAULT_CONSENT;
  const updated: CookieConsentPreferences = {
    ...current,
    ...preferences,
    necessary: true, // Always locked to true
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('typlix-cookie-consent-updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to save cookie consent', err);
  }

  return updated;
}

export function resetCookieConsent(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('typlix-cookie-consent-reset'));
  } catch (err) {
    console.error('Failed to reset cookie consent', err);
  }
}

export function openCookieConsentModal(): void {
  window.dispatchEvent(new CustomEvent('typlix-open-cookie-modal'));
}
