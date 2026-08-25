import React from 'react';

export default function GameStats({ timeRemaining, wpm, accuracy, combo, level, targetWpm, targetAccuracy }: any) {
  return (
    <div style={{ display: 'flex', gap: '20px', padding: '15px', background: '#e5e7eb', borderRadius: '5px', marginBottom: '20px', flexWrap: 'wrap' }}>
      <div style={{ fontWeight: 'bold', color: '#4f46e5' }}>
        Level {level}
      </div>
      <div>
        <strong>Time: </strong> {timeRemaining}s
      </div>
      <div>
        <strong>WPM: </strong> {wpm} / {targetWpm}
      </div>
      <div>
        <strong>Accuracy: </strong> {accuracy}% / {targetAccuracy}%
      </div>
      <div>
        <strong>Combo: </strong> {combo}x
      </div>
    </div>
  );
}
