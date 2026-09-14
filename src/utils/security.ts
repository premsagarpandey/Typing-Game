/**
 * Typlix Core Security Utilities
 * Includes prototype freezing and frameguard defense.
 */

/**
 * Deep freezes an object to make it completely immutable against prototype tampering
 */
export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  const propNames = Object.getOwnPropertyNames(obj) as Array<keyof T>;
  for (const name of propNames) {
    const value = obj[name];
    if (value && typeof value === 'object') {
      deepFreeze(value as object);
    }
  }
  return Object.freeze(obj);
}

/**
 * Clickjack defense fallback (CSP frame-ancestors is primary)
 */
export function initDevToolsSecurityWarning(): void {
  if (typeof window === 'undefined') return;

  try {
    if (window.self !== window.top && window.top) {
      window.top.location.replace(window.self.location.href);
    }
  } catch {
    // Cross-origin iframe environment handled by CSP
  }
}

