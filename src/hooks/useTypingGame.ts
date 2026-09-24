import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { calculateWPM, calculateAccuracy } from '../utils/calculations';
import { generateLevelText } from '../data/levels';
import type { LevelConfig } from '../data/levels';
import { generateTimedWords } from '../data/words';
import { getRandomQuote } from '../data/quotes';
import type { QuoteCategory } from '../data/quotes';
import { getRandomSnippet } from '../data/codeSnippets';
import type { CodeLanguage } from '../data/codeSnippets';
import type { Difficulty } from '../data/quotes';
import { secureStorage, type TypingSessionRecord } from '../utils/secureStorage';

import { playKeystrokeSound as playSound } from '../utils/soundEngine';

export type GameStatus = 'idle' | 'playing' | 'finished' | 'passed' | 'failed';
export type GameMode = 'lesson' | 'timed' | 'custom' | 'quotes' | 'code';

export interface GameOptions {
  mode?: GameMode;
  customText?: string;
  modeLabel?: string;
  quoteCategory?: QuoteCategory | null;
  quoteDifficulty?: Difficulty | null;
  codeLanguage?: CodeLanguage | null;
  codeDifficulty?: Difficulty | null;
}

export function useTypingGame(
  initialTime: number = 40,
  levelConfig?: LevelConfig,
  options?: GameOptions
) {
  const currentMode = options?.mode || 'lesson';
  const customText = options?.customText || '';
  const modeLabel = options?.modeLabel;
  const quoteCategory = options?.quoteCategory;
  const quoteDifficulty = options?.quoteDifficulty;
  const codeLanguage = options?.codeLanguage;
  const codeDifficulty = options?.codeDifficulty;

  const actualInitialTime = useMemo(() => {
    if (currentMode === 'lesson') {
      return levelConfig ? levelConfig.timeLimit : initialTime;
    }
    return initialTime;
  }, [currentMode, levelConfig, initialTime]);

  const [status, setStatus] = useState<GameStatus>('idle');
  const [timeRemaining, setTimeRemaining] = useState(actualInitialTime);
  const [targetText, setTargetText] = useState(() => {
    if (currentMode === 'lesson') {
      return levelConfig ? generateLevelText(levelConfig, 25) : '';
    } else if (currentMode === 'custom') {
      return customText.trim() || 'Type something here...';
    } else if (currentMode === 'quotes') {
      return getRandomQuote(quoteCategory, quoteDifficulty).text;
    } else if (currentMode === 'code') {
      return getRandomSnippet(codeLanguage, codeDifficulty).code;
    } else {
      return generateTimedWords(60);
    }
  });

  const [typedText, setTypedText] = useState('');
  const [shakeTrigger, setShakeTrigger] = useState(0);

  // Stats
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);

  const correctCharsRef = useRef(0);
  const totalCharsTypedRef = useRef(0);
  const maxComboRef = useRef(0);
  const levelConfigRef = useRef(levelConfig);
  const modeRef = useRef(currentMode);
  const modeLabelRef = useRef(modeLabel);
  const statusRef = useRef<GameStatus>(status);
  const typedTextRef = useRef(typedText);
  const targetTextRef = useRef(targetText);
  const timeRemainingRef = useRef(timeRemaining);
  const actualInitialTimeRef = useRef(actualInitialTime);
  const startTimeRef = useRef<number | null>(null);

  // Keep refs in sync for reliable callbacks & timer reads
  useEffect(() => {
    statusRef.current = status;
    typedTextRef.current = typedText;
    targetTextRef.current = targetText;
    timeRemainingRef.current = timeRemaining;
    actualInitialTimeRef.current = actualInitialTime;
    correctCharsRef.current = correctChars;
    totalCharsTypedRef.current = totalCharsTyped;
    maxComboRef.current = maxCombo;
    levelConfigRef.current = levelConfig;
    modeRef.current = currentMode;
    modeLabelRef.current = modeLabel;
  }, [
    status,
    typedText,
    targetText,
    timeRemaining,
    actualInitialTime,
    correctChars,
    totalCharsTyped,
    maxCombo,
    levelConfig,
    currentMode,
    modeLabel,
  ]);

  // Unified session completion logic
  const completeSession = useCallback(
    (spentSeconds: number, correctCount: number, totalTypedCount: number) => {
      const mode = modeRef.current;
      const currentConfig = levelConfigRef.current;
      const finalWpm = calculateWPM(correctCount, spentSeconds);
      const finalAcc = calculateAccuracy(correctCount, totalTypedCount);

      let newStatus: GameStatus = 'finished';

      if (mode === 'lesson' && currentConfig) {
        if (finalWpm >= currentConfig.targetWpm && finalAcc >= currentConfig.targetAccuracy) {
          newStatus = 'passed';
        } else {
          newStatus = 'failed';
        }
      } else {
        newStatus = 'passed';
      }

      setStatus(newStatus);
      statusRef.current = newStatus;

      // Record session in storage for stats tracking
      if (totalTypedCount > 0) {
        try {
          const existing = secureStorage.getItem<TypingSessionRecord[]>('typlix_stats', []);
          const label =
            modeLabelRef.current ||
            (mode === 'lesson'
              ? `Level ${currentConfig?.level || 1}`
              : mode === 'timed'
              ? `Timed (${actualInitialTimeRef.current}s)`
              : 'Custom Text');

          const record: TypingSessionRecord = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            level: mode === 'lesson' ? (currentConfig ? currentConfig.level : 1) : 0,
            wpm: finalWpm,
            accuracy: finalAcc,
            maxCombo: maxComboRef.current,
            date: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            passed: newStatus === 'passed',
            mode,
            modeLabel: label,
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
            const totalElapsed = startTimeRef.current
              ? Math.max(1, (performance.now() - startTimeRef.current) / 1000)
              : actualInitialTimeRef.current;
            completeSession(totalElapsed, correctCharsRef.current, totalCharsTypedRef.current);
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, completeSession]);

  // Derived WPM and Accuracy
  const timeElapsed = Math.max(1, actualInitialTime - timeRemaining);
  const wpm = useMemo(() => calculateWPM(correctChars, timeElapsed), [correctChars, timeElapsed]);
  const accuracy = useMemo(
    () => calculateAccuracy(correctChars, totalCharsTyped),
    [correctChars, totalCharsTyped]
  );

  // Highly-optimized stable handleInput: never recreates on keystrokes
  const handleInput = useCallback(
    (value: string) => {
      const currentStatus = statusRef.current;
      if (currentStatus === 'finished' || currentStatus === 'passed' || currentStatus === 'failed') return;

      if (currentStatus === 'idle') {
        setStatus('playing');
        statusRef.current = 'playing';
        startTimeRef.current = performance.now();
      }

      const prevTyped = typedTextRef.current;
      const currentTarget = targetTextRef.current;
      typedTextRef.current = value;
      setTypedText(value);

      const lastCharIndex = value.length - 1;
      const isCorrect = value[lastCharIndex] === currentTarget[lastCharIndex];
      let newTotalTyped = totalCharsTypedRef.current;

      if (value.length > prevTyped.length) {
        newTotalTyped = totalCharsTypedRef.current + 1;
        totalCharsTypedRef.current = newTotalTyped;
        setTotalCharsTyped(newTotalTyped);
        if (isCorrect) {
          playSound('correct');
          setCombo((prev) => {
            const newCombo = prev + 1;
            if (newCombo > maxComboRef.current) {
              maxComboRef.current = newCombo;
              setMaxCombo(newCombo);
            }
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
        if (value[i] === currentTarget[i]) currentCorrect++;
      }
      correctCharsRef.current = currentCorrect;
      setCorrectChars(currentCorrect);

      // In timed mode: automatically append more words when approaching the end
      if (modeRef.current === 'timed' && value.length >= currentTarget.length - 20) {
        const additional = ' ' + generateTimedWords(30);
        targetTextRef.current = currentTarget + additional;
        setTargetText((prev) => prev + additional);
      }

      // If all target text is completed in lesson or custom mode, finish immediately
      if (modeRef.current !== 'timed' && value.length >= currentTarget.length && currentTarget.length > 0) {
        const elapsedSeconds = startTimeRef.current
          ? Math.max(1, (performance.now() - startTimeRef.current) / 1000)
          : Math.max(1, actualInitialTimeRef.current - timeRemainingRef.current);
        completeSession(elapsedSeconds, currentCorrect, newTotalTyped);
      }
    },
    [completeSession]
  );

  const resetGame = useCallback(
    (newConfig?: LevelConfig, newCustomText?: string) => {
      const mode = modeRef.current;
      const config = newConfig || levelConfigRef.current;
      setStatus('idle');
      statusRef.current = 'idle';
      startTimeRef.current = null;
      const nextTime = mode === 'lesson' && config ? config.timeLimit : actualInitialTimeRef.current;
      setTimeRemaining(nextTime);
      timeRemainingRef.current = nextTime;
      setTypedText('');
      typedTextRef.current = '';
      setCombo(0);
      setMaxCombo(0);
      maxComboRef.current = 0;
      setCorrectChars(0);
      correctCharsRef.current = 0;
      setTotalCharsTyped(0);
      totalCharsTypedRef.current = 0;

      let newTarget = '';
      if (mode === 'lesson') {
        if (config) {
          newTarget = generateLevelText(config, 25);
        }
      } else if (mode === 'custom') {
        const textToUse = newCustomText !== undefined ? newCustomText : customText;
        newTarget = textToUse.trim() || 'Type something here...';
      } else if (mode === 'quotes') {
        newTarget = getRandomQuote(quoteCategory, quoteDifficulty).text;
      } else if (mode === 'code') {
        newTarget = getRandomSnippet(codeLanguage, codeDifficulty).code;
      } else {
        newTarget = generateTimedWords(60);
      }
      targetTextRef.current = newTarget;
      setTargetText(newTarget);
    },
    [customText, quoteCategory, quoteDifficulty, codeLanguage, codeDifficulty]
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
    handleInput,
    resetGame,
    setTargetText,
  };
}
