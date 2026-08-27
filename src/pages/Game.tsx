import React, { useState, useEffect, useMemo } from 'react';
import { useTypingGame } from '../hooks/useTypingGame';
import GameStats from '../components/game/GameStats';
import TypingArea from '../components/game/TypingArea';
import ResultsModal from '../components/game/ResultsModal';
import VirtualKeyboard from '../components/game/VirtualKeyboard';
import { getLevelConfig } from '../data/levels';

export default function Game() {
  const [currentLevel, setCurrentLevel] = useState(() => {
    const saved = localStorage.getItem('typingGameLevel');
    return saved ? parseInt(saved, 10) : 1;
  });

  const levelConfig = useMemo(() => getLevelConfig(currentLevel), [currentLevel]);

  const {
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
  } = useTypingGame(30, levelConfig);

  useEffect(() => {
    localStorage.setItem('typingGameLevel', currentLevel.toString());
  }, [currentLevel]);

  const handleNextLevel = () => {
    setCurrentLevel(prev => Math.min(prev + 1, 50));
    resetGame();
  };

  const handleRetry = () => {
    resetGame();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full relative">
      <div className="w-full flex flex-col gap-6">
        <GameStats 
          timeRemaining={timeRemaining}
          wpm={wpm}
          accuracy={accuracy}
          combo={combo}
          level={currentLevel}
          targetWpm={levelConfig.targetWpm}
          targetAccuracy={levelConfig.targetAccuracy}
        />

        <TypingArea 
          targetText={targetText}
          typedText={typedText}
          status={status}
          shakeTrigger={shakeTrigger}
          onInput={handleInput}
        />
        
        <VirtualKeyboard nextChar={targetText[typedText.length] || ''} />
      </div>

      {(status === 'passed' || status === 'failed') && (
        <ResultsModal 
          wpm={wpm}
          accuracy={accuracy}
          maxCombo={maxCombo}
          status={status}
          levelConfig={levelConfig}
          onNextLevel={handleNextLevel}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
