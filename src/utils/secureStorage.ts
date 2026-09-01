/**
 * Typlix Secure Storage Utility
 * Provides cryptographic integrity checking and strict runtime validation
 * to prevent unauthorized modifications to localStorage (e.g. through DevTools).
 */

const STORAGE_SECRET_SALT = 'TYPLIX_SECURE_V1_SALT_9f4b';

// Fully typed SHA-256 implementation
function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number): number {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i = 0;
  let j = 0;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let composite = ascii + '\x80';
  while (composite.length % 64 !== 56) {
    composite += '\x00';
  }
  for (i = 0; i < composite.length; i++) {
    j = composite.charCodeAt(i);
    words[i >> 2] = (words[i >> 2] || 0) | (j << ((3 - (i % 4)) * 8));
  }
  words[words.length] = ((asciiBitLength / maxWord) | 0);
  words[words.length] = (asciiBitLength | 0);

  for (j = 0; j < words.length;) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15] || 0;
      const w2 = w[i - 2] || 0;

      const a = hash[0], e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? (w[i] || 0)
            : ((w[i - 16] || 0) +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                (w[i - 7] || 0) +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0, a, hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]];
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byte = (hash[i] >> (b * 8)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return result;
}

function computeSignature(key: string, dataStr: string): string {
  return sha256(`${STORAGE_SECRET_SALT}:${key}:${dataStr}`);
}

interface SecureEnvelope<T> {
  data: T;
  sig: string;
  ts: number;
}

export interface TypingSessionRecord {
  id: string;
  level: number;
  wpm: number;
  accuracy: number;
  maxCombo: number;
  date: string;
  passed: boolean;
}

const memoryCache = new Map<string, unknown>();

/**
 * Validates data against predefined game constraints
 */
function sanitizeAndValidate<T>(key: string, value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;

  if (key === 'typingGameLevel') {
    const num = typeof value === 'number' ? value : parseInt(String(value), 10);
    if (!Number.isFinite(num) || isNaN(num) || num < 1) return 1 as T;
    return Math.min(Math.floor(num), 50) as T;
  }

  if (key === 'sound') {
    if (typeof value === 'boolean') return value as T;
    if (value === 'true' || value === 1) return true as T;
    if (value === 'false' || value === 0) return false as T;
    return fallback;
  }

  if (key === 'typlix_stats') {
    if (!Array.isArray(value)) return fallback;
    const validRecords = value.filter(
      (item): item is TypingSessionRecord =>
        item &&
        typeof item === 'object' &&
        typeof item.wpm === 'number' &&
        typeof item.accuracy === 'number' &&
        typeof item.level === 'number'
    );
    return validRecords.slice(-50) as T;
  }

  return value as T;
}

export const secureStorage = {
  getItem<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;

    // Fast in-memory cache lookup
    if (memoryCache.has(key)) {
      return memoryCache.get(key) as T;
    }

    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        memoryCache.set(key, fallback);
        return fallback;
      }

      // Check if it's stored in envelope format
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && 'sig' in parsed && 'data' in parsed) {
          const envelope = parsed as SecureEnvelope<T>;
          const expectedSig = computeSignature(key, JSON.stringify(envelope.data));

          if (envelope.sig === expectedSig) {
            const validated = sanitizeAndValidate(key, envelope.data, fallback);
            memoryCache.set(key, validated);
            return validated;
          } else {
            // Tampering detected: Signature mismatch
            console.warn(`[Typlix Security] Tamper detected on key '${key}'. Reverting to safe state.`);
            this.setItem(key, fallback);
            return fallback;
          }
        }
      } catch {
        // Not a JSON envelope, might be a legacy raw string
      }

      // Legacy fallback / migration
      let legacyValue: unknown = raw;
      try {
        legacyValue = JSON.parse(raw);
      } catch {
        // Raw string
      }

      const validated = sanitizeAndValidate(key, legacyValue, fallback);
      // Upgrade to secure format
      this.setItem(key, validated);
      return validated;
    } catch {
      memoryCache.set(key, fallback);
      return fallback;
    }
  },

  setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    try {
      const sanitized = sanitizeAndValidate(key, value, value);
      memoryCache.set(key, sanitized);

      const dataStr = JSON.stringify(sanitized);
      const sig = computeSignature(key, dataStr);

      const envelope: SecureEnvelope<T> = {
        data: sanitized,
        sig,
        ts: Date.now(),
      };

      window.localStorage.setItem(key, JSON.stringify(envelope));
    } catch (e) {
      console.warn('[Typlix Security] Storage write error', e);
    }
  },

  removeItem(key: string): void {
    memoryCache.delete(key);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },

  clear(): void {
    memoryCache.clear();
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.clear();
    } catch {
      // Ignore
    }
  }
};
