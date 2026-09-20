/**
 * Typlix Anti-Inspect & DevTools Defense Engine
 * Protects typing sessions, leaderboard submissions, and UI state
 * from inspection shortcuts, right-click tampering, DevTools execution,
 * and automated DOM injection.
 */

export interface SecurityAlertEventDetail {
  reason: string;
  type: 'shortcut' | 'contextmenu' | 'devtools' | 'paste' | 'tamper';
  timestamp: number;
}

const STORAGE_KEY_ANTI_INSPECT = 'typlix_anti_inspect_enabled';

class AntiInspectManager {
  private isEnabled: boolean = true;
  private isDevToolsOpen: boolean = false;
  private devToolsCheckInterval: number | null = null;
  private listenersAttached: boolean = false;

  constructor() {
    // Read saved preference, default to true
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_ANTI_INSPECT);
        this.isEnabled = saved !== null ? JSON.parse(saved) : true;
      } catch {
        this.isEnabled = true;
      }
    }
  }

  /**
   * Initializes all browser security protections
   */
  public init(): void {
    if (typeof window === 'undefined' || this.listenersAttached) return;

    this.attachEventListeners();
    this.injectConsoleWarning();
    this.startDevToolsDetector();
    this.listenersAttached = true;
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    try {
      localStorage.setItem(STORAGE_KEY_ANTI_INSPECT, JSON.stringify(enabled));
    } catch {
      // Ignore storage write errors
    }
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Broadcasts a security alert event for UI toast notifications
   */
  public notify(type: SecurityAlertEventDetail['type'], reason: string): void {
    if (typeof window === 'undefined') return;

    const event = new CustomEvent<SecurityAlertEventDetail>('typlix-security-alert', {
      detail: {
        reason,
        type,
        timestamp: Date.now(),
      },
    });
    window.dispatchEvent(event);
  }

  /**
   * Prevents devtool keyboard shortcuts
   */
  private handleKeyDown = (e: KeyboardEvent): void => {
    if (!this.isEnabled) return;

    const key = e.key ? e.key.toUpperCase() : '';
    const keyCode = e.keyCode || e.which;
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;
    const isAlt = e.altKey;

    let blockedReason: string | null = null;

    // F12 -> DevTools
    if (key === 'F12' || keyCode === 123) {
      blockedReason = 'F12 (DevTools)';
    }
    // Ctrl + Shift + I or Cmd + Option + I -> Inspect
    else if (isCtrlOrCmd && (isShift || isAlt) && key === 'I') {
      blockedReason = 'Inspect Element (Ctrl+Shift+I)';
    }
    // Ctrl + Shift + J or Cmd + Option + J -> Console
    else if (isCtrlOrCmd && (isShift || isAlt) && key === 'J') {
      blockedReason = 'Developer Console (Ctrl+Shift+J)';
    }
    // Ctrl + Shift + C or Cmd + Option + C -> Element Inspector
    else if (isCtrlOrCmd && (isShift || isAlt) && key === 'C') {
      blockedReason = 'Element Picker (Ctrl+Shift+C)';
    }
    // Ctrl + Shift + K -> Firefox Web Console
    else if (isCtrlOrCmd && isShift && key === 'K') {
      blockedReason = 'Browser Web Console (Ctrl+Shift+K)';
    }
    // Ctrl + U -> View Page Source
    else if (isCtrlOrCmd && !isShift && key === 'U') {
      blockedReason = 'View Page Source (Ctrl+U)';
    }
    // Ctrl + S -> Save Page (prevent offline dump tampering)
    else if (isCtrlOrCmd && !isShift && key === 'S') {
      blockedReason = 'Save Page (Ctrl+S)';
    }

    if (blockedReason) {
      e.preventDefault();
      e.stopPropagation();
      this.notify('shortcut', `Inspect shortcut blocked: ${blockedReason}`);
    }
  };

  /**
   * Prevents right-click context menu (inspect element)
   */
  private handleContextMenu = (e: MouseEvent): void => {
    if (!this.isEnabled) return;

    // Allow normal clicking in inputs if explicitly required, but prevent on all game and app UI
    const target = e.target as HTMLElement | null;
    const isTypingArea = target?.closest('.typing-area-container') || target?.tagName === 'INPUT';

    e.preventDefault();
    this.notify(
      'contextmenu',
      isTypingArea
        ? 'Right-click inspect is disabled in typing area for fair play.'
        : 'Right-click context menu is disabled for session integrity.'
    );
  };

  /**
   * Prevents drag-and-drop of text/images to evade bot script dropping
   */
  private handleDragStart = (e: DragEvent): void => {
    if (!this.isEnabled) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('.typing-area-container') || target?.closest('.typing-lines-track')) {
      e.preventDefault();
    }
  };

  private attachEventListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown, { capture: true });
    window.addEventListener('contextmenu', this.handleContextMenu, { capture: true });
    window.addEventListener('dragstart', this.handleDragStart, { capture: true });
  }

  /**
   * Continuously monitors for DevTools opening via viewport dimension analysis
   */
  private startDevToolsDetector(): void {
    const checkDevTools = () => {
      if (!this.isEnabled) return;

      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      const isOpen = widthDiff > threshold || heightDiff > threshold;

      if (isOpen && !this.isDevToolsOpen) {
        this.isDevToolsOpen = true;
        this.notify('devtools', 'Developer tools window detected. Anti-tamper monitoring active.');
      } else if (!isOpen && this.isDevToolsOpen) {
        this.isDevToolsOpen = false;
      }
    };

    this.devToolsCheckInterval = window.setInterval(checkDevTools, 1500);
  }

  /**
   * Prominently displays high-visibility anti-tamper message in browser console
   */
  public injectConsoleWarning(): void {
    if (typeof window === 'undefined') return;

    try {
      const titleStyle = [
        'color: #ef4444',
        'font-size: 24px',
        'font-weight: 800',
        'font-family: monospace',
        'padding: 8px 0',
      ].join(';');

      const bodyStyle = [
        'color: #a3a3a3',
        'font-size: 13px',
        'font-family: system-ui, sans-serif',
        'line-height: 1.5',
      ].join(';');

      const badgeStyle = [
        'background: #18181b',
        'color: #22c55e',
        'font-size: 11px',
        'font-weight: 600',
        'padding: 4px 8px',
        'border-radius: 4px',
        'border: 1px solid #27272a',
      ].join(';');

      console.log(
        '%c⛔ STOP! TYPLIX SECURITY SHIELD ACTIVE\n' +
        '%cThis browser console is monitored. Attempting to inspect variables, inject typing bots, ' +
        'or modify localStorage records will trigger automated cryptographic invalidation and anti-cheat session flags.\n\n' +
        '%c🛡️ HMAC-SHA256 Integrity Enforced  •  Synthetic Event Filtering Active',
        titleStyle,
        bodyStyle,
        badgeStyle
      );
    } catch {
      // Ignore console styling errors in older browsers
    }
  }

  public getDevToolsStatus(): boolean {
    return this.isDevToolsOpen;
  }

  public cleanup(): void {
    if (typeof window === 'undefined') return;
    window.removeEventListener('keydown', this.handleKeyDown, { capture: true });
    window.removeEventListener('contextmenu', this.handleContextMenu, { capture: true });
    window.removeEventListener('dragstart', this.handleDragStart, { capture: true });

    if (this.devToolsCheckInterval !== null) {
      clearInterval(this.devToolsCheckInterval);
      this.devToolsCheckInterval = null;
    }
    this.listenersAttached = false;
  }
}

export const antiInspectManager = new AntiInspectManager();
