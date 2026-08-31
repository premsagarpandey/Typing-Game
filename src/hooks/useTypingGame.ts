import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { calculateWPM, calculateAccuracy } from '../utils/calculations';
import { generateLevelText } from '../data/levels';
import type { LevelConfig } from '../data/levels';
import { antiCheatEngine } from '../utils/antiCheat';
import { secureStorage } from '../utils/secureStorage';

let audioCtx: AudioContext | null = null;

const playSound = (type: 'correct' | 'error') => {
  if (typeof window !== 'undefined') {
    const soundSetting = secureStorage.getItem('sound', true);
    if (!soundSetting) return;
  }

  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    if (!oscillator || !gainNode) return;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'correct') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.03);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.03);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.03);
    } else {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    }
  } catch {
    // AudioContext unavailable
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

  // Reset when level changes
  useEffect(() => {
    if (levelConfig) {
      antiCheatEngine.reset();
      setStatus('idle');
      setTimeRemaining(levelConfig.timeLimit);
      setTargetText(generateLevelText(levelConfig, 25));
      setTypedText('');
      setCombo(0);
      setMaxCombo(0);
      setCorrectChars(0);
      setTotalCharsTyped(0);
      setSecurityFlag(null);
    }
  }, [levelConfig?.level]);

  const correctCharsRef = useRef(0);
  const totalCharsTypedRef = useRef(0);

  // Sync refs with latest counts
  useEffect(() => {
    correctCharsRef.current = correctChars;
    totalCharsTypedRef.current = totalCharsTyped;
  }, [correctChars, totalCharsTyped]);

  // Timer logic
  useEffect(() => {
    if (status !== 'playing') return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          const finalWpm = calculateWPM(correctCharsRef.current, actualInitialTime);
          const finalAcc = calculateAccuracy(correctCharsRef.current, totalCharsTypedRef.current);
          const isScoreValid = antiCheatEngine.validateSessionScore(finalWpm, finalAcc, actualInitialTime);

          if (!isScoreValid || antiCheatEngine.getState().isFlagged) {
            setSecurityFlag(antiCheatEngine.getState().reason || 'Anti-cheat policy violation');
            setStatus('failed');
            return 0;
          }

          if (levelConfig) {
            if (finalWpm >= levelConfig.targetWpm && finalAcc >= levelConfig.targetAccuracy) {
              setStatus('passed');
            } else {
              setStatus('failed');
            }
          } else {
            setStatus('finished');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, levelConfig, actualInitialTime]);

  // Derive WPM and Accuracy
  const timeElapsed = Math.max(1, actualInitialTime - timeRemaining);
  const wpm = useMemo(() => calculateWPM(correctChars, timeElapsed), [correctChars, timeElapsed]);
  const accuracy = useMemo(
    () => calculateAccuracy(correctChars, totalCharsTyped),
    [correctChars, totalCharsTyped]
  );

  const handleInput = useCallback((value: string) => {
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

    if (value.length > typedText.length) {
      setTotalCharsTyped((prev) => prev + 1);
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
      const totalTyped = totalCharsTyped + 1;
      const finalWpm = calculateWPM(currentCorrect, timeSpent);
      const finalAcc = calculateAccuracy(currentCorrect, totalTyped);
      const isScoreValid = antiCheatEngine.validateSessionScore(finalWpm, finalAcc, timeSpent);

      if (!isScoreValid || antiCheatEngine.getState().isFlagged) {
        setSecurityFlag(antiCheatEngine.getState().reason || 'Anti-cheat policy violation');
        setStatus('failed');
        return;
      }

      if (levelConfig) {
        if (finalWpm >= levelConfig.targetWpm && finalAcc >= levelConfig.targetAccuracy) {
          setStatus('passed');
        } else {
          setStatus('failed');
        }
      } else {
        setStatus('finished');
      }
    }
  }, [status, typedText, targetText, levelConfig, actualInitialTime, timeRemaining, totalCharsTyped]);

  const resetGame = useCallback(() => {
    antiCheatEngine.reset();
    setStatus('idle');
    setTimeRemaining(actualInitialTime);
    setTypedText('');
    setCombo(0);
    setMaxCombo(0);
    setCorrectChars(0);
    setTotalCharsTyped(0);
    setSecurityFlag(null);
    if (levelConfig) {
      setTargetText(generateLevelText(levelConfig, 25));
    }
  }, [actualInitialTime, levelConfig]);

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
