import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Settings() {
  const [soundEnabled, setSoundEnabled] = useLocalStorage('sound', true);
  const [darkMode, setDarkMode] = useLocalStorage('dark', false);

  return (
    <div>
      <h2>Settings</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <label>
          <input type="checkbox" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />
          Enable Sound
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
          Dark Mode
        </label>
      </div>

    </div>
  );
}
