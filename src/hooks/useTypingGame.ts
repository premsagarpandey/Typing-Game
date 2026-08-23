import { useState, useEffect, useCallback } from 'react';
import { calculateWPM, calculateAccuracy } from '../utils/calculations';
import { getRandomText } from '../data/typingContent';

export type GameStatus = 'idle' | 'playing' | 'finished';
export type GameMode = 'quick' | 'speed' | 'quotes' | 'words'; // Simplified for now

export function useTypingGame(initialTime: number = 30, mode: GameMode = 'words') {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [targetText, setTargetText] = useState('');
  const [typedText, setTypedText] = useState('');
  
  // Stats
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);

  // Initialize text
  useEffect(() => {
    if (status === 'idle') {
      const textMode = mode === 'quotes' ? 'quotes' : 'words';
      setTargetText(getRandomText(textMode, 30));
    }
  }, [status, mode]);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'playing' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setStatus('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, timeRemaining]);

  // Calculate WPM and Accuracy continuously
  useEffect(() => {
    if (status === 'playing') {
      const timeElapsed = initialTime - timeRemaining;
      setWpm(calculateWPM(correctChars, timeElapsed));
      setAccuracy(calculateAccuracy(correctChars, totalCharsTyped));
    }
  }, [correctChars, totalCharsTyped, timeRemaining, initialTime, status]);

  const handleInput = useCallback((value: string) => {
    if (status === 'finished') return;
    if (status === 'idle') {
      setStatus('playing');
    }

    setTypedText(value);

    // Calculate current character stats
    const lastCharIndex = value.length - 1;
    const isCorrect = value[lastCharIndex] === targetText[lastCharIndex];

    if (value.length > typedText.length) {
      setTotalCharsTyped(prev => prev + 1);
      if (isCorrect) {
        setCorrectChars(prev => prev + 1);
        setCombo(prev => {
          const newCombo = prev + 1;
          setMaxCombo(max => Math.max(max, newCombo));
          return newCombo;
        });
      } else {
        setCombo(0);
      }
    } else {
      // User hit backspace - we don't reduce total typed but we should adjust combo/correct if needed.
      // For simplicity, backspace just changes the text. Real WPM often counts net correct characters.
      // We will re-evaluate correct chars based on the whole string matching.
    }

    // Re-evaluate total correct chars by comparing string (more accurate for backspaces)
    let currentCorrect = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === targetText[i]) currentCorrect++;
    }
    setCorrectChars(currentCorrect);

    // Add more text if we are close to the end
    if (value.length >= targetText.length - 10) {
      const textMode = mode === 'quotes' ? 'quotes' : 'words';
      setTargetText(prev => prev + ' ' + getRandomText(textMode, 20));
    }

  }, [status, typedText, targetText, mode]);

  const resetGame = useCallback(() => {
    setStatus('idle');
    setTimeRemaining(initialTime);
    setTypedText('');
    setWpm(0);
    setAccuracy(100);
    setCombo(0);
    setMaxCombo(0);
    setCorrectChars(0);
    setTotalCharsTyped(0);
  }, [initialTime]);

  return {
    status,
    timeRemaining,
    targetText,
    typedText,
    wpm,
    accuracy,
    combo,
    maxCombo,
    handleInput,
    resetGame
  };
}
