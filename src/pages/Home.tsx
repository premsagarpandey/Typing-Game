import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Typlix</h1>
      <p>A simple typing game to improve your speed.</p>
      
      <button 
        onClick={() => navigate('/game')}
        style={{ padding: '10px 20px', fontSize: '18px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Start Game
      </button>

      <div style={{ marginTop: '40px', textAlign: 'left' }}>
        <h3>Features</h3>
        <ul>
          <li>Test your typing speed.</li>
          <li>See your words per minute (WPM).</li>
          <li>Track your accuracy.</li>
        </ul>

        <h3>How to play</h3>
        <ol>
          <li>Click Start Game.</li>
          <li>Type the words as fast as you can.</li>
          <li>Look at your results!</li>
        </ol>
      </div>
    </div>
  );
}
