import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { calculateWPM, calculateAccuracy } from '../utils/calculations';
import { generateLevelText } from '../data/levels';
import type { LevelConfig } from '../data/levels';
import { antiCheatEngine } from '../utils/antiCheat';
import { secureStorage, type TypingSessionRecord } from '../utils/secureStorage';

let audioCtx: AudioContext | null = null;

const playSound = (type: 'correct' | 'error') => {
  if (typeof window !== 'undefined') {
    // Fast O(1) in-memory lookup via secureStorage
    const soundSetting = secureStorage.getItem('sound', true);
    if (!soundSetting) return;
  }

  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    if (!oscillator || !gainNode) return;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    if (type === 'correct') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.03);
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
      oscillator.start(now);
      oscillator.stop(now + 0.03);
    } else {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
    }
  } catch {
    // AudioContext unavailable or blocked
  }
};

export type GameStatus = 'idle' | 'playing' | 'finished' | 'passed' | 'failed';

export function useTypingGame(initialTime: number = 40, levelConfig?: LevelConfig) {
  const actualInitialTime = levelConfig ? levelConfig.timeLimit : initialTime;

  const [status, setStatus] = useState<GameStatus>('idle');
  const [timeRemaining, setTimeRemaining] = useState(actualInitialTime);
  const [targetText, setTargetText] = useState(() => (levelConfig ? generateLevelText(levelConfig, 25) : ''));
  const [typedText, setTypedText] = useState('');
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [securityFlag, setSecurityFlag] = useState<string | null>(null);

  // Stats
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);

  const correctCharsRef = useRef(0);
  const totalCharsTypedRef = useRef(0);
  const maxComboRef = useRef(0);
  const levelConfigRef = useRef(levelConfig);

  // Keep refs in sync for reliable timer reads
  useEffect(() => {
    correctCharsRef.current = correctChars;
    totalCharsTypedRef.current = totalCharsTyped;
    maxComboRef.current = maxCombo;
    levelConfigRef.current = levelConfig;
  }, [correctChars, totalCharsTyped, maxCombo, levelConfig]);

  // Unified session completion logic
  const completeSession = useCallback(
    (spentSeconds: number, correctCount: number, totalTypedCount: number) => {
      const currentConfig = levelConfigRef.current;
      const finalWpm = calculateWPM(correctCount, spentSeconds);
      const finalAcc = calculateAccuracy(correctCount, totalTypedCount);
      const isScoreValid = antiCheatEngine.validateSessionScore(finalWpm, finalAcc, spentSeconds);

      let newStatus: GameStatus = 'finished';
      let flagReason: string | null = null;

      if (!isScoreValid || antiCheatEngine.getState().isFlagged) {
        flagReason = antiCheatEngine.getState().reason || 'Anti-cheat policy violation';
        newStatus = 'failed';
      } else if (currentConfig) {
        if (finalWpm >= currentConfig.targetWpm && finalAcc >= currentConfig.targetAccuracy) {
          newStatus = 'passed';
        } else {
          newStatus = 'failed';
        }
      }

      setSecurityFlag(flagReason);
      setStatus(newStatus);

      // Record session in secure storage for real stats tracking
      if (!flagReason && totalTypedCount > 0) {
        try {
          const existing = secureStorage.getItem<TypingSessionRecord[]>('typlix_stats', []);
          const record: TypingSessionRecord = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            level: currentConfig ? currentConfig.level : 1,
            wpm: finalWpm,
            accuracy: finalAcc,
            maxCombo: maxComboRef.current,
            date: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            passed: newStatus === 'passed' || newStatus === 'finished',
          };
          secureStorage.setItem('typlix_stats', [...existing, record].slice(-50));
        } catch {
          // ignore
        }
      }
    },
    []
  );

  // Timer: Decrements timeRemaining and finishes game when time runs out
  useEffect(() => {
    if (status !== 'playing') return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            completeSession(actualInitialTime, correctCharsRef.current, totalCharsTypedRef.current);
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, actualInitialTime, completeSession]);

  // Derived WPM and Accuracy
  const timeElapsed = Math.max(1, actualInitialTime - timeRemaining);
  const wpm = useMemo(() => calculateWPM(correctChars, timeElapsed), [correctChars, timeElapsed]);
  const accuracy = useMemo(
    () => calculateAccuracy(correctChars, totalCharsTyped),
    [correctChars, totalCharsTyped]
  );

  const handleInput = useCallback(
    (value: string) => {
      if (status === 'finished' || status === 'passed' || status === 'failed') return;

      const isValidInput = antiCheatEngine.validateInput(typedText, value);
      if (!isValidInput) {
        playSound('error');
        setShakeTrigger((prev) => prev + 1);
        setSecurityFlag(antiCheatEngine.getState().reason);
        return;
      }

      if (status === 'idle') {
        setStatus('playing');
      }

      setTypedText(value);

      const lastCharIndex = value.length - 1;
      const isCorrect = value[lastCharIndex] === targetText[lastCharIndex];
      let newTotalTyped = totalCharsTyped;

      if (value.length > typedText.length) {
        newTotalTyped = totalCharsTyped + 1;
        setTotalCharsTyped(newTotalTyped);
        if (isCorrect) {
          playSound('correct');
          setCombo((prev) => {
            const newCombo = prev + 1;
            setMaxCombo((max) => Math.max(max, newCombo));
            return newCombo;
          });
        } else {
          playSound('error');
          setShakeTrigger((prev) => prev + 1);
          setCombo(0);
        }
      }

      let currentCorrect = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === targetText[i]) currentCorrect++;
      }
      setCorrectChars(currentCorrect);

      // If all target text is completed, finish level immediately
      if (value.length >= targetText.length && targetText.length > 0) {
        const timeSpent = Math.max(1, actualInitialTime - timeRemaining);
        completeSession(timeSpent, currentCorrect, newTotalTyped);
      }
    },
    [status, typedText, targetText, actualInitialTime, timeRemaining, totalCharsTyped, completeSession]
  );

  const resetGame = useCallback(
    (newConfig?: LevelConfig) => {
      const config = newConfig || levelConfigRef.current;
      antiCheatEngine.reset();
      setStatus('idle');
      setTimeRemaining(config ? config.timeLimit : actualInitialTime);
      setTypedText('');
      setCombo(0);
      setMaxCombo(0);
      setCorrectChars(0);
      setTotalCharsTyped(0);
      setSecurityFlag(null);
      if (config) {
        setTargetText(generateLevelText(config, 25));
      }
    },
    [actualInitialTime]
  );

  return {
    status,
    timeRemaining,
    targetText,
    typedText,
    wpm,
    accuracy,
    combo,
    maxCombo,
    shakeTrigger,
    securityFlag,
    handleInput,
    resetGame,
  };
}
