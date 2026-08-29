import { useState, useEffect, useMemo } from 'react';
import { useTypingGame } from '../hooks/useTypingGame';
import GameStats from '../components/game/GameStats';
import TypingArea from '../components/game/TypingArea';
import ResultsModal from '../components/game/ResultsModal';
import VirtualKeyboard from '../components/game/VirtualKeyboard';
import { getLevelConfig } from '../data/levels';
import { secureStorage } from '../utils/secureStorage';

export default function Game() {
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    return secureStorage.getItem<number>('typingGameLevel', 1);
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
    securityFlag,
    handleInput,
    resetGame,
  } = useTypingGame(30, levelConfig);

  useEffect(() => {
    secureStorage.setItem('typingGameLevel', currentLevel);
  }, [currentLevel]);

  const handleNextLevel = () => {
    setCurrentLevel((prev) => Math.min(prev + 1, 50));
    resetGame();
  };

  const handleRetry = () => {
    resetGame();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-3xl mx-auto gap-6 py-4">
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
          securityFlag={securityFlag}
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
          securityFlag={securityFlag}
          onNextLevel={handleNextLevel}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}

