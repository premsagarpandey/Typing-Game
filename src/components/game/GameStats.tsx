import React from 'react';

export default function GameStats({ timeRemaining, wpm, accuracy, combo }: any) {
  return (
    <div style={{ display: 'flex', gap: '20px', padding: '15px', background: '#e5e7eb', borderRadius: '5px', marginBottom: '20px' }}>
      <div>
        <strong>Time: </strong> {timeRemaining}s
      </div>
      <div>
        <strong>WPM: </strong> {wpm}
      </div>
      <div>
        <strong>Accuracy: </strong> {accuracy}%
      </div>
      <div>
        <strong>Combo: </strong> {combo}x
      </div>
    </div>
  );
}
