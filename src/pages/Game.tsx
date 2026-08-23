import React from 'react';
import { useTypingGame } from '../hooks/useTypingGame';
import GameStats from '../components/game/GameStats';
import TypingArea from '../components/game/TypingArea';
import ResultsModal from '../components/game/ResultsModal';
import VirtualKeyboard from '../components/game/VirtualKeyboard';

export default function Game() {
  const {
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
  } = useTypingGame(30, 'words');

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full relative">
      
      <div className="w-full flex flex-col gap-6">
        <GameStats 
          timeRemaining={timeRemaining}
          wpm={wpm}
          accuracy={accuracy}
          combo={combo}
        />

        <TypingArea 
          targetText={targetText}
          typedText={typedText}
          status={status}
          onInput={handleInput}
        />
        
        <VirtualKeyboard nextChar={targetText[typedText.length] || ''} />
      </div>

      {status === 'finished' && (
        <ResultsModal 
          wpm={wpm}
          accuracy={accuracy}
          maxCombo={maxCombo}
          onPlayAgain={resetGame}
        />
      )}
    </div>
  );
}
