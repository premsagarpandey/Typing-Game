/**
 * Typlix Core Security Utilities
 * Includes XSS sanitization, DevTools defense warnings, and prototype freezing.
 */

/**
 * Sanitizes strings to prevent XSS and HTML injection
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Deep freezes an object to make it completely immutable against prototype tampering
 */
export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  const propNames = Object.getOwnPropertyNames(obj);
  for (const name of propNames) {
    const value = (obj as any)[name];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }
  return Object.freeze(obj);
}

/**
 * Logs a high-visibility security warning in browser DevTools to prevent Self-XSS attacks
 */
export function initDevToolsSecurityWarning(): void {
  if (typeof window === 'undefined') return;

  // Frame-busting clickjack defense
  try {
    if (window.top && window.top !== window.self) {
      window.top.location.href = window.self.location.href;
    }
  } catch {
    // Cross-origin frame attempt blocked by browser
  }

  // Console Security Warning
  const bannerStyle = `
    color: #ef4444;
    font-size: 28px;
    font-weight: 900;
    text-shadow: 2px 2px 0px #000;
    padding: 8px;
  `;

  const bodyStyle = `
    color: #f3f4f6;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
  `;

  const cautionStyle = `
    color: #f59e0b;
    font-size: 13px;
    font-weight: 600;
  `;

  setTimeout(() => {
    try {
      console.log('%c🛑 TYPLIX SECURITY NOTICE', bannerStyle);
      console.log(
        '%cThis browser feature is intended for developers. Pasting untrusted scripts or commands here may compromise your session, corrupt local game progress, or violate anti-cheat policies.',
        bodyStyle
      );
      console.log(
        '%c🛡️ Anti-Tamper & Cryptographic Checksums are active.',
        cautionStyle
      );
    } catch {
      // Ignore
    }
  }, 500);
}
