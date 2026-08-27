import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateWPM, calculateAccuracy } from '../utils/calculations';
import { generateLevelText } from '../data/levels';
import type { LevelConfig } from '../data/levels';

let audioCtx: AudioContext | null = null;

const playSound = (type: 'correct' | 'error') => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  if (type === 'correct') {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.05);
  } else {
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  }
};

export type GameStatus = 'idle' | 'playing' | 'finished' | 'passed' | 'failed';

export function useTypingGame(initialTime: number = 30, levelConfig?: LevelConfig) {
  const [status, setStatus] = useState<GameStatus>('idle');
  const actualInitialTime = levelConfig ? levelConfig.timeLimit : initialTime;
  const [timeRemaining, setTimeRemaining] = useState(actualInitialTime);
  const [targetText, setTargetText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [shakeTrigger, setShakeTrigger] = useState(0);
  
  // Stats
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);

  const correctCharsRef = useRef(0);
  const totalCharsTypedRef = useRef(0);
  
  // Keep refs updated for timer closure
  useEffect(() => {
    correctCharsRef.current = correctChars;
    totalCharsTypedRef.current = totalCharsTyped;
  }, [correctChars, totalCharsTyped]);

  // Initialize text
  useEffect(() => {
    if (status === 'idle') {
      setTimeRemaining(actualInitialTime);
      if (levelConfig) {
        setTargetText(generateLevelText(levelConfig, 30));
      }
    }
  }, [status, levelConfig, actualInitialTime]);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'playing' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer hit 0
            if (levelConfig) {
              const finalWpm = calculateWPM(correctCharsRef.current, actualInitialTime);
              const finalAcc = calculateAccuracy(correctCharsRef.current, totalCharsTypedRef.current);
              
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
    }
    return () => clearInterval(interval);
  }, [status, timeRemaining, levelConfig, actualInitialTime]);

  // Calculate WPM and Accuracy continuously
  useEffect(() => {
    if (status === 'playing') {
      const timeElapsed = actualInitialTime - timeRemaining;
      setWpm(calculateWPM(correctChars, timeElapsed));
      setAccuracy(calculateAccuracy(correctChars, totalCharsTyped));
    }
  }, [correctChars, totalCharsTyped, timeRemaining, actualInitialTime, status]);

  const handleInput = useCallback((value: string) => {
    if (status === 'finished' || status === 'passed' || status === 'failed') return;
    if (status === 'idle') {
      setStatus('playing');
    }

    setTypedText(value);

    const lastCharIndex = value.length - 1;
    const isCorrect = value[lastCharIndex] === targetText[lastCharIndex];

    if (value.length > typedText.length) {
      setTotalCharsTyped(prev => prev + 1);
      if (isCorrect) {
        playSound('correct');
        setCombo(prev => {
          const newCombo = prev + 1;
          setMaxCombo(max => Math.max(max, newCombo));
          return newCombo;
        });
      } else {
        playSound('error');
        setShakeTrigger(prev => prev + 1);
        setCombo(0);
      }
    }

    let currentCorrect = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === targetText[i]) currentCorrect++;
    }
    setCorrectChars(currentCorrect);

    if (value.length >= targetText.length - 10) {
      if (levelConfig) {
        setTargetText(prev => prev + ' ' + generateLevelText(levelConfig, 20));
      }
    }

  }, [status, typedText, targetText, levelConfig]);

  const resetGame = useCallback(() => {
    setStatus('idle');
    setTypedText('');
    setWpm(0);
    setAccuracy(100);
    setCombo(0);
    setMaxCombo(0);
    setCorrectChars(0);
    setTotalCharsTyped(0);
  }, []);

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
    handleInput,
    resetGame
  };
}
