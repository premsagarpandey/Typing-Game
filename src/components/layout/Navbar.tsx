import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ background: '#3b82f6', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src="/logo.png" alt="Typlix Logo" style={{ height: '40px', background: 'white', padding: '4px', borderRadius: '8px' }} />
      </Link>
      
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/game" style={{ color: 'white', textDecoration: 'none' }}>Play</Link>
        <Link to="/stats" style={{ color: 'white', textDecoration: 'none' }}>Stats</Link>
        <Link to="/leaderboard" style={{ color: 'white', textDecoration: 'none' }}>Leaderboard</Link>
        <Link to="/settings" style={{ color: 'white', textDecoration: 'none' }}>Settings</Link>
      </div>
    </nav>
  );
}
