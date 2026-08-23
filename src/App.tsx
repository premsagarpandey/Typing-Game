import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Game from './pages/Game';
import Stats from './pages/Stats';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
