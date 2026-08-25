import React from 'react';

export default function ResultsModal({ wpm, accuracy, maxCombo, status, levelConfig, onNextLevel, onRetry }: any) {
  const isPassed = status === 'passed';
  
  return (
    <div style={{ marginTop: '20px', padding: '20px', background: 'white', border: '2px solid black', borderRadius: '5px', textAlign: 'center' }}>
      <h2 style={{ color: isPassed ? '#10b981' : '#ef4444' }}>
        {isPassed ? 'LEVEL CLEARED!' : 'LEVEL FAILED'}
      </h2>
      
      <p>WPM: {wpm} / {levelConfig.targetWpm}</p>
      <p>Accuracy: {accuracy}% / {levelConfig.targetAccuracy}%</p>
      <p>Max Combo: {maxCombo}</p>
      
      {isPassed ? (
        <button 
          onClick={onNextLevel}
          style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
        >
          Next Level
        </button>
      ) : (
        <button 
          onClick={onRetry}
          style={{ padding: '10px 20px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
        >
          Retry Level
        </button>
      )}
    </div>
  );
}
