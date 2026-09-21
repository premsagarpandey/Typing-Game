/**
 * Typlix Anti-Cheat & Bot Detection Engine
 * Protects typing sessions from automated macro bots, synthetic inputs,
 * copy-paste exploits, and superhuman typing velocities.
 */

export interface AntiCheatState {
  isFlagged: boolean;
  reason: string | null;
  anomalyScore: number;
}

export class AntiCheatEngine {
  private lastKeyTimestamp: number = 0;
  private keystrokeIntervals: number[] = [];
  private anomalyScore: number = 0;
  private isFlagged: boolean = false;
  private reason: string | null = null;
  private rapidKeystrokeStreak: number = 0;

  // Maximum allowable sustained human WPM threshold for validation
  private static readonly MAX_HUMAN_WPM = 260;
  // Minimum realistic bot interval between synthetic key presses (ms)
  private static readonly MIN_BOT_INTERVAL_MS = 3;
  // Threshold score at which a session is permanently flagged
  private static readonly FLAG_THRESHOLD = 10;

  public reset(): void {
    this.lastKeyTimestamp = 0;
    this.keystrokeIntervals = [];
    this.anomalyScore = 0;
    this.isFlagged = false;
    this.reason = null;
    this.rapidKeystrokeStreak = 0;
  }

  // Non-typing modifier and navigation keys that should never affect cadence
  private static readonly IGNORED_KEYS = new Set([
    'CapsLock',
    'Shift',
    'Control',
    'Alt',
    'Meta',
    'Escape',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
    'PageUp',
    'PageDown',
    'Insert',
    'Delete',
  ]);

  /**
   * Evaluates keydown / keypress event authenticity
   */
  public handleKeyEvent(e: React.KeyboardEvent | KeyboardEvent): boolean {
    if (this.isFlagged) return true; // Do not block typing even if flagged

    // Ignore modifier keys and navigation keys
    if (e.key && AntiCheatEngine.IGNORED_KEYS.has(e.key)) {
      return true;
    }

    // 1. Synthetic event check (safe check: only flag if explicitly false, not undefined)
    if (e.isTrusted === false) {
      this.flagViolation('Synthetic script event detected (untrusted event)');
      return true; // Still allow typing so user is not permanently stuck
    }

    const now = performance.now();

    if (this.lastKeyTimestamp > 0) {
      const delta = now - this.lastKeyTimestamp;
      this.keystrokeIntervals.push(delta);
      if (this.keystrokeIntervals.length > 50) {
        this.keystrokeIntervals.shift();
      }

      // Check for impossibly fast consecutive keystrokes (software bot script < 3ms)
      if (delta < AntiCheatEngine.MIN_BOT_INTERVAL_MS) {
        this.rapidKeystrokeStreak++;
        if (this.rapidKeystrokeStreak >= 12) {
          this.anomalyScore += 2;
          if (this.anomalyScore >= AntiCheatEngine.FLAG_THRESHOLD) {
            this.flagViolation('Automated keystroke macro / bot cadence detected');
          }
        }
      } else {
        this.rapidKeystrokeStreak = Math.max(0, this.rapidKeystrokeStreak - 1);
        // Gradually forgive anomaly score during normal human typing
        if (this.anomalyScore > 0 && delta > 40) {
          this.anomalyScore = Math.max(0, this.anomalyScore - 0.2);
        }
      }
    }

    this.lastKeyTimestamp = now;
    return true;
  }

  /**
   * Validates text input differences to prevent paste or multi-character injection.
   * Single character keystrokes and deletions are always permitted so typing never freezes.
   */
  public validateInput(prevVal: string, newVal: string): boolean {
    const diff = newVal.length - prevVal.length;

    // A human types 1 character per keypress or deletes characters.
    // Allow up to 3 chars for standard text replacement or multi-byte characters,
    // but block bulk paste injections (> 8 chars at once).
    if (diff > 8) {
      this.flagViolation('Clipboard paste or bulk text injection blocked');
      return false;
    }

    return true;
  }

  /**
   * Validates final session WPM & Accuracy realism
   */
  public validateSessionScore(wpm: number, accuracy: number, timeElapsed: number): boolean {
    if (this.isFlagged) return false;

    // Superhuman speed check
    if (wpm > AntiCheatEngine.MAX_HUMAN_WPM && timeElapsed >= 3) {
      this.flagViolation(`Unrealistic typing speed detected (${wpm} WPM exceeds human limits)`);
      return false;
    }

    // Mathematical consistency check
    if (accuracy < 0 || accuracy > 100 || wpm < 0 || !Number.isFinite(wpm)) {
      this.flagViolation('Corrupted or tampered score parameters');
      return false;
    }

    return true;
  }

  private flagViolation(reason: string): void {
    this.isFlagged = true;
    this.reason = reason;
    console.warn(`[Typlix Anti-Cheat] Session Flagged: ${reason}`);
  }

  public getState(): AntiCheatState {
    return {
      isFlagged: this.isFlagged,
      reason: this.reason,
      anomalyScore: this.anomalyScore,
    };
  }
}

export const antiCheatEngine = new AntiCheatEngine();
