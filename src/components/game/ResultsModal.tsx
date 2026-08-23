import React from 'react';

export default function ResultsModal({ wpm, accuracy, maxCombo, onPlayAgain }: any) {
  return (
    <div style={{ marginTop: '20px', padding: '20px', background: 'white', border: '2px solid black', borderRadius: '5px', textAlign: 'center' }}>
      <h2>Game Over!</h2>
      <p>WPM: {wpm}</p>
      <p>Accuracy: {accuracy}%</p>
      <p>Max Combo: {maxCombo}</p>
      <button 
        onClick={onPlayAgain}
        style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Play Again
      </button>
    </div>
  );
}
